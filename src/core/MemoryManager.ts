import { MemoryState } from '@/types';
import { Logger } from '@/utils/Logger';

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

export class MemoryManager {
  private shortTermMemory: Map<string, MemoryEntry> = new Map();
  private longTermMemory: Map<string, MemoryEntry> = new Map();
  private workingMemory: Map<string, MemoryEntry> = new Map();
  private episodicMemory: Map<string, MemoryEntry> = new Map();
  private semanticMemory: Map<string, MemoryEntry> = new Map();
  
  private consolidations: Map<string, MemoryConsolidation> = new Map();
  private retrievals: Map<string, MemoryRetrieval> = new Map();
  
  private logger: Logger;
  private performanceMetrics = {
    totalMemories: 0,
    shortTermCount: 0,
    longTermCount: 0,
    workingCount: 0,
    episodicCount: 0,
    semanticCount: 0,
    averageRetrievalTime: 0,
    consolidationCount: 0,
    optimizationCount: 0
  };

  private readonly SHORT_TERM_CAPACITY = 1000;
  private readonly WORKING_MEMORY_CAPACITY = 100;
  private readonly CONSOLIDATION_THRESHOLD = 0.7;
  private readonly DECAY_RATE = 0.1;

  constructor() {
    this.logger = new Logger('MemoryManager');
    this.initializeMemory();
  }

  private initializeMemory(): void {
    // Initialize memory systems with default entries
    this.createDefaultMemories();
    this.logger.info('MemoryManager initialized with default memories');
  }

  private createDefaultMemories(): void {
    // Create default semantic memories
    const defaultSemanticMemories = [
      {
        id: 'semantic_basic_concepts',
        type: 'semantic' as const,
        content: {
          concepts: ['object', 'action', 'property', 'relation'],
          categories: ['physical', 'abstract', 'temporal', 'spatial']
        },
        importance: 0.9,
        associations: ['basic_knowledge', 'foundational_concepts']
      },
      {
        id: 'semantic_reasoning_patterns',
        type: 'semantic' as const,
        content: {
          patterns: ['if_then', 'cause_effect', 'similarity', 'contrast'],
          logicTypes: ['deductive', 'inductive', 'abductive']
        },
        importance: 0.8,
        associations: ['reasoning', 'logic', 'patterns']
      }
    ];

    defaultSemanticMemories.forEach(memory => {
      this.storeMemory(memory.id, memory.type, memory.content, memory.importance, memory.associations);
    });
  }

  public storeMemory(
    id: string, 
    type: MemoryEntry['type'], 
    content: any, 
    importance: number = 0.5,
    associations: string[] = []
  ): void {
    const memory: MemoryEntry = {
      id,
      type,
      content,
      timestamp: Date.now(),
      importance,
      associations,
      accessCount: 0,
      lastAccessed: Date.now(),
      decayRate: this.calculateDecayRate(type, importance),
      metadata: new Map<string, any>([
        ['created_at', Date.now()],
        ['version', '1.0'],
        ['source', 'memory_manager']
      ])
    };

    switch (type) {
      case 'short_term':
        this.storeShortTermMemory(memory);
        break;
      case 'long_term':
        this.storeLongTermMemory(memory);
        break;
      case 'working':
        this.storeWorkingMemory(memory);
        break;
      case 'episodic':
        this.storeEpisodicMemory(memory);
        break;
      case 'semantic':
        this.storeSemanticMemory(memory);
        break;
    }

    this.performanceMetrics.totalMemories++;
    this.logger.debug('Memory stored', { id, type, importance });
  }

  private storeShortTermMemory(memory: MemoryEntry): void {
    if (this.shortTermMemory.size >= this.SHORT_TERM_CAPACITY) {
      this.evictLeastImportantShortTerm();
    }
    this.shortTermMemory.set(memory.id, memory);
    this.performanceMetrics.shortTermCount++;
  }

  private storeLongTermMemory(memory: MemoryEntry): void {
    this.longTermMemory.set(memory.id, memory);
    this.performanceMetrics.longTermCount++;
  }

  private storeWorkingMemory(memory: MemoryEntry): void {
    if (this.workingMemory.size >= this.WORKING_MEMORY_CAPACITY) {
      this.evictLeastImportantWorking();
    }
    this.workingMemory.set(memory.id, memory);
    this.performanceMetrics.workingCount++;
  }

  private storeEpisodicMemory(memory: MemoryEntry): void {
    this.episodicMemory.set(memory.id, memory);
    this.performanceMetrics.episodicCount++;
  }

  private storeSemanticMemory(memory: MemoryEntry): void {
    this.semanticMemory.set(memory.id, memory);
    this.performanceMetrics.semanticCount++;
  }

  private evictLeastImportantShortTerm(): void {
    let leastImportant: MemoryEntry | null = null;
    let lowestImportance = Infinity;

    for (const memory of this.shortTermMemory.values()) {
      const adjustedImportance = memory.importance * (1 - memory.decayRate * (Date.now() - memory.lastAccessed) / 1000);
      if (adjustedImportance < lowestImportance) {
        lowestImportance = adjustedImportance;
        leastImportant = memory;
      }
    }

    if (leastImportant) {
      this.shortTermMemory.delete(leastImportant.id);
      this.performanceMetrics.shortTermCount--;
      this.logger.debug('Evicted least important short-term memory', { id: leastImportant.id });
    }
  }

  private evictLeastImportantWorking(): void {
    let leastImportant: MemoryEntry | null = null;
    let lowestImportance = Infinity;

    for (const memory of this.workingMemory.values()) {
      const adjustedImportance = memory.importance * (1 - memory.decayRate * (Date.now() - memory.lastAccessed) / 1000);
      if (adjustedImportance < lowestImportance) {
        lowestImportance = adjustedImportance;
        leastImportant = memory;
      }
    }

    if (leastImportant) {
      this.workingMemory.delete(leastImportant.id);
      this.performanceMetrics.workingCount--;
      this.logger.debug('Evicted least important working memory', { id: leastImportant.id });
    }
  }

  public retrieveMemory(query: string, type?: MemoryEntry['type']): MemoryRetrieval {
    const startTime = Date.now();
    const retrievedMemories: MemoryEntry[] = [];
    const relevanceScores = new Map<string, number>();

    const searchStrategy = this.determineSearchStrategy(query, type);
    const memoriesToSearch = this.getMemoriesByType(type);

    for (const memory of memoriesToSearch.values()) {
      const relevance = this.calculateRelevance(query, memory);
      if (relevance > 0.1) { // Minimum relevance threshold
        retrievedMemories.push(memory);
        relevanceScores.set(memory.id, relevance);
        
        // Update access statistics
        memory.accessCount++;
        memory.lastAccessed = Date.now();
      }
    }

    // Sort by relevance
    retrievedMemories.sort((a, b) => 
      (relevanceScores.get(b.id) || 0) - (relevanceScores.get(a.id) || 0)
    );

    const retrieval: MemoryRetrieval = {
      id: `retrieval_${Date.now()}`,
      query,
      retrievedMemories: retrievedMemories.slice(0, 20), // Limit results
      relevanceScores,
      retrievalTime: Date.now() - startTime,
      searchStrategy
    };

    this.retrievals.set(retrieval.id, retrieval);
    this.updateRetrievalMetrics(retrieval);

    this.logger.debug('Memory retrieval completed', {
      query,
      resultsCount: retrievedMemories.length,
      retrievalTime: retrieval.retrievalTime
    });

    return retrieval;
  }

  private determineSearchStrategy(query: string, type?: MemoryEntry['type']): string {
    if (type) {
      return `type_specific_${type}`;
    }
    if (query.length < 10) {
      return 'keyword_search';
    }
    if (query.includes('pattern') || query.includes('similar')) {
      return 'pattern_matching';
    }
    return 'semantic_search';
  }

  private getMemoriesByType(type?: MemoryEntry['type']): Map<string, MemoryEntry> {
    if (!type) {
      // Search all memory types
      const allMemories = new Map<string, MemoryEntry>();
      [this.shortTermMemory, this.longTermMemory, this.workingMemory, 
       this.episodicMemory, this.semanticMemory].forEach(memoryMap => {
        memoryMap.forEach((memory, id) => allMemories.set(id, memory));
      });
      return allMemories;
    }

    switch (type) {
      case 'short_term': return this.shortTermMemory;
      case 'long_term': return this.longTermMemory;
      case 'working': return this.workingMemory;
      case 'episodic': return this.episodicMemory;
      case 'semantic': return this.semanticMemory;
      default: return new Map();
    }
  }

  private calculateRelevance(query: string, memory: MemoryEntry): number {
    const queryLower = query.toLowerCase();
    const contentStr = JSON.stringify(memory.content).toLowerCase();
    
    // Keyword matching
    const keywordScore = this.calculateKeywordScore(queryLower, contentStr);
    
    // Association matching
    const associationScore = this.calculateAssociationScore(queryLower, memory.associations);
    
    // Recency and importance
    const recencyScore = this.calculateRecencyScore(memory);
    const importanceScore = memory.importance;
    
    // Combined relevance score
    const relevance = (keywordScore * 0.4) + (associationScore * 0.3) + 
                     (recencyScore * 0.2) + (importanceScore * 0.1);
    
    return Math.max(0, Math.min(1, relevance));
  }

  private calculateKeywordScore(query: string, content: string): number {
    const queryWords = query.split(/\s+/).filter(word => word.length > 2);
    if (queryWords.length === 0) return 0.5;

    const matches = queryWords.filter(word => content.includes(word));
    return matches.length / queryWords.length;
  }

  private calculateAssociationScore(query: string, associations: string[]): number {
    if (associations.length === 0) return 0.5;

    const queryWords = query.split(/\s+/).filter(word => word.length > 2);
    const associationStr = associations.join(' ').toLowerCase();
    
    const matches = queryWords.filter(word => associationStr.includes(word));
    return matches.length / Math.max(queryWords.length, 1);
  }

  private calculateRecencyScore(memory: MemoryEntry): number {
    const timeSinceAccess = Date.now() - memory.lastAccessed;
    const hoursSinceAccess = timeSinceAccess / (1000 * 60 * 60);
    return Math.max(0, 1 - (hoursSinceAccess / 24)); // Decay over 24 hours
  }

  public consolidateMemories(): MemoryConsolidation[] {
    const consolidations: MemoryConsolidation[] = [];
    
    // Consolidate short-term memories into long-term
    const shortTermMemories = Array.from(this.shortTermMemory.values());
    const consolidationGroups = this.groupMemoriesForConsolidation(shortTermMemories);
    
    for (const group of consolidationGroups) {
      if (group.length >= 2) {
        const consolidation = this.createConsolidation(group);
        if (consolidation) {
          consolidations.push(consolidation);
          this.consolidations.set(consolidation.id, consolidation);
          this.performanceMetrics.consolidationCount++;
        }
      }
    }

    this.logger.info('Memory consolidation completed', { 
      consolidationCount: consolidations.length 
    });

    return consolidations;
  }

  private groupMemoriesForConsolidation(memories: MemoryEntry[]): MemoryEntry[][] {
    const groups: MemoryEntry[][] = [];
    const processed = new Set<string>();

    for (const memory of memories) {
      if (processed.has(memory.id)) continue;

      const group = [memory];
      processed.add(memory.id);

      // Find related memories
      for (const otherMemory of memories) {
        if (processed.has(otherMemory.id)) continue;
        
        const similarity = this.calculateMemorySimilarity(memory, otherMemory);
        if (similarity > this.CONSOLIDATION_THRESHOLD) {
          group.push(otherMemory);
          processed.add(otherMemory.id);
        }
      }

      if (group.length > 1) {
        groups.push(group);
      }
    }

    return groups;
  }

  private calculateMemorySimilarity(memory1: MemoryEntry, memory2: MemoryEntry): number {
    // Content similarity
    const contentSimilarity = this.calculateContentSimilarity(memory1.content, memory2.content);
    
    // Association similarity
    const associationSimilarity = this.calculateAssociationSimilarity(memory1.associations, memory2.associations);
    
    // Temporal proximity
    const temporalSimilarity = this.calculateTemporalSimilarity(memory1.timestamp, memory2.timestamp);
    
    return (contentSimilarity * 0.5) + (associationSimilarity * 0.3) + (temporalSimilarity * 0.2);
  }

  private calculateContentSimilarity(content1: any, content2: any): number {
    const str1 = JSON.stringify(content1).toLowerCase();
    const str2 = JSON.stringify(content2).toLowerCase();
    
    const words1 = new Set(str1.split(/\s+/));
    const words2 = new Set(str2.split(/\s+/));
    
    const intersection = new Set([...words1].filter(word => words2.has(word)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }

  private calculateAssociationSimilarity(assoc1: string[], assoc2: string[]): number {
    if (assoc1.length === 0 && assoc2.length === 0) return 1.0;
    if (assoc1.length === 0 || assoc2.length === 0) return 0.0;
    
    const set1 = new Set(assoc1);
    const set2 = new Set(assoc2);
    
    const intersection = new Set([...set1].filter(item => set2.has(item)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  }

  private calculateTemporalSimilarity(timestamp1: number, timestamp2: number): number {
    const timeDiff = Math.abs(timestamp1 - timestamp2);
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    return Math.max(0, 1 - (hoursDiff / 24)); // Decay over 24 hours
  }

  private createConsolidation(group: MemoryEntry[]): MemoryConsolidation | null {
    if (group.length < 2) return null;

    const consolidatedContent = this.mergeMemoryContents(group);
    const consolidatedAssociations = this.mergeAssociations(group);
    const averageImportance = group.reduce((sum, mem) => sum + mem.importance, 0) / group.length;
    
    const consolidatedMemory: MemoryEntry = {
      id: `consolidated_${Date.now()}`,
      type: 'long_term',
      content: consolidatedContent,
      timestamp: Date.now(),
      importance: Math.min(1.0, averageImportance * 1.2), // Slight boost for consolidation
      associations: consolidatedAssociations,
      accessCount: group.reduce((sum, mem) => sum + mem.accessCount, 0),
      lastAccessed: Date.now(),
      decayRate: this.calculateDecayRate('long_term', averageImportance),
      metadata: new Map<string, any>([
        ['consolidated_from', group.map(m => m.id)],
        ['consolidation_timestamp', Date.now()],
        ['original_count', group.length]
      ])
    };

    // Store consolidated memory
    this.storeLongTermMemory(consolidatedMemory);

    // Remove original memories from short-term
    group.forEach(memory => {
      if (memory.type === 'short_term') {
        this.shortTermMemory.delete(memory.id);
        this.performanceMetrics.shortTermCount--;
      }
    });

    const consolidation: MemoryConsolidation = {
      id: `consolidation_${Date.now()}`,
      sourceMemories: group.map(m => m.id),
      consolidatedMemory,
      consolidationStrength: this.calculateConsolidationStrength(group),
      patterns: this.extractConsolidationPatterns(group),
      insights: this.generateConsolidationInsights(group)
    };

    return consolidation;
  }

  private mergeMemoryContents(memories: MemoryEntry[]): any {
    // Simple merging strategy - can be enhanced with more sophisticated approaches
    const merged: any = {};
    
    for (const memory of memories) {
      if (typeof memory.content === 'object') {
        Object.assign(merged, memory.content);
      } else {
        merged[memory.id] = memory.content;
      }
    }
    
    return merged;
  }

  private mergeAssociations(memories: MemoryEntry[]): string[] {
    const allAssociations = new Set<string>();
    
    for (const memory of memories) {
      memory.associations.forEach(assoc => allAssociations.add(assoc));
    }
    
    return Array.from(allAssociations);
  }

  private calculateConsolidationStrength(group: MemoryEntry[]): number {
    const similarities = [];
    
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const memory1 = group[i];
        const memory2 = group[j];
        if (memory1 && memory2) {
          similarities.push(this.calculateMemorySimilarity(memory1, memory2));
        }
      }
    }
    
    return similarities.length > 0 ? 
      similarities.reduce((sum, sim) => sum + sim, 0) / similarities.length : 0;
  }

  private extractConsolidationPatterns(group: MemoryEntry[]): string[] {
    const patterns: string[] = [];
    
    // Extract common themes
    const themes = this.extractCommonThemes(group);
    patterns.push(...themes);
    
    // Extract temporal patterns
    const temporalPatterns = this.extractTemporalPatterns(group);
    patterns.push(...temporalPatterns);
    
    // Extract content patterns
    const contentPatterns = this.extractContentPatterns(group);
    patterns.push(...contentPatterns);
    
    return patterns;
  }

  private extractCommonThemes(group: MemoryEntry[]): string[] {
    const themes: string[] = [];
    const contentStrings = group.map(m => JSON.stringify(m.content).toLowerCase());
    
    // Simple theme extraction - can be enhanced
    const commonWords = this.findCommonWords(contentStrings);
    themes.push(...commonWords.slice(0, 5));
    
    return themes;
  }

  private extractTemporalPatterns(group: MemoryEntry[]): string[] {
    const patterns: string[] = [];
    const timestamps = group.map(m => m.timestamp).sort();
    
    if (timestamps.length > 1) {
      const timeSpans = [];
      for (let i = 1; i < timestamps.length; i++) {
        const current = timestamps[i];
        const previous = timestamps[i-1];
        if (current && previous) {
          timeSpans.push(current - previous);
        }
      }
      
      const avgSpan = timeSpans.reduce((sum, span) => sum + span, 0) / timeSpans.length;
      if (avgSpan < 60000) patterns.push('rapid_sequence');
      else if (avgSpan < 3600000) patterns.push('hourly_pattern');
      else patterns.push('spread_out');
    }
    
    return patterns;
  }

  private extractContentPatterns(group: MemoryEntry[]): string[] {
    const patterns: string[] = [];
    
    // Check for similar content types
    const contentTypes = group.map(m => typeof m.content);
    const uniqueTypes = new Set(contentTypes);
    
    if (uniqueTypes.size === 1) patterns.push('uniform_content_type');
    else patterns.push('mixed_content_types');
    
    // Check for structured vs unstructured content
    const structuredCount = group.filter(m => 
      typeof m.content === 'object' && m.content !== null
    ).length;
    
    if (structuredCount === group.length) patterns.push('all_structured');
    else if (structuredCount === 0) patterns.push('all_unstructured');
    else patterns.push('mixed_structure');
    
    return patterns;
  }

  private findCommonWords(contentStrings: string[]): string[] {
    const wordCounts = new Map<string, number>();
    
    for (const content of contentStrings) {
      const words = content.split(/\s+/).filter(word => word.length > 3);
      for (const word of words) {
        wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
      }
    }
    
    return Array.from(wordCounts.entries())
      .filter(([_, count]) => count > 1)
      .sort(([_, a], [__, b]) => b - a)
      .map(([word, _]) => word);
  }

  private generateConsolidationInsights(group: MemoryEntry[]): string[] {
    const insights: string[] = [];
    
    insights.push(`Consolidated ${group.length} memories into long-term storage`);
    
    const avgImportance = group.reduce((sum, m) => sum + m.importance, 0) / group.length;
    insights.push(`Average importance: ${(avgImportance * 100).toFixed(1)}%`);
    
    const patterns = this.extractConsolidationPatterns(group);
    if (patterns.length > 0) {
      insights.push(`Detected patterns: ${patterns.join(', ')}`);
    }
    
    return insights;
  }

  public optimizeMemory(): MemoryOptimization[] {
    const optimizations: MemoryOptimization[] = [];
    
    // Memory pruning
    const pruningOptimization = this.performMemoryPruning();
    if (pruningOptimization) optimizations.push(pruningOptimization);
    
    // Memory reorganization
    const reorganizationOptimization = this.performMemoryReorganization();
    if (reorganizationOptimization) optimizations.push(reorganizationOptimization);
    
    // Memory compression
    const compressionOptimization = this.performMemoryCompression();
    if (compressionOptimization) optimizations.push(compressionOptimization);
    
    this.performanceMetrics.optimizationCount += optimizations.length;
    
    this.logger.info('Memory optimization completed', { 
      optimizationCount: optimizations.length 
    });
    
    return optimizations;
  }

  private performMemoryPruning(): MemoryOptimization | null {
    const affectedMemories: string[] = [];
    const improvementMetrics = new Map<string, number>();
    
    // Prune low-importance memories from short-term
    const shortTermMemories = Array.from(this.shortTermMemory.values());
    const prunedCount = shortTermMemories.filter(memory => {
      const shouldPrune = memory.importance < 0.2 && 
                         (Date.now() - memory.lastAccessed) > 3600000; // 1 hour
      if (shouldPrune) {
        affectedMemories.push(memory.id);
        this.shortTermMemory.delete(memory.id);
        this.performanceMetrics.shortTermCount--;
      }
      return shouldPrune;
    }).length;
    
    if (prunedCount > 0) {
      improvementMetrics.set('pruned_count', prunedCount);
      improvementMetrics.set('space_freed', prunedCount * 0.1); // Estimated space
      
      return {
        id: `pruning_${Date.now()}`,
        optimizationType: 'pruning',
        affectedMemories,
        improvementMetrics,
        optimizationTime: Date.now()
      };
    }
    
    return null;
  }

  private performMemoryReorganization(): MemoryOptimization | null {
    const affectedMemories: string[] = [];
    const improvementMetrics = new Map<string, number>();
    
    // Reorganize memories based on associations
    const allMemories = Array.from(this.longTermMemory.values());
    const associationGroups = this.groupMemoriesByAssociations(allMemories);
    
    let reorganizationCount = 0;
    for (const group of associationGroups) {
      if (group.length > 1) {
        // Update associations for better organization
        const commonAssociations = this.findCommonAssociations(group);
        for (const memory of group) {
          memory.associations = [...new Set([...memory.associations, ...commonAssociations])];
          affectedMemories.push(memory.id);
          reorganizationCount++;
        }
      }
    }
    
    if (reorganizationCount > 0) {
      improvementMetrics.set('reorganized_count', reorganizationCount);
      improvementMetrics.set('association_improvement', 0.15);
      
      return {
        id: `reorganization_${Date.now()}`,
        optimizationType: 'reorganization',
        affectedMemories,
        improvementMetrics,
        optimizationTime: Date.now()
      };
    }
    
    return null;
  }

  private performMemoryCompression(): MemoryOptimization | null {
    const affectedMemories: string[] = [];
    const improvementMetrics = new Map<string, number>();
    
    // Compress similar memories
    const longTermMemories = Array.from(this.longTermMemory.values());
    const compressionGroups = this.findCompressionGroups(longTermMemories);
    
    let compressionCount = 0;
    for (const group of compressionGroups) {
      if (group.length > 1) {
        const compressedMemory = this.compressMemoryGroup(group);
        if (compressedMemory) {
          // Replace group with compressed memory
          group.forEach(memory => {
            this.longTermMemory.delete(memory.id);
            affectedMemories.push(memory.id);
          });
          this.storeLongTermMemory(compressedMemory);
          compressionCount++;
        }
      }
    }
    
    if (compressionCount > 0) {
      improvementMetrics.set('compressed_count', compressionCount);
      improvementMetrics.set('space_saved', compressionCount * 0.3);
      
      return {
        id: `compression_${Date.now()}`,
        optimizationType: 'compression',
        affectedMemories,
        improvementMetrics,
        optimizationTime: Date.now()
      };
    }
    
    return null;
  }

  private groupMemoriesByAssociations(memories: MemoryEntry[]): MemoryEntry[][] {
    const groups: MemoryEntry[][] = [];
    const processed = new Set<string>();
    
    for (const memory of memories) {
      if (processed.has(memory.id)) continue;
      
      const group = [memory];
      processed.add(memory.id);
      
      for (const otherMemory of memories) {
        if (processed.has(otherMemory.id)) continue;
        
        const commonAssociations = memory.associations.filter(assoc => 
          otherMemory.associations.includes(assoc)
        );
        
        if (commonAssociations.length > 0) {
          group.push(otherMemory);
          processed.add(otherMemory.id);
        }
      }
      
      if (group.length > 1) {
        groups.push(group);
      }
    }
    
    return groups;
  }

  private findCommonAssociations(group: MemoryEntry[]): string[] {
    const associationCounts = new Map<string, number>();
    
    for (const memory of group) {
      for (const association of memory.associations) {
        associationCounts.set(association, (associationCounts.get(association) || 0) + 1);
      }
    }
    
    return Array.from(associationCounts.entries())
      .filter(([_, count]) => count > group.length / 2)
      .map(([association, _]) => association);
  }

  private findCompressionGroups(memories: MemoryEntry[]): MemoryEntry[][] {
    const groups: MemoryEntry[][] = [];
    const processed = new Set<string>();
    
    for (const memory of memories) {
      if (processed.has(memory.id)) continue;
      
      const group = [memory];
      processed.add(memory.id);
      
      for (const otherMemory of memories) {
        if (processed.has(otherMemory.id)) continue;
        
        const similarity = this.calculateMemorySimilarity(memory, otherMemory);
        if (similarity > 0.8) { // High similarity for compression
          group.push(otherMemory);
          processed.add(otherMemory.id);
        }
      }
      
      if (group.length > 1) {
        groups.push(group);
      }
    }
    
    return groups;
  }

  private compressMemoryGroup(group: MemoryEntry[]): MemoryEntry | null {
    if (group.length < 2) return null;
    
    const compressedContent = this.compressMemoryContents(group);
    const compressedAssociations = this.mergeAssociations(group);
    const averageImportance = group.reduce((sum, m) => sum + m.importance, 0) / group.length;
    
    return {
      id: `compressed_${Date.now()}`,
      type: 'long_term',
      content: compressedContent,
      timestamp: Date.now(),
      importance: averageImportance,
      associations: compressedAssociations,
      accessCount: group.reduce((sum, m) => sum + m.accessCount, 0),
      lastAccessed: Date.now(),
      decayRate: this.calculateDecayRate('long_term', averageImportance),
      metadata: new Map<string, any>([
        ['compressed_from', group.map(m => m.id)],
        ['compression_timestamp', Date.now()],
        ['original_count', group.length]
      ])
    };
  }

  private compressMemoryContents(group: MemoryEntry[]): any {
    // Create a summary representation
    const summary: any = {
      type: 'compressed_memory',
      original_count: group.length,
      summary: this.createMemorySummary(group),
      key_elements: this.extractKeyElements(group)
    };
    
    return summary;
  }

  private createMemorySummary(group: MemoryEntry[]): string {
    const contentStrings = group.map(m => 
      typeof m.content === 'string' ? m.content : JSON.stringify(m.content)
    );
    
    // Simple summary - can be enhanced with NLP
    const commonWords = this.findCommonWords(contentStrings);
    return `Compressed memory containing ${group.length} related memories. Key themes: ${commonWords.slice(0, 3).join(', ')}`;
  }

  private extractKeyElements(group: MemoryEntry[]): any {
    const elements: any = {
      themes: this.extractCommonThemes(group),
      patterns: this.extractConsolidationPatterns(group),
      importance_range: {
        min: Math.min(...group.map(m => m.importance)),
        max: Math.max(...group.map(m => m.importance)),
        average: group.reduce((sum, m) => sum + m.importance, 0) / group.length
      }
    };
    
    return elements;
  }

  private calculateDecayRate(type: MemoryEntry['type'], _importance: number): number {
    const baseDecayRate = this.DECAY_RATE;
    
    switch (type) {
      case 'short_term':
        return baseDecayRate * 2; // Faster decay
      case 'working':
        return baseDecayRate * 1.5; // Moderate decay
      case 'long_term':
        return baseDecayRate * 0.5; // Slower decay
      case 'episodic':
        return baseDecayRate * 0.8; // Moderate decay
      case 'semantic':
        return baseDecayRate * 0.3; // Very slow decay
      default:
        return baseDecayRate;
    }
  }

  private updateRetrievalMetrics(retrieval: MemoryRetrieval): void {
    const currentAvg = this.performanceMetrics.averageRetrievalTime;
    const totalRetrievals = this.retrievals.size;
    
    this.performanceMetrics.averageRetrievalTime = 
      (currentAvg * (totalRetrievals - 1) + retrieval.retrievalTime) / totalRetrievals;
  }

  public getMemoryState(): MemoryState {
    return {
      totalMemories: this.shortTermMemory.size + this.longTermMemory.size + this.workingMemory.size + this.episodicMemory.size + this.semanticMemory.size,
      shortTermCount: this.shortTermMemory.size,
      longTermCount: this.longTermMemory.size,
      workingCount: this.workingMemory.size,
      episodicCount: this.episodicMemory.size,
      semanticCount: this.semanticMemory.size,
      proceduralCount: 5, // Default procedural memories
      shortTerm: {
        capacity: 100,
        items: Array.from(this.shortTermMemory.values()).map(entry => ({
          ...entry,
          accessibility: 0.9
        })),
        decay: {
          type: 'exponential',
          rate: 0.1,
          parameters: {}
        }
      },
      longTerm: {
        knowledge: Array.from(this.longTermMemory.values()).map(entry => ({
          ...entry,
          confidence: 0.8,
          source: 'memory',
          validity: {
            start: Date.now(),
            conditions: {}
          },
          type: 'fact' as any
        })),
        patterns: [],
        skills: [],
        experiences: []
      },
      working: {
        active: Array.from(this.workingMemory.values()).map(entry => ({
          ...entry,
          accessibility: 0.9
        })),
        focus: {
          target: 'current_task',
          intensity: 0.8,
          duration: 1000
        },
        capacity: 50
      },
      episodic: {
        events: Array.from(this.episodicMemory.values()).map(entry => ({
          ...entry,
          participants: [],
          effects: [],
          probability: 0.8
        })),
        timeline: {
          events: Array.from(this.episodicMemory.values()).map(entry => ({
            ...entry,
            participants: [],
            effects: [],
            probability: 0.8
          })),
          order: 'chronological',
          granularity: 'milliseconds'
        },
        associations: []
      },
      semantic: {
        concepts: Array.from(this.semanticMemory.values()).map(entry => ({
          ...entry,
          name: entry.id,
          definition: entry.content,
          properties: {} as Record<string, unknown>,
          instances: []
        })),
        relationships: [],
        schemas: []
      }
    };
  }

  public getPerformanceMetrics(): Record<string, any> {
    return {
      ...this.performanceMetrics,
      memoryUtilization: {
        shortTerm: this.shortTermMemory.size / this.SHORT_TERM_CAPACITY,
        working: this.workingMemory.size / this.WORKING_MEMORY_CAPACITY
      },
      retrievalStats: {
        totalRetrievals: this.retrievals.size,
        averageRelevance: this.calculateAverageRelevance()
      }
    };
  }

  private calculateAverageRelevance(): number {
    if (this.retrievals.size === 0) return 0;
    
    let totalRelevance = 0;
    let totalScores = 0;
    
    for (const retrieval of this.retrievals.values()) {
      for (const score of retrieval.relevanceScores.values()) {
        totalRelevance += score;
        totalScores++;
      }
    }
    
    return totalScores > 0 ? totalRelevance / totalScores : 0;
  }

  public clearMemory(type?: MemoryEntry['type']): void {
    if (!type) {
      this.shortTermMemory.clear();
      this.longTermMemory.clear();
      this.workingMemory.clear();
      this.episodicMemory.clear();
      this.semanticMemory.clear();
      this.logger.info('All memory cleared');
    } else {
      switch (type) {
        case 'short_term':
          this.shortTermMemory.clear();
          break;
        case 'long_term':
          this.longTermMemory.clear();
          break;
        case 'working':
          this.workingMemory.clear();
          break;
        case 'episodic':
          this.episodicMemory.clear();
          break;
        case 'semantic':
          this.semanticMemory.clear();
          break;
      }
      this.logger.info(`Memory cleared for type: ${type}`);
    }
  }
} 