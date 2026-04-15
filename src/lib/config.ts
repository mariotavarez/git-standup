import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import type { AppConfig } from '../types.js';

const CONFIG_DIR = path.join(os.homedir(), '.config', 'git-standup');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

async function ensureConfigDir(): Promise<void> {
  await fs.mkdir(CONFIG_DIR, { recursive: true });
}

export async function readConfig(): Promise<AppConfig> {
  try {
    const raw = await fs.readFile(CONFIG_FILE, 'utf-8');
    return JSON.parse(raw) as AppConfig;
  } catch {
    return {};
  }
}

export async function writeConfig(config: AppConfig): Promise<void> {
  await ensureConfigDir();
  await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
}

export async function setConfigValue<K extends keyof AppConfig>(
  key: K,
  value: AppConfig[K]
): Promise<void> {
  const current = await readConfig();
  current[key] = value;
  await writeConfig(current);
}

export function getConfigPath(): string {
  return CONFIG_FILE;
}
