import { ReasoningResult } from '@/types';
export interface ModalOperator {
    symbol: string;
    name: string;
    description: string;
    strength: number;
    dual?: string;
}
export interface ModalWorld {
    id: string;
    name: string;
    accessibleFrom: string[];
    propositions: Map<string, boolean>;
    accessibility: Map<string, number>;
}
export interface ModalRule {
    id: string;
    antecedent: string;
    consequent: string;
    operator: string;
    confidence: number;
    evidence: string[];
}
export declare class ModalLogic {
    private operators;
    private worlds;
    private rules;
    private logger;
    private performanceMetrics;
    constructor();
    initialize(): Promise<void>;
    private initializeModalOperators;
    private initializeModalRules;
    reason(input: string, context?: Record<string, any>): ReasoningResult;
    private extractModalOperators;
    private explorePossibleWorlds;
    private analyzeAccessibility;
    private generateModalConclusion;
    private calculateModalConfidence;
    private calculateModalUncertainty;
    private extractPropositions;
    private gatherModalEvidence;
    private generateModalAlternatives;
    private identifyModalUncertaintySources;
    private suggestModalUncertaintyMitigation;
    private updatePerformanceMetrics;
    getPerformanceMetrics(): Record<string, any>;
    private calculateAverageReasoningTime;
    addModalOperator(operator: ModalOperator): void;
    addModalRule(rule: ModalRule): void;
    addModalWorld(world: ModalWorld): void;
}
//# sourceMappingURL=ModalLogic.d.ts.map