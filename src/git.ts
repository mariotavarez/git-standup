import { execSync } from 'child_process';
import type { Commit } from './types.js';

/**
 * Run `git log` in the given repo and return parsed commits.
 * Returns an empty array if git fails or no commits match.
 */
export function getCommits(
  repoPath: string,
  since: string,
  author: string
): Commit[] {
  // Format: hash|ISO-date|message|author-email
  const format = '%h|%ci|%s|%ae';

  let output: string;
  try {
    output = execSync(
      `git -C "${repoPath}" log --no-merges --format="${format}" --since="${since}" --author="${author}"`,
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
    ).trim();
  } catch {
    return [];
  }

  if (!output) return [];

  return output
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [hash, isoDate, ...rest] = line.split('|');
      // last segment is author email, everything in between is message
      const author = rest[rest.length - 1] ?? '';
      const message = rest.slice(0, -1).join('|');

      // Parse date and time from ISO string: "2024-01-15 09:42:31 +0000"
      const dateObj = new Date(isoDate ?? '');
      const date = isoDate ? isoDate.slice(0, 10) : '';
      const time = isNaN(dateObj.getTime())
        ? ''
        : dateObj.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          });

      return {
        hash: (hash ?? '').trim(),
        date,
        time,
        message: (message ?? '').trim(),
        author: (author ?? '').trim(),
      } satisfies Commit;
    });
}

/**
 * Resolve the configured user.email for the current machine.
 * Falls back to empty string if not set.
 */
export function getGitEmail(): string {
  try {
    return execSync('git config user.email', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
  } catch {
    return '';
  }
}
