<div align="center">

# 📋 git-standup

**Your daily standup, written by your git history.**

Never stare blankly at "what did you do yesterday?" again. `git-standup` scans your repos, groups your commits, and generates a beautiful report ready to share — in seconds.

[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![npx](https://img.shields.io/badge/run%20with-npx-CB3837?logo=npm&logoColor=white)](https://www.npmjs.com/package/git-standup)

<img src=".github/demo.svg" alt="git-standup demo" width="700"/>

</div>

---

## Why git-standup?

Daily standups are valuable. Trying to *remember* what you did is not.

`git-standup` reads your actual commit history — across all your repos — and formats it into a clean, readable report. Use it to prep for standups, write weekly summaries, or just track your own momentum.

```bash
npx git-standup
```

---

## Features

- **Multi-repo scanning** — Automatically finds all git repos under a directory, no config needed
- **Flexible time ranges** — Yesterday, last week, a specific date — any range `git log` understands
- **Three output formats** — Terminal (full), compact one-liner, or Markdown for Slack/Notion
- **Commit type coloring** — `feat` (green), `fix` (red), `docs` (blue), `refactor` (yellow) — at a glance
- **Author filtering** — See your commits, or anyone on the team
- **Zero dependencies beyond git** — Works on any machine with Node 20 and git installed

---

## Quick Install

```bash
# Run instantly with npx
npx git-standup

# Install globally for daily use
npm install -g git-standup
```

---

## Usage

```bash
# What did I do yesterday? (default)
git-standup

# Last 3 days
git-standup --since "3 days ago"

# This entire week
git-standup --since "monday"

# Scan all sibling repos (~/projects/*)
git-standup --all

# Search in a specific directory
git-standup --path ~/work/projects --depth 3

# Filter by author
git-standup --author "Mario Tavarez"

# Export as Markdown (paste to Slack / Notion)
git-standup --format markdown

# Compact mode (one line per repo)
git-standup --format compact
```

### Example Output

```
  Daily Standup — Tuesday, April 15, 2026
  3 repos · 11 commits · mario.tavarez
  ─────────────────────────────────────────────────────

  react-node-editor  (4 commits)
    a1b2c3  feat: add drag-and-drop node palette
    b2c3d4  fix: edge connection handles on touch devices
    c3d4e5  refactor: extract node data types to types/
    d4e5f6  style: improve dark theme contrast

  devpulse  (4 commits)
    e5f6g7  feat: add hardcoded-secret pattern scanner
    f6g7h8  refactor: extract check runner to lib/
    g7h8i9  fix: semver comparison for major versions
    h8i9j0  docs: update README with usage examples

  ai-review-cli  (3 commits)
    i9j0k1  feat: add ai-review explain command
    j0k1l2  fix: demo mode mock data quality
    k1l2m3  test: add unit tests for formatter

  ─────────────────────────────────────────────────────
  Scanned 3 repos in ~/projects  ·  Elapsed: 0.8s
  Run with --format markdown to copy to Slack/Notion
```

### Markdown Output (for Slack/Notion)

```bash
git-standup --format markdown
```

```markdown
## Standup — April 15, 2026

**react-node-editor** (4 commits)
- feat: add drag-and-drop node palette
- fix: edge connection handles on touch devices

**devpulse** (4 commits)
- feat: add hardcoded-secret pattern scanner
- refactor: extract check runner to lib/
```

---

## Commit Type Colors

| Type | Color | Meaning |
|---|---|---|
| `feat` | 🟢 Green | New feature |
| `fix` | 🔴 Red | Bug fix |
| `docs` | 🔵 Blue | Documentation |
| `refactor` | 🟡 Yellow | Code refactor |
| `test` | 🩵 Cyan | Tests |
| `chore` | ⬜ Dim | Maintenance |
| `perf` | 🟠 Orange | Performance |

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 20+ | Runtime |
| TypeScript | 5.7 | Strict type safety |
| simple-git | 3 | Git log parsing |
| Commander | 12 | CLI argument parsing |
| Chalk | 5 | Terminal colors |
| Boxen | 8 | Bordered output boxes |
| dayjs | 1.11 | Date formatting |

---

## License

MIT © [Mario Tavarez](https://github.com/mariotavarez)
