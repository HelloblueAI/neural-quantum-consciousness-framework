import { Vector } from '../../types';
import { Experience, LearningResult } from '../../types';
export interface UnsupervisedLearningConfig {
    clusteringAlgorithm: 'kmeans' | 'dbscan' | 'hierarchical';
    dimensionalityReduction: 'pca' | 'tsne' | 'umap';
    patternDetection: boolean;
    anomalyDetection: boolean;
}
export interface Cluster {
    id: string;
    centroid: Vector;
    members: string[];
    points: Vector[];
    radius: number;
    density: number;
    quality: number;
}
export interface DimensionalityReduction {
    id: string;
    originalDimensions: number;
    reducedDimensions: number;
    method: string;
    explainedVariance: number;
    parameters: Map<string, number | null>;
}
export interface Pattern {
    id: string;
    type: 'sequential' | 'temporal' | 'spatial' | 'association';
    confidence: number;
    support: number;
    description: string;
}
export declare class UnsupervisedLearning {
    private readonly _config;
    private readonly logger;
    private readonly clusters;
    private readonly patterns;
    private readonly dimensionalityReductions;
    private performanceMetrics;
    constructor(config: UnsupervisedLearningConfig);
    initialize(): Promise<void>;
    getMetrics(): any;
    private initializeAlgorithms;
    learn(experiences: Experience[]): LearningResult;
    private extractFeatures;
    private performClustering;
    private performDimensionalityReduction;
    private detectPatterns;
    private generateInsights;
    private gatherUnsupervisedEvidence;
    private updatePerformanceMetrics;
    getPerformanceMetrics(): Record<string, any>;
    private calculateAverageReasoningTime;
    addCluster(cluster: Cluster): void;
    addPattern(pattern: Pattern): void;
    addModel(model: DimensionalityReduction): void;
}
//# sourceMappingURL=UnsupervisedLearning.d.ts.map