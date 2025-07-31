/**
 * Classical Logic Engine
 * Implements classical propositional and predicate logic
 */
import { LogicalPremise, LogicalConclusion, ProofStep } from '../../types';
export declare class ClassicalLogic {
    private readonly logger;
    private premises;
    private inferenceRules;
    private logicalOperators;
    private proofHistory;
    constructor();
    initialize(): Promise<void>;
    reason(input: string, context?: Record<string, any>): Promise<LogicalConclusion>;
    addPremise(premise: LogicalPremise): void;
    getPremises(): LogicalPremise[];
    getProofHistory(): ProofStep[];
    validateArgument(premises: LogicalPremise[], conclusion: string): boolean;
    private initializeLogicalOperators;
    private initializeInferenceRules;
    private setupLogicalFramework;
    private parseLogicalInput;
    private extractPropositions;
    private identifyOperators;
    private analyzeLogicalStructure;
    private calculateLogicalComplexity;
    private extractPremises;
    private calculatePremiseConfidence;
    private applyInferenceRules;
    private checkRuleApplicability;
    private matchesPattern;
    private applyRule;
    private generateConclusionFromRule;
    private calculateRuleConfidence;
    private generateConclusions;
    private generateAdditionalConclusions;
    private validateConclusions;
    private validateConclusion;
    private hasValidLogicalForm;
    private createProof;
    private calculateConfidence;
    private assessValidity;
    private isLogicallyValid;
    private assessSoundness;
    private convertToLogicalForm;
    private checkLogicalEntailment;
}
//# sourceMappingURL=ClassicalLogic.d.ts.map