import { LearningResult, Experience } from '../../types';
export interface TransferTask {
    id: string;
    name: string;
    sourceDomain: string;
    targetDomain: string;
    similarity: number;
    transferMethod: 'fine_tuning' | 'feature_transfer' | 'knowledge_distillation' | 'adversarial';
    sourceModel: Map<string, any>;
    targetModel: Map<string, any>;
    performance: Map<string, number>;
    metadata: Map<string, any>;
}
export interface TransferStrategy {
    id: string;
    name: string;
    type: 'domain_adaptation' | 'multi_task' | 'progressive' | 'adversarial';
    description: string;
    parameters: Map<string, any>;
    performance: Map<string, number>;
    confidence: number;
}
export interface DomainMapping {
    id: string;
    sourceDomain: string;
    targetDomain: string;
    mappingRules: Map<string, any>;
    similarity: number;
    transferEfficiency: number;
    confidence: number;
}
export interface TransferPerformance {
    taskId: string;
    sourceDomain: string;
    targetDomain: string;
    metrics: Map<string, number>;
    transferTime: number;
    adaptationTime: number;
    knowledgeRetention: number;
    generalization: number;
}
export declare class TransferLearning {
    private tasks;
    private strategies;
    private domainMappings;
    private transferPerformances;
    private logger;
    private performanceMetrics;
    constructor();
    /**
     * Initialize the transfer learning component
     */
    initialize(): Promise<void>;
    private initializeTransferStrategies;
    learn(experiences: Experience[], _context?: Record<string, any>): LearningResult;
    private extractTransferTasks;
    private selectTransferStrategies;
    private createDomainMappings;
    private executeTransferLearning;
    private generateTransferInsights;
    private calculateTransferConfidence;
    private _calculateTransferUncertainty;
    private extractDomain;
    private calculateDomainSimilarity;
    private selectTransferMethod;
    private extractSourceModel;
    private extractTargetModel;
    private calculateTransferPerformance;
    private extractTransferMetadata;
    private findApplicableStrategies;
    private isStrategyApplicable;
    private selectBestTransferStrategy;
    private generateMappingRules;
    private calculateTransferEfficiency;
    private calculateMappingConfidence;
    private isStrategyForTask;
    private executeTransferTask;
    private extractModelParameters;
    private calculateModelPerformance;
    private calculateDataCompatibility;
    private createFeatureMapping;
    private createParameterMapping;
    private createArchitectureMapping;
    private calculateFeatureCount;
    private calculateModelComplexity;
    private calculateConsistency;
    private calculateDataTypeCompatibility;
    private getDataType;
    private extractFeatures;
    private _gatherTransferEvidence;
    private _generateTransferAlternatives;
    private _identifyTransferUncertaintySources;
    private _suggestTransferUncertaintyMitigation;
    private updatePerformanceMetrics;
    getPerformanceMetrics(): Record<string, any>;
    getMetrics(): any;
    private calculateAverageTransferTime;
    addTask(task: TransferTask): void;
    addStrategy(strategy: TransferStrategy): void;
    addDomainMapping(mapping: DomainMapping): void;
}
//# sourceMappingURL=TransferLearning.d.ts.map