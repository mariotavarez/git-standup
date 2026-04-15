import type { AppConfig } from '../types.js';
export declare function readConfig(): Promise<AppConfig>;
export declare function writeConfig(config: AppConfig): Promise<void>;
export declare function setConfigValue<K extends keyof AppConfig>(key: K, value: AppConfig[K]): Promise<void>;
export declare function getConfigPath(): string;
