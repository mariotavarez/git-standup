import chalk from 'chalk';
import boxen from 'boxen';
import { readConfig, writeConfig, getConfigPath } from '../lib/config.js';
import type { AppConfig } from '../types.js';

interface ConfigSetOptions {
  author?: string;
  path?: string;
  depth?: string | number;
  format?: string;
}

export async function showConfig(): Promise<void> {
  const config = await readConfig();
  const configPath = getConfigPath();

  const lines: string[] = [
    chalk.bold('  git-standup configuration'),
    chalk.dim(`  ${configPath}`),
    '',
    `  ${chalk.cyan('author')}       ${config.author ? chalk.white(config.author) : chalk.dim('(not set — uses git config user.name)')}`,
    `  ${chalk.cyan('defaultPath')}  ${config.defaultPath ? chalk.white(config.defaultPath) : chalk.dim('(not set — uses current directory)')}`,
    `  ${chalk.cyan('defaultDepth')} ${config.defaultDepth !== undefined ? chalk.white(String(config.defaultDepth)) : chalk.dim('(not set — defaults to 2)')}`,
    `  ${chalk.cyan('defaultFormat')}${config.defaultFormat ? chalk.white(config.defaultFormat) : chalk.dim('(not set — defaults to full)')}`,
  ];

  console.log(
    boxen(lines.join('\n'), {
      padding: { top: 0, bottom: 0, left: 1, right: 2 },
      margin: { top: 1, bottom: 1, left: 0, right: 0 },
      borderStyle: 'round',
      borderColor: 'cyan',
    })
  );

  console.log(
    chalk.dim('  Use ') +
      chalk.cyan('git-standup config set --author "Your Name"') +
      chalk.dim(' to update.\n')
  );
}

export async function setConfig(opts: ConfigSetOptions): Promise<void> {
  const current = await readConfig();
  const updates: AppConfig = { ...current };
  const changed: string[] = [];

  if (opts.author !== undefined) {
    updates.author = opts.author;
    changed.push(`author = ${chalk.white(opts.author)}`);
  }

  if (opts.path !== undefined) {
    updates.defaultPath = opts.path;
    changed.push(`defaultPath = ${chalk.white(opts.path)}`);
  }

  if (opts.depth !== undefined) {
    const depth = Number(opts.depth);
    if (isNaN(depth) || depth < 0) {
      console.error(chalk.red('  Error: depth must be a non-negative number'));
      process.exit(1);
    }
    updates.defaultDepth = depth;
    changed.push(`defaultDepth = ${chalk.white(String(depth))}`);
  }

  if (opts.format !== undefined) {
    const valid = ['full', 'compact', 'markdown'];
    if (!valid.includes(opts.format)) {
      console.error(chalk.red(`  Error: format must be one of: ${valid.join(', ')}`));
      process.exit(1);
    }
    updates.defaultFormat = opts.format as 'full' | 'compact' | 'markdown';
    changed.push(`defaultFormat = ${chalk.white(opts.format)}`);
  }

  if (changed.length === 0) {
    console.log(chalk.yellow('\n  No configuration values specified. Nothing changed.\n'));
    console.log(
      chalk.dim('  Options: --author, --path, --depth, --format\n')
    );
    return;
  }

  await writeConfig(updates);
  console.log(chalk.green('\n  Configuration updated:'));
  for (const line of changed) {
    console.log(chalk.dim('    ') + chalk.cyan(line));
  }
  console.log('');
}

export async function resetConfig(): Promise<void> {
  await writeConfig({});
  console.log(chalk.green('\n  Configuration reset to defaults.\n'));
}
