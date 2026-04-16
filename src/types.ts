export interface Commit {
  hash: string;
  date: string;
  time: string;
  message: string;
  author: string;
}

export interface RepoResult {
  name: string;
  path: string;
  commits: Commit[];
}

export interface CliOptions {
  since: string;
  author: string;
  dir: string;
  depth: number;
  format: 'text' | 'markdown';
}
