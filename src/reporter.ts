import { homedir } from 'os';
import type { RepoResult } from './types.js';

// ANSI color helpers (no external deps)
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  blue: '\x1b[34m',
  brightBlue: '\x1b[94m',
  gray: '\x1b[90m',
  white: '\x1b[97m',
  green: '\x1b[32m',
  brightGreen: '\x1b[92m',
};

function blue(s: string): string {
  return `${c.bold}${c.brightBlue}${s}${c.reset}`;
}
function gray(s: string): string {
  return `${c.gray}${s}${c.reset}`;
}
function dim(s: string): string {
  return `${c.dim}${s}${c.reset}`;
}
function white(s: string): string {
  return `${c.white}${s}${c.reset}`;
}
function green(s: string): string {
  return `${c.bold}${c.brightGreen}${s}${c.reset}`;
}

/** Replace $HOME with ~ for nicer display */
function tildePath(p: string): string {
  const home = homedir();
  return p.startsWith(home) ? `~${p.slice(home.length)}` : p;
}

/**
 * Print results as colored terminal text.
 */
export function printText(results: RepoResult[]): void {
  const totalCommits = results.reduce((acc, r) => acc + r.commits.length, 0);

  if (results.length === 0) {
    console.log(dim('No commits found. Try --since=1week or a broader range.'));
    return;
  }

  console.log('');

  for (const repo of results) {
    const label = `${tildePath(repo.path)}`;
    const count = `(${repo.commits.length} commit${repo.commits.length === 1 ? '' : 's'})`;
    console.log(`${blue(label)}  ${dim(count)}`);

    for (const commit of repo.commits) {
      const hash = gray(commit.hash.padEnd(9));
      const time = dim(commit.time.padEnd(6));
      const msg = white(commit.message);
      console.log(`  ${hash}  ${time}  ${msg}`);
    }

    console.log('');
  }

  const summary = `${totalCommits} commit${totalCommits === 1 ? '' : 's'} across ${results.length} repositor${results.length === 1 ? 'y' : 'ies'}`;
  console.log(green(summary));
  console.log('');
}

/**
 * Print results in Markdown format suitable for Slack/Notion standup posts.
 */
export function printMarkdown(results: RepoResult[]): void {
  const totalCommits = results.reduce((acc, r) => acc + r.commits.length, 0);

  if (results.length === 0) {
    console.log('_No commits found._');
    return;
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  console.log(`## Standup — ${today}\n`);
  console.log('**What I did:**\n');

  for (const repo of results) {
    console.log(`**\`${tildePath(repo.path)}\`**`);
    for (const commit of repo.commits) {
      console.log(`- \`${commit.hash}\` ${commit.time}  ${commit.message}`);
    }
    console.log('');
  }

  console.log(
    `> ${totalCommits} commit${totalCommits === 1 ? '' : 's'} across ${results.length} repositor${results.length === 1 ? 'y' : 'ies'}`
  );
}
