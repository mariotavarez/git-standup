# git-standup

> Generate beautiful standup reports from your git history

[![Node.js 20+](https://img.shields.io/badge/node-%3E%3D20-brightgreen?logo=node.js)](https://nodejs.org)
[![TypeScript 5.7](https://img.shields.io/badge/typescript-5.7-blue?logo=typescript)](https://www.typescriptlang.org)
[![MIT License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

```
╔══════════════════════════════════════════════════════╗
║  Daily Standup — Tuesday, Jan 14, 2025               ║
║  2 repos · 7 commits · mario.tavarez                 ║
╚══════════════════════════════════════════════════════╝

▸ my-api-server  (4 commits)
  ✦ abc1234  feat: add user authentication endpoint
  ✦ bcd2345  fix: handle null user in middleware
  ✦ cde3456  refactor: extract token validation
  ✦ def4567  test: add auth unit tests

▸ react-dashboard  (3 commits)
  ✦ fgh6789  feat: add dark mode toggle
  ✦ ghi8901  fix: resolve mobile menu z-index issue
  ✦ hij0123  docs: update component API docs

──────────────────────────────────────────────────────
  Total: 7 commits across 2 repos  |  Jan 14
```

## Features

- Scans one or many git repositories automatically
- Groups commits by repo with colored output
- Color-coded commit types (feat=green, fix=red, docs=blue, refactor=yellow, test=magenta)
- Three output formats: `full`, `compact`, `markdown`
- Configurable author, path, depth, and default format
- Spinner feedback while scanning and reading history
- Supports any git date syntax (`yesterday`, `3 days ago`, `2024-01-01`)
- `--all` mode scans sibling directories for all your projects

## Installation

```bash
# Global install
npm install -g git-standup

# Or run directly with npx
npx git-standup
```

## Usage

```bash
# Show yesterday's commits in the current repo
git-standup

# Commits from the last 2 days
git-standup --since "2 days ago"

# Scan all sibling repos (great for monorepo setups)
git-standup --all

# Output in Markdown for sharing in Slack/Notion
git-standup --format markdown

# Commits from a specific date range
git-standup --since "2024-01-01" --until "2024-01-07"

# Filter by author
git-standup --author "Alice"

# Scan a specific directory up to depth 3
git-standup --path ~/projects --depth 3
```

## Options

| Flag | Default | Description |
|------|---------|-------------|
| `--since <date>` | `yesterday` | Start of date range |
| `--until <date>` | `now` | End of date range |
| `--author <name>` | git config user | Filter by commit author |
| `--path <dir>` | current directory | Root directory to scan |
| `--depth <n>` | `2` | Max directory depth to search for repos |
| `--format <type>` | `full` | Output format: `full`, `compact`, `markdown` |
| `--all` | `false` | Scan parent directory (includes sibling repos) |

## Configuration

Save defaults so you don't have to repeat flags every time:

```bash
# View current config
git-standup config
git-standup config show

# Set defaults
git-standup config set --author "Mario Tavarez"
git-standup config set --path ~/projects
git-standup config set --depth 3
git-standup config set --format compact

# Reset all config
git-standup config reset
```

Configuration is stored at `~/.config/git-standup/config.json`.

## Output Formats

### Full (default)
Rich terminal output with colored commit types and hashes — best for local viewing.

### Compact
One line per repo showing commit count and types — great for a quick glance.

### Markdown
Clean Markdown output for pasting into Slack, Notion, GitHub, or any other tool.

```bash
git-standup --format markdown > standup.md
```

## Building from Source

```bash
git clone https://github.com/mariotavarez/git-standup.git
cd git-standup
npm install
npm run build
npm link  # install globally from local build
```

## License

MIT © Mario Tavarez
