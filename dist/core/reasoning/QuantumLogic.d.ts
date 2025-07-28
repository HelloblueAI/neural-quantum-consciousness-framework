import { ReasoningResult } from '@/types';
export interface QuantumState {
    id: string;
    name: string;
    amplitude: number;
    phase: number;
    superposition: Map<string, number>;
    entangled: string[];
}
export interface QuantumOperator {
    symbol: string;
    name: string;
    description: string;
    matrix: number[][];
    type: 'unitary' | 'measurement' | 'entanglement';
    strength: number;
}
export interface QuantumMeasurement {
    stateId: string;
    operator: string;
    result: number;
    probability: number;
    collapsed: boolean;
}
export interface QuantumRule {
    id: string;
    antecedent: string;
    consequent: string;
    quantumConstraint: string;
    confidence: number;
    evidence: string[];
}
export declare class QuantumLogic {
    private operators;
    private states;
    private measurements;
    private rules;
    private logger;
    private performanceMetrics;
    constructor();
    /**
     * Initialize the quantum logic component
     */
    initialize(): Promise<void>;
    private initializeQuantumOperators;
    private initializeQuantumRules;
    reason(input: string, context?: Record<string, any>): ReasoningResult;
    private extractQuantumOperators;
    private extractQuantumStates;
    private performQuantumMeasurements;
    private calculateMeasurementResult;
    private calculateMeasurementProbability;
    private determineCollapse;
    private applyOperator;
    private calculateAmplitude;
    private calculatePhase;
    private extractSuperposition;
    private extractEntanglement;
    private generateQuantumConclusion;
    private determineQuantumStructure;
    private calculateQuantumConfidence;
    private calculateQuantumUncertainty;
    private gatherQuantumEvidence;
    private generateQuantumAlternatives;
    private identifyQuantumUncertaintySources;
    private suggestQuantumUncertaintyMitigation;
    private updatePerformanceMetrics;
    getPerformanceMetrics(): Record<string, any>;
    private calculateAverageReasoningTime;
    addQuantumOperator(operator: QuantumOperator): void;
    addQuantumRule(rule: QuantumRule): void;
    addQuantumState(state: QuantumState): void;
}
//# sourceMappingURL=QuantumLogic.d.ts.map