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
    addKnowledge(id: string, knowledge: Knowledge): Promise<void>;
    retrieve(query: any): Promise<Knowledge[]>;
    getKnowledge(id: string): Promise<Knowledge | null>;
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
    private getKnowledgeByType;
    private getAverageConfidence;
}
//# sourceMappingURL=KnowledgeBase.d.ts.map