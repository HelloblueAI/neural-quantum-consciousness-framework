import { Logger } from '../utils/Logger';
export class MemoryManager {
    shortTermMemory = new Map();
    longTermMemory = new Map();
    workingMemory = new Map();
    episodicMemory = new Map();
    semanticMemory = new Map();
    consolidations = new Map();
    retrievals = new Map();
    logger;
    performanceMetrics = {
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
    SHORT_TERM_CAPACITY = 1000;
    WORKING_MEMORY_CAPACITY = 100;
    CONSOLIDATION_THRESHOLD = 0.7;
    DECAY_RATE = 0.1;
    constructor() {
        this.logger = new Logger('MemoryManager');
        this.initializeMemory();
    }
    initializeMemory() {
        // Initialize memory systems with default entries
        this.createDefaultMemories();
        this.logger.info('MemoryManager initialized with default memories');
    }
    createDefaultMemories() {
        // Create default semantic memories
        const defaultSemanticMemories = [
            {
                id: 'semantic_basic_concepts',
                type: 'semantic',
                content: {
                    concepts: ['object', 'action', 'property', 'relation'],
                    categories: ['physical', 'abstract', 'temporal', 'spatial']
                },
                importance: 0.9,
                associations: ['basic_knowledge', 'foundational_concepts']
            },
            {
                id: 'semantic_reasoning_patterns',
                type: 'semantic',
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
    storeMemory(id, type, content, importance = 0.5, associations = []) {
        const memory = {
            id,
            type,
            content,
            timestamp: Date.now(),
            importance,
            associations,
            accessCount: 0,
            lastAccessed: Date.now(),
            decayRate: this.calculateDecayRate(type, importance),
            metadata: new Map([
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
    storeShortTermMemory(memory) {
        if (this.shortTermMemory.size >= this.SHORT_TERM_CAPACITY) {
            this.evictLeastImportantShortTerm();
        }
        this.shortTermMemory.set(memory.id, memory);
        this.performanceMetrics.shortTermCount++;
    }
    storeLongTermMemory(memory) {
        this.longTermMemory.set(memory.id, memory);
        this.performanceMetrics.longTermCount++;
    }
    storeWorkingMemory(memory) {
        if (this.workingMemory.size >= this.WORKING_MEMORY_CAPACITY) {
            this.evictLeastImportantWorking();
        }
        this.workingMemory.set(memory.id, memory);
        this.performanceMetrics.workingCount++;
    }
    storeEpisodicMemory(memory) {
        this.episodicMemory.set(memory.id, memory);
        this.performanceMetrics.episodicCount++;
    }
    storeSemanticMemory(memory) {
        this.semanticMemory.set(memory.id, memory);
        this.performanceMetrics.semanticCount++;
    }
    evictLeastImportantShortTerm() {
        let leastImportant = null;
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
    evictLeastImportantWorking() {
        let leastImportant = null;
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
    retrieveMemory(query, type) {
        const startTime = Date.now();
        const retrievedMemories = [];
        const relevanceScores = new Map();
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
        retrievedMemories.sort((a, b) => (relevanceScores.get(b.id) || 0) - (relevanceScores.get(a.id) || 0));
        const retrieval = {
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
    determineSearchStrategy(query, type) {
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
    getMemoriesByType(type) {
        if (!type) {
            // Search all memory types
            const allMemories = new Map();
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
    calculateRelevance(query, memory) {
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
    calculateKeywordScore(query, content) {
        const queryWords = query.split(/\s+/).filter(word => word.length > 2);
        if (queryWords.length === 0)
            return 0.5;
        const matches = queryWords.filter(word => content.includes(word));
        return matches.length / queryWords.length;
    }
    calculateAssociationScore(query, associations) {
        if (associations.length === 0)
            return 0.5;
        const queryWords = query.split(/\s+/).filter(word => word.length > 2);
        const associationStr = associations.join(' ').toLowerCase();
        const matches = queryWords.filter(word => associationStr.includes(word));
        return matches.length / Math.max(queryWords.length, 1);
    }
    calculateRecencyScore(memory) {
        const timeSinceAccess = Date.now() - memory.lastAccessed;
        const hoursSinceAccess = timeSinceAccess / (1000 * 60 * 60);
        return Math.max(0, 1 - (hoursSinceAccess / 24)); // Decay over 24 hours
    }
    consolidateMemories() {
        const consolidations = [];
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
    groupMemoriesForConsolidation(memories) {
        const groups = [];
        const processed = new Set();
        for (const memory of memories) {
            if (processed.has(memory.id))
                continue;
            const group = [memory];
            processed.add(memory.id);
            // Find related memories
            for (const otherMemory of memories) {
                if (processed.has(otherMemory.id))
                    continue;
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
    calculateMemorySimilarity(memory1, memory2) {
        // Content similarity
        const contentSimilarity = this.calculateContentSimilarity(memory1.content, memory2.content);
        // Association similarity
        const associationSimilarity = this.calculateAssociationSimilarity(memory1.associations, memory2.associations);
        // Temporal proximity
        const temporalSimilarity = this.calculateTemporalSimilarity(memory1.timestamp, memory2.timestamp);
        return (contentSimilarity * 0.5) + (associationSimilarity * 0.3) + (temporalSimilarity * 0.2);
    }
    calculateContentSimilarity(content1, content2) {
        const str1 = JSON.stringify(content1).toLowerCase();
        const str2 = JSON.stringify(content2).toLowerCase();
        const words1 = new Set(str1.split(/\s+/));
        const words2 = new Set(str2.split(/\s+/));
        const intersection = new Set([...words1].filter(word => words2.has(word)));
        const union = new Set([...words1, ...words2]);
        return intersection.size / union.size;
    }
    calculateAssociationSimilarity(assoc1, assoc2) {
        if (assoc1.length === 0 && assoc2.length === 0)
            return 1.0;
        if (assoc1.length === 0 || assoc2.length === 0)
            return 0.0;
        const set1 = new Set(assoc1);
        const set2 = new Set(assoc2);
        const intersection = new Set([...set1].filter(item => set2.has(item)));
        const union = new Set([...set1, ...set2]);
        return intersection.size / union.size;
    }
    calculateTemporalSimilarity(timestamp1, timestamp2) {
        const timeDiff = Math.abs(timestamp1 - timestamp2);
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        return Math.max(0, 1 - (hoursDiff / 24)); // Decay over 24 hours
    }
    createConsolidation(group) {
        if (group.length < 2)
            return null;
        const consolidatedContent = this.mergeMemoryContents(group);
        const consolidatedAssociations = this.mergeAssociations(group);
        const averageImportance = group.reduce((sum, mem) => sum + mem.importance, 0) / group.length;
        const consolidatedMemory = {
            id: `consolidated_${Date.now()}`,
            type: 'long_term',
            content: consolidatedContent,
            timestamp: Date.now(),
            importance: Math.min(1.0, averageImportance * 1.2), // Slight boost for consolidation
            associations: consolidatedAssociations,
            accessCount: group.reduce((sum, mem) => sum + mem.accessCount, 0),
            lastAccessed: Date.now(),
            decayRate: this.calculateDecayRate('long_term', averageImportance),
            metadata: new Map([
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
        const consolidation = {
            id: `consolidation_${Date.now()}`,
            sourceMemories: group.map(m => m.id),
            consolidatedMemory,
            consolidationStrength: this.calculateConsolidationStrength(group),
            patterns: this.extractConsolidationPatterns(group),
            insights: this.generateConsolidationInsights(group)
        };
        return consolidation;
    }
    mergeMemoryContents(memories) {
        // Simple merging strategy - can be enhanced with more sophisticated approaches
        const merged = {};
        for (const memory of memories) {
            if (typeof memory.content === 'object') {
                Object.assign(merged, memory.content);
            }
            else {
                merged[memory.id] = memory.content;
            }
        }
        return merged;
    }
    mergeAssociations(memories) {
        const allAssociations = new Set();
        for (const memory of memories) {
            memory.associations.forEach(assoc => allAssociations.add(assoc));
        }
        return Array.from(allAssociations);
    }
    calculateConsolidationStrength(group) {
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
    extractConsolidationPatterns(group) {
        const patterns = [];
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
    extractCommonThemes(group) {
        const themes = [];
        const contentStrings = group.map(m => JSON.stringify(m.content).toLowerCase());
        // Simple theme extraction - can be enhanced
        const commonWords = this.findCommonWords(contentStrings);
        themes.push(...commonWords.slice(0, 5));
        return themes;
    }
    extractTemporalPatterns(group) {
        const patterns = [];
        const timestamps = group.map(m => m.timestamp).sort();
        if (timestamps.length > 1) {
            const timeSpans = [];
            for (let i = 1; i < timestamps.length; i++) {
                const current = timestamps[i];
                const previous = timestamps[i - 1];
                if (current && previous) {
                    timeSpans.push(current - previous);
                }
            }
            const avgSpan = timeSpans.reduce((sum, span) => sum + span, 0) / timeSpans.length;
            if (avgSpan < 60000)
                patterns.push('rapid_sequence');
            else if (avgSpan < 3600000)
                patterns.push('hourly_pattern');
            else
                patterns.push('spread_out');
        }
        return patterns;
    }
    extractContentPatterns(group) {
        const patterns = [];
        // Check for similar content types
        const contentTypes = group.map(m => typeof m.content);
        const uniqueTypes = new Set(contentTypes);
        if (uniqueTypes.size === 1)
            patterns.push('uniform_content_type');
        else
            patterns.push('mixed_content_types');
        // Check for structured vs unstructured content
        const structuredCount = group.filter(m => typeof m.content === 'object' && m.content !== null).length;
        if (structuredCount === group.length)
            patterns.push('all_structured');
        else if (structuredCount === 0)
            patterns.push('all_unstructured');
        else
            patterns.push('mixed_structure');
        return patterns;
    }
    findCommonWords(contentStrings) {
        const wordCounts = new Map();
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
    generateConsolidationInsights(group) {
        const insights = [];
        insights.push(`Consolidated ${group.length} memories into long-term storage`);
        const avgImportance = group.reduce((sum, m) => sum + m.importance, 0) / group.length;
        insights.push(`Average importance: ${(avgImportance * 100).toFixed(1)}%`);
        const patterns = this.extractConsolidationPatterns(group);
        if (patterns.length > 0) {
            insights.push(`Detected patterns: ${patterns.join(', ')}`);
        }
        return insights;
    }
    optimizeMemory() {
        const optimizations = [];
        // Memory pruning
        const pruningOptimization = this.performMemoryPruning();
        if (pruningOptimization)
            optimizations.push(pruningOptimization);
        // Memory reorganization
        const reorganizationOptimization = this.performMemoryReorganization();
        if (reorganizationOptimization)
            optimizations.push(reorganizationOptimization);
        // Memory compression
        const compressionOptimization = this.performMemoryCompression();
        if (compressionOptimization)
            optimizations.push(compressionOptimization);
        this.performanceMetrics.optimizationCount += optimizations.length;
        this.logger.info('Memory optimization completed', {
            optimizationCount: optimizations.length
        });
        return optimizations;
    }
    performMemoryPruning() {
        const affectedMemories = [];
        const improvementMetrics = new Map();
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
    performMemoryReorganization() {
        const affectedMemories = [];
        const improvementMetrics = new Map();
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
    performMemoryCompression() {
        const affectedMemories = [];
        const improvementMetrics = new Map();
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
    groupMemoriesByAssociations(memories) {
        const groups = [];
        const processed = new Set();
        for (const memory of memories) {
            if (processed.has(memory.id))
                continue;
            const group = [memory];
            processed.add(memory.id);
            for (const otherMemory of memories) {
                if (processed.has(otherMemory.id))
                    continue;
                const commonAssociations = memory.associations.filter(assoc => otherMemory.associations.includes(assoc));
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
    findCommonAssociations(group) {
        const associationCounts = new Map();
        for (const memory of group) {
            for (const association of memory.associations) {
                associationCounts.set(association, (associationCounts.get(association) || 0) + 1);
            }
        }
        return Array.from(associationCounts.entries())
            .filter(([_, count]) => count > group.length / 2)
            .map(([association, _]) => association);
    }
    findCompressionGroups(memories) {
        const groups = [];
        const processed = new Set();
        for (const memory of memories) {
            if (processed.has(memory.id))
                continue;
            const group = [memory];
            processed.add(memory.id);
            for (const otherMemory of memories) {
                if (processed.has(otherMemory.id))
                    continue;
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
    compressMemoryGroup(group) {
        if (group.length < 2)
            return null;
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
            metadata: new Map([
                ['compressed_from', group.map(m => m.id)],
                ['compression_timestamp', Date.now()],
                ['original_count', group.length]
            ])
        };
    }
    compressMemoryContents(group) {
        // Create a summary representation
        const summary = {
            type: 'compressed_memory',
            original_count: group.length,
            summary: this.createMemorySummary(group),
            key_elements: this.extractKeyElements(group)
        };
        return summary;
    }
    createMemorySummary(group) {
        const contentStrings = group.map(m => typeof m.content === 'string' ? m.content : JSON.stringify(m.content));
        // Simple summary - can be enhanced with NLP
        const commonWords = this.findCommonWords(contentStrings);
        return `Compressed memory containing ${group.length} related memories. Key themes: ${commonWords.slice(0, 3).join(', ')}`;
    }
    extractKeyElements(group) {
        const elements = {
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
    calculateDecayRate(type, _importance) {
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
    updateRetrievalMetrics(retrieval) {
        const currentAvg = this.performanceMetrics.averageRetrievalTime;
        const totalRetrievals = this.retrievals.size;
        this.performanceMetrics.averageRetrievalTime =
            (currentAvg * (totalRetrievals - 1) + retrieval.retrievalTime) / totalRetrievals;
    }
    getMemoryState() {
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
                    type: 'fact'
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
                    properties: {},
                    instances: []
                })),
                relationships: [],
                schemas: []
            }
        };
    }
    getPerformanceMetrics() {
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
    calculateAverageRelevance() {
        if (this.retrievals.size === 0)
            return 0;
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
    clearMemory(type) {
        if (!type) {
            this.shortTermMemory.clear();
            this.longTermMemory.clear();
            this.workingMemory.clear();
            this.episodicMemory.clear();
            this.semanticMemory.clear();
            this.logger.info('All memory cleared');
        }
        else {
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
//# sourceMappingURL=MemoryManager.js.map