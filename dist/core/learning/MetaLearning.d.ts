import { LearningResult, Experience } from '../../types';
export interface LearningTask {
    id: string;
    name: string;
    type: 'classification' | 'regression' | 'clustering' | 'reinforcement';
    dataset: Map<string, any>;
    performance: Map<string, number>;
    hyperparameters: Map<string, any>;
    metadata: Map<string, any>;
}
export interface LearningStrategy {
    id: string;
    name: string;
    type: 'hyperparameter_optimization' | 'model_selection' | 'ensemble' | 'transfer';
    description: string;
    parameters: Map<string, any>;
    performance: Map<string, number>;
    confidence: number;
}
export interface HyperparameterConfig {
    id: string;
    name: string;
    type: 'continuous' | 'discrete' | 'categorical';
    range: [number, number] | string[] | number[];
    currentValue: any;
    bestValue: any;
    importance: number;
}
export interface ModelPerformance {
    modelId: string;
    taskId: string;
    metrics: Map<string, number>;
    trainingTime: number;
    inferenceTime: number;
    complexity: number;
    generalization: number;
}
export declare class MetaLearning {
    private tasks;
    private strategies;
    private hyperparameters;
    private modelPerformances;
    private logger;
    private performanceMetrics;
    constructor();
    /**
     * Initialize the meta learning component
     */
    initialize(): Promise<void>;
    private initializeMetaLearningStrategies;
    learn(experiences: Experience[], _context?: Record<string, any>): LearningResult;
    private extractLearningTasks;
    private selectOptimalStrategies;
    private optimizeHyperparameters;
    private evaluateModelPerformances;
    private generateMetaLearningInsights;
    private calculateMetaLearningConfidence;
    private __calculateMetaLearningUncertainty;
    private determineTaskType;
    private extractDataset;
    private calculateTaskPerformance;
    private extractHyperparameters;
    private extractTaskMetadata;
    private findApplicableStrategies;
    private isStrategyApplicable;
    private selectBestStrategy;
    private createHyperparameterConfigs;
    private createHyperparameterConfig;
    private optimizeTaskHyperparameters;
    private evaluateStrategyOnTask;
    private extractFeatures;
    private extractLabels;
    private extractDatasetMetadata;
    private convertExperienceToFeatures;
    private calculateDataQuality;
    private calculateConsistency;
    private calculateTimeRange;
    private calculateTaskComplexity;
    private calculateLabelDistribution;
    private calculateTextComplexity;
    private calculateArrayComplexity;
    private calculateObjectComplexity;
    private __gatherMetaLearningEvidence;
    private __generateMetaLearningAlternatives;
    private __identifyMetaLearningUncertaintySources;
    private __suggestMetaLearningUncertaintyMitigation;
    private updatePerformanceMetrics;
    getPerformanceMetrics(): Record<string, any>;
    getMetrics(): any;
    private calculateAverageReasoningTime;
    addTask(task: LearningTask): void;
    addStrategy(strategy: LearningStrategy): void;
    addHyperparameter(config: HyperparameterConfig): void;
}
//# sourceMappingURL=MetaLearning.d.ts.map