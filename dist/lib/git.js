import { simpleGit } from 'simple-git';
import path from 'path';
export async function isGitRepo(repoPath) {
    try {
        const git = simpleGit(repoPath);
        await git.revparse(['--git-dir']);
        return true;
    }
    catch {
        return false;
    }
}
export async function getCurrentUser() {
    try {
        const git = simpleGit();
        const name = await git.raw(['config', '--global', 'user.name']);
        const email = await git.raw(['config', '--global', 'user.email']);
        return {
            name: name.trim(),
            email: email.trim(),
        };
    }
    catch {
        return { name: '', email: '' };
    }
}
export async function getCommits(repoPath, opts) {
    try {
        const git = simpleGit(repoPath);
        const logArgs = [
            `--since=${opts.since}`,
            `--until=${opts.until}`,
            '--format=%H%x00%an%x00%ae%x00%aI%x00%s',
        ];
        if (opts.author) {
            logArgs.push(`--author=${opts.author}`);
        }
        const rawLog = await git.raw(['log', ...logArgs]);
        if (!rawLog.trim()) {
            return [];
        }
        const repoName = path.basename(repoPath);
        const commits = [];
        const lines = rawLog.trim().split('\n');
        for (const line of lines) {
            if (!line.trim())
                continue;
            const parts = line.split('\x00');
            if (parts.length < 5)
                continue;
            const [hash, author, email, date, ...subjectParts] = parts;
            const subject = subjectParts.join('\x00');
            commits.push({
                hash: hash.substring(0, 7),
                author: author.trim(),
                email: email.trim(),
                date: date.trim(),
                subject: subject.trim(),
                repo: repoName,
                repoPath,
            });
        }
        return commits;
    }
    catch {
        return [];
    }
}
