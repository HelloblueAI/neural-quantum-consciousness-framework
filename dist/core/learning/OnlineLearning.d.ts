import { LearningResult, Experience } from '../../types';
export interface OnlineLearningTask {
    id: string;
    name: string;
    type: 'streaming_classification' | 'online_regression' | 'adaptive_clustering' | 'incremental_learning';
    description: string;
    dataStream: Experience[];
    modelState: Map<string, any>;
    learningRate: number;
    adaptationThreshold: number;
    performance: Map<string, number>;
    metadata: Map<string, any>;
}
export interface OnlineStrategy {
    id: string;
    name: string;
    type: 'stochastic_gradient' | 'adaptive_learning' | 'incremental_update' | 'drift_detection';
    description: string;
    parameters: Map<string, any>;
    performance: Map<string, number>;
    confidence: number;
}
export interface DriftDetection {
    id: string;
    taskId: string;
    driftType: 'concept_drift' | 'data_drift' | 'virtual_drift' | 'no_drift';
    severity: number;
    confidence: number;
    adaptationRequired: boolean;
    metadata: Map<string, any>;
}
export interface OnlineLearningPerformance {
    taskId: string;
    strategyType: string;
    metrics: Map<string, number>;
    samplesProcessed: number;
    adaptationCount: number;
    driftDetections: number;
    efficiency: number;
}
export declare class OnlineLearning {
    private tasks;
    private strategies;
    private driftDetections;
    private performances;
    private logger;
    private performanceMetrics;
    constructor();
    /**
     * Initialize the online learning component
     */
    initialize(): Promise<void>;
    private initializeOnlineStrategies;
    learn(experiences: Experience[], _context?: Record<string, any>): LearningResult;
    private extractOnlineLearningTasks;
    private selectOnlineStrategies;
    private detectDrifts;
    private evaluateOnlineLearningPerformance;
    private generateOnlineLearningInsights;
    private calculateOnlineLearningConfidence;
    private _calculateOnlineLearningUncertainty;
    private determineOnlineTaskType;
    private initializeModelState;
    private calculateOptimalLearningRate;
    private calculateOnlineLearningPerformance;
    private extractOnlineLearningMetadata;
    private findApplicableStrategies;
    private isStrategyApplicable;
    private selectBestOnlineStrategy;
    private isStrategyForTask;
    private detectTaskDrift;
    private evaluateTaskPerformance;
    private extractModelParameters;
    private calculateModelPerformance;
    private calculateDataComplexity;
    private calculateAdaptationRate;
    private calculateOnlineEfficiency;
    private calculateStreamVelocity;
    private calculateFeatureCount;
    private calculateModelComplexity;
    private calculateStability;
    private extractDriftMetadata;
    private __gatherOnlineLearningEvidence;
    private __generateOnlineLearningAlternatives;
    private _identifyOnlineLearningUncertaintySources;
    private _suggestOnlineLearningUncertaintyMitigation;
    private updatePerformanceMetrics;
    getPerformanceMetrics(): Record<string, any>;
    getMetrics(): any;
    processStream(_dataStream: any): Promise<any>;
    updateModels(_processedData: any): Promise<any>;
    adaptToDrift(_processedData: any): Promise<any>;
    private calculateAverageOnlineTime;
    addTask(task: OnlineLearningTask): void;
    addStrategy(strategy: OnlineStrategy): void;
    addDriftDetection(detection: DriftDetection): void;
}
//# sourceMappingURL=OnlineLearning.d.ts.map