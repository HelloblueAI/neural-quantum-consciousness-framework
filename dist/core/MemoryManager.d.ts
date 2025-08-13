import { MemoryState } from '@/types';
export interface MemoryEntry {
    id: string;
    type: 'short_term' | 'long_term' | 'working' | 'episodic' | 'semantic';
    content: any;
    timestamp: number;
    importance: number;
    associations: string[];
    accessCount: number;
    lastAccessed: number;
    decayRate: number;
    metadata: Map<string, any>;
}
export interface MemoryConsolidation {
    id: string;
    sourceMemories: string[];
    consolidatedMemory: MemoryEntry;
    consolidationStrength: number;
    patterns: string[];
    insights: string[];
}
export interface MemoryRetrieval {
    id: string;
    query: string;
    retrievedMemories: MemoryEntry[];
    relevanceScores: Map<string, number>;
    retrievalTime: number;
    searchStrategy: string;
}
export interface MemoryOptimization {
    id: string;
    optimizationType: 'consolidation' | 'pruning' | 'reorganization' | 'compression';
    affectedMemories: string[];
    improvementMetrics: Map<string, number>;
    optimizationTime: number;
}
export declare class MemoryManager {
    private shortTermMemory;
    private longTermMemory;
    private workingMemory;
    private episodicMemory;
    private semanticMemory;
    private consolidations;
    private retrievals;
    private logger;
    private performanceMetrics;
    private readonly SHORT_TERM_CAPACITY;
    private readonly WORKING_MEMORY_CAPACITY;
    private readonly CONSOLIDATION_THRESHOLD;
    private readonly DECAY_RATE;
    constructor();
    private initializeMemory;
    private createDefaultMemories;
    storeMemory(id: string, type: MemoryEntry['type'], content: any, importance?: number, associations?: string[]): void;
    private storeShortTermMemory;
    private storeLongTermMemory;
    private storeWorkingMemory;
    private storeEpisodicMemory;
    private storeSemanticMemory;
    private evictLeastImportantShortTerm;
    private evictLeastImportantWorking;
    retrieveMemory(query: string, type?: MemoryEntry['type']): MemoryRetrieval;
    private determineSearchStrategy;
    private getMemoriesByType;
    private calculateRelevance;
    private calculateKeywordScore;
    private calculateAssociationScore;
    private calculateRecencyScore;
    consolidateMemories(): MemoryConsolidation[];
    private groupMemoriesForConsolidation;
    private calculateMemorySimilarity;
    private calculateContentSimilarity;
    private calculateAssociationSimilarity;
    private calculateTemporalSimilarity;
    private createConsolidation;
    private mergeMemoryContents;
    private mergeAssociations;
    private calculateConsolidationStrength;
    private extractConsolidationPatterns;
    private extractCommonThemes;
    private extractTemporalPatterns;
    private extractContentPatterns;
    private findCommonWords;
    private generateConsolidationInsights;
    optimizeMemory(): MemoryOptimization[];
    private performMemoryPruning;
    private performMemoryReorganization;
    private performMemoryCompression;
    private groupMemoriesByAssociations;
    private findCommonAssociations;
    private findCompressionGroups;
    private compressMemoryGroup;
    private compressMemoryContents;
    private createMemorySummary;
    private extractKeyElements;
    private calculateDecayRate;
    private updateRetrievalMetrics;
    getMemoryState(): MemoryState;
    getPerformanceMetrics(): Record<string, any>;
    private calculateAverageRelevance;
    clearMemory(type?: MemoryEntry['type']): void;
}
//# sourceMappingURL=MemoryManager.d.ts.map