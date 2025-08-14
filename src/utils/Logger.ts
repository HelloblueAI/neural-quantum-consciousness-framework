/**
 * Advanced Logging System
 * Structured logging with multiple levels, performance tracking, and intelligent filtering
 */

import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';

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
  readonly correlationId?: string;
  readonly sessionId?: string;
  readonly userId?: string;
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
export class Logger extends EventEmitter {
  private readonly config: LoggerConfig;
  private readonly logHistory: LogEntry[] = [];
  private readonly performanceMetrics = {
    totalLogs: 0,
    errors: 0,
    warnings: 0,
    averageLogTime: 0
  };
  
  // Session and correlation tracking
  private sessionId: string;
  private correlationCounter: number = 0;
  
  private static readonly LOG_LEVELS: Record<LogLevel, number> = {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
    fatal: 5
  };
  
  constructor(component: string, config?: Partial<LoggerConfig>) {
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
  public generateCorrelationId(): string {
    this.correlationCounter++;
    return `${this.sessionId}-${this.correlationCounter}`;
  }
  
  /**
   * Get current session ID
   */
  public getSessionId(): string {
    return this.sessionId;
  }
  
  /**
   * Log with correlation ID
   */
  public logWithCorrelation(
    level: LogLevel, 
    message: string, 
    correlationId: string, 
    data?: any
  ): void {
    this.log(level, message, {
      ...data,
      correlationId,
      sessionId: this.sessionId
    });
  }
  
  /**
   * Log with user context
   */
  public logWithUser(
    level: LogLevel, 
    message: string, 
    userId: string, 
    data?: any
  ): void {
    this.log(level, message, {
      ...data,
      userId,
      sessionId: this.sessionId
    });
  }
  
  /**
   * Log a trace message
   */
  public trace(message: string, data?: any): void {
    this.log('trace', message, data);
  }
  
  /**
   * Log a debug message
   */
  public debug(message: string, data?: any): void {
    this.log('debug', message, data);
  }
  
  /**
   * Log an info message
   */
  public info(message: string, data?: any): void {
    this.log('info', message, data);
  }
  
  /**
   * Log a warning message
   */
  public warn(message: string, data?: any): void {
    this.log('warn', message, data);
  }
  
  /**
   * Log an error message
   */
  public error(message: string, error?: Error, data?: any): void {
    this.log('error', message, data, error);
  }
  
  /**
   * Log a fatal message
   */
  public fatal(message: string, error?: Error, data?: any): void {
    this.log('fatal', message, data, error);
  }
  
  /**
   * Log performance metrics
   */
  public performance(operation: string, duration: number, data?: any): void {
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
  public log(level: LogLevel, message: string, data?: any, error?: Error): void {
    if (!this.shouldLog(level)) {
      return;
    }
    
    const startTime = Date.now();
    
    try {
      const entry: LogEntry = {
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
      
    } catch (logError) {
      // Fallback to console if logging fails
      console.error('Logging failed:', logError);
      console.log(`[${level.toUpperCase()}] ${this.config.component}: ${message}`, data);
    }
  }
  
  /**
   * Get log history
   */
  public getHistory(level?: LogLevel, limit?: number): LogEntry[] {
    let filtered = this.logHistory;
    
    if (level) {
      filtered = filtered.filter(entry => 
        Logger.LOG_LEVELS[entry.level] >= Logger.LOG_LEVELS[level]
      );
    }
    
    if (limit) {
      filtered = filtered.slice(-limit);
    }
    
    return filtered;
  }
  
  /**
   * Get performance metrics
   */
  public getPerformanceMetrics(): any {
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
  public clearHistory(): void {
    this.logHistory.length = 0;
    this.log('info', 'Log history cleared');
  }
  
  /**
   * Export logs
   */
  public exportLogs(format: 'json' | 'text' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(this.logHistory, null, 2);
    } else {
      return this.logHistory
        .map(entry => `[${new Date(entry.timestamp).toISOString()}] [${entry.level.toUpperCase()}] ${entry.component}: ${entry.message}`)
        .join('\n');
    }
  }
  
  /**
   * Analyze log patterns
   */
  public analyzePatterns(): any {
    const patterns = {
      levelDistribution: this.analyzeLevelDistribution(),
      errorPatterns: this.analyzeErrorPatterns(),
      performanceTrends: this.analyzePerformanceTrends(),
      componentUsage: this.analyzeComponentUsage()
    };
    
    return patterns;
  }
  
  // Private methods
  
  private shouldLog(level: LogLevel): boolean {
    return Logger.LOG_LEVELS[level] >= Logger.LOG_LEVELS[this.config.level];
  }
  
  private addToHistory(entry: LogEntry): void {
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
  
  private removeSensitiveFields(obj: any): void {
    const sensitiveFields = ['password', 'token', 'key', 'secret', 'auth'];
    
    for (const key in obj) {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        obj[key] = '[REDACTED]';
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
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
  
  private updatePerformanceMetrics(entry: LogEntry, logTime: number): void {
    this.performanceMetrics.totalLogs++;
    this.performanceMetrics.averageLogTime = 
      (this.performanceMetrics.averageLogTime * (this.performanceMetrics.totalLogs - 1) + logTime) / 
      this.performanceMetrics.totalLogs;
    
    if (entry.level === 'error' || entry.level === 'fatal') {
      this.performanceMetrics.errors++;
    } else if (entry.level === 'warn') {
      this.performanceMetrics.warnings++;
    }
  }
  
  private outputToConsole(entry: LogEntry): void {
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
  
  private analyzeLevelDistribution(): Record<LogLevel, number> {
    const distribution: Record<LogLevel, number> = {
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
  
  private analyzeErrorPatterns(): any {
    const errors = this.logHistory.filter(entry => entry.level === 'error' || entry.level === 'fatal');
    
    const patterns = {
      totalErrors: errors.length,
      errorTypes: {} as Record<string, number>,
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
  
  private analyzePerformanceTrends(): any {
    const performanceEntries = this.logHistory.filter(entry => entry.performance);
    
    return {
      averageLogTime: this.performanceMetrics.averageLogTime,
      memoryUsage: performanceEntries.map(entry => entry.performance?.memoryUsage || 0),
      cpuUsage: performanceEntries.map(entry => entry.performance?.cpuUsage || 0)
    };
  }
  
  private analyzeComponentUsage(): any {
    const componentUsage: Record<string, number> = {};
    
    for (const entry of this.logHistory) {
      componentUsage[entry.component] = (componentUsage[entry.component] || 0) + 1;
    }
    
    return componentUsage;
  }
  
  private calculateErrorFrequency(errors: LogEntry[]): number {
    if (errors.length === 0) return 0;
    
    const timeSpan = (this.logHistory[this.logHistory.length - 1]?.timestamp || 0) - (this.logHistory[0]?.timestamp || 0);
    if (!timeSpan) return 0;
    return errors.length / (timeSpan / (1000 * 60)); // errors per minute
  }
  
  private findCommonMessages(entries: LogEntry[]): Record<string, number> {
    const messageCount: Record<string, number> = {};
    
    for (const entry of entries) {
      messageCount[entry.message] = (messageCount[entry.message] || 0) + 1;
    }
    
    return messageCount;
  }
} 