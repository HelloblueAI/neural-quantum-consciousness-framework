/**
 * Supervised Learning Algorithm
 * Implements supervised learning with pattern recognition and classification
 */
export interface SupervisedLearningConfig {
    modelType: 'classification' | 'regression' | 'pattern_recognition';
    hyperparameters: Map<string, any>;
    validationSplit: number;
    maxIterations: number;
}
export declare class SupervisedLearning {
    private readonly logger;
    private readonly models;
    private performanceMetrics;
    constructor(_config: SupervisedLearningConfig);
    initialize(): Promise<void>;
    learn(experiences: any[]): any;
    predict(input: any): any;
    getMetrics(): any;
    getPerformanceMetrics(): any;
    private initializeModels;
    private _loadTrainingData;
    private _extractTrainingExamples;
    private extractFeatures;
    private extractLabels;
    private trainModel;
    private evaluateModel;
    private _updateModels;
    private updateModel;
    private calculateImprovement;
    private _evaluatePerformance;
    private _selectModel;
    private _makePrediction;
    private generatePrediction;
    private _updateMetrics;
}
//# sourceMappingURL=SupervisedLearning.d.ts.map