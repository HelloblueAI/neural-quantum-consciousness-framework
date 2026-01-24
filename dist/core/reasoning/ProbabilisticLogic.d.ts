import { ReasoningResult } from '../../types';
export interface ProbabilityDistribution {
    id: string;
    name: string;
    type: 'discrete' | 'continuous' | 'mixed';
    parameters: Map<string, number>;
    support: number[];
    mean: number;
    variance: number;
}
export interface BayesianUpdate {
    prior: number;
    likelihood: number;
    posterior: number;
    evidence: string[];
}
export declare class ProbabilisticLogic {
    private distributions;
    private bayesianUpdates;
    private logger;
    private performanceMetrics;
    constructor();
    initialize(): Promise<void>;
    private initializeProbabilityDistributions;
    reason(input: string, context?: Record<string, any>): ReasoningResult;
    private calculateProbability;
    private performBayesianUpdate;
    private calculateConfidence;
    private generateProbabilisticConclusion;
    private gatherEvidence;
    private generateAlternatives;
    private identifyUncertaintySources;
    private suggestUncertaintyMitigation;
    private applyBayesianUpdate;
    private updatePerformanceMetrics;
    getPerformanceMetrics(): Record<string, any>;
    private calculateAverageReasoningTime;
    addProbabilityDistribution(distribution: ProbabilityDistribution): void;
    getProbabilityDistribution(id: string): ProbabilityDistribution | undefined;
}
//# sourceMappingURL=ProbabilisticLogic.d.ts.map