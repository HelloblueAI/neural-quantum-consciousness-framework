import { Logger } from '@/utils/Logger';
export class AdaptiveLearning {
    tasks = new Map();
    strategies = new Map();
    adaptationEvents = new Map();
    performances = new Map();
    logger;
    performanceMetrics = {
        totalTasks: 0,
        totalStrategies: 0,
        averageEfficiency: 0,
        totalAdaptations: 0
    };
    constructor() {
        this.logger = new Logger('AdaptiveLearning');
        this.initializeAdaptationStrategies();
    }
    /**
     * Initialize the adaptive learning component
     */
    async initialize() {
        try {
            this.logger.info('Initializing Adaptive Learning...');
            // Initialize adaptation strategies
            this.initializeAdaptationStrategies();
            // Initialize performance metrics
            this.performanceMetrics = {
                totalTasks: 0,
                totalStrategies: 0,
                averageEfficiency: 0,
                totalAdaptations: 0
            };
            this.logger.info('Adaptive Learning initialized successfully');
        }
        catch (error) {
            this.logger.error('Failed to initialize Adaptive Learning', error);
            throw error;
        }
    }
    initializeAdaptationStrategies() {
        // Initialize adaptive learning strategies
        const standardStrategies = [
            {
                id: 'gradient_based_adaptation',
                name: 'Gradient-Based Adaptation',
                type: 'gradient_based',
                description: 'Adapt model parameters using gradient information',
                parameters: new Map([
                    ['learning_rate', 0.01],
                    ['momentum', 0.9],
                    ['adaptation_threshold', 0.1]
                ]),
                performance: new Map([
                    ['convergence_speed', 0.0],
                    ['adaptation_efficiency', 0.0],
                    ['stability', 0.0]
                ]),
                confidence: 0.8
            },
            {
                id: 'evolutionary_adaptation',
                name: 'Evolutionary Adaptation',
                type: 'evolutionary',
                description: 'Use evolutionary algorithms for model adaptation',
                parameters: new Map([
                    ['population_size', 50],
                    ['mutation_rate', 0.1],
                    ['selection_pressure', 0.8]
                ]),
                performance: new Map([
                    ['exploration_efficiency', 0.0],
                    ['convergence_quality', 0.0],
                    ['diversity_maintenance', 0.0]
                ]),
                confidence: 0.75
            },
            {
                id: 'reinforcement_adaptation',
                name: 'Reinforcement Adaptation',
                type: 'reinforcement',
                description: 'Use reinforcement learning for adaptation decisions',
                parameters: new Map([
                    ['exploration_rate', 0.1],
                    ['reward_function', 'performance_improvement'],
                    ['policy_type', 'epsilon_greedy']
                ]),
                performance: new Map([
                    ['decision_quality', 0.0],
                    ['exploration_efficiency', 0.0],
                    ['reward_optimization', 0.0]
                ]),
                confidence: 0.7
            },
            {
                id: 'meta_learning_adaptation',
                name: 'Meta-Learning Adaptation',
                type: 'meta_learning',
                description: 'Learn to adapt using meta-learning techniques',
                parameters: new Map([
                    ['meta_learning_rate', 0.001],
                    ['adaptation_memory', 100],
                    ['meta_update_frequency', 10]
                ]),
                performance: new Map([
                    ['meta_learning_efficiency', 0.0],
                    ['adaptation_speed', 0.0],
                    ['knowledge_transfer', 0.0]
                ]),
                confidence: 0.85
            }
        ];
        standardStrategies.forEach(strategy => {
            this.strategies.set(strategy.id, strategy);
        });
        this.logger.info('AdaptiveLearning initialized with standard adaptation strategies');
    }
    learn(experiences, _context) {
        this.logger.debug('Starting adaptive learning', { experienceCount: experiences.length });
        try {
            const startTime = Date.now();
            const tasks = this.extractAdaptiveLearningTasks(experiences);
            const strategies = this.selectAdaptationStrategies(tasks);
            const adaptationEvents = this.executeAdaptations(tasks, strategies);
            const performances = this.evaluateAdaptiveLearningPerformance(tasks, strategies, adaptationEvents);
            const insights = this.generateAdaptiveLearningInsights(tasks, strategies, adaptationEvents, performances);
            const confidence = this.calculateAdaptiveLearningConfidence(tasks, strategies, performances);
            const learningTime = Date.now() - startTime;
            this.updatePerformanceMetrics(learningTime, confidence, strategies.length);
            const result = {
                insights: insights,
                confidence: confidence,
                success: true,
                improvements: [
                    { type: 'task_extraction', magnitude: 0.8, description: `Adaptive learning tasks extracted: ${tasks.length}` },
                    { type: 'strategy_selection', magnitude: 0.7, description: `Adaptation strategies selected: ${strategies.length}` },
                    { type: 'adaptation_execution', magnitude: 0.6, description: `Adaptation events: ${adaptationEvents.length}` },
                    { type: 'performance_evaluation', magnitude: 0.9, description: `Adaptive learning performances evaluated: ${performances.length}` }
                ],
                newKnowledge: [
                    {
                        id: `adaptive_learning_${Date.now()}`,
                        type: 'meta-knowledge',
                        content: {
                            representation: {
                                format: 'symbolic',
                                structure: { insights, steps: [`Adaptive learning completed with confidence: ${confidence.toFixed(3)}`] },
                                encoding: { format: 'json', parameters: {} }
                            },
                            semantics: {
                                meaning: 'Adaptive learning insights and patterns',
                                context: { domain: 'adaptive-learning', scope: 'global', constraints: {} },
                                interpretation: { meaning: 'Learning to adapt strategies', confidence: confidence, alternatives: [] }
                            },
                            relationships: []
                        },
                        confidence: confidence,
                        source: 'adaptive-learning',
                        timestamp: Date.now(),
                        validity: { start: Date.now(), conditions: {} }
                    }
                ],
                adaptationMetrics: {
                    performance: confidence,
                    stability: 0.8,
                    flexibility: 0.7,
                    efficiency: 0.8
                },
            };
            this.logger.info('Adaptive learning completed', {
                experienceCount: experiences.length,
                confidence: result.confidence,
                tasksProcessed: tasks.length,
                learningTime
            });
            return result;
        }
        catch (error) {
            this.logger.error('Error in adaptive learning', error);
            throw new Error(`Adaptive learning failed: ${error}`);
        }
    }
    extractAdaptiveLearningTasks(experiences) {
        const tasks = [];
        // Group experiences by type for different adaptive learning tasks
        const taskGroups = new Map();
        for (const experience of experiences) {
            const taskType = this.determineAdaptiveTaskType(experience);
            if (!taskGroups.has(taskType)) {
                taskGroups.set(taskType, []);
            }
            taskGroups.get(taskType).push(experience);
        }
        // Create adaptive learning tasks
        for (const [taskType, taskExperiences] of taskGroups) {
            if (taskExperiences.length > 0) {
                const task = {
                    id: `adaptive_${taskType}_${Date.now()}`,
                    name: `${taskType} Adaptive Learning Task`,
                    type: taskType,
                    description: `Adaptive learning for ${taskType}`,
                    currentModel: this.initializeCurrentModel(taskExperiences),
                    targetModel: this.initializeTargetModel(taskExperiences),
                    adaptationStrategy: this.selectAdaptationStrategy(taskExperiences),
                    adaptationRate: this.calculateAdaptationRate(taskExperiences),
                    performance: this.calculateAdaptiveLearningPerformance(taskExperiences),
                    metadata: this.extractAdaptiveLearningMetadata(taskExperiences)
                };
                tasks.push(task);
                this.tasks.set(task.id, task);
            }
        }
        this.performanceMetrics.totalTasks += tasks.length;
        return tasks;
    }
    selectAdaptationStrategies(tasks) {
        const selectedStrategies = [];
        for (const task of tasks) {
            const applicableStrategies = this.findApplicableStrategies(task);
            const bestStrategy = this.selectBestAdaptationStrategy(applicableStrategies, task);
            if (bestStrategy) {
                selectedStrategies.push(bestStrategy);
            }
        }
        this.performanceMetrics.totalStrategies += selectedStrategies.length;
        return selectedStrategies;
    }
    executeAdaptations(tasks, strategies) {
        const events = [];
        for (const task of tasks) {
            const strategy = strategies.find(s => this.isStrategyForTask(s, task));
            if (strategy) {
                const event = this.executeTaskAdaptation(task, strategy);
                if (event) {
                    events.push(event);
                    this.adaptationEvents.set(event.id, event);
                }
            }
        }
        this.performanceMetrics.totalAdaptations += events.length;
        return events;
    }
    evaluateAdaptiveLearningPerformance(tasks, strategies, adaptationEvents) {
        const performances = [];
        for (const task of tasks) {
            const strategy = strategies.find(s => this.isStrategyForTask(s, task));
            const taskEvents = adaptationEvents.filter(e => e.taskId === task.id);
            if (strategy) {
                const performance = this.evaluateTaskPerformance(task, strategy, taskEvents);
                if (performance) {
                    performances.push(performance);
                    this.performances.set(performance.taskId, performance);
                }
            }
        }
        return performances;
    }
    generateAdaptiveLearningInsights(tasks, strategies, adaptationEvents, performances) {
        const insights = [];
        // Task-based insights
        if (tasks.length > 0) {
            const taskTypes = [...new Set(tasks.map(task => task.type))];
            insights.push(`Created ${tasks.length} adaptive learning tasks: ${taskTypes.join(', ')}`);
        }
        // Strategy-based insights
        if (strategies.length > 0) {
            const strategyTypes = [...new Set(strategies.map(strategy => strategy.type))];
            insights.push(`Applied ${strategies.length} adaptation strategies: ${strategyTypes.join(', ')}`);
        }
        // Adaptation event insights
        if (adaptationEvents.length > 0) {
            const eventTypes = [...new Set(adaptationEvents.map(e => e.eventType))];
            insights.push(`Generated ${adaptationEvents.length} adaptation events: ${eventTypes.join(', ')}`);
        }
        // Performance insights
        if (performances.length > 0) {
            const averageEfficiency = performances.reduce((sum, perf) => sum + perf.efficiency, 0) / performances.length;
            insights.push(`Average adaptive learning efficiency: ${(averageEfficiency * 100).toFixed(1)}%`);
        }
        return insights;
    }
    calculateAdaptiveLearningConfidence(tasks, strategies, performances) {
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
    calculateAdaptiveLearningUncertainty(_tasks, _strategies, _performances) {
        if (_tasks.length === 0)
            return 0.5;
        const taskUncertainty = _tasks.some(task => (task.performance.get('efficiency') || 0) < 0.5) ? 0.3 : 0.1;
        const strategyUncertainty = _strategies.some(strategy => strategy.confidence < 0.5) ? 0.3 : 0.1;
        const performanceUncertainty = _performances.some(perf => perf.efficiency < 0.5) ? 0.3 : 0.1;
        return Math.min(taskUncertainty + strategyUncertainty + performanceUncertainty, 1.0);
    }
    determineAdaptiveTaskType(experience) {
        // Determine adaptive learning task type from experience
        if (experience.metadata?.['taskType']) {
            return experience.metadata['taskType'] || 'adaptive_classification';
        }
        // Infer task type from data characteristics
        if (typeof experience.data === 'string') {
            return 'adaptive_classification';
        }
        else if (typeof experience.data === 'number') {
            return 'dynamic_regression';
        }
        else if (Array.isArray(experience.data)) {
            return 'evolving_clustering';
        }
        else if (experience.action) {
            return 'self_modifying';
        }
        return 'adaptive_classification'; // Default
    }
    initializeCurrentModel(experiences) {
        const model = new Map();
        model.set('type', 'current_model');
        model.set('parameters', this.extractModelParameters(experiences));
        model.set('performance', this.calculateModelPerformance(experiences));
        model.set('adaptation_history', []);
        return model;
    }
    initializeTargetModel(experiences) {
        const model = new Map();
        model.set('type', 'target_model');
        model.set('parameters', this.extractModelParameters(experiences));
        model.set('performance', this.calculateModelPerformance(experiences));
        model.set('target_metrics', this.calculateTargetMetrics(experiences));
        return model;
    }
    selectAdaptationStrategy(experiences) {
        // Select adaptation strategy based on data characteristics
        const dataComplexity = this.calculateDataComplexity(experiences);
        const performance = this.calculateModelPerformance(experiences);
        const averagePerformance = performance.get('accuracy') || 0.5;
        if (dataComplexity > 0.7) {
            return 'evolutionary';
        }
        else if (averagePerformance < 0.5) {
            return 'reinforcement';
        }
        else if (experiences.length > 100) {
            return 'meta_learning';
        }
        else {
            return 'gradient_based';
        }
    }
    calculateAdaptationRate(experiences) {
        // Calculate adaptation rate based on performance and data characteristics
        const performance = this.calculateModelPerformance(experiences);
        const averagePerformance = performance.get('accuracy') || 0.5;
        const dataComplexity = this.calculateDataComplexity(experiences);
        const baseRate = 0.01;
        const performanceFactor = 1 - averagePerformance; // Higher adaptation for lower performance
        const complexityFactor = dataComplexity; // Higher adaptation for complex data
        return Math.max(0.001, Math.min(0.1, baseRate * (1 + performanceFactor + complexityFactor)));
    }
    calculateAdaptiveLearningPerformance(experiences) {
        const performance = new Map();
        const accuracies = experiences.map(exp => exp.confidence || 0);
        const averageAccuracy = accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length;
        const adaptationPotential = this.calculateAdaptationPotential(experiences);
        const efficiency = this.calculateAdaptiveEfficiency(experiences);
        performance.set('accuracy', averageAccuracy);
        performance.set('adaptation_potential', adaptationPotential);
        performance.set('efficiency', efficiency);
        return performance;
    }
    extractAdaptiveLearningMetadata(experiences) {
        const metadata = new Map();
        metadata.set('sample_count', experiences.length);
        metadata.set('data_complexity', this.calculateDataComplexity(experiences));
        metadata.set('adaptation_history', this.extractAdaptationHistory(experiences));
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
        // Check if strategy is applicable to adaptive learning task
        const performance = task.performance.get('accuracy') || 0.5;
        const adaptationPotential = task.performance.get('adaptation_potential') || 0.5;
        switch (strategy.type) {
            case 'gradient_based':
                return performance > 0.3;
            case 'evolutionary':
                return adaptationPotential > 0.5;
            case 'reinforcement':
                return performance < 0.7;
            case 'meta_learning':
                return task.currentModel.get('adaptation_history')?.length > 5;
            default:
                return false;
        }
    }
    selectBestAdaptationStrategy(strategies, task) {
        if (strategies.length === 0)
            return null;
        // Select strategy based on task characteristics
        const performance = task.performance.get('accuracy') || 0.5;
        const adaptationPotential = task.performance.get('adaptation_potential') || 0.5;
        if (adaptationPotential > 0.7) {
            return strategies.find(s => s.type === 'evolutionary') || strategies[0] || null;
        }
        else if (performance < 0.5) {
            return strategies.find(s => s.type === 'reinforcement') || strategies[0] || null;
        }
        else if (performance > 0.8) {
            return strategies.find(s => s.type === 'meta_learning') || strategies[0] || null;
        }
        else {
            return strategies.find(s => s.type === 'gradient_based') || strategies[0] || null;
        }
    }
    isStrategyForTask(strategy, task) {
        return this.isStrategyApplicable(strategy, task);
    }
    executeTaskAdaptation(task, strategy) {
        // Simulate adaptation execution
        const adaptationProbability = Math.random();
        const adaptationThreshold = 0.6;
        if (adaptationProbability > adaptationThreshold) {
            const eventTypes = ['parameter_update', 'architecture_change', 'strategy_switch', 'performance_improvement'];
            const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)] || 'parameter_update';
            const event = {
                id: `adaptation_${task.id}_${Date.now()}`,
                taskId: task.id,
                eventType,
                severity: Math.random(),
                confidence: Math.random() * 0.5 + 0.5,
                adaptationRequired: eventType !== 'performance_improvement',
                metadata: this.extractAdaptationMetadata(task, strategy)
            };
            return event;
        }
        return null;
    }
    evaluateTaskPerformance(task, strategy, taskEvents) {
        // Simulate performance evaluation
        const baseEfficiency = task.performance.get('efficiency') || 0.5;
        const strategyMultiplier = strategy.confidence;
        const adaptationImpact = taskEvents.length > 0 ? 1.1 : 0.9;
        const finalEfficiency = Math.min(baseEfficiency * strategyMultiplier * adaptationImpact, 1.0);
        const performance = {
            taskId: task.id,
            strategyType: strategy.type,
            metrics: new Map([
                ['efficiency', finalEfficiency],
                ['adaptation_speed', finalEfficiency * 0.8],
                ['improvement_rate', finalEfficiency * 0.9],
                ['stability', finalEfficiency * 0.85]
            ]),
            adaptationsCount: taskEvents.length,
            improvementRate: finalEfficiency * 0.9,
            stability: finalEfficiency * 0.85,
            efficiency: finalEfficiency
        };
        return performance;
    }
    extractModelParameters(experiences) {
        const parameters = new Map();
        parameters.set('input_size', experiences.length);
        parameters.set('feature_count', this.calculateFeatureCount(experiences));
        parameters.set('complexity', this.calculateModelComplexity(experiences));
        return parameters;
    }
    calculateModelPerformance(experiences) {
        const performance = new Map();
        const accuracies = experiences.map(exp => exp.confidence || 0);
        const averageAccuracy = accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length;
        performance.set('accuracy', averageAccuracy);
        performance.set('stability', this.calculateStability(accuracies));
        return performance;
    }
    calculateTargetMetrics(experiences) {
        const metrics = new Map();
        const basePerformance = this.calculateModelPerformance(experiences);
        const targetAccuracy = (basePerformance.get('accuracy') || 0.5) * 1.2; // 20% improvement target
        const targetStability = (basePerformance.get('stability') || 0.5) * 1.1; // 10% improvement target
        metrics.set('target_accuracy', Math.min(targetAccuracy, 1.0));
        metrics.set('target_stability', Math.min(targetStability, 1.0));
        return metrics;
    }
    calculateDataComplexity(experiences) {
        if (experiences.length === 0)
            return 0;
        const complexities = experiences.map(exp => {
            if (typeof exp.data === 'string') {
                return Math.min(exp.data.length / 100, 1.0);
            }
            else if (Array.isArray(exp.data)) {
                return Math.min(exp.data.length / 10, 1.0);
            }
            else if (typeof exp.data === 'object') {
                return Math.min(Object.keys(exp.data || {}).length / 5, 1.0);
            }
            return 0.3;
        });
        return complexities.reduce((sum, complexity) => sum + complexity, 0) / complexities.length;
    }
    calculateAdaptationPotential(experiences) {
        if (experiences.length === 0)
            return 0;
        const performance = this.calculateModelPerformance(experiences);
        const currentAccuracy = performance.get('accuracy') || 0.5;
        const dataComplexity = this.calculateDataComplexity(experiences);
        // Higher potential for adaptation when performance is low or data is complex
        const performancePotential = 1 - currentAccuracy;
        const complexityPotential = dataComplexity;
        return Math.min((performancePotential * 0.6) + (complexityPotential * 0.4), 1.0);
    }
    calculateAdaptiveEfficiency(experiences) {
        if (experiences.length === 0)
            return 0.5;
        const accuracies = experiences.map(exp => exp.confidence || 0);
        const averageAccuracy = accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length;
        const adaptationPotential = this.calculateAdaptationPotential(experiences);
        return (averageAccuracy * 0.7) + (adaptationPotential * 0.3);
    }
    extractAdaptationHistory(experiences) {
        // Simulate adaptation history
        const history = [];
        const historyLength = Math.min(experiences.length, 10);
        for (let i = 0; i < historyLength; i++) {
            history.push({
                timestamp: Date.now() - (historyLength - i) * 1000,
                adaptationType: ['parameter_update', 'architecture_change', 'strategy_switch'][Math.floor(Math.random() * 3)],
                performance: Math.random() * 0.3 + 0.5
            });
        }
        return history;
    }
    calculateFeatureCount(experiences) {
        if (experiences.length === 0)
            return 0;
        const firstExperience = experiences[0];
        if (!firstExperience)
            return 1;
        if (typeof firstExperience.data === 'string') {
            return firstExperience.data.length;
        }
        else if (Array.isArray(firstExperience.data)) {
            return firstExperience.data.length;
        }
        else if (typeof firstExperience.data === 'object') {
            return Object.keys(firstExperience.data || {}).length;
        }
        return 1;
    }
    calculateModelComplexity(experiences) {
        const featureCount = this.calculateFeatureCount(experiences);
        const experienceCount = experiences.length;
        return Math.min((featureCount * experienceCount) / 1000, 1.0);
    }
    calculateStability(accuracies) {
        if (accuracies.length < 2)
            return 1.0;
        const mean = accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length;
        const variance = accuracies.reduce((sum, acc) => sum + Math.pow(acc - mean, 2), 0) / accuracies.length;
        return Math.max(0, 1 - Math.sqrt(variance));
    }
    extractAdaptationMetadata(task, strategy) {
        const metadata = new Map();
        metadata.set('task_type', task.type);
        metadata.set('strategy_type', strategy.type);
        metadata.set('adaptation_rate', task.adaptationRate);
        metadata.set('adaptation_time', Date.now());
        return metadata;
    }
    gatherAdaptiveLearningEvidence(_tasks, _strategies, _adaptationEvents, _performances) {
        const evidence = [];
        // Add task-based evidence
        if (_tasks.length > 0) {
            evidence.push(`Processed ${_tasks.length} adaptive learning tasks`);
            const averageAdaptationRate = _tasks.reduce((sum, task) => sum + task.adaptationRate, 0) / _tasks.length;
            evidence.push(`Average adaptation rate: ${(averageAdaptationRate * 100).toFixed(1)}%`);
        }
        // Add strategy-based evidence
        if (_strategies.length > 0) {
            evidence.push(`Applied ${_strategies.length} adaptation strategies`);
            const averageConfidence = _strategies.reduce((sum, strategy) => sum + strategy.confidence, 0) / _strategies.length;
            evidence.push(`Average strategy confidence: ${(averageConfidence * 100).toFixed(1)}%`);
        }
        // Add adaptation event evidence
        if (_adaptationEvents.length > 0) {
            evidence.push(`Generated ${_adaptationEvents.length} adaptation events`);
            const adaptationsRequired = _adaptationEvents.filter(e => e.adaptationRequired).length;
            evidence.push(`Adaptations required: ${adaptationsRequired}`);
        }
        // Add performance evidence
        if (_performances.length > 0) {
            evidence.push(`Evaluated ${_performances.length} adaptive learning performances`);
            const averageEfficiency = _performances.reduce((sum, perf) => sum + perf.efficiency, 0) / _performances.length;
            evidence.push(`Average efficiency: ${(averageEfficiency * 100).toFixed(1)}%`);
        }
        return evidence;
    }
    generateAdaptiveLearningAlternatives(_tasks, _strategies) {
        const alternatives = [];
        if (_tasks.some(task => (task.performance.get('efficiency') || 0) < 0.5)) {
            alternatives.push('Try different adaptation algorithms');
            alternatives.push('Implement ensemble adaptation');
        }
        if (_strategies.length < 2) {
            alternatives.push('Explore additional adaptation strategies');
            alternatives.push('Combine multiple adaptation approaches');
        }
        alternatives.push('Implement adaptive adaptation rates');
        alternatives.push('Use multi-objective adaptation optimization');
        return alternatives;
    }
    identifyAdaptiveLearningUncertaintySources(_tasks, _strategies) {
        const sources = [];
        if (_tasks.some(task => (task.performance.get('efficiency') || 0) < 0.5)) {
            sources.push('Low efficiency indicates uncertain adaptive learning');
        }
        if (_strategies.some(strategy => strategy.confidence < 0.5)) {
            sources.push('Low strategy confidence suggests uncertain adaptation');
        }
        if (_tasks.some(task => task.adaptationRate < 0.01)) {
            sources.push('Very low adaptation rates may indicate insufficient learning');
        }
        return sources;
    }
    suggestAdaptiveLearningUncertaintyMitigation(_tasks, _strategies) {
        const mitigations = [];
        if (_tasks.some(task => (task.performance.get('efficiency') || 0) < 0.5)) {
            mitigations.push('Increase adaptation rates for better learning');
            mitigations.push('Try different adaptation strategies');
        }
        if (_strategies.some(strategy => strategy.confidence < 0.5)) {
            mitigations.push('Use ensemble of multiple adaptation strategies');
            mitigations.push('Implement adaptive strategy selection');
        }
        return mitigations;
    }
    updatePerformanceMetrics(_learningTime, confidence, _strategiesApplied) {
        this.performanceMetrics.averageEfficiency =
            (this.performanceMetrics.averageEfficiency * this.performanceMetrics.totalTasks + confidence) /
                (this.performanceMetrics.totalTasks + 1);
    }
    getPerformanceMetrics() {
        return {
            ...this.performanceMetrics,
            algorithmType: 'adaptive',
            isInitialized: true
        };
    }
    getMetrics() {
        return this.getPerformanceMetrics();
    }
    calculateAverageAdaptationTime() {
        // This would be calculated from actual timing data
        return 125; // Placeholder
    }
    addTask(task) {
        this.tasks.set(task.id, task);
        this.logger.info('Added adaptive learning task', { taskId: task.id, name: task.name });
    }
    addStrategy(strategy) {
        this.strategies.set(strategy.id, strategy);
        this.logger.info('Added adaptation strategy', { strategyId: strategy.id, name: strategy.name });
    }
    addAdaptationEvent(event) {
        this.adaptationEvents.set(event.id, event);
        this.logger.info('Added adaptation event', { eventId: event.id, taskId: event.taskId, eventType: event.eventType });
    }
}
//# sourceMappingURL=AdaptiveLearning.js.map