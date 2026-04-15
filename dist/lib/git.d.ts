import type { CommitInfo, StandupOptions } from '../types.js';
export declare function isGitRepo(repoPath: string): Promise<boolean>;
export declare function getCurrentUser(): Promise<{
    name: string;
    email: string;
}>;
export declare function getCommits(repoPath: string, opts: StandupOptions): Promise<CommitInfo[]>;
