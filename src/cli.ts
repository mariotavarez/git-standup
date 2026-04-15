#!/usr/bin/env node

import { Command } from 'commander';
import { runStandup } from './commands/standup.js';
import { showConfig, setConfig, resetConfig } from './commands/config.js';

const program = new Command();

program
  .name('git-standup')
  .description('Generate beautiful standup reports from your git history')
  .version('1.0.0');

// Default standup command (root-level options)
program
  .option('--since <date>', 'Start date for commits (e.g. "yesterday", "3 days ago", "2024-01-01")', 'yesterday')
  .option('--until <date>', 'End date for commits (e.g. "today", "now")', 'now')
  .option('--author <name>', 'Filter commits by author name or email')
  .option('--path <dir>', 'Directory to scan for git repositories')
  .option('--depth <n>', 'Max depth to scan for repos', '2')
  .option('--format <type>', 'Output format: full, compact, or markdown', 'full')
  .option('--all', 'Scan parent directory for sibling repos')
  .action(async (opts) => {
    try {
      await runStandup(opts);
    } catch (err) {
      if (err instanceof Error) {
        console.error('\n  Error:', err.message, '\n');
      } else {
        console.error('\n  An unexpected error occurred.\n');
      }
      process.exit(1);
    }
  });

// Config subcommand
const configCmd = program
  .command('config')
  .description('View or update git-standup configuration');

configCmd
  .command('show')
  .description('Show current configuration')
  .action(async () => {
    try {
      await showConfig();
    } catch (err) {
      if (err instanceof Error) {
        console.error('\n  Error:', err.message, '\n');
      }
      process.exit(1);
    }
  });

configCmd
  .command('set')
  .description('Set configuration values')
  .option('--author <name>', 'Default author filter')
  .option('--path <dir>', 'Default scan path')
  .option('--depth <n>', 'Default scan depth')
  .option('--format <type>', 'Default output format (full/compact/markdown)')
  .action(async (opts) => {
    try {
      await setConfig(opts);
    } catch (err) {
      if (err instanceof Error) {
        console.error('\n  Error:', err.message, '\n');
      }
      process.exit(1);
    }
  });

configCmd
  .command('reset')
  .description('Reset configuration to defaults')
  .action(async () => {
    try {
      await resetConfig();
    } catch (err) {
      if (err instanceof Error) {
        console.error('\n  Error:', err.message, '\n');
      }
      process.exit(1);
    }
  });

// Default: show config if no subcommand
configCmd.action(async () => {
  try {
    await showConfig();
  } catch (err) {
    if (err instanceof Error) {
      console.error('\n  Error:', err.message, '\n');
    }
    process.exit(1);
  }
});

program.parse(process.argv);
