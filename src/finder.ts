import { readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Walk a directory tree up to `maxDepth` levels deep and return
 * all directories that contain a `.git` sub-directory.
 */
export function findGitRepos(rootDir: string, maxDepth: number = 3): string[] {
  const repos: string[] = [];

  function walk(dir: string, depth: number): void {
    if (depth > maxDepth) return;

    let entries: string[];
    try {
      entries = readdirSync(dir);
    } catch {
      // Permission denied or unreadable — skip silently
      return;
    }

    // If this directory is itself a git repo, record it and stop descending
    if (existsSync(join(dir, '.git'))) {
      repos.push(dir);
      return;
    }

    for (const entry of entries) {
      // Skip hidden directories (except .git which we already checked)
      if (entry.startsWith('.')) continue;

      const fullPath = join(dir, entry);
      let stat;
      try {
        stat = statSync(fullPath);
      } catch {
        continue;
      }

      if (stat.isDirectory()) {
        walk(fullPath, depth + 1);
      }
    }
  }

  walk(rootDir, 1);
  return repos;
}
