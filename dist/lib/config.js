import fs from 'fs/promises';
import path from 'path';
import os from 'os';
const CONFIG_DIR = path.join(os.homedir(), '.config', 'git-standup');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
async function ensureConfigDir() {
    await fs.mkdir(CONFIG_DIR, { recursive: true });
}
export async function readConfig() {
    try {
        const raw = await fs.readFile(CONFIG_FILE, 'utf-8');
        return JSON.parse(raw);
    }
    catch {
        return {};
    }
}
export async function writeConfig(config) {
    await ensureConfigDir();
    await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
}
export async function setConfigValue(key, value) {
    const current = await readConfig();
    current[key] = value;
    await writeConfig(current);
}
export function getConfigPath() {
    return CONFIG_FILE;
}
