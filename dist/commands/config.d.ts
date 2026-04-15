interface ConfigSetOptions {
    author?: string;
    path?: string;
    depth?: string | number;
    format?: string;
}
export declare function showConfig(): Promise<void>;
export declare function setConfig(opts: ConfigSetOptions): Promise<void>;
export declare function resetConfig(): Promise<void>;
export {};
