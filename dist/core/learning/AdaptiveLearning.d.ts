import { LearningResult, Experience } from '@/types';
export interface AdaptiveLearningTask {
    id: string;
    name: string;
    type: 'adaptive_classification' | 'dynamic_regression' | 'evolving_clustering' | 'self_modifying';
    description: string;
    currentModel: Map<string, any>;
    targetModel: Map<string, any>;
    adaptationStrategy: string;
    adaptationRate: number;
    performance: Map<string, number>;
    metadata: Map<string, any>;
}
export interface AdaptationStrategy {
    id: string;
    name: string;
    type: 'gradient_based' | 'evolutionary' | 'reinforcement' | 'meta_learning';
    description: string;
    parameters: Map<string, any>;
    performance: Map<string, number>;
    confidence: number;
}
export interface AdaptationEvent {
    id: string;
    taskId: string;
    eventType: 'parameter_update' | 'architecture_change' | 'strategy_switch' | 'performance_improvement';
    severity: number;
    confidence: number;
    adaptationRequired: boolean;
    metadata: Map<string, any>;
}
export interface AdaptiveLearningPerformance {
    taskId: string;
    strategyType: string;
    metrics: Map<string, number>;
    adaptationsCount: number;
    improvementRate: number;
    stability: number;
    efficiency: number;
}
export declare class AdaptiveLearning {
    private tasks;
    private strategies;
    private adaptationEvents;
    private performances;
    private logger;
    private performanceMetrics;
    constructor();
    /**
     * Initialize the adaptive learning component
     */
    initialize(): Promise<void>;
    private initializeAdaptationStrategies;
    learn(experiences: Experience[], _context?: Record<string, any>): LearningResult;
    private extractAdaptiveLearningTasks;
    private selectAdaptationStrategies;
    private executeAdaptations;
    private evaluateAdaptiveLearningPerformance;
    private generateAdaptiveLearningInsights;
    private calculateAdaptiveLearningConfidence;
    private calculateAdaptiveLearningUncertainty;
    private determineAdaptiveTaskType;
    private initializeCurrentModel;
    private initializeTargetModel;
    private selectAdaptationStrategy;
    private calculateAdaptationRate;
    private calculateAdaptiveLearningPerformance;
    private extractAdaptiveLearningMetadata;
    private findApplicableStrategies;
    private isStrategyApplicable;
    private selectBestAdaptationStrategy;
    private isStrategyForTask;
    private executeTaskAdaptation;
    private evaluateTaskPerformance;
    private extractModelParameters;
    private calculateModelPerformance;
    private calculateTargetMetrics;
    private calculateDataComplexity;
    private calculateAdaptationPotential;
    private calculateAdaptiveEfficiency;
    private extractAdaptationHistory;
    private calculateFeatureCount;
    private calculateModelComplexity;
    private calculateStability;
    private extractAdaptationMetadata;
    private gatherAdaptiveLearningEvidence;
    private generateAdaptiveLearningAlternatives;
    private identifyAdaptiveLearningUncertaintySources;
    private suggestAdaptiveLearningUncertaintyMitigation;
    private updatePerformanceMetrics;
    getPerformanceMetrics(): Record<string, any>;
    getMetrics(): any;
    private calculateAverageAdaptationTime;
    addTask(task: AdaptiveLearningTask): void;
    addStrategy(strategy: AdaptationStrategy): void;
    addAdaptationEvent(event: AdaptationEvent): void;
}
//# sourceMappingURL=AdaptiveLearning.d.ts.map