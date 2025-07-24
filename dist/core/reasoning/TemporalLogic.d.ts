import { ReasoningResult } from '../../types';
export interface TemporalOperator {
    symbol: string;
    name: string;
    description: string;
    temporalType: 'past' | 'present' | 'future' | 'relative';
    strength: number;
}
export interface TemporalEvent {
    id: string;
    name: string;
    timestamp: number;
    duration: number;
    type: 'instant' | 'interval' | 'period';
    properties: Map<string, any>;
}
export interface TemporalRelation {
    fromEvent: string;
    toEvent: string;
    relation: 'before' | 'after' | 'during' | 'overlaps' | 'meets' | 'starts' | 'finishes' | 'equals';
    confidence: number;
}
export interface TemporalRule {
    id: string;
    antecedent: string;
    consequent: string;
    temporalConstraint: string;
    confidence: number;
    evidence: string[];
}
export declare class TemporalLogic {
    private operators;
    private events;
    private relations;
    private rules;
    private logger;
    private performanceMetrics;
    constructor();
    /**
     * Initialize the temporal logic component
     */
    initialize(): Promise<void>;
    private initializeTemporalOperators;
    private initializeTemporalRules;
    reason(input: string, context?: Record<string, any>): ReasoningResult;
    private extractTemporalOperators;
    private extractTemporalEvents;
    private analyzeTemporalRelations;
    private determineTemporalRelation;
    private calculateRelationConfidence;
    private calculatePropertyOverlap;
    private estimateTimestamp;
    private estimateDuration;
    private determineEventType;
    private generateTemporalConclusion;
    private determineTemporalStructure;
    private calculateTemporalConfidence;
    private calculateTemporalUncertainty;
    private gatherTemporalEvidence;
    private generateTemporalAlternatives;
    private identifyTemporalUncertaintySources;
    private suggestTemporalUncertaintyMitigation;
    private updatePerformanceMetrics;
    getPerformanceMetrics(): Record<string, any>;
    private calculateAverageReasoningTime;
    addTemporalOperator(operator: TemporalOperator): void;
    addTemporalRule(rule: TemporalRule): void;
    addTemporalEvent(event: TemporalEvent): void;
}
//# sourceMappingURL=TemporalLogic.d.ts.map