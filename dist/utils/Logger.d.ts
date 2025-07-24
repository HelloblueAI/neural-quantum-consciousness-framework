/**
 * Advanced Logging System
 * Structured logging with multiple levels, performance tracking, and intelligent filtering
 */
import { EventEmitter } from 'events';
export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export interface LogEntry {
    readonly timestamp: number;
    readonly level: LogLevel;
    readonly component: string;
    readonly message: string;
    readonly data?: any;
    readonly error?: Error;
    readonly performance?: {
        readonly duration: number;
        readonly memoryUsage: number;
        readonly cpuUsage: number;
    };
}
export interface LoggerConfig {
    readonly level: LogLevel;
    readonly component: string;
    readonly enablePerformanceTracking: boolean;
    readonly enableStructuredLogging: boolean;
    readonly maxEntries: number;
}
/**
 * Advanced Logger
 *
 * Provides sophisticated logging capabilities including:
 * - Multiple log levels with intelligent filtering
 * - Performance tracking and monitoring
 * - Structured logging with metadata
 * - Error tracking and analysis
 * - Log aggregation and analysis
 */
export declare class Logger extends EventEmitter {
    private readonly config;
    private readonly logHistory;
    private readonly performanceMetrics;
    private static readonly LOG_LEVELS;
    constructor(component: string, config?: Partial<LoggerConfig>);
    /**
     * Log a trace message
     */
    trace(message: string, data?: any): void;
    /**
     * Log a debug message
     */
    debug(message: string, data?: any): void;
    /**
     * Log an info message
     */
    info(message: string, data?: any): void;
    /**
     * Log a warning message
     */
    warn(message: string, data?: any): void;
    /**
     * Log an error message
     */
    error(message: string, error?: Error, data?: any): void;
    /**
     * Log a fatal message
     */
    fatal(message: string, error?: Error, data?: any): void;
    /**
     * Log performance metrics
     */
    performance(operation: string, duration: number, data?: any): void;
    /**
     * Log with custom level
     */
    log(level: LogLevel, message: string, data?: any, error?: Error): void;
    /**
     * Get log history
     */
    getHistory(level?: LogLevel, limit?: number): LogEntry[];
    /**
     * Get performance metrics
     */
    getPerformanceMetrics(): any;
    /**
     * Clear log history
     */
    clearHistory(): void;
    /**
     * Export logs
     */
    exportLogs(format?: 'json' | 'text'): string;
    /**
     * Analyze log patterns
     */
    analyzePatterns(): any;
    private shouldLog;
    private addToHistory;
    private removeSensitiveFields;
    private updatePerformanceMetrics;
    private outputToConsole;
    private analyzeLevelDistribution;
    private analyzeErrorPatterns;
    private analyzePerformanceTrends;
    private analyzeComponentUsage;
    private calculateErrorFrequency;
    private findCommonMessages;
}
//# sourceMappingURL=Logger.d.ts.map