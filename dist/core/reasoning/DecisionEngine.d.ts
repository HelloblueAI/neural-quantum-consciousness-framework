import { ReasoningResult } from '../../types';
export interface DecisionOption {
    id: string;
    name: string;
    description: string;
    criteria: Map<string, number>;
    utilities: Map<string, number>;
    risks: Map<string, number>;
    confidence: number;
}
export interface DecisionCriterion {
    id: string;
    name: string;
    weight: number;
    type: 'benefit' | 'cost' | 'risk' | 'uncertainty';
    importance: number;
}
export interface DecisionRule {
    id: string;
    name: string;
    type: 'maximax' | 'maximin' | 'minimax_regret' | 'expected_value' | 'utility_maximization';
    description: string;
    confidence: number;
    evidence: string[];
}
export interface DecisionAnalysis {
    selectedOption: string;
    reasoning: string;
    confidence: number;
    alternatives: string[];
    risks: string[];
    recommendations: string[];
}
export declare class DecisionEngine {
    private options;
    private criteria;
    private rules;
    private logger;
    private isInitialized;
    private performanceMetrics;
    constructor();
    initialize(): Promise<void>;
    private initializeDecisionRules;
    reason(input: string, context?: Record<string, any>): ReasoningResult;
    decide(input: string, context?: Record<string, any>): ReasoningResult;
    private extractDecisionOptions;
    private extractDecisionCriteria;
    private findApplicableRules;
    private isRuleApplicable;
    private performDecisionAnalysis;
    private applyDecisionRule;
    private applyMaximaxRule;
    private applyMaximinRule;
    private applyMinimaxRegretRule;
    private applyExpectedValueRule;
    private applyUtilityMaximizationRule;
    private calculateDecisionConfidence;
    private calculateDecisionUncertainty;
    private extractCriteria;
    private extractUtilities;
    private extractRisks;
    private calculateOptionConfidence;
    private calculateCriterionWeight;
    private determineCriterionType;
    private calculateCriterionImportance;
    private generateAlternatives;
    private identifyRisks;
    private generateRecommendations;
    private gatherDecisionEvidence;
    private identifyDecisionUncertaintySources;
    private suggestDecisionUncertaintyMitigation;
    private updatePerformanceMetrics;
    getPerformanceMetrics(): Record<string, any>;
    private calculateAverageReasoningTime;
    addDecisionOption(option: DecisionOption): void;
    addDecisionCriterion(criterion: DecisionCriterion): void;
    addDecisionRule(rule: DecisionRule): void;
}
//# sourceMappingURL=DecisionEngine.d.ts.map