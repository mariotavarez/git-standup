# Design — git-standup

> Architecture and engineering decisions for `git-standup`.
> Inspired by [awesome-design-docs](https://github.com/joelparkerhenderson/awesome-design-docs) and the [VoltAgent design philosophy](https://github.com/voltagent/voltagent): small surface area, composable primitives, no magic.

---

## Goals

| Goal | Decision |
|------|----------|
| Zero runtime dependencies | Use only Node.js built-ins (`child_process`, `fs`, `path`, `os`) |
| Works everywhere | Spawn `git` as a subprocess — no JS git library |
| Fast | Parallel repo scanning via synchronous `execSync` in a tight loop (no I/O bottleneck in practice at 3 levels deep) |
| Composable output | Separate reporter module; adding JSON or CSV output is one new function |
| npx-first | Compiled to `dist/index.js` with a shebang; `bin` field in `package.json` |

---

## Module structure

```
src/
  index.ts     CLI entry point — arg parsing, orchestration
  finder.ts    Directory walker — detects .git folders
  git.ts       git log wrapper — spawns git, parses output
  reporter.ts  Output formatters — text (ANSI) and markdown
  config.ts    --since resolver — translates human strings to git date strings
  types.ts     Shared interfaces: Commit, RepoResult, CliOptions
```

Each module has a single responsibility and no circular imports.

---

## Key design decisions

### 1. Spawn `git` directly

Spawning `git` as a subprocess (via `execSync`) means:
- No JS git library to maintain or audit
- Git's own date parsing and author matching handles edge cases
- Works with any git version ≥ 2.x

The `git log` format string `%h|%ci|%s|%ae` uses `|` as delimiter and `%ci` (ISO 8601) for reliable date parsing.

### 2. Synchronous directory walk

`finder.ts` uses synchronous `readdirSync` / `statSync`. This is intentional:
- The tree is shallow (max depth 3)
- Sync I/O avoids complexity with async concurrency
- The bottleneck is `git log` subprocess latency, not directory listing

### 3. `--since` resolution is a pure function

`config.ts` maps human-readable strings to git-understood date strings:
- `yesterday` → `"yesterday"` (git parses this natively)
- `3days` → `"3 days ago"`
- `1week` → `"1 week ago"`
- `2024-01-15` → `"2024-01-15"` (ISO passthrough)

This is a pure string-in / string-out function — easy to test, easy to extend.

### 4. ANSI colors via string literals

No `chalk` or similar. ANSI escape codes are well-supported in every modern terminal and add zero bytes to the install. The color helpers in `reporter.ts` are five-line wrappers.

### 5. stderr for progress, stdout for output

Progress messages ("Searching for git repos...") go to `stderr`. The commit output goes to `stdout`. This means:
```bash
npx git-standup --format=markdown > standup.md
```
Works correctly — the progress spinner doesn't pollute the file.

---

## Data flow

```
argv
  └─► parseArgs()           → CliOptions
        └─► resolveSince()  → git date string
        └─► findGitRepos()  → string[] (repo paths)
              └─► getCommits() per repo → Commit[]
                    └─► printText() or printMarkdown()
```

---

## Extending

**Add JSON output:**
```typescript
// reporter.ts
export function printJson(results: RepoResult[]): void {
  console.log(JSON.stringify(results, null, 2));
}
```
Then add `'json'` to the `format` union in `types.ts` and wire it up in `index.ts`.

**Add `--until` flag:**
Extend `CliOptions`, parse the flag in `parseArgs`, pass to `getCommits` as an additional `git log --until` argument.

**Parallelize repo scanning:**
Replace the `for...of` loop in `main()` with `Promise.all(repoPaths.map(...))` using the async version of `execSync` (`exec` from `child_process/promises`).
