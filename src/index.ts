#!/usr/bin/env node
/**
 * git-standup — See all your git commits from yesterday across every local repo.
 *
 * Usage:
 *   npx git-standup [options]
 *
 * Options:
 *   --since=<value>     Time range: yesterday (default), 1week, 3days, 2024-01-15
 *   --author=<email>    Author email filter (default: git config user.email)
 *   --dir=<path>        Root directory to search (default: ~/)
 *   --depth=<n>         Max directory depth to search (default: 3)
 *   --format=markdown   Output as Markdown instead of colored text
 *   --help, -h          Show this help message
 */

import { homedir } from 'os';
import { findGitRepos } from './finder.js';
import { getCommits, getGitEmail } from './git.js';
import { printText, printMarkdown } from './reporter.js';
import { resolveSince } from './config.js';
import type { CliOptions, RepoResult } from './types.js';

// ─── Argument parsing ────────────────────────────────────────────────────────

function parseArgs(argv: string[]): CliOptions {
  const args = argv.slice(2); // strip 'node' and script path

  const opts: CliOptions = {
    since: 'yesterday',
    author: '',
    dir: homedir(),
    depth: 3,
    format: 'text',
  };

  for (const arg of args) {
    if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }

    const [key, ...valueParts] = arg.replace(/^--/, '').split('=');
    const value = valueParts.join('=');

    switch (key) {
      case 'since':
        opts.since = value;
        break;
      case 'author':
        opts.author = value;
        break;
      case 'dir':
        opts.dir = value.replace(/^~/, homedir());
        break;
      case 'depth': {
        const n = parseInt(value, 10);
        if (!isNaN(n) && n > 0) opts.depth = n;
        break;
      }
      case 'format':
        if (value === 'markdown') opts.format = 'markdown';
        break;
    }
  }

  return opts;
}

function printHelp(): void {
  console.log(`
git-standup — See all your git commits from yesterday across every local repo.

USAGE
  npx git-standup [options]

OPTIONS
  --since=<value>     Time range (default: yesterday)
                        yesterday  ·  1week  ·  3days  ·  2024-01-15
  --author=<email>    Author email filter (default: git config user.email)
  --dir=<path>        Root directory to search (default: ~/)
  --depth=<n>         Max directory depth to search (default: 3)
  --format=markdown   Output Markdown for Slack/Notion standup posts
  --help, -h          Show this help

EXAMPLES
  npx git-standup
  npx git-standup --since=1week
  npx git-standup --dir=~/projects --depth=2
  npx git-standup --since=2024-01-15 --format=markdown
`);
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const opts = parseArgs(process.argv);

  // Resolve author
  if (!opts.author) {
    opts.author = getGitEmail();
    if (!opts.author) {
      console.error(
        'Error: Could not determine git author. Set --author=your@email.com'
      );
      process.exit(1);
    }
  }

  const sinceGit = resolveSince(opts.since);

  process.stderr.write(
    `\x1b[2mSearching for git repos in ${opts.dir === homedir() ? '~/' : opts.dir}...\x1b[0m\n`
  );

  const repoPaths = findGitRepos(opts.dir, opts.depth);

  if (repoPaths.length === 0) {
    console.error(`No git repositories found in ${opts.dir}`);
    process.exit(0);
  }

  process.stderr.write(
    `\x1b[2mFound ${repoPaths.length} repos. Scanning commits since "${sinceGit}" by ${opts.author}...\x1b[0m\n`
  );

  const results: RepoResult[] = [];

  for (const repoPath of repoPaths) {
    const commits = getCommits(repoPath, sinceGit, opts.author);
    if (commits.length === 0) continue;

    const name = repoPath.split('/').filter(Boolean).pop() ?? repoPath;
    results.push({ name, path: repoPath, commits });
  }

  if (opts.format === 'markdown') {
    printMarkdown(results);
  } else {
    printText(results);
  }
}

main().catch((err: unknown) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
