export interface InferenceRule {
    id: string;
    name: string;
    type: 'deduction' | 'induction' | 'abduction' | 'analogy';
    antecedent: string[];
    consequent: string;
    confidence: number;
    evidence: string[];
}
export interface InferenceChain {
    id: string;
    steps: InferenceStep[];
    conclusion: string;
    confidence: number;
    type: 'deductive' | 'inductive' | 'abductive' | 'mixed';
}
export interface InferenceStep {
    ruleId: string;
    inputs: string[];
    output: string;
    confidence: number;
    reasoning: string;
}
export interface LogicalPremise {
    id: string;
    statement: string;
    type: 'fact' | 'assumption' | 'hypothesis' | 'observation';
    confidence: number;
    source: string;
}
export declare class InferenceEngine {
    private rules;
    private premises;
    private chains;
    private logger;
    private performanceMetrics;
    private isInitialized;
    constructor();
    /**
     * Initialize the inference engine component
     */
    initialize(): Promise<void>;
    private initializeInferenceRules;
    reason(input: any): Promise<any>;
    infer(input: any): Promise<any>;
    private extractPremises;
    private findApplicableRules;
    private isRuleApplicable;
    private generateInferenceChains;
    private generateStepsForRule;
    private generateMixedChain;
    private synthesizeConclusion;
    private calculateInferenceConfidence;
    private calculateInferenceUncertainty;
    private determinePremiseType;
    private calculatePremiseConfidence;
    private gatherInferenceEvidence;
    private generateInferenceAlternatives;
    private identifyInferenceUncertaintySources;
    private suggestInferenceUncertaintyMitigation;
    private updatePerformanceMetrics;
    getPerformanceMetrics(): Record<string, any>;
    private calculateAverageReasoningTime;
    addInferenceRule(rule: InferenceRule): void;
    addPremise(premise: LogicalPremise): void;
    getInferenceChains(): InferenceChain[];
}
//# sourceMappingURL=InferenceEngine.d.ts.map