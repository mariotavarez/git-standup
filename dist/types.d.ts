export interface CommitInfo {
    hash: string;
    author: string;
    email: string;
    date: string;
    subject: string;
    repo: string;
    repoPath: string;
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
    since: string;
    until: string;
    author?: string;
    path: string;
    depth: number;
    format: 'full' | 'compact' | 'markdown';
}
export interface AppConfig {
    author?: string;
    defaultPath?: string;
    defaultDepth?: number;
    defaultFormat?: 'full' | 'compact' | 'markdown';
}
