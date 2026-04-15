import ora from 'ora';
import chalk from 'chalk';
import path from 'path';
import dayjs from 'dayjs';
import { findGitRepos } from '../lib/finder.js';
import { getCommits, getCurrentUser } from '../lib/git.js';
import { formatReport } from '../lib/formatter.js';
import { readConfig } from '../lib/config.js';
export async function runStandup(cmdOpts) {
    // Load persisted config for defaults
    const savedConfig = await readConfig();
    // Resolve author: flag > saved config > current git user
    let author = cmdOpts.author ?? savedConfig.author;
    if (!author) {
        const currentUser = await getCurrentUser();
        author = currentUser.name || currentUser.email || undefined;
    }
    // Resolve scan path
    let scanPath;
    if (cmdOpts.all) {
        // Scan parent directory to include sibling repos
        scanPath = path.resolve(process.cwd(), '..');
    }
    else if (cmdOpts.path) {
        scanPath = path.resolve(cmdOpts.path);
    }
    else if (savedConfig.defaultPath) {
        scanPath = path.resolve(savedConfig.defaultPath);
    }
    else {
        scanPath = process.cwd();
    }
    const depth = typeof cmdOpts.depth !== 'undefined'
        ? Number(cmdOpts.depth)
        : (savedConfig.defaultDepth ?? 2);
    const rawFormat = cmdOpts.format ?? savedConfig.defaultFormat ?? 'full';
    const format = ['full', 'compact', 'markdown'].includes(rawFormat)
        ? rawFormat
        : 'full';
    const opts = {
        since: cmdOpts.since ?? 'yesterday',
        until: cmdOpts.until ?? 'now',
        author,
        path: scanPath,
        depth,
        format,
    };
    // Step 1: Find repos with spinner
    const spinnerFind = ora({
        text: chalk.dim(`Scanning for git repos in ${chalk.bold(scanPath)}…`),
        color: 'cyan',
    }).start();
    let repoPaths;
    try {
        repoPaths = await findGitRepos(scanPath, depth);
        spinnerFind.succeed(chalk.dim(`Found ${chalk.bold(repoPaths.length)} git repo${repoPaths.length !== 1 ? 's' : ''}`));
    }
    catch (err) {
        spinnerFind.fail(chalk.red('Failed to scan for repos'));
        throw err;
    }
    if (repoPaths.length === 0) {
        console.log(chalk.yellow('\n  No git repositories found in the specified path.\n'));
        return;
    }
    // Step 2: Fetch commits with spinner
    const spinnerCommits = ora({
        text: chalk.dim('Reading git history…'),
        color: 'cyan',
    }).start();
    const repoCommitsList = [];
    let totalCommits = 0;
    try {
        const commitResults = await Promise.all(repoPaths.map((repoPath) => getCommits(repoPath, opts)));
        for (let i = 0; i < repoPaths.length; i++) {
            const commits = commitResults[i];
            if (commits.length > 0) {
                repoCommitsList.push({
                    repoName: path.basename(repoPaths[i]),
                    repoPath: repoPaths[i],
                    commits,
                });
                totalCommits += commits.length;
            }
        }
        // Sort repos by name
        repoCommitsList.sort((a, b) => a.repoName.localeCompare(b.repoName));
        spinnerCommits.succeed(chalk.dim(`Found ${chalk.bold(totalCommits)} commit${totalCommits !== 1 ? 's' : ''} across ${chalk.bold(repoCommitsList.length)} active repo${repoCommitsList.length !== 1 ? 's' : ''}`));
    }
    catch (err) {
        spinnerCommits.fail(chalk.red('Failed to read git history'));
        throw err;
    }
    // Step 3: Build report
    const report = {
        date: dayjs().toISOString(),
        repos: repoCommitsList,
        totalCommits,
    };
    // Step 4: Format and display
    const output = formatReport(report, opts);
    console.log('\n' + output);
}
