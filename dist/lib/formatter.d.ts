import type { StandupReport, StandupOptions } from '../types.js';
export declare function formatFull(report: StandupReport, opts: StandupOptions): string;
export declare function formatCompact(report: StandupReport, opts: StandupOptions): string;
export declare function formatMarkdown(report: StandupReport, opts: StandupOptions): string;
export declare function formatReport(report: StandupReport, opts: StandupOptions): string;
