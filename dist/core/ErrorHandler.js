/**
 * Error Handler
 * Comprehensive error handling and recovery system
 */
export class ErrorHandler {
    logger;
    errorHistory = [];
    recoveryStrategies = new Map();
    constructor(logger) {
        this.logger = logger;
        this.initializeRecoveryStrategies();
    }
    createError(code, originalError) {
        const error = new Error(`AGI Error: ${code}`);
        error.code = code;
        error.originalError = originalError;
        error.timestamp = Date.now();
        error.severity = this.getErrorSeverity(code);
        // Add to history
        this.errorHistory.push({
            code,
            message: error.message,
            timestamp: Date.now(),
            severity: error.severity,
            originalError
        });
        return error;
    }
    async handleError(error) {
        try {
            this.logger.error('Handling error', error);
            // Determine recovery strategy
            const strategy = this.getRecoveryStrategy(error.code);
            if (strategy) {
                await this.executeRecoveryStrategy(strategy, error);
            }
            else {
                this.logger.warn('No recovery strategy found for error', { code: error.code });
            }
        }
        catch (handlingError) {
            this.logger.error('Error handling failed', handlingError);
        }
    }
    getErrorHistory() {
        return this.errorHistory;
    }
    getErrorStatistics() {
        const stats = {
            totalErrors: this.errorHistory.length,
            errorsBySeverity: {},
            errorsByCode: {},
            recentErrors: this.errorHistory.slice(-10)
        };
        for (const error of this.errorHistory) {
            stats.errorsBySeverity[error.severity] = (stats.errorsBySeverity[error.severity] || 0) + 1;
            stats.errorsByCode[error.code] = (stats.errorsByCode[error.code] || 0) + 1;
        }
        return stats;
    }
    // Private methods
    initializeRecoveryStrategies() {
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
    getErrorSeverity(code) {
        const criticalErrors = ['INITIALIZATION_FAILED', 'STARTUP_FAILED', 'SHUTDOWN_FAILED'];
        const highErrors = ['PLAN_EXECUTION_FAILED', 'INPUT_PROCESSING_FAILED'];
        const mediumErrors = ['LEARNING_FAILED', 'META_REASONING_FAILED'];
        const lowErrors = ['CREATIVITY_FAILED'];
        if (criticalErrors.includes(code))
            return 'critical';
        if (highErrors.includes(code))
            return 'high';
        if (mediumErrors.includes(code))
            return 'medium';
        if (lowErrors.includes(code))
            return 'low';
        return 'medium';
    }
    getRecoveryStrategy(code) {
        return this.recoveryStrategies.get(code);
    }
    async executeRecoveryStrategy(strategy, _error) {
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
        }
        catch (recoveryError) {
            this.logger.error('Recovery strategy execution failed', recoveryError);
        }
    }
    async executeRetryStrategy(strategy, _error) {
        const maxAttempts = strategy.maxAttempts || 1;
        const backoff = strategy.backoff || 1000;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                this.logger.info(`Retry attempt ${attempt}/${maxAttempts}`, { action: strategy.action });
                // Simulate retry action
                await this.simulateRetryAction(strategy.action);
                this.logger.info('Retry successful');
                return;
            }
            catch (retryError) {
                this.logger.warn(`Retry attempt ${attempt} failed`, retryError);
                if (attempt < maxAttempts) {
                    await this.delay(backoff * attempt);
                }
            }
        }
        this.logger.error('All retry attempts failed');
    }
    async executeFallbackStrategy(strategy, _error) {
        this.logger.info('Executing fallback strategy', { action: strategy.action });
        // Simulate fallback action
        await this.simulateFallbackAction(strategy.action);
        this.logger.info('Fallback strategy completed');
    }
    async executeDegradationStrategy(strategy, _error) {
        this.logger.info('Executing degradation strategy', { action: strategy.action });
        // Simulate degradation action
        await this.simulateDegradationAction(strategy.action);
        this.logger.info('Degradation strategy completed');
    }
    async executeRestartStrategy(strategy, _error) {
        this.logger.info('Executing restart strategy', { action: strategy.action });
        // Simulate restart action
        await this.simulateRestartAction(strategy.action);
        this.logger.info('Restart strategy completed');
    }
    async simulateRetryAction(action) {
        // Simulate the retry action
        await this.delay(100);
        this.logger.debug('Simulated retry action', { action });
    }
    async simulateFallbackAction(action) {
        // Simulate the fallback action
        await this.delay(200);
        this.logger.debug('Simulated fallback action', { action });
    }
    async simulateDegradationAction(action) {
        // Simulate the degradation action
        await this.delay(150);
        this.logger.debug('Simulated degradation action', { action });
    }
    async simulateRestartAction(action) {
        // Simulate the restart action
        await this.delay(500);
        this.logger.debug('Simulated restart action', { action });
    }
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
