/**
 * Error Handler
 * Comprehensive error handling and recovery system
 */

import { Logger } from '@/utils/Logger';

export class ErrorHandler {
  private readonly logger: Logger;
  private errorHistory: any[] = [];
  private recoveryStrategies: Map<string, any> = new Map();
  
  constructor(logger: Logger) {
    this.logger = logger;
    this.initializeRecoveryStrategies();
  }
  
  public createError(code: string, originalError?: any): Error {
    const error = new Error(`AGI Error: ${code}`);
    (error as any).code = code;
    (error as any).originalError = originalError;
    (error as any).timestamp = Date.now();
    (error as any).severity = this.getErrorSeverity(code);
    
    // Add to history
    this.errorHistory.push({
      code,
      message: error.message,
      timestamp: Date.now(),
      severity: (error as any).severity,
      originalError
    });
    
    return error;
  }
  
  public async handleError(error: any): Promise<void> {
    try {
      this.logger.error('Handling error', error as Error);
      
      // Determine recovery strategy
      const strategy = this.getRecoveryStrategy(error.code);
      
      if (strategy) {
        await this.executeRecoveryStrategy(strategy, error);
      } else {
        this.logger.warn('No recovery strategy found for error', { code: error.code });
      }
      
    } catch (handlingError) {
      this.logger.error('Error handling failed', handlingError as Error);
    }
  }
  
  public getErrorHistory(): any[] {
    return this.errorHistory;
  }
  
  public getErrorStatistics(): any {
    const stats = {
      totalErrors: this.errorHistory.length,
      errorsBySeverity: {} as Record<string, number>,
      errorsByCode: {} as Record<string, number>,
      recentErrors: this.errorHistory.slice(-10)
    };
    
    for (const error of this.errorHistory) {
      stats.errorsBySeverity[error.severity] = (stats.errorsBySeverity[error.severity] || 0) + 1;
      stats.errorsByCode[error.code] = (stats.errorsByCode[error.code] || 0) + 1;
    }
    
    return stats;
  }
  
  // Private methods
  
  private initializeRecoveryStrategies(): void {
    // Initialize recovery strategies for different error types
    this.recoveryStrategies.set('INITIALIZATION_FAILED', {
      type: 'retry',
      maxAttempts: 3,
      backoff: 1000,
      action: 'Reinitialize system components'
    });
    
    this.recoveryStrategies.set('STARTUP_FAILED', {
      type: 'retry',
      maxAttempts: 2,
      backoff: 2000,
      action: 'Restart system with clean state'
    });
    
    this.recoveryStrategies.set('SHUTDOWN_FAILED', {
      type: 'fallback',
      action: 'Force shutdown and cleanup'
    });
    
    this.recoveryStrategies.set('INPUT_PROCESSING_FAILED', {
      type: 'degradation',
      action: 'Process input with reduced capabilities'
    });
    
    this.recoveryStrategies.set('PLAN_EXECUTION_FAILED', {
      type: 'fallback',
      action: 'Execute alternative plan'
    });
    
    this.recoveryStrategies.set('LEARNING_FAILED', {
      type: 'retry',
      maxAttempts: 1,
      action: 'Retry learning with different parameters'
    });
    
    this.recoveryStrategies.set('META_REASONING_FAILED', {
      type: 'degradation',
      action: 'Skip meta-reasoning for this cycle'
    });
    
    this.recoveryStrategies.set('CREATIVITY_FAILED', {
      type: 'fallback',
      action: 'Use standard problem-solving approach'
    });
    
    this.recoveryStrategies.set('SYSTEM_NOT_INITIALIZED', {
      type: 'restart',
      action: 'Initialize system before proceeding'
    });
  }
  
  private getErrorSeverity(code: string): string {
    const criticalErrors = ['INITIALIZATION_FAILED', 'STARTUP_FAILED', 'SHUTDOWN_FAILED'];
    const highErrors = ['PLAN_EXECUTION_FAILED', 'INPUT_PROCESSING_FAILED'];
    const mediumErrors = ['LEARNING_FAILED', 'META_REASONING_FAILED'];
    const lowErrors = ['CREATIVITY_FAILED'];
    
    if (criticalErrors.includes(code)) return 'critical';
    if (highErrors.includes(code)) return 'high';
    if (mediumErrors.includes(code)) return 'medium';
    if (lowErrors.includes(code)) return 'low';
    
    return 'medium';
  }
  
  private getRecoveryStrategy(code: string): any {
    return this.recoveryStrategies.get(code);
  }
  
  private async executeRecoveryStrategy(strategy: any, _error: any): Promise<void> {
    try {
      this.logger.info('Executing recovery strategy', { 
        type: strategy.type, 
        action: strategy.action 
      });
      
      switch (strategy.type) {
        case 'retry':
          await this.executeRetryStrategy(strategy, _error);
          break;
        case 'fallback':
          await this.executeFallbackStrategy(strategy, _error);
          break;
        case 'degradation':
          await this.executeDegradationStrategy(strategy, _error);
          break;
        case 'restart':
          await this.executeRestartStrategy(strategy, _error);
          break;
        default:
          this.logger.warn('Unknown recovery strategy type', { type: strategy.type });
      }
      
    } catch (recoveryError) {
      this.logger.error('Recovery strategy execution failed', recoveryError as Error);
    }
  }
  
  private async executeRetryStrategy(strategy: any, _error: any): Promise<void> {
    const maxAttempts = strategy.maxAttempts || 1;
    const backoff = strategy.backoff || 1000;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        this.logger.info(`Retry attempt ${attempt}/${maxAttempts}`, { action: strategy.action });
        
        // Simulate retry action
        await this.simulateRetryAction(strategy.action);
        
        this.logger.info('Retry successful');
        return;
        
      } catch (retryError) {
        this.logger.warn(`Retry attempt ${attempt} failed`, retryError);
        
        if (attempt < maxAttempts) {
          await this.delay(backoff * attempt);
        }
      }
    }
    
    this.logger.error('All retry attempts failed');
  }
  
  private async executeFallbackStrategy(strategy: any, _error: any): Promise<void> {
    this.logger.info('Executing fallback strategy', { action: strategy.action });
    
    // Simulate fallback action
    await this.simulateFallbackAction(strategy.action);
    
    this.logger.info('Fallback strategy completed');
  }
  
  private async executeDegradationStrategy(strategy: any, _error: any): Promise<void> {
    this.logger.info('Executing degradation strategy', { action: strategy.action });
    
    // Simulate degradation action
    await this.simulateDegradationAction(strategy.action);
    
    this.logger.info('Degradation strategy completed');
  }
  
  private async executeRestartStrategy(strategy: any, _error: any): Promise<void> {
    this.logger.info('Executing restart strategy', { action: strategy.action });
    
    // Simulate restart action
    await this.simulateRestartAction(strategy.action);
    
    this.logger.info('Restart strategy completed');
  }
  
  private async simulateRetryAction(action: string): Promise<void> {
    // Simulate the retry action
    await this.delay(100);
    this.logger.debug('Simulated retry action', { action });
  }
  
  private async simulateFallbackAction(action: string): Promise<void> {
    // Simulate the fallback action
    await this.delay(200);
    this.logger.debug('Simulated fallback action', { action });
  }
  
  private async simulateDegradationAction(action: string): Promise<void> {
    // Simulate the degradation action
    await this.delay(150);
    this.logger.debug('Simulated degradation action', { action });
  }
  
  private async simulateRestartAction(action: string): Promise<void> {
    // Simulate the restart action
    await this.delay(500);
    this.logger.debug('Simulated restart action', { action });
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
} 