/**
 * Advanced Logging System
 * Structured logging with multiple levels, performance tracking, and intelligent filtering
 */
import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
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
export class Logger extends EventEmitter {
    config;
    logHistory = [];
    performanceMetrics = {
        totalLogs: 0,
        errors: 0,
        warnings: 0,
        averageLogTime: 0
    };
    // Session and correlation tracking
    sessionId;
    correlationCounter = 0;
    static LOG_LEVELS = {
        trace: 0,
        debug: 1,
        info: 2,
        warn: 3,
        error: 4,
        fatal: 5
    };
    constructor(component, config) {
        super();
        this.config = {
            level: 'info',
            component,
            enablePerformanceTracking: true,
            enableStructuredLogging: true,
            maxEntries: 10000,
            ...config
        };
        // Generate session ID
        this.sessionId = uuidv4();
        this.log('info', 'Logger initialized', { component: this.config.component });
    }
    /**
     * Generate a new correlation ID for request tracking
     */
    generateCorrelationId() {
        this.correlationCounter++;
        return `${this.sessionId}-${this.correlationCounter}`;
    }
    /**
     * Get current session ID
     */
    getSessionId() {
        return this.sessionId;
    }
    /**
     * Log with correlation ID
     */
    logWithCorrelation(level, message, correlationId, data) {
        this.log(level, message, {
            ...data,
            correlationId,
            sessionId: this.sessionId
        });
    }
    /**
     * Log with user context
     */
    logWithUser(level, message, userId, data) {
        this.log(level, message, {
            ...data,
            userId,
            sessionId: this.sessionId
        });
    }
    /**
     * Log a trace message
     */
    trace(message, data) {
        this.log('trace', message, data);
    }
    /**
     * Log a debug message
     */
    debug(message, data) {
        this.log('debug', message, data);
    }
    /**
     * Log an info message
     */
    info(message, data) {
        this.log('info', message, data);
    }
    /**
     * Log a warning message
     */
    warn(message, data) {
        this.log('warn', message, data);
    }
    /**
     * Log an error message
     */
    error(message, error, data) {
        this.log('error', message, data, error);
    }
    /**
     * Log a fatal message
     */
    fatal(message, error, data) {
        this.log('fatal', message, data, error);
    }
    /**
     * Log performance metrics
     */
    performance(operation, duration, data) {
        this.log('info', `Performance: ${operation}`, {
            ...data,
            duration,
            memoryUsage: process.memoryUsage(),
            cpuUsage: process.cpuUsage()
        });
    }
    /**
     * Log with custom level
     */
    log(level, message, data, error) {
        if (!this.shouldLog(level)) {
            return;
        }
        const startTime = Date.now();
        try {
            const entry = {
                timestamp: Date.now(),
                level: level,
                component: this.config.component,
                message: message,
                data: data || {},
                ...(error && { error }),
                ...(performance && {
                    performance: {
                        duration: 0,
                        memoryUsage: 0,
                        cpuUsage: 0
                    }
                })
            };
            // Add to history
            this.addToHistory(entry);
            // Emit log event
            this.emit('log', entry);
            // Update performance metrics
            this.updatePerformanceMetrics(entry, Date.now() - startTime);
            // Output to console (in development)
            this.outputToConsole(entry);
        }
        catch (logError) {
            // Fallback to console if logging fails
            console.error('Logging failed:', logError);
            console.log(`[${level.toUpperCase()}] ${this.config.component}: ${message}`, data);
        }
    }
    /**
     * Get log history
     */
    getHistory(level, limit) {
        let filtered = this.logHistory;
        if (level) {
            filtered = filtered.filter(entry => Logger.LOG_LEVELS[entry.level] >= Logger.LOG_LEVELS[level]);
        }
        if (limit) {
            filtered = filtered.slice(-limit);
        }
        return filtered;
    }
    /**
     * Get performance metrics
     */
    getPerformanceMetrics() {
        return {
            ...this.performanceMetrics,
            historySize: this.logHistory.length,
            errorRate: this.performanceMetrics.errors / Math.max(this.performanceMetrics.totalLogs, 1),
            warningRate: this.performanceMetrics.warnings / Math.max(this.performanceMetrics.totalLogs, 1)
        };
    }
    /**
     * Clear log history
     */
    clearHistory() {
        this.logHistory.length = 0;
        this.log('info', 'Log history cleared');
    }
    /**
     * Export logs
     */
    exportLogs(format = 'json') {
        if (format === 'json') {
            return JSON.stringify(this.logHistory, null, 2);
        }
        else {
            return this.logHistory
                .map(entry => `[${new Date(entry.timestamp).toISOString()}] [${entry.level.toUpperCase()}] ${entry.component}: ${entry.message}`)
                .join('\n');
        }
    }
    /**
     * Analyze log patterns
     */
    analyzePatterns() {
        const patterns = {
            levelDistribution: this.analyzeLevelDistribution(),
            errorPatterns: this.analyzeErrorPatterns(),
            performanceTrends: this.analyzePerformanceTrends(),
            componentUsage: this.analyzeComponentUsage()
        };
        return patterns;
    }
    // Private methods
    shouldLog(level) {
        return Logger.LOG_LEVELS[level] >= Logger.LOG_LEVELS[this.config.level];
    }
    addToHistory(entry) {
        this.logHistory.push(entry);
        // Maintain max entries limit
        if (this.logHistory.length > this.config.maxEntries) {
            this.logHistory.splice(0, this.logHistory.length - this.config.maxEntries);
        }
    }
    // private sanitizeData(data: any): any {
    //   if (!data) return data;
    //   try {
    //     // Deep clone to avoid mutations
    //     const sanitized = JSON.parse(JSON.stringify(data));
    //     // Remove sensitive information
    //     if (typeof sanitized === 'object') {
    //       this.removeSensitiveFields(sanitized);
    //     }
    //     return sanitized;
    //   } catch (error) {
    //     return { error: 'Failed to sanitize data', originalData: String(data) };
    //   }
    // }
    removeSensitiveFields(obj) {
        const sensitiveFields = ['password', 'token', 'key', 'secret', 'auth'];
        for (const key in obj) {
            if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
                obj[key] = '[REDACTED]';
            }
            else if (typeof obj[key] === 'object' && obj[key] !== null) {
                this.removeSensitiveFields(obj[key]);
            }
        }
    }
    // private sanitizeError(error: Error): any {
    //   return {
    //     name: error.name,
    //     message: error.message,
    //     stack: error.stack,
    //     cause: error.cause
    //   };
    // }
    updatePerformanceMetrics(entry, logTime) {
        this.performanceMetrics.totalLogs++;
        this.performanceMetrics.averageLogTime =
            (this.performanceMetrics.averageLogTime * (this.performanceMetrics.totalLogs - 1) + logTime) /
                this.performanceMetrics.totalLogs;
        if (entry.level === 'error' || entry.level === 'fatal') {
            this.performanceMetrics.errors++;
        }
        else if (entry.level === 'warn') {
            this.performanceMetrics.warnings++;
        }
    }
    outputToConsole(entry) {
        const timestamp = new Date(entry.timestamp).toISOString();
        const level = entry.level.toUpperCase().padEnd(5);
        const component = entry.component.padEnd(15);
        const message = entry.message;
        const logLine = `[${timestamp}] [${level}] [${component}] ${message}`;
        switch (entry.level) {
            case 'trace':
            case 'debug':
                console.debug(logLine, entry.data);
                break;
            case 'info':
                console.info(logLine, entry.data);
                break;
            case 'warn':
                console.warn(logLine, entry.data);
                break;
            case 'error':
            case 'fatal':
                console.error(logLine, entry.data, entry.error);
                break;
        }
    }
    analyzeLevelDistribution() {
        const distribution = {
            trace: 0,
            debug: 0,
            info: 0,
            warn: 0,
            error: 0,
            fatal: 0
        };
        for (const entry of this.logHistory) {
            distribution[entry.level]++;
        }
        return distribution;
    }
    analyzeErrorPatterns() {
        const errors = this.logHistory.filter(entry => entry.level === 'error' || entry.level === 'fatal');
        const patterns = {
            totalErrors: errors.length,
            errorTypes: {},
            errorFrequency: this.calculateErrorFrequency(errors),
            commonErrorMessages: this.findCommonMessages(errors)
        };
        for (const error of errors) {
            if (error.error) {
                const errorType = error.error.name || 'Unknown';
                patterns.errorTypes[errorType] = (patterns.errorTypes[errorType] || 0) + 1;
            }
        }
        return patterns;
    }
    analyzePerformanceTrends() {
        const performanceEntries = this.logHistory.filter(entry => entry.performance);
        return {
            averageLogTime: this.performanceMetrics.averageLogTime,
            memoryUsage: performanceEntries.map(entry => entry.performance?.memoryUsage || 0),
            cpuUsage: performanceEntries.map(entry => entry.performance?.cpuUsage || 0)
        };
    }
    analyzeComponentUsage() {
        const componentUsage = {};
        for (const entry of this.logHistory) {
            componentUsage[entry.component] = (componentUsage[entry.component] || 0) + 1;
        }
        return componentUsage;
    }
    calculateErrorFrequency(errors) {
        if (errors.length === 0)
            return 0;
        const timeSpan = (this.logHistory[this.logHistory.length - 1]?.timestamp || 0) - (this.logHistory[0]?.timestamp || 0);
        if (!timeSpan)
            return 0;
        return errors.length / (timeSpan / (1000 * 60)); // errors per minute
    }
    findCommonMessages(entries) {
        const messageCount = {};
        for (const entry of entries) {
            messageCount[entry.message] = (messageCount[entry.message] || 0) + 1;
        }
        return messageCount;
    }
}
