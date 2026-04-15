import fs, { type Dirent } from 'fs';
import { readdir } from 'fs/promises';
import path from 'path';
import { isGitRepo } from './git.js';

async function walkDir(
  dir: string,
  currentDepth: number,
  maxDepth: number,
  results: string[]
): Promise<void> {
  if (currentDepth > maxDepth) return;

  let entries: Dirent[];
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }

  // Check if this directory is a git repo
  const hasGit = entries.some(
    (e) => e.name === '.git' && (e.isDirectory() || e.isFile())
  );

  if (hasGit) {
    const valid = await isGitRepo(dir);
    if (valid) {
      results.push(dir);
      // Don't recurse into nested git repos
      return;
    }
  }

  if (currentDepth < maxDepth) {
    const subdirPromises = entries
      .filter((e) => e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules')
      .map((e) => walkDir(path.join(dir, e.name), currentDepth + 1, maxDepth, results));

    await Promise.all(subdirPromises);
  }
}

export async function findGitRepos(
  basePath: string,
  maxDepth: number
): Promise<string[]> {
  const results: string[] = [];
  await walkDir(basePath, 0, maxDepth, results);
  return results.sort();
}
