import { Logger } from '../../utils/Logger';
export class ActiveLearning {
    tasks = new Map();
    strategies = new Map();
    queryResults = new Map();
    performances = new Map();
    logger;
    performanceMetrics = {
        totalTasks: 0,
        totalStrategies: 0,
        averageEfficiency: 0,
        totalQueries: 0
    };
    constructor() {
        this.logger = new Logger('ActiveLearning');
        this.initializeAcquisitionStrategies();
    }
    /**
     * Initialize the active learning component
     */
    async initialize() {
        try {
            this.logger.info('Initializing Active Learning...');
            // Initialize acquisition strategies
            this.initializeAcquisitionStrategies();
            // Initialize performance metrics
            this.performanceMetrics = {
                totalTasks: 0,
                totalStrategies: 0,
                averageEfficiency: 0,
                totalQueries: 0
            };
            this.logger.info('Active Learning initialized successfully');
        }
        catch (error) {
            this.logger.error('Failed to initialize Active Learning', error);
            throw error;
        }
    }
    initializeAcquisitionStrategies() {
        // Initialize active learning acquisition strategies
        const standardStrategies = [
            {
                id: 'uncertainty_sampling',
                name: 'Uncertainty Sampling',
                type: 'uncertainty',
                description: 'Select samples with highest prediction uncertainty',
                parameters: new Map([
                    ['uncertainty_metric', 'entropy'],
                    ['threshold', 0.5],
                    ['batch_size', 10]
                ]),
                performance: new Map([
                    ['uncertainty_reduction', 0.0],
                    ['information_gain', 0.0],
                    ['efficiency', 0.0]
                ]),
                confidence: 0.8
            },
            {
                id: 'diversity_sampling',
                name: 'Diversity Sampling',
                type: 'diversity',
                description: 'Select diverse samples to improve coverage',
                parameters: new Map([
                    ['diversity_metric', 'cosine_distance'],
                    ['cluster_size', 5],
                    ['coverage_threshold', 0.8]
                ]),
                performance: new Map([
                    ['diversity_score', 0.0],
                    ['coverage_improvement', 0.0],
                    ['representation_quality', 0.0]
                ]),
                confidence: 0.75
            },
            {
                id: 'expected_model_change',
                name: 'Expected Model Change',
                type: 'expected_improvement',
                description: 'Select samples that maximize expected model improvement',
                parameters: new Map([
                    ['improvement_metric', 'gradient_norm'],
                    ['learning_rate', 0.01],
                    ['simulation_steps', 5]
                ]),
                performance: new Map([
                    ['model_change', 0.0],
                    ['improvement_rate', 0.0],
                    ['convergence_speed', 0.0]
                ]),
                confidence: 0.7
            },
            {
                id: 'query_by_committee',
                name: 'Query by Committee',
                type: 'information_gain',
                description: 'Use ensemble disagreement to select informative samples',
                parameters: new Map([
                    ['committee_size', 5],
                    ['disagreement_metric', 'variance'],
                    ['consensus_threshold', 0.7]
                ]),
                performance: new Map([
                    ['committee_disagreement', 0.0],
                    ['consensus_quality', 0.0],
                    ['ensemble_diversity', 0.0]
                ]),
                confidence: 0.85
            }
        ];
        standardStrategies.forEach(strategy => {
            this.strategies.set(strategy.id, strategy);
        });
        this.logger.info('ActiveLearning initialized with standard acquisition strategies');
    }
    learn(experiences, _context) {
        this.logger.debug('Starting active learning', { experienceCount: experiences.length });
        try {
            const startTime = Date.now();
            const tasks = this.extractActiveLearningTasks(experiences);
            const strategies = this.selectAcquisitionStrategies(tasks);
            const queryResults = this.executeActiveLearning(tasks, strategies);
            const performances = this.evaluateActiveLearningPerformance(tasks, strategies, queryResults);
            const insights = this.generateActiveLearningInsights(tasks, strategies, queryResults, performances);
            const confidence = this.calculateActiveLearningConfidence(tasks, strategies, performances);
            const learningTime = Date.now() - startTime;
            this.updatePerformanceMetrics(learningTime, confidence, strategies.length);
            const result = {
                insights: insights,
                confidence: confidence,
                success: true,
                improvements: [
                    { type: 'task_extraction', magnitude: 0.8, description: `Active learning tasks extracted: ${tasks.length}` },
                    { type: 'strategy_selection', magnitude: 0.7, description: `Acquisition strategies selected: ${strategies.length}` },
                    { type: 'query_generation', magnitude: 0.6, description: `Query results generated: ${queryResults.length}` },
                    { type: 'performance_evaluation', magnitude: 0.7, description: `Active learning performances evaluated: ${performances.length}` },
                    { type: 'completion', magnitude: confidence, description: `Active learning completed with confidence: ${confidence.toFixed(3)}` }
                ],
                newKnowledge: [],
                adaptationMetrics: {
                    performance: confidence,
                    stability: 0.8,
                    flexibility: 0.6,
                    efficiency: 0.7
                }
            };
            this.logger.info('Active learning completed', {
                experienceCount: experiences.length,
                confidence: result.confidence,
                tasksProcessed: tasks.length,
                learningTime
            });
            return result;
        }
        catch (error) {
            this.logger.error('Error in active learning', error);
            throw new Error(`Active learning failed: ${error}`);
        }
    }
    extractActiveLearningTasks(experiences) {
        const tasks = [];
        // Split experiences into labeled and unlabeled data
        const labeledData = experiences.filter(exp => exp.confidence !== undefined);
        const unlabeledData = experiences.filter(exp => exp.confidence === undefined);
        if (unlabeledData.length > 0) {
            const task = {
                id: `active_learning_${Date.now()}`,
                name: 'Active Learning Task',
                type: 'uncertainty_sampling',
                description: 'Intelligent data selection for learning',
                dataset: this.extractDataset(labeledData, unlabeledData),
                labeledData,
                unlabeledData,
                acquisitionFunction: 'entropy',
                budget: Math.min(unlabeledData.length, 50),
                performance: this.calculateActiveLearningPerformance(labeledData, unlabeledData),
                metadata: this.extractActiveLearningMetadata(labeledData, unlabeledData)
            };
            tasks.push(task);
            this.tasks.set(task.id, task);
        }
        this.performanceMetrics.totalTasks += tasks.length;
        return tasks;
    }
    selectAcquisitionStrategies(tasks) {
        const selectedStrategies = [];
        for (const task of tasks) {
            const applicableStrategies = this.findApplicableStrategies(task);
            const bestStrategy = this.selectBestAcquisitionStrategy(applicableStrategies, task);
            if (bestStrategy) {
                selectedStrategies.push(bestStrategy);
            }
        }
        this.performanceMetrics.totalStrategies += selectedStrategies.length;
        return selectedStrategies;
    }
    executeActiveLearning(tasks, strategies) {
        const results = [];
        for (const task of tasks) {
            const strategy = strategies.find(s => this.isStrategyForTask(s, task));
            if (strategy) {
                const queryResult = this.executeQuery(task, strategy);
                if (queryResult) {
                    results.push(queryResult);
                    this.queryResults.set(queryResult.id, queryResult);
                }
            }
        }
        this.performanceMetrics.totalQueries += results.length;
        return results;
    }
    evaluateActiveLearningPerformance(tasks, strategies, queryResults) {
        const performances = [];
        for (const task of tasks) {
            const strategy = strategies.find(s => this.isStrategyForTask(s, task));
            const queryResult = queryResults.find(q => q.taskId === task.id);
            if (strategy && queryResult) {
                const performance = this.evaluateTaskPerformance(task, strategy, queryResult);
                if (performance) {
                    performances.push(performance);
                    this.performances.set(performance.taskId, performance);
                }
            }
        }
        return performances;
    }
    generateActiveLearningInsights(tasks, strategies, queryResults, performances) {
        const insights = [];
        // Task-based insights
        if (tasks.length > 0) {
            const totalUnlabeled = tasks.reduce((sum, task) => sum + task.unlabeledData.length, 0);
            const totalLabeled = tasks.reduce((sum, task) => sum + task.labeledData.length, 0);
            insights.push(`Created ${tasks.length} active learning tasks with ${totalUnlabeled} unlabeled and ${totalLabeled} labeled samples`);
        }
        // Strategy-based insights
        if (strategies.length > 0) {
            const strategyTypes = [...new Set(strategies.map(strategy => strategy.type))];
            insights.push(`Applied ${strategies.length} acquisition strategies: ${strategyTypes.join(', ')}`);
        }
        // Query-based insights
        if (queryResults.length > 0) {
            const totalQueried = queryResults.reduce((sum, result) => sum + result.selectedSamples.length, 0);
            insights.push(`Generated ${queryResults.length} queries, selecting ${totalQueried} samples`);
        }
        // Performance insights
        if (performances.length > 0) {
            const averageEfficiency = performances.reduce((sum, perf) => sum + perf.efficiency, 0) / performances.length;
            insights.push(`Average active learning efficiency: ${(averageEfficiency * 100).toFixed(1)}%`);
        }
        return insights;
    }
    calculateActiveLearningConfidence(tasks, strategies, performances) {
        if (tasks.length === 0)
            return 0.5;
        const taskConfidence = tasks.length > 0 ?
            tasks.reduce((sum, task) => sum + (task.performance.get('efficiency') || 0), 0) / tasks.length : 0.5;
        const strategyConfidence = strategies.length > 0 ?
            strategies.reduce((sum, strategy) => sum + strategy.confidence, 0) / strategies.length : 0.5;
        const performanceConfidence = performances.length > 0 ?
            performances.reduce((sum, perf) => sum + perf.efficiency, 0) / performances.length : 0.5;
        const confidence = (taskConfidence * 0.4) + (strategyConfidence * 0.3) + (performanceConfidence * 0.3);
        return Math.max(0, Math.min(1, confidence));
    }
    // private _calculateActiveLearningUncertainty(tasks: ActiveLearningTask[], strategies: AcquisitionStrategy[], performances: ActiveLearningPerformance[]): number {
    //   if (tasks.length === 0) return 0.5;
    //   const taskUncertainty = tasks.some(task => (task.performance.get('efficiency') || 0) < 0.5) ? 0.3 : 0.1;
    //   const strategyUncertainty = strategies.some(strategy => strategy.confidence < 0.5) ? 0.3 : 0.1;
    //   const performanceUncertainty = performances.some(perf => perf.efficiency < 0.5) ? 0.3 : 0.1;
    //   return Math.min(taskUncertainty + strategyUncertainty + performanceUncertainty, 1.0);
    // }
    extractDataset(labeledData, unlabeledData) {
        const dataset = new Map();
        dataset.set('labeled_size', labeledData.length);
        dataset.set('unlabeled_size', unlabeledData.length);
        dataset.set('total_size', labeledData.length + unlabeledData.length);
        dataset.set('label_ratio', labeledData.length / (labeledData.length + unlabeledData.length));
        dataset.set('features', this.extractFeatures(labeledData.concat(unlabeledData)));
        return dataset;
    }
    calculateActiveLearningPerformance(labeledData, unlabeledData) {
        const performance = new Map();
        const labeledAccuracy = labeledData.length > 0 ?
            labeledData.reduce((sum, exp) => sum + (exp.confidence || 0), 0) / labeledData.length : 0;
        const dataDiversity = this.calculateDataDiversity(labeledData.concat(unlabeledData));
        const efficiency = this.calculateActiveLearningEfficiency(labeledData, unlabeledData);
        performance.set('labeled_accuracy', labeledAccuracy);
        performance.set('data_diversity', dataDiversity);
        performance.set('efficiency', efficiency);
        return performance;
    }
    extractActiveLearningMetadata(labeledData, unlabeledData) {
        const metadata = new Map();
        metadata.set('labeled_count', labeledData.length);
        metadata.set('unlabeled_count', unlabeledData.length);
        metadata.set('data_quality', this.calculateDataQuality(labeledData.concat(unlabeledData)));
        metadata.set('feature_complexity', this.calculateFeatureComplexity(labeledData.concat(unlabeledData)));
        return metadata;
    }
    findApplicableStrategies(task) {
        const applicableStrategies = [];
        for (const strategy of this.strategies.values()) {
            if (this.isStrategyApplicable(strategy, task)) {
                applicableStrategies.push(strategy);
            }
        }
        return applicableStrategies;
    }
    isStrategyApplicable(strategy, task) {
        // Check if strategy is applicable to active learning task
        const unlabeledRatio = task.unlabeledData.length / (task.labeledData.length + task.unlabeledData.length);
        switch (strategy.type) {
            case 'uncertainty':
                return unlabeledRatio > 0.3;
            case 'diversity':
                return task.unlabeledData.length > 10;
            case 'expected_improvement':
                return task.labeledData.length > 5;
            case 'information_gain':
                return task.unlabeledData.length > 5;
            default:
                return false;
        }
    }
    selectBestAcquisitionStrategy(strategies, task) {
        if (strategies.length === 0)
            return null;
        // Select strategy based on task characteristics
        const unlabeledRatio = task.unlabeledData.length / (task.labeledData.length + task.unlabeledData.length);
        if (unlabeledRatio > 0.7) {
            return strategies.find(s => s.type === 'uncertainty') || strategies[0] || null;
        }
        else if (unlabeledRatio > 0.5) {
            return strategies.find(s => s.type === 'diversity') || strategies[0] || null;
        }
        else if (task.labeledData.length > 10) {
            return strategies.find(s => s.type === 'expected_improvement') || strategies[0] || null;
        }
        else {
            return strategies.find(s => s.type === 'information_gain') || strategies[0] || null;
        }
    }
    isStrategyForTask(strategy, task) {
        return this.isStrategyApplicable(strategy, task);
    }
    executeQuery(task, strategy) {
        // Simulate active learning query execution
        const selectedSamples = this.selectSamples(task, strategy);
        const acquisitionScores = this.calculateAcquisitionScores(selectedSamples, strategy);
        const expectedImprovement = this.calculateExpectedImprovement(selectedSamples, task);
        const queryCost = selectedSamples.length;
        const result = {
            id: `query_${task.id}_${Date.now()}`,
            taskId: task.id,
            selectedSamples,
            acquisitionScores,
            expectedImprovement,
            queryCost,
            metadata: this.extractQueryMetadata(selectedSamples, strategy)
        };
        return result;
    }
    evaluateTaskPerformance(task, strategy, queryResult) {
        // Simulate performance evaluation
        const baseEfficiency = task.performance.get('efficiency') || 0.5;
        const strategyMultiplier = strategy.confidence;
        const improvementMultiplier = queryResult.expectedImprovement;
        const finalEfficiency = Math.min(baseEfficiency * strategyMultiplier * improvementMultiplier, 1.0);
        const performance = {
            taskId: task.id,
            strategyType: strategy.type,
            metrics: new Map([
                ['efficiency', finalEfficiency],
                ['improvement_rate', finalEfficiency * 0.8],
                ['query_efficiency', finalEfficiency * 0.9],
                ['knowledge_gain', finalEfficiency * 0.85]
            ]),
            samplesQueried: queryResult.selectedSamples.length,
            totalBudget: task.budget,
            improvementRate: finalEfficiency * 0.8,
            efficiency: finalEfficiency
        };
        return performance;
    }
    selectSamples(task, _strategy) {
        const samples = [];
        const maxSamples = Math.min(task.budget, task.unlabeledData.length);
        // Simulate sample selection based on strategy
        for (let i = 0; i < maxSamples; i++) {
            const sample = task.unlabeledData[i];
            if (sample) {
                samples.push(sample);
            }
        }
        return samples;
    }
    calculateAcquisitionScores(samples, _strategy) {
        const scores = new Map();
        for (let i = 0; i < samples.length; i++) {
            const sampleId = `sample_${i}`;
            const score = Math.random() * 0.5 + 0.5; // Simulate acquisition score
            scores.set(sampleId, score);
        }
        return scores;
    }
    calculateExpectedImprovement(samples, task) {
        const baseImprovement = task.performance.get('efficiency') || 0.5;
        const sampleCount = samples.length;
        const maxPossible = task.budget;
        return Math.min(baseImprovement * (sampleCount / maxPossible), 1.0);
    }
    extractQueryMetadata(samples, strategy) {
        const metadata = new Map();
        metadata.set('sample_count', samples.length);
        metadata.set('strategy_type', strategy.type);
        metadata.set('acquisition_function', strategy.parameters.get('uncertainty_metric') || 'entropy');
        return metadata;
    }
    extractFeatures(experiences) {
        return experiences.flatMap(exp => this.convertExperienceToFeatures(exp));
    }
    calculateDataDiversity(experiences) {
        if (experiences.length < 2)
            return 1.0;
        const features = this.extractFeatures(experiences);
        const similarities = [];
        for (let i = 0; i < features.length; i++) {
            for (let j = i + 1; j < features.length; j++) {
                const feature1 = features[i];
                const feature2 = features[j];
                if (feature1 && feature2) {
                    const similarity = this.calculateCosineSimilarity(feature1, feature2);
                    similarities.push(similarity);
                }
            }
        }
        const averageSimilarity = similarities.reduce((sum, sim) => sum + sim, 0) / similarities.length;
        return Math.max(0, 1 - averageSimilarity);
    }
    calculateActiveLearningEfficiency(labeledData, unlabeledData) {
        const labeledAccuracy = labeledData.length > 0 ?
            labeledData.reduce((sum, exp) => sum + (exp.confidence || 0), 0) / labeledData.length : 0.5;
        const unlabeledRatio = unlabeledData.length / (labeledData.length + unlabeledData.length);
        return (labeledAccuracy * 0.7) + ((1 - unlabeledRatio) * 0.3);
    }
    calculateDataQuality(experiences) {
        if (experiences.length === 0)
            return 0;
        const qualities = experiences.map(exp => {
            if (typeof exp.data === 'string') {
                return Math.min(exp.data.length / 100, 1.0);
            }
            else if (Array.isArray(exp.data)) {
                return Math.min(exp.data.length / 10, 1.0);
            }
            else if (typeof exp.data === 'object') {
                return Math.min(Object.keys(exp.data || {}).length / 5, 1.0);
            }
            return 0.5;
        });
        return qualities.reduce((sum, quality) => sum + quality, 0) / qualities.length;
    }
    calculateFeatureComplexity(experiences) {
        if (experiences.length === 0)
            return 0;
        const complexities = experiences.map(exp => {
            if (typeof exp.data === 'string') {
                return Math.min(exp.data.length / 50, 1.0);
            }
            else if (Array.isArray(exp.data)) {
                return Math.min(exp.data.length / 5, 1.0);
            }
            else if (typeof exp.data === 'object') {
                return Math.min(Object.keys(exp.data || {}).length / 3, 1.0);
            }
            return 0.3;
        });
        return complexities.reduce((sum, complexity) => sum + complexity, 0) / complexities.length;
    }
    convertExperienceToFeatures(experience) {
        const features = [];
        features.push(experience.timestamp || 0);
        features.push(experience.confidence || 0);
        if (experience.data) {
            if (typeof experience.data === 'string') {
                features.push(experience.data.length);
                features.push(this.calculateTextComplexity(experience.data));
            }
            else if (Array.isArray(experience.data)) {
                features.push(experience.data.length);
                features.push(this.calculateArrayComplexity(experience.data));
            }
            else if (typeof experience.data === 'object') {
                features.push(Object.keys(experience.data).length);
                features.push(this.calculateObjectComplexity(experience.data));
            }
        }
        return features.map(f => ({ values: [Math.min(Math.max(f / 100, 0), 1)], dimension: 1, magnitude: Math.min(Math.max(f / 100, 0), 1) }));
    }
    calculateCosineSimilarity(vec1, vec2) {
        if (vec1.values.length !== vec2.values.length)
            return 0;
        let dotProduct = 0;
        let norm1 = 0;
        let norm2 = 0;
        for (let i = 0; i < vec1.values.length; i++) {
            dotProduct += (vec1.values[i] || 0) * (vec2.values[i] || 0);
            norm1 += (vec1.values[i] || 0) * (vec1.values[i] || 0);
            norm2 += (vec2.values[i] || 0) * (vec2.values[i] || 0);
        }
        if (norm1 === 0 || norm2 === 0)
            return 0;
        return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    }
    calculateTextComplexity(text) {
        const words = text.split(/\s+/).length;
        const sentences = text.split(/[.!?]+/).length;
        return Math.min((words / sentences) * 0.1, 1.0);
    }
    calculateArrayComplexity(array) {
        return Math.min(array.length * 0.1, 1.0);
    }
    calculateObjectComplexity(obj) {
        return Math.min(Object.keys(obj).length * 0.1, 1.0);
    }
    // private _gatherActiveLearningEvidence(tasks: ActiveLearningTask[], strategies: AcquisitionStrategy[], queryResults: QueryResult[], performances: ActiveLearningPerformance[]): string[] {
    //   const evidence: string[] = [];
    //   // Add task-based evidence
    //   if (tasks.length > 0) {
    //     evidence.push(`Processed ${tasks.length} active learning tasks`);
    //     const totalUnlabeled = tasks.reduce((sum, task) => sum + task.unlabeledData.length, 0);
    //     evidence.push(`Total unlabeled samples available: ${totalUnlabeled}`);
    //   }
    //   // Add strategy-based evidence
    //   if (strategies.length > 0) {
    //     evidence.push(`Applied ${strategies.length} acquisition strategies`);
    //     const averageConfidence = strategies.reduce((sum, strategy) => sum + strategy.confidence, 0) / strategies.length;
    //     evidence.push(`Average strategy confidence: ${(averageConfidence * 100).toFixed(1)}%`);
    //   }
    //   // Add query evidence
    //   if (queryResults.length > 0) {
    //     evidence.push(`Generated ${queryResults.length} queries`);
    //     const totalQueried = queryResults.reduce((sum, result) => sum + result.selectedSamples.length, 0);
    //     evidence.push(`Total samples queried: ${totalQueried}`);
    //   }
    //   // Add performance evidence
    //   if (performances.length > 0) {
    //     evidence.push(`Evaluated ${performances.length} active learning performances`);
    //     const averageEfficiency = performances.reduce((sum, perf) => sum + perf.efficiency, 0) / performances.length;
    //     evidence.push(`Average efficiency: ${(averageEfficiency * 100).toFixed(1)}%`);
    //   }
    //   return evidence;
    // }
    // private _generateActiveLearningAlternatives(tasks: ActiveLearningTask[], strategies: AcquisitionStrategy[]): string[] {
    //   const alternatives: string[] = [];
    //   if (tasks.some(task => (task.performance.get('efficiency') || 0) < 0.5)) {
    //     alternatives.push('Try different acquisition functions');
    //     alternatives.push('Implement ensemble-based query strategies');
    //   }
    //   if (strategies.length < 2) {
    //     alternatives.push('Explore additional acquisition strategies');
    //     alternatives.push('Combine multiple query methods');
    //   }
    //   alternatives.push('Implement adaptive query selection');
    //   alternatives.push('Use multi-objective optimization for queries');
    //   return alternatives;
    // }
    // private _identifyActiveLearningUncertaintySources(tasks: ActiveLearningTask[], strategies: AcquisitionStrategy[]): string[] {
    //   const sources: string[] = [];
    //   if (tasks.some(task => (task.performance.get('efficiency') || 0) < 0.5)) {
    //     sources.push('Low efficiency indicates uncertain active learning');
    //   }
    //   if (strategies.some(strategy => strategy.confidence < 0.5)) {
    //     sources.push('Low strategy confidence suggests uncertain query selection');
    //   }
    //   if (tasks.some(task => task.unlabeledData.length < 10)) {
    //     sources.push('Insufficient unlabeled data for reliable active learning');
    //   }
    //   return sources;
    // }
    // private _suggestActiveLearningUncertaintyMitigation(tasks: ActiveLearningTask[], strategies: AcquisitionStrategy[]): string[] {
    //   const mitigations: string[] = [];
    //   if (tasks.some(task => (task.performance.get('efficiency') || 0) < 0.5)) {
    //     mitigations.push('Collect more diverse unlabeled data');
    //     mitigations.push('Try different acquisition strategies');
    //     mitigations.push('Use ensemble of multiple acquisition strategies');
    //     mitigations.push('Implement adaptive strategy selection');
    //   }
    //   return mitigations;
    // }
    updatePerformanceMetrics(_learningTime, confidence, _strategiesApplied) {
        this.performanceMetrics.averageEfficiency =
            (this.performanceMetrics.averageEfficiency * this.performanceMetrics.totalTasks + confidence) /
                (this.performanceMetrics.totalTasks + 1);
    }
    getPerformanceMetrics() {
        return {
            ...this.performanceMetrics,
            algorithmType: 'active',
            isInitialized: true
        };
    }
    getMetrics() {
        return this.getPerformanceMetrics();
    }
    async generateQueries(_context) {
        // Generate queries for active learning
        return [];
    }
    async explore(_queries) {
        // Explore using active learning
        return { results: [] };
    }
    // private calculateAverageQueryTime(): number {
    //   // This would be calculated from actual timing data
    //   return 100; // Placeholder
    // }
    addTask(task) {
        this.tasks.set(task.id, task);
        this.logger.info('Added active learning task', { taskId: task.id, name: task.name });
    }
    addStrategy(strategy) {
        this.strategies.set(strategy.id, strategy);
        this.logger.info('Added acquisition strategy', { strategyId: strategy.id, name: strategy.name });
    }
    addQueryResult(result) {
        this.queryResults.set(result.id, result);
        this.logger.info('Added query result', { resultId: result.id, taskId: result.taskId });
    }
}
//# sourceMappingURL=ActiveLearning.js.map