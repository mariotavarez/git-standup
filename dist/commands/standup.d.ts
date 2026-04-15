interface StandupCommandOptions {
    since?: string;
    until?: string;
    author?: string;
    path?: string;
    depth?: string | number;
    format?: string;
    all?: boolean;
}
export declare function runStandup(cmdOpts: StandupCommandOptions): Promise<void>;
export {};
