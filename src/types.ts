export interface CommitInfo {
  hash: string;
  author: string;
  email: string;
  date: string;       // ISO
  subject: string;
  repo: string;       // repo name (dirname)
  repoPath: string;   // absolute path
}

export interface StandupReport {
  date: string;
  repos: RepoCommits[];
  totalCommits: number;
}

export interface RepoCommits {
  repoName: string;
  repoPath: string;
  commits: CommitInfo[];
}

export interface StandupOptions {
  since: string;          // e.g. "yesterday", "3 days ago", "2024-01-01"
  until: string;          // e.g. "today", default "now"
  author?: string;        // git author filter (default: current git user)
  path: string;           // directory to scan for repos
  depth: number;          // max scan depth for repos
  format: 'full' | 'compact' | 'markdown';
}

export interface AppConfig {
  author?: string;
  defaultPath?: string;
  defaultDepth?: number;
  defaultFormat?: 'full' | 'compact' | 'markdown';
}
