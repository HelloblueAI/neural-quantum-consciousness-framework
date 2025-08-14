/**
 * Security Manager
 * Comprehensive security system with authentication, authorization, and threat detection
 */
import { EventEmitter } from 'events';
export declare class SecurityManager extends EventEmitter {
    private blockedIdentifiers;
    private readonly id;
    private readonly logger;
    private readonly config;
    private isInitialized;
    private threats;
    private vulnerabilities;
    private securityMetrics;
    private requestCounts;
    private readonly rateLimitConfig;
    /**
     * Check rate limiting for a request
     */
    checkRateLimit(identifier: string): {
        allowed: boolean;
        remaining: number;
        resetTime: number;
    };
    /**
     * Block an identifier for violating rate limits
     */
    blockIdentifier(identifier: string, reason?: string): void;
    /**
     * Check if an identifier is blocked
     */
    isBlocked(identifier: string): boolean;
    constructor(config: any);
    initialize(): Promise<void>;
    validateInput(input: any): void;
    validateActionPlan(plan: any): void;
    validateSolution(solution: any): void;
    authenticate(credentials: any): boolean;
    authorize(user: any, action: any): boolean;
    getMetrics(): any;
    /**
     * Get security metrics for monitoring
     */
    getSecurityMetrics(): any;
    private calculateSecurityScore;
    private initializeAuthentication;
    private initializeAuthorization;
    private initializeEncryption;
    private initializeMonitoring;
    private detectMaliciousContent;
    private validateInputStructure;
    private detectInjectionAttacks;
    private detectDangerousActions;
    private validateActionPermissions;
    private detectResourceAbuse;
    private detectHarmfulSolutions;
    private validateSolutionSafety;
    private detectEthicalViolations;
    private validateCredentials;
    private checkPermissions;
    private getObjectDepth;
}
//# sourceMappingURL=SecurityManager.d.ts.map