/**
 * Knowledge Base
 * Advanced knowledge storage, retrieval, and integration system
 */
import { EventEmitter } from 'events';
import { Knowledge } from '@/types';
export declare class KnowledgeBase extends EventEmitter {
    private readonly id;
    private readonly logger;
    private knowledge;
    private indexes;
    private isInitialized;
    constructor();
    initialize(): Promise<void>;
    store(knowledge: Knowledge): Promise<void>;
    /**
     * Add knowledge with a specific ID
     */
    addKnowledge(id: string, knowledge: any): Promise<void>;
    /**
     * Add knowledge with facts array
     */
    addKnowledgeWithFacts(id: string, facts: string[], type?: string): Promise<void>;
    retrieve(query: any): Promise<Knowledge[]>;
    /**
     * Get knowledge by ID
     */
    getKnowledge(id: string): Knowledge | undefined;
    /**
     * Get knowledge by type
     */
    getKnowledgeByType(type: string): Knowledge[];
    /**
     * Get all knowledge
     */
    getAllKnowledge(): Knowledge[];
    /**
     * Get knowledge count
     */
    getKnowledgeCount(): number;
    /**
     * Check if knowledge exists
     */
    hasKnowledge(id: string): boolean;
    /**
     * Delete knowledge by ID
     */
    deleteKnowledge(id: string): boolean;
    /**
     * Clear all knowledge
     */
    clear(): void;
    getKnowledgeSync(id: string): any;
    integrateLearning(learningResult: any): Promise<void>;
    getMetrics(): any;
    private initializeIndexes;
    private loadInitialKnowledge;
    private storeInternal;
    private updateIndexes;
    private searchKnowledge;
    private matchesQuery;
    private updateRelatedKnowledge;
    private findRelatedKnowledge;
    private isRelated;
    private getKnowledgeTypeDistribution;
    private getAverageConfidence;
}
//# sourceMappingURL=KnowledgeBase.d.ts.map