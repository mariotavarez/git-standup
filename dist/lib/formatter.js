import chalk from 'chalk';
import boxen from 'boxen';
import dayjs from 'dayjs';
// Detect commit type from conventional commit subject
function getCommitType(subject) {
    const match = subject.match(/^(\w+)(\(.+\))?!?:/);
    return match ? match[1].toLowerCase() : '';
}
function colorizeSubject(subject) {
    const type = getCommitType(subject);
    const typeEnd = subject.indexOf(':');
    if (typeEnd === -1) {
        return chalk.white(subject);
    }
    const prefix = subject.substring(0, typeEnd + 1);
    const rest = subject.substring(typeEnd + 1);
    let coloredPrefix;
    switch (type) {
        case 'feat':
        case 'feature':
            coloredPrefix = chalk.green(prefix);
            break;
        case 'fix':
        case 'bugfix':
            coloredPrefix = chalk.red(prefix);
            break;
        case 'docs':
        case 'doc':
            coloredPrefix = chalk.blue(prefix);
            break;
        case 'refactor':
        case 'refact':
            coloredPrefix = chalk.yellow(prefix);
            break;
        case 'test':
        case 'tests':
            coloredPrefix = chalk.magenta(prefix);
            break;
        case 'chore':
            coloredPrefix = chalk.gray(prefix);
            break;
        case 'style':
            coloredPrefix = chalk.cyan(prefix);
            break;
        case 'perf':
            coloredPrefix = chalk.blueBright(prefix);
            break;
        case 'ci':
        case 'build':
            coloredPrefix = chalk.whiteBright(prefix);
            break;
        default:
            coloredPrefix = chalk.white(prefix);
    }
    return coloredPrefix + chalk.white(rest);
}
function formatDate(isoDate) {
    return dayjs(isoDate).format('dddd, MMM D, YYYY');
}
function buildHeader(report, author) {
    const dateStr = formatDate(report.date);
    const repoCount = report.repos.length;
    const commitCount = report.totalCommits;
    const authorStr = author ? `  ${chalk.dim(author)}` : '';
    const titleLine = `  ${chalk.bold('Daily Standup')} ${chalk.dim('—')} ${chalk.bold.white(dateStr)}`;
    const statsLine = `  ${chalk.cyan(repoCount + ' repo' + (repoCount !== 1 ? 's' : ''))} ${chalk.dim('·')} ${chalk.cyan(commitCount + ' commit' + (commitCount !== 1 ? 's' : ''))}${authorStr}`;
    return boxen(titleLine + '\n' + statsLine, {
        padding: { top: 0, bottom: 0, left: 1, right: 2 },
        margin: { top: 1, bottom: 1, left: 0, right: 0 },
        borderStyle: 'double',
        borderColor: 'cyan',
    });
}
function formatRepoFull(repoCommits) {
    const { repoName, commits } = repoCommits;
    const lines = [];
    lines.push(chalk.bold.cyan(`▸ ${repoName}`) +
        chalk.dim(`  (${commits.length} commit${commits.length !== 1 ? 's' : ''})`));
    for (const commit of commits) {
        const hash = chalk.dim(commit.hash);
        const subject = colorizeSubject(commit.subject);
        lines.push(`  ${chalk.dim('✦')} ${hash}  ${subject}`);
    }
    return lines.join('\n');
}
function formatRepoCompact(repoCommits) {
    const { repoName, commits } = repoCommits;
    const types = new Set(commits.map((c) => getCommitType(c.subject)).filter(Boolean));
    const typeStr = types.size > 0 ? chalk.dim(` [${Array.from(types).join(', ')}]`) : '';
    return (chalk.bold.cyan(`▸ ${repoName}`) +
        chalk.dim(`  ${commits.length} commit${commits.length !== 1 ? 's' : ''}`) +
        typeStr);
}
function buildFooter(report) {
    if (report.repos.length === 0) {
        return chalk.dim('  No commits found for the given time range.\n');
    }
    const allDates = report.repos
        .flatMap((r) => r.commits)
        .map((c) => dayjs(c.date).format('MMM D'));
    const uniqueDates = [...new Set(allDates)];
    const dateRange = uniqueDates.length > 1 ? `${uniqueDates[uniqueDates.length - 1]} → ${uniqueDates[0]}` : uniqueDates[0] ?? '';
    return ('\n' +
        chalk.dim('─'.repeat(50)) +
        '\n' +
        chalk.dim(`  Total: ${report.totalCommits} commit${report.totalCommits !== 1 ? 's' : ''} across ${report.repos.length} repo${report.repos.length !== 1 ? 's' : ''}`) +
        (dateRange ? chalk.dim(`  |  ${dateRange}`) : '') +
        '\n');
}
export function formatFull(report, opts) {
    if (report.repos.length === 0) {
        return (buildHeader(report, opts.author) +
            chalk.dim('\n  No commits found in the given time range.\n'));
    }
    const repoSections = report.repos.map(formatRepoFull).join('\n\n');
    return buildHeader(report, opts.author) + repoSections + '\n' + buildFooter(report);
}
export function formatCompact(report, opts) {
    if (report.repos.length === 0) {
        return (buildHeader(report, opts.author) +
            chalk.dim('\n  No commits found in the given time range.\n'));
    }
    const lines = report.repos.map(formatRepoCompact).join('\n');
    return buildHeader(report, opts.author) + lines + '\n' + buildFooter(report);
}
export function formatMarkdown(report, opts) {
    const dateStr = formatDate(report.date);
    const lines = [];
    lines.push(`## Standup — ${dateStr}`);
    lines.push('');
    if (opts.author) {
        lines.push(`**Author:** ${opts.author}`);
        lines.push('');
    }
    if (report.repos.length === 0) {
        lines.push('_No commits found for the given time range._');
        return lines.join('\n');
    }
    lines.push('### What I worked on');
    lines.push('');
    for (const repoCommits of report.repos) {
        lines.push(`**${repoCommits.repoName}**`);
        for (const commit of repoCommits.commits) {
            lines.push(`- \`${commit.hash}\` ${commit.subject}`);
        }
        lines.push('');
    }
    lines.push(`---`, `_${report.totalCommits} commit${report.totalCommits !== 1 ? 's' : ''} across ${report.repos.length} repo${report.repos.length !== 1 ? 's' : ''}_`);
    return lines.join('\n');
}
export function formatReport(report, opts) {
    switch (opts.format) {
        case 'compact':
            return formatCompact(report, opts);
        case 'markdown':
            return formatMarkdown(report, opts);
        case 'full':
        default:
            return formatFull(report, opts);
    }
}
