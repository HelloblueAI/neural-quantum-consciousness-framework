/**
 * Fuzzy Logic Engine
 * Implements fuzzy logic for handling uncertainty and imprecision
 */
import { EventEmitter } from 'events';
export declare class FuzzyLogic extends EventEmitter {
    private readonly id;
    private readonly logger;
    private isInitialized;
    private membershipFunctions;
    private performanceMetrics;
    constructor();
    /**
     * Initialize the fuzzy logic component
     */
    initialize(): Promise<void>;
    reason(input: any): Promise<any>;
    infer(premises: any[]): Promise<any[]>;
    getMetrics(): any;
    private initializeFuzzyRules;
    private fuzzifyInput;
    private calculateMembership;
    private calculateTriangularMembership;
    private calculateTrapezoidalMembership;
    private calculateGaussianMembership;
    private applyFuzzyRules;
    private applyGoalRules;
    private applyConstraintRules;
    private applyContextRules;
    private defuzzifyResults;
    private calculateFuzzyConfidence;
    private calculateUncertainty;
    private generateFuzzySteps;
    private applyFuzzyInference;
    private updateMetrics;
}
//# sourceMappingURL=FuzzyLogic.d.ts.map