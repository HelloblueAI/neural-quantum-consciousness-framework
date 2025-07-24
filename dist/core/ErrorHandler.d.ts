/**
 * Error Handler
 * Comprehensive error handling and recovery system
 */
import { Logger } from '../utils/Logger';
export declare class ErrorHandler {
    private readonly logger;
    private errorHistory;
    private recoveryStrategies;
    constructor(logger: Logger);
    createError(code: string, originalError?: any): Error;
    handleError(error: any): Promise<void>;
    getErrorHistory(): any[];
    getErrorStatistics(): any;
    private initializeRecoveryStrategies;
    private getErrorSeverity;
    private getRecoveryStrategy;
    private executeRecoveryStrategy;
    private executeRetryStrategy;
    private executeFallbackStrategy;
    private executeDegradationStrategy;
    private executeRestartStrategy;
    private simulateRetryAction;
    private simulateFallbackAction;
    private simulateDegradationAction;
    private simulateRestartAction;
    private delay;
}
//# sourceMappingURL=ErrorHandler.d.ts.map