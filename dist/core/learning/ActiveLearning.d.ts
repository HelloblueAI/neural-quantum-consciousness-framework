import { LearningResult, Experience } from '../../types';
export interface ActiveLearningTask {
    id: string;
    name: string;
    type: 'uncertainty_sampling' | 'diversity_sampling' | 'expected_model_change' | 'query_by_committee';
    description: string;
    dataset: Map<string, any>;
    labeledData: Experience[];
    unlabeledData: Experience[];
    acquisitionFunction: string;
    budget: number;
    performance: Map<string, number>;
    metadata: Map<string, any>;
}
export interface AcquisitionStrategy {
    id: string;
    name: string;
    type: 'uncertainty' | 'diversity' | 'expected_improvement' | 'information_gain';
    description: string;
    parameters: Map<string, any>;
    performance: Map<string, number>;
    confidence: number;
}
export interface QueryResult {
    id: string;
    taskId: string;
    selectedSamples: Experience[];
    acquisitionScores: Map<string, number>;
    expectedImprovement: number;
    queryCost: number;
    metadata: Map<string, any>;
}
export interface ActiveLearningPerformance {
    taskId: string;
    strategyType: string;
    metrics: Map<string, number>;
    samplesQueried: number;
    totalBudget: number;
    improvementRate: number;
    efficiency: number;
}
export declare class ActiveLearning {
    private tasks;
    private strategies;
    private queryResults;
    private performances;
    private logger;
    private performanceMetrics;
    constructor();
    /**
     * Initialize the active learning component
     */
    initialize(): Promise<void>;
    private initializeAcquisitionStrategies;
    learn(experiences: Experience[], _context?: Record<string, any>): LearningResult;
    private extractActiveLearningTasks;
    private selectAcquisitionStrategies;
    private executeActiveLearning;
    private evaluateActiveLearningPerformance;
    private generateActiveLearningInsights;
    private calculateActiveLearningConfidence;
    private extractDataset;
    private calculateActiveLearningPerformance;
    private extractActiveLearningMetadata;
    private findApplicableStrategies;
    private isStrategyApplicable;
    private selectBestAcquisitionStrategy;
    private isStrategyForTask;
    private executeQuery;
    private evaluateTaskPerformance;
    private selectSamples;
    private calculateAcquisitionScores;
    private calculateExpectedImprovement;
    private extractQueryMetadata;
    private extractFeatures;
    private calculateDataDiversity;
    private calculateActiveLearningEfficiency;
    private calculateDataQuality;
    private calculateFeatureComplexity;
    private convertExperienceToFeatures;
    private calculateCosineSimilarity;
    private calculateTextComplexity;
    private calculateArrayComplexity;
    private calculateObjectComplexity;
    private updatePerformanceMetrics;
    getPerformanceMetrics(): Record<string, any>;
    getMetrics(): any;
    generateQueries(_context: any): Promise<any[]>;
    explore(_queries: any[]): Promise<any>;
    addTask(task: ActiveLearningTask): void;
    addStrategy(strategy: AcquisitionStrategy): void;
    addQueryResult(result: QueryResult): void;
}
//# sourceMappingURL=ActiveLearning.d.ts.map