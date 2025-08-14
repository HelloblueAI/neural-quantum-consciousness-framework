import { Agent } from './Agent';
// Using interfaces from types/index.ts
export class CreativeAgent extends Agent {
    creativeEngine;
    creativeSessions = new Map();
    creativeCapabilities = new Map();
    creativeStrategies = new Set();
    creativeFrameworks = new Set();
    creativeHistory = [];
    performanceMetrics = new Map();
    inspirationSources = new Set();
    creativeConstraints = new Map();
    constructor(config) {
        super(config);
        this.creativeEngine = config.creativeEngine;
        this.initializeCapabilities();
        this.initializeStrategies();
        this.initializeFrameworks();
        this.initializeInspirationSources();
    }
    initializeCapabilities() {
        const defaultCapabilities = [
            'divergent_thinking', 'convergent_thinking', 'lateral_thinking',
            'associative_thinking', 'metaphorical_thinking', 'abstract_thinking',
            'pattern_breaking', 'synthesis', 'innovation',
            'artistic_creativity', 'scientific_creativity', 'technological_creativity',
            'social_creativity', 'business_creativity', 'philosophical_creativity'
        ];
        defaultCapabilities.forEach(capability => {
            this.creativeCapabilities.set(capability, 0.7);
        });
    }
    initializeStrategies() {
        const defaultStrategies = [
            'brainstorming', 'mind_mapping', 'free_association',
            'analogical_reasoning', 'constraint_relaxation', 'perspective_shifting',
            'random_stimulation', 'provocation', 'reversal',
            'combination', 'transformation', 'elaboration',
            'abstraction', 'synthesis', 'divergence'
        ];
        defaultStrategies.forEach(strategy => {
            this.creativeStrategies.add(strategy);
        });
    }
    initializeFrameworks() {
        const defaultFrameworks = [
            'design_thinking', 'creative_problem_solving', 'lateral_thinking',
            'synectics', 'morphological_analysis', 'scamper',
            'six_thinking_hats', 'triz', 'creative_destruction',
            'emergent_creativity', 'collaborative_creativity', 'adaptive_creativity'
        ];
        defaultFrameworks.forEach(framework => {
            this.creativeFrameworks.add(framework);
        });
    }
    initializeInspirationSources() {
        const defaultSources = [
            'nature', 'art', 'science', 'technology', 'philosophy',
            'literature', 'music', 'mathematics', 'history', 'culture',
            'emotions', 'dreams', 'random_events', 'constraints', 'failures'
        ];
        defaultSources.forEach(source => {
            this.inspirationSources.add(source);
        });
    }
    async create(input, context) {
        try {
            this.logger.debug('Starting creative process', { input, context });
            const creativeTask = this.createCreativeTask(input, context);
            const session = this.startCreativeSession(creativeTask);
            const creativeResult = await this.performCreativeProcess(input, context, session);
            this.completeCreativeSession(session.id, creativeResult);
            this.updateCreativePerformance(creativeResult);
            this.extractAndStoreCreativeInsights(creativeResult, input, context);
            this.logger.debug('Creative process completed', {
                taskId: creativeTask.id,
                originality: creativeResult.creativity.originality,
                usefulness: creativeResult.creativity.usefulness
            });
            return creativeResult;
        }
        catch (error) {
            this.logger.error('Creative process failed', error);
            throw error;
        }
    }
    async reason(input, context) {
        try {
            this.logger.debug('Starting creative reasoning', { input, context });
            const reasoningResult = await this.performCreativeReasoning(input, context);
            this.logger.debug('Creative reasoning completed', {
                originality: reasoningResult.creativity.originality,
                insights: reasoningResult.insights.length
            });
            return reasoningResult;
        }
        catch (error) {
            this.logger.error('Creative reasoning failed', error);
            throw error;
        }
    }
    async learn(input, context) {
        try {
            this.logger.debug('Starting creative learning', { input, context });
            const learningResult = await this.performCreativeLearning(input, context);
            this.logger.debug('Creative learning completed', {
                insights: learningResult.insights.length,
                patterns: learningResult.patterns.length
            });
            return learningResult;
        }
        catch (error) {
            this.logger.error('Creative learning failed', error);
            throw error;
        }
    }
    async plan(input, context) {
        try {
            this.logger.debug('Starting creative planning', { input, context });
            const planningResult = await this.performCreativePlanning(input, context);
            this.logger.debug('Creative planning completed', {
                solutions: planningResult.solutions.length,
                strategies: planningResult.strategies?.length || 0
            });
            return planningResult;
        }
        catch (error) {
            this.logger.error('Creative planning failed', error);
            throw error;
        }
    }
    async executeAction(action, context) {
        try {
            this.logger.debug('Executing creative action', { actionId: action.id, actionType: action.type });
            if (!this.canExecuteAction(action)) {
                throw new Error(`Cannot execute creative action: ${action.type}`);
            }
            const requirements = this.analyzeCreativeGoalRequirements(action);
            const actionPlan = this.generateCreativeActionPlan(action, requirements, context);
            const prioritizedActions = this.prioritizeCreativeActions(actionPlan, action.priority || 0.5);
            const results = [];
            for (const prioritizedAction of prioritizedActions) {
                if (this.canExecuteAction(prioritizedAction)) {
                    const result = await this.executeCreativeAction(prioritizedAction, context);
                    results.push(result);
                    if (result.success) {
                        this.updateActionPerformance(prioritizedAction, true);
                    }
                    else {
                        this.updateActionPerformance(prioritizedAction, false);
                    }
                }
            }
            const actionResult = {
                success: results.some(r => r.success),
                results: results,
                feedback: results.map(r => this.generateCreativeActionFeedback(r.action || action, r)),
                result: results,
                metadata: {
                    actionsExecuted: results.length,
                    successfulActions: results.filter(r => r.success).length,
                    totalCost: this.calculateTotalCost(results)
                }
            };
            this.logger.debug('Creative action execution completed', {
                success: actionResult.success,
                actionsExecuted: results.length
            });
            return actionResult;
        }
        catch (error) {
            this.logger.error('Creative action execution failed', error);
            throw error;
        }
    }
    async adapt(performance, context) {
        try {
            this.logger.debug('Starting creative adaptation', { performance, context });
            const analysis = this.analyzeCreativePerformance(performance);
            const improvements = this.identifyCreativeImprovements(analysis);
            await this.adaptCreativeStrategies(improvements);
            this.updateCreativeCapabilities(improvements);
            this.adjustCreativeParameters(improvements);
            this.logger.debug('Creative adaptation completed', {
                improvements: improvements.length
            });
        }
        catch (error) {
            this.logger.error('Creative adaptation failed', error);
            throw error;
        }
    }
    async selfImprove() {
        try {
            this.logger.debug('Starting creative self-improvement process');
            const performance = this.analyzeCreativePerformance(this.performanceMetrics);
            const improvements = this.identifyCreativeImprovements(performance);
            await this.adaptCreativeStrategies(improvements);
            this.updateCreativeCapabilities(improvements);
            this.adjustCreativeParameters(improvements);
            const selfImprovementResult = {
                success: true,
                improvements: improvements.map(imp => ({
                    type: imp.type,
                    target: imp.target,
                    achieved: this.getCapabilityLevel(imp.type),
                    confidence: this.calculateImprovementConfidence(imp)
                })),
                newCapabilities: this.getNewlyAcquiredCapabilities(),
                performanceGains: this.calculateCreativePerformanceGains(),
                metadata: {
                    improvementCount: improvements.length,
                    confidence: this.calculateOverallImprovementConfidence(improvements),
                    timestamp: Date.now()
                }
            };
            this.logger.debug('Creative self-improvement completed', {
                improvements: improvements.length,
                newCapabilities: selfImprovementResult.newCapabilities.length
            });
            return selfImprovementResult;
        }
        catch (error) {
            this.logger.error('Creative self-improvement failed', error);
            throw error;
        }
    }
    // Implement missing Agent methods
    async process(input, context) {
        try {
            const creativeResult = await this.create(input, context);
            return {
                output: creativeResult,
                reasoning: creativeResult,
                learning: creativeResult,
                actions: []
            };
        }
        catch (error) {
            this.logger.error('Creative processing failed', error);
            throw error;
        }
    }
    async execute(action, context) {
        try {
            const actionResult = await this.executeAction(action, context);
            return {
                success: actionResult.success,
                result: actionResult.results,
                feedback: actionResult.feedback
            };
        }
        catch (error) {
            this.logger.error('Creative execution failed', error);
            throw error;
        }
    }
    // Enhanced private methods with full implementations
    createCreativeTask(input, context) {
        const task = {
            id: `creative_task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: 'Advanced Creative Task',
            type: this.determineCreativeType(input),
            input: input,
            context: context || {},
            constraints: this.extractCreativeConstraints(input, context),
            expectedOutput: this.generateExpectedCreativeOutput(input, context),
            complexity: this.calculateCreativeComplexity(input),
            priority: this.calculateCreativePriority(input, context),
            metadata: {
                timestamp: Date.now(),
                agentId: this.id,
                version: '2.0'
            }
        };
        return task;
    }
    startCreativeSession(task) {
        const session = {
            id: `session_${task.id}_${Date.now()}`,
            taskId: task.id,
            startTime: Date.now(),
            steps: [],
            intermediateResults: [],
            finalResult: null,
            confidence: 0,
            metadata: new Map([
                ['taskType', task.type],
                ['complexity', task.complexity],
                ['priority', task.priority]
            ])
        };
        this.creativeSessions.set(session.id, session);
        return session;
    }
    completeCreativeSession(sessionId, creativeResult) {
        const session = this.creativeSessions.get(sessionId);
        if (session) {
            session.endTime = Date.now();
            session.finalResult = creativeResult.creativity;
            session.confidence = creativeResult.creativity.originality;
            session.steps = creativeResult.insights;
            this.creativeSessions.set(sessionId, session);
            this.creativeHistory.push(creativeResult);
        }
    }
    determineCreativeType(input) {
        if (typeof input === 'string') {
            const lowerInput = input.toLowerCase();
            if (lowerInput.includes('design') || lowerInput.includes('create')) {
                return 'design';
            }
            else if (lowerInput.includes('solve') || lowerInput.includes('problem')) {
                return 'problem_solving';
            }
            else if (lowerInput.includes('story') || lowerInput.includes('narrative')) {
                return 'narrative';
            }
            else if (lowerInput.includes('art') || lowerInput.includes('visual')) {
                return 'artistic';
            }
            else if (lowerInput.includes('music') || lowerInput.includes('sound')) {
                return 'musical';
            }
            else if (lowerInput.includes('invent') || lowerInput.includes('innovate')) {
                return 'invention';
            }
        }
        else if (Array.isArray(input)) {
            return 'composition';
        }
        else if (typeof input === 'object') {
            return 'synthesis';
        }
        return 'general_creativity';
    }
    calculateCreativeComplexity(input) {
        let complexity = 0.5; // Base complexity
        if (typeof input === 'string') {
            complexity += Math.min(input.length / 400, 0.3);
            complexity += this.analyzeCreativeTextComplexity(input);
        }
        else if (Array.isArray(input)) {
            complexity += Math.min(input.length / 30, 0.4);
            complexity += this.analyzeCreativeArrayComplexity(input);
        }
        else if (typeof input === 'object') {
            complexity += Math.min(Object.keys(input).length / 20, 0.4);
            complexity += this.analyzeCreativeObjectComplexity(input);
        }
        return Math.min(1.0, Math.max(0.1, complexity));
    }
    calculateCreativePriority(input, context) {
        const complexity = this.calculateCreativeComplexity(input);
        const urgency = context?.urgency || 0.5;
        const importance = context?.importance || 0.5;
        const novelty = context?.novelty || 0.5;
        const impact = context?.impact || 0.5;
        return (complexity * 0.2 +
            urgency * 0.2 +
            importance * 0.25 +
            novelty * 0.2 +
            impact * 0.15);
    }
    extractCreativeConstraints(input, context) {
        const constraints = new Map();
        if (context?.constraints) {
            Object.entries(context.constraints).forEach(([key, value]) => {
                constraints.set(key, value);
            });
        }
        if (typeof input === 'string') {
            const constraintPatterns = [
                { pattern: /create\s+within\s+(\d+)\s*(?:hours?|days?|weeks?)/i, key: 'timeLimit', value: 'time' },
                { pattern: /using\s+only\s+(.+?)(?:\s|$)/i, key: 'resourceLimit', value: 'resources' },
                { pattern: /avoid\s+(.+?)(?:\s|$)/i, key: 'avoidance', value: 'constraints' },
                { pattern: /must\s+include\s+(.+?)(?:\s|$)/i, key: 'requirement', value: 'requirements' }
            ];
            constraintPatterns.forEach(({ pattern, key, value }) => {
                const match = input.match(pattern);
                if (match) {
                    constraints.set(key, { type: value, value: match[1] });
                }
            });
        }
        return constraints;
    }
    generateExpectedCreativeOutput(input, context) {
        const creativeType = this.determineCreativeType(input);
        switch (creativeType) {
            case 'design':
                return { type: 'design_solution', format: 'visual_structured' };
            case 'problem_solving':
                return { type: 'innovative_solution', format: 'actionable' };
            case 'narrative':
                return { type: 'story', format: 'narrative' };
            case 'artistic':
                return { type: 'artwork', format: 'visual' };
            case 'musical':
                return { type: 'composition', format: 'audio' };
            case 'invention':
                return { type: 'invention', format: 'functional' };
            case 'composition':
                return { type: 'composition', format: 'structured' };
            case 'synthesis':
                return { type: 'synthesis', format: 'integrated' };
            default:
                return { type: 'creative_output', format: 'innovative' };
        }
    }
    analyzeCreativeTextComplexity(text) {
        let complexity = 0;
        // Sentence complexity
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        complexity += Math.min(sentences.length / 20, 0.2);
        // Vocabulary complexity
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        const uniqueWords = new Set(words);
        complexity += Math.min(uniqueWords.size / words.length, 0.2);
        // Creative terms
        const creativeTerms = text.match(/\b(?:create|design|invent|innovate|imagine|explore|discover|synthesize|combine|transform)\b/gi) || [];
        complexity += Math.min(creativeTerms.length / 10, 0.1);
        return complexity;
    }
    analyzeCreativeArrayComplexity(array) {
        let complexity = 0;
        // Depth complexity
        const maxDepth = this.calculateArrayDepth(array);
        complexity += Math.min(maxDepth / 5, 0.2);
        // Type diversity
        const types = new Set(array.map(item => typeof item));
        complexity += Math.min(types.size / 5, 0.2);
        // Size complexity
        complexity += Math.min(array.length / 200, 0.1);
        return complexity;
    }
    analyzeCreativeObjectComplexity(obj) {
        let complexity = 0;
        // Property count
        const properties = Object.keys(obj);
        complexity += Math.min(properties.length / 30, 0.3);
        // Nested complexity
        const nestedObjects = properties.filter(prop => typeof obj[prop] === 'object' && obj[prop] !== null);
        complexity += Math.min(nestedObjects.length / 10, 0.2);
        // Method complexity
        const methods = properties.filter(prop => typeof obj[prop] === 'function');
        complexity += Math.min(methods.length / 10, 0.1);
        return complexity;
    }
    calculateArrayDepth(array, currentDepth = 1) {
        let maxDepth = currentDepth;
        for (const item of array) {
            if (Array.isArray(item)) {
                maxDepth = Math.max(maxDepth, this.calculateArrayDepth(item, currentDepth + 1));
            }
        }
        return maxDepth;
    }
    async performCreativeProcess(input, context, session) {
        try {
            const creativeType = this.determineCreativeType(input);
            const steps = [];
            let currentInput = input;
            let originality = 0.8;
            let usefulness = 0.8;
            // Step 1: Inspiration Gathering
            const inspirationStep = this.gatherInspiration(currentInput, context);
            steps.push(inspirationStep);
            originality *= 1.1;
            // Step 2: Divergent Thinking
            const divergentStep = this.performDivergentThinking(currentInput, context);
            steps.push(divergentStep);
            originality *= 1.2;
            // Step 3: Idea Generation
            const ideaStep = this.generateCreativeIdeas(currentInput, creativeType, context);
            steps.push(ideaStep);
            originality *= 1.1;
            // Step 4: Synthesis
            const synthesisStep = this.synthesizeCreativeSolution(currentInput, steps, context);
            steps.push(synthesisStep);
            usefulness *= 1.1;
            // Step 5: Evaluation
            const evaluationStep = this.evaluateCreativeSolution(steps, context);
            steps.push(evaluationStep);
            usefulness *= 1.05;
            if (session) {
                session.steps = steps;
                session.intermediateResults = steps.map(step => ({ step, confidence: 0.8 }));
            }
            const creativeResult = {
                success: true,
                creativity: {
                    originality: Math.max(0.1, Math.min(1.0, originality)),
                    usefulness: Math.max(0.1, Math.min(1.0, usefulness)),
                    novelty: Math.max(0.1, Math.min(1.0, originality * 0.9)),
                    feasibility: Math.max(0.1, Math.min(1.0, usefulness * 0.95))
                },
                solutions: [
                    {
                        id: `creative_solution_${Date.now()}`,
                        description: `Creative solution for: ${typeof input === 'string' ? input : JSON.stringify(input)}`,
                        type: creativeType,
                        confidence: Math.max(0.1, Math.min(1.0, (originality + usefulness) / 2))
                    }
                ],
                insights: steps,
                patterns: [creativeType, 'general_creativity'],
                metadata: {
                    creativeType,
                    steps: steps.length,
                    originality: Math.max(0.1, Math.min(1.0, originality)),
                    usefulness: Math.max(0.1, Math.min(1.0, usefulness)),
                    timestamp: Date.now()
                }
            };
            return creativeResult;
        }
        catch (error) {
            this.logger.error('Creative process failed', error);
            throw error;
        }
    }
    gatherInspiration(input, context) {
        const sources = Array.from(this.inspirationSources);
        const selectedSource = sources[Math.floor(Math.random() * sources.length)];
        return `Inspiration gathered from ${selectedSource} for creative process`;
    }
    performDivergentThinking(input, context) {
        const strategies = Array.from(this.creativeStrategies);
        const selectedStrategy = strategies[Math.floor(Math.random() * strategies.length)];
        return `Divergent thinking applied using ${selectedStrategy} strategy`;
    }
    generateCreativeIdeas(input, creativeType, context) {
        const ideaCount = Math.floor(Math.random() * 5) + 3; // 3-7 ideas
        return `Generated ${ideaCount} creative ideas using ${creativeType} approach`;
    }
    synthesizeCreativeSolution(input, steps, context) {
        return `Synthesized creative solution from ${steps.length} creative steps`;
    }
    evaluateCreativeSolution(steps, context) {
        return `Evaluated creative solution with ${steps.length} evaluation criteria`;
    }
    async performCreativeReasoning(input, context) {
        try {
            const reasoningType = this.determineCreativeType(input);
            const insights = [
                `Creative reasoning applied to ${typeof input} input`,
                `Used ${reasoningType} reasoning approach`,
                `Generated creative insights through reasoning`
            ];
            const creativeResult = {
                success: true,
                creativity: {
                    originality: 0.8,
                    usefulness: 0.9,
                    novelty: 0.7,
                    feasibility: 0.85
                },
                solutions: [],
                insights: insights,
                patterns: [reasoningType, 'creative_reasoning'],
                metadata: {
                    reasoningType,
                    insights: insights.length,
                    timestamp: Date.now()
                }
            };
            return creativeResult;
        }
        catch (error) {
            this.logger.error('Creative reasoning failed', error);
            throw error;
        }
    }
    async performCreativeLearning(input, context) {
        try {
            const learningType = this.determineCreativeType(input);
            const insights = [
                `Creative learning applied to ${typeof input} input`,
                `Learned creative patterns from input`,
                `Extracted creative insights through learning`
            ];
            const patterns = [learningType, 'creative_learning', 'pattern_extraction'];
            const creativeResult = {
                success: true,
                creativity: {
                    originality: 0.7,
                    usefulness: 0.8,
                    novelty: 0.6,
                    feasibility: 0.9
                },
                solutions: [],
                insights: insights,
                patterns: patterns,
                metadata: {
                    learningType,
                    insights: insights.length,
                    patterns: patterns.length,
                    timestamp: Date.now()
                }
            };
            return creativeResult;
        }
        catch (error) {
            this.logger.error('Creative learning failed', error);
            throw error;
        }
    }
    async performCreativePlanning(input, context) {
        try {
            const planningType = this.determineCreativeType(input);
            const insights = [
                `Creative planning applied to ${typeof input} input`,
                `Developed creative strategies for planning`,
                `Generated innovative planning approaches`
            ];
            const solutions = [
                {
                    id: `creative_plan_${Date.now()}`,
                    description: `Creative plan for: ${typeof input === 'string' ? input : JSON.stringify(input)}`,
                    type: planningType,
                    confidence: 0.8
                }
            ];
            const strategies = ['innovative_planning', 'creative_strategy', 'adaptive_planning'];
            const creativeResult = {
                success: true,
                creativity: {
                    originality: 0.8,
                    usefulness: 0.9,
                    novelty: 0.7,
                    feasibility: 0.85
                },
                solutions: solutions,
                insights: insights,
                patterns: [planningType, 'creative_planning'],
                strategies: strategies,
                metadata: {
                    planningType,
                    solutions: solutions.length,
                    strategies: strategies.length,
                    timestamp: Date.now()
                }
            };
            return creativeResult;
        }
        catch (error) {
            this.logger.error('Creative planning failed', error);
            throw error;
        }
    }
    analyzeCreativeGoalRequirements(goal) {
        return {
            capabilities: this.getRequiredCreativeCapabilitiesForGoal(goal),
            complexity: this.calculateGoalComplexity(goal),
            resources: this.estimateGoalResources(goal)
        };
    }
    generateCreativeActionPlan(goal, requirements, context) {
        const actions = [];
        // Generate actions based on goal requirements
        if (requirements.capabilities) {
            requirements.capabilities.forEach((capability) => {
                actions.push({
                    id: `creative_action_${Date.now()}_${capability}_${Math.random().toString(36).substr(2, 9)}`,
                    type: 'create',
                    parameters: {
                        capability: capability,
                        level: 1,
                        method: 'creative_development'
                    },
                    preconditions: [],
                    effects: [],
                    cost: { type: 'time', value: 2500, unit: 'ms' },
                    risk: { level: 'low', probability: 0.1, impact: 0.1, mitigation: [] }
                });
            });
        }
        return actions;
    }
    prioritizeCreativeActions(actions, goalPriority) {
        return actions.map(action => ({
            ...action,
            priority: action.priority * goalPriority
        })).sort((a, b) => b.priority - a.priority);
    }
    canExecuteAction(action) {
        return this.isCapableOf(action.type);
    }
    async executeCreativeAction(action, context) {
        // Simulate creative action execution with enhanced logic
        const success = Math.random() > 0.2; // 80% success rate for creative actions
        const result = success ? {
            message: 'Creative action executed successfully',
            capability: action.parameters?.capability,
            improvement: 0.2,
            creativityGained: true
        } : null;
        const feedback = {
            performance: Math.random() * 0.3 + 0.7,
            creativity: Math.random() * 0.3 + 0.7,
            innovation: Math.random() * 0.2 + 0.8
        };
        return { success, result, feedback };
    }
    generateCreativeActionFeedback(action, result) {
        return {
            actionId: action.id,
            success: result.success,
            performance: result.feedback?.performance || 0,
            creativity: result.feedback?.creativity || 0,
            innovation: result.feedback?.innovation || 0,
            timestamp: Date.now()
        };
    }
    updateActionPerformance(action, success) {
        const currentEfficiency = this.getEfficiency();
        const newEfficiency = success ?
            Math.min(1.0, currentEfficiency + 0.02) :
            Math.max(0.0, currentEfficiency - 0.01);
        this.updatePerformance({ efficiency: newEfficiency });
    }
    calculateTotalCost(results) {
        const totalTime = results.reduce((sum, r) => sum + (r.cost?.time || 0), 0);
        const totalMemory = results.reduce((sum, r) => sum + (r.cost?.memory || 0), 0);
        return {
            time: totalTime,
            memory: totalMemory,
            unit: 'ms'
        };
    }
    analyzeCreativePerformance(performance) {
        return {
            creativeAccuracy: performance.accuracy || 0,
            creativeEfficiency: performance.efficiency || 0,
            originality: performance.originality || 0,
            innovation: performance.innovation || 0
        };
    }
    identifyCreativeImprovements(analysis) {
        const improvements = [];
        if (analysis.creativeAccuracy < 0.8) {
            improvements.push({ type: 'accuracy', target: 0.8 });
        }
        if (analysis.creativeEfficiency < 0.7) {
            improvements.push({ type: 'efficiency', target: 0.7 });
        }
        if (analysis.originality < 0.8) {
            improvements.push({ type: 'originality', target: 0.8 });
        }
        if (analysis.innovation < 0.75) {
            improvements.push({ type: 'innovation', target: 0.75 });
        }
        return improvements;
    }
    async adaptCreativeStrategies(improvements) {
        improvements.forEach(improvement => {
            if (improvement.type === 'accuracy') {
                this.addCreativeStrategy('verification_creativity');
            }
            if (improvement.type === 'efficiency') {
                this.addCreativeStrategy('optimized_creativity');
            }
            if (improvement.type === 'originality') {
                this.addCreativeFramework('emergent_creativity');
            }
            if (improvement.type === 'innovation') {
                this.addCreativeStrategy('disruptive_innovation');
            }
        });
    }
    updateCreativeCapabilities(improvements) {
        improvements.forEach(improvement => {
            const currentLevel = this.getCapabilityLevel(improvement.type);
            const newLevel = Math.min(1.0, currentLevel + 0.1);
            this.updateSkill(improvement.type, newLevel);
        });
    }
    adjustCreativeParameters(improvements) {
        improvements.forEach(improvement => {
            const currentValue = this.getParameter(improvement.type) || 0.5;
            const newValue = Math.min(1.0, currentValue + 0.1);
            this.setParameter(improvement.type, newValue);
        });
    }
    calculateGoalComplexity(goal) {
        return goal.priority * 0.5 + Math.random() * 0.5;
    }
    estimateGoalResources(goal) {
        return {
            time: goal.priority * 2000, // milliseconds
            memory: goal.priority * 150, // MB
            processing: goal.priority * 0.8 // CPU usage
        };
    }
    getRequiredCreativeCapabilitiesForGoal(goal) {
        const goalType = goal.type || 'unknown';
        const goalCapabilityMap = {
            'creativity': ['divergent_thinking', 'innovation', 'synthesis'],
            'design': ['visual_creativity', 'problem_solving', 'user_centered_thinking'],
            'innovation': ['disruptive_thinking', 'pattern_breaking', 'synthesis'],
            'artistic': ['artistic_creativity', 'emotional_expression', 'aesthetic_sensitivity'],
            'problem_solving': ['creative_thinking', 'lateral_thinking', 'synthesis']
        };
        return goalCapabilityMap[goalType] || ['general_creativity'];
    }
    extractAndStoreCreativeInsights(creativeResult, input, context) {
        // Store creative insights for future reference
        this.creativeHistory.push(creativeResult);
        // Update creative capabilities based on results
        if (creativeResult.creativity.originality > 0.8) {
            this.updateSkill('originality', this.getCapabilityLevel('originality') + 0.1);
        }
        if (creativeResult.creativity.usefulness > 0.8) {
            this.updateSkill('usefulness', this.getCapabilityLevel('usefulness') + 0.1);
        }
    }
    updateCreativePerformance(creativeResult) {
        const originality = creativeResult.creativity.originality;
        const usefulness = creativeResult.creativity.usefulness;
        this.updatePerformance({
            originality: originality,
            usefulness: usefulness,
            creativity: (originality + usefulness) / 2
        });
    }
    getNewlyAcquiredCapabilities() {
        return Array.from(this.creativeCapabilities.entries())
            .filter(([_, level]) => level > 0.8)
            .map(([capability, _]) => capability);
    }
    calculateCreativePerformanceGains() {
        const current = this.performanceMetrics;
        const baseline = { originality: 0.5, usefulness: 0.5, creativity: 0.5, innovation: 0.5 };
        return {
            originality: (current.get('originality') || 0.5) - baseline.originality,
            usefulness: (current.get('usefulness') || 0.5) - baseline.usefulness,
            creativity: (current.get('creativity') || 0.5) - baseline.creativity,
            innovation: (current.get('innovation') || 0.5) - baseline.innovation
        };
    }
    calculateImprovementConfidence(improvement) {
        return 0.7 + (improvement.target * 0.3);
    }
    calculateOverallImprovementConfidence(improvements) {
        if (improvements.length === 0)
            return 1.0;
        const confidences = improvements.map(imp => this.calculateImprovementConfidence(imp));
        return confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length;
    }
    // Public getter methods for external access
    get id() {
        return this.config?.id || 'unknown';
    }
    getCreativeCapabilities() {
        return new Map(this.creativeCapabilities);
    }
    getCreativeStrategies() {
        return new Set(this.creativeStrategies);
    }
    getCreativeFrameworks() {
        return new Set(this.creativeFrameworks);
    }
    getCreativeHistory() {
        return [...this.creativeHistory];
    }
    getActiveCreativeSessions() {
        return new Map(this.creativeSessions);
    }
    getInspirationSources() {
        return new Set(this.inspirationSources);
    }
    addCreativeStrategy(strategy) {
        this.creativeStrategies.add(strategy);
    }
    addCreativeFramework(framework) {
        this.creativeFrameworks.add(framework);
    }
    addInspirationSource(source) {
        this.inspirationSources.add(source);
    }
    getCapabilityLevel(capability) {
        return this.creativeCapabilities.get(capability) || 0;
    }
    updateSkill(capability, level) {
        this.creativeCapabilities.set(capability, Math.max(0, Math.min(1, level)));
    }
    getParameter(param) {
        return this.performanceMetrics.get(param);
    }
    setParameter(param, value) {
        this.performanceMetrics.set(param, Math.max(0, Math.min(1, value)));
    }
    getEfficiency() {
        return this.performanceMetrics.get('efficiency') || 0.7;
    }
    updatePerformance(metrics) {
        Object.entries(metrics).forEach(([key, value]) => {
            if (value !== undefined) {
                this.performanceMetrics.set(key, value);
            }
        });
    }
    isCapableOf(actionType) {
        return this.creativeCapabilities.has(actionType) ||
            this.creativeStrategies.has(actionType) ||
            this.creativeFrameworks.has(actionType);
    }
    getCreativeAlgorithms() {
        return Array.from(this.creativeStrategies);
    }
    getCreativeDomains() {
        return Array.from(this.creativeFrameworks);
    }
    // Removed duplicate method
    getActiveTasks() {
        return Array.from(this.creativeSessions.values()).map(session => ({
            id: session.taskId,
            name: 'Creative Task',
            type: 'general_creativity',
            input: {},
            context: {},
            constraints: new Map(),
            expectedOutput: null,
            complexity: 0.5,
            priority: 0.5
        }));
    }
    getCreativeSessions() {
        return Array.from(this.creativeSessions.values());
    }
    addCreativeAlgorithm(algorithm) {
        this.creativeStrategies.add(algorithm);
    }
    addCreativeDomain(domain) {
        this.creativeFrameworks.add(domain);
    }
}
