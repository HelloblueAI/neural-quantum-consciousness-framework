import { Agent } from './Agent';
import { Logger } from '../utils/Logger';
export class CreativeAgent extends Agent {
    // private _reasoningEngine: ReasoningEngine;
    learningEngine;
    creativeCapabilities;
    artisticDomains;
    innovationStrategies;
    activeTasks = new Map();
    creativeSessions = new Map();
    creativeIdeas = new Map();
    creativeLogger;
    constructor(config) {
        super(config);
        // this._reasoningEngine = config.reasoningEngine;
        this.learningEngine = config.learningEngine;
        this.creativeCapabilities = config.creativeCapabilities;
        this.artisticDomains = config.artisticDomains;
        this.innovationStrategies = config.innovationStrategies;
        this.creativeLogger = new Logger(`CreativeAgent:${config.name}`);
        this.creativeLogger.info('CreativeAgent initialized', {
            agentId: config.id,
            capabilities: this.creativeCapabilities,
            domains: this.artisticDomains,
            strategies: this.innovationStrategies
        });
    }
    async process(input, context) {
        this.creativeLogger.debug('Processing creative input', { input, context });
        try {
            // Create creative task
            const task = this.createCreativeTask(input, context);
            this.activeTasks.set(task.id, task);
            // Start creative session
            const session = this.startCreativeSession(task);
            this.creativeSessions.set(session.id, session);
            // Generate creative ideas
            const ideas = await this.generateCreativeIdeas(input, context);
            // Reason about creative possibilities
            const reasoningResult = await this.reason(ideas, context);
            // Learn from creative process
            const learningResult = await this.learn([this.createCreativeExperience(input, ideas)], context);
            // Plan creative actions
            const goals = this.extractCreativeGoals(ideas);
            const actions = await this.plan(goals, context);
            // Complete session
            this.completeCreativeSession(session.id, ideas);
            // Update performance
            this.updateCreativePerformance(ideas);
            const output = {
                result: ideas,
                confidence: this.calculateCreativeConfidence(ideas),
                reasoning: reasoningResult,
                learning: learningResult,
                actions: actions
            };
            this.creativeLogger.info('Creative processing completed', {
                taskId: task.id,
                ideaCount: ideas.length,
                actionCount: actions.length
            });
            return {
                output: output,
                reasoning: reasoningResult,
                learning: learningResult,
                actions: actions
            };
        }
        catch (error) {
            this.creativeLogger.error('Error in creative processing');
            throw new Error(`CreativeAgent processing failed: ${error}`);
        }
    }
    async reason(input, context) {
        this.creativeLogger.debug('Starting creative reasoning', { input, context });
        try {
            const startTime = Date.now();
            // Analyze creative ideas and determine reasoning approach
            const reasoningApproach = this.determineCreativeReasoningApproach(input, context);
            // Perform creative reasoning
            const reasoningResult = {
                conclusions: this.generateCreativeConclusions(input),
                confidence: this.calculateCreativeReasoningConfidence(input),
                reasoning: {
                    steps: this.generateCreativeReasoningSteps(input).map((step, index) => ({
                        id: `step_${index}`,
                        type: 'intuition',
                        premise: {
                            content: step,
                            truthValue: 1,
                            certainty: 0.8,
                            evidence: []
                        },
                        conclusion: {
                            content: step,
                            truthValue: 1,
                            certainty: 0.8,
                            evidence: []
                        },
                        confidence: 0.8,
                        reasoning: step
                    })),
                    logic: 'classical',
                    evidence: this.gatherCreativeReasoningEvidence(input).map((evidence, index) => ({
                        source: `creative_evidence_${index}`,
                        strength: 0.8,
                        reliability: 0.9,
                        timestamp: Date.now(),
                        description: evidence
                    })),
                    assumptions: []
                },
                alternatives: this.generateCreativeReasoningAlternatives(input).map((alternative, index) => ({
                    id: `alternative_${index}`,
                    description: alternative,
                    probability: 0.7,
                    feasibility: 0.8,
                    consequences: [{
                            type: 'creative',
                            description: alternative,
                            probability: 0.7,
                            impact: 0.6
                        }],
                    reasoning: alternative
                })),
                uncertainty: {
                    type: 'probabilistic',
                    parameters: {
                        level: this.calculateCreativeReasoningUncertainty(input),
                        sources: this.identifyCreativeReasoningUncertaintySources(input),
                        mitigation: this.suggestCreativeReasoningUncertaintyMitigation(input)
                    },
                    confidence: 0.8
                },
                metadata: {
                    reasoningTime: Date.now() - startTime,
                    algorithm: 'creative_reasoning',
                    version: '1.0.0'
                }
            };
            this.creativeLogger.info('Creative reasoning completed', {
                approach: reasoningApproach,
                confidence: reasoningResult.confidence,
                reasoningTime: reasoningResult.metadata?.reasoningTime
            });
            return reasoningResult;
        }
        catch (error) {
            this.creativeLogger.error('Error in creative reasoning');
            throw new Error(`Creative reasoning failed: ${error}`);
        }
    }
    async learn(experiences, context) {
        this.creativeLogger.debug('Starting creative learning', { experienceCount: experiences.length });
        try {
            const startTime = Date.now();
            // Add experiences to memory
            experiences.forEach(exp => this.addExperience(exp));
            // Determine creative learning approach
            const learningApproach = this.determineCreativeLearningApproach(experiences, context);
            // Perform creative learning using the learning engine
            const learningResult = await this.learningEngine.learn(experiences[0] || {});
            const learningTime = Date.now() - startTime;
            // Log creative learning activity
            this.logActivity('creative_learning', {
                experienceCount: experiences.length,
                approach: learningApproach,
                confidence: learningResult.confidence,
                learningTime
            });
            this.creativeLogger.info('Creative learning completed', {
                approach: learningApproach,
                confidence: learningResult.confidence,
                learningTime
            });
            return learningResult;
        }
        catch (error) {
            this.creativeLogger.error('Error in creative learning');
            throw new Error(`Creative learning failed: ${error}`);
        }
    }
    async plan(goals, context) {
        this.creativeLogger.debug('Starting creative planning', { goalCount: goals.length });
        try {
            const actions = [];
            for (const goal of goals) {
                // Analyze creative goal requirements
                const requirements = this.analyzeCreativeGoalRequirements(goal);
                // Generate creative action plan
                const goalActions = this.generateCreativeActionPlan(goal, requirements, context);
                // Prioritize creative actions
                const prioritizedActions = this.prioritizeCreativeActions(goalActions, goal.priority);
                actions.push(...prioritizedActions);
            }
            this.creativeLogger.info('Creative planning completed', {
                goalCount: goals.length,
                actionCount: actions.length
            });
            return actions;
        }
        catch (error) {
            this.creativeLogger.error('Error in creative planning');
            throw new Error(`Creative planning failed: ${error}`);
        }
    }
    async execute(action, context) {
        this.creativeLogger.debug('Executing creative action', { actionId: action.id, actionType: action.type });
        try {
            // Validate action
            if (!this.canExecuteCreativeAction(action)) {
                throw new Error(`Cannot execute creative action: ${action.type}`);
            }
            // Execute creative action
            const result = await this.executeCreativeAction(action, context);
            // Generate feedback
            // const feedback = this.generateCreativeActionFeedback(action, result);
            // Update performance
            this.updateCreativeActionPerformance(action, result.success);
            this.creativeLogger.info('Creative action executed', {
                actionId: action.id,
                success: result.success,
                resultType: typeof result.result
            });
            return result;
        }
        catch (error) {
            this.creativeLogger.error('Error executing creative action', error);
            return {
                success: false,
                result: null,
                feedback: { error: error.message }
            };
        }
    }
    async adapt(performance, _context) {
        this.creativeLogger.debug('Adapting creative to performance', { performance });
        try {
            // Analyze creative performance
            const performanceAnalysis = this.analyzeCreativePerformance(performance);
            // Identify creative improvements
            const improvements = this.identifyCreativeImprovements(performanceAnalysis);
            // Adapt creative strategies
            await this.adaptCreativeStrategies(improvements);
            // Update creative capabilities
            this.updateCreativeCapabilities(improvements);
            // Adjust creative parameters
            this.adjustCreativeParameters(improvements);
            this.creativeLogger.info('Creative adaptation completed', {
                improvements: improvements.length
            });
        }
        catch (error) {
            this.creativeLogger.error('Error in creative adaptation', error);
            throw new Error(`Creative adaptation failed: ${error}`);
        }
    }
    async generateCreativeIdeas(input, context) {
        this.creativeLogger.debug('Generating creative ideas', { input, context });
        try {
            const ideas = [];
            const ideaCount = Math.floor(Math.random() * 5) + 3; // Generate 3-7 ideas
            for (let i = 0; i < ideaCount; i++) {
                const idea = {
                    id: `idea_${Date.now()}_${i}`,
                    title: this.generateIdeaTitle(input),
                    description: this.generateIdeaDescription(input),
                    category: this.determineIdeaCategory(input),
                    originality: Math.random() * 0.5 + 0.5, // 0.5-1.0
                    feasibility: Math.random() * 0.4 + 0.6, // 0.6-1.0
                    impact: Math.random() * 0.3 + 0.7, // 0.7-1.0
                    inspiration: this.generateInspiration(input),
                    metadata: new Map([
                        ['generation_time', Date.now()],
                        ['input_type', typeof input],
                        ['context_keys', Object.keys(context || {})]
                    ])
                };
                ideas.push(idea);
                this.creativeIdeas.set(idea.id, idea);
            }
            this.creativeLogger.info('Creative ideas generated', {
                ideaCount: ideas.length,
                averageOriginality: ideas.reduce((sum, idea) => sum + idea.originality, 0) / ideas.length
            });
            return ideas;
        }
        catch (error) {
            this.creativeLogger.error('Error generating creative ideas', error);
            throw new Error(`Creative idea generation failed: ${error}`);
        }
    }
    getCreativeCapabilities() {
        return [...this.creativeCapabilities];
    }
    getArtisticDomains() {
        return [...this.artisticDomains];
    }
    getInnovationStrategies() {
        return [...this.innovationStrategies];
    }
    getActiveTasks() {
        return Array.from(this.activeTasks.values());
    }
    getCreativeSessions() {
        return Array.from(this.creativeSessions.values());
    }
    getCreativeIdeas() {
        return Array.from(this.creativeIdeas.values());
    }
    addCreativeCapability(capability) {
        if (!this.creativeCapabilities.includes(capability)) {
            this.creativeCapabilities.push(capability);
            this.creativeLogger.info('Creative capability added', { capability });
        }
    }
    addArtisticDomain(domain) {
        if (!this.artisticDomains.includes(domain)) {
            this.artisticDomains.push(domain);
            this.creativeLogger.info('Artistic domain added', { domain });
        }
    }
    addInnovationStrategy(strategy) {
        if (!this.innovationStrategies.includes(strategy)) {
            this.innovationStrategies.push(strategy);
            this.creativeLogger.info('Innovation strategy added', { strategy });
        }
    }
    createCreativeTask(input, context) {
        const task = {
            id: `creative_task_${Date.now()}`,
            name: 'Creative Task',
            type: this.determineCreativeTaskType(input),
            input,
            context: context || {},
            constraints: new Map(),
            expectedOutput: null,
            complexity: this.calculateCreativeTaskComplexity(input),
            priority: this.calculateCreativeTaskPriority(input, context)
        };
        return task;
    }
    startCreativeSession(task) {
        const session = {
            id: `session_${task.id}_${Date.now()}`,
            taskId: task.id,
            startTime: Date.now(),
            inspiration: this.generateSessionInspiration(task),
            iterations: 0,
            finalResult: null,
            originality: 0,
            quality: 0,
            metadata: new Map()
        };
        return session;
    }
    completeCreativeSession(sessionId, ideas) {
        const session = this.creativeSessions.get(sessionId);
        if (session && ideas.length > 0) {
            session.endTime = Date.now();
            session.finalResult = ideas;
            session.originality = ideas.reduce((sum, idea) => sum + idea.originality, 0) / ideas.length;
            session.quality = ideas.reduce((sum, idea) => sum + idea.feasibility, 0) / ideas.length;
            session.iterations = Math.floor(Math.random() * 10) + 5; // 5-14 iterations
            this.creativeSessions.set(sessionId, session);
        }
    }
    determineCreativeReasoningApproach(input, _context) {
        if (Array.isArray(input) && input.length > 0) {
            return 'idea_analysis';
        }
        else if (typeof input === 'string' && input.includes('art')) {
            return 'artistic_analysis';
        }
        else if (typeof input === 'object') {
            return 'innovation_analysis';
        }
        return 'general_creative_analysis';
    }
    determineCreativeTaskType(input) {
        if (typeof input === 'string') {
            if (input.includes('art') || input.includes('paint')) {
                return 'artistic';
            }
            else if (input.includes('science') || input.includes('research')) {
                return 'scientific';
            }
            else if (input.includes('write') || input.includes('story')) {
                return 'literary';
            }
            else if (input.includes('music') || input.includes('sound')) {
                return 'musical';
            }
            else if (input.includes('build') || input.includes('design')) {
                return 'architectural';
            }
            else if (input.includes('tech') || input.includes('invent')) {
                return 'technological';
            }
        }
        return 'artistic'; // Default
    }
    calculateCreativeTaskComplexity(input) {
        if (typeof input === 'string') {
            return Math.min(input.length / 100, 1.0);
        }
        else if (Array.isArray(input)) {
            return Math.min(input.length / 10, 1.0);
        }
        else if (typeof input === 'object') {
            return Math.min(Object.keys(input).length / 5, 1.0);
        }
        return 0.5;
    }
    calculateCreativeTaskPriority(input, context) {
        const complexity = this.calculateCreativeTaskComplexity(input);
        const urgency = context?.urgency || 0.5;
        const importance = context?.importance || 0.5;
        return (complexity * 0.3) + (urgency * 0.4) + (importance * 0.3);
    }
    generateSessionInspiration(_task) {
        const inspirations = [
            'nature', 'technology', 'emotions', 'patterns', 'contrasts',
            'movement', 'color', 'sound', 'texture', 'space'
        ];
        const count = Math.floor(Math.random() * 3) + 2; // 2-4 inspirations
        const selected = [];
        for (let i = 0; i < count; i++) {
            const inspiration = inspirations[Math.floor(Math.random() * inspirations.length)];
            if (inspiration && !selected.includes(inspiration)) {
                selected.push(inspiration);
            }
        }
        return selected;
    }
    createCreativeExperience(_input, ideas) {
        return {
            id: `exp_${Date.now()}`,
            timestamp: Date.now(),
            context: {
                id: `context_${Date.now()}`,
                timestamp: Date.now(),
                environment: {},
                memory: {},
                goals: [],
                constraints: []
            },
            action: {
                id: `action_${Date.now()}`,
                type: 'create',
                parameters: {},
                preconditions: [],
                effects: [],
                cost: { type: 'time', value: 1000, unit: 'ms' },
                risk: { level: 'low', probability: 0.1, impact: 0.1, mitigation: [] }
            },
            outcome: {
                state: {},
                changes: [],
                value: {},
                uncertainty: {}
            },
            feedback: {
                type: 'positive',
                strength: 0.8,
                specificity: 0.7,
                timeliness: 0.9
            },
            learning: [],
            data: ideas,
            confidence: 0.8
        };
    }
    extractCreativeGoals(ideas) {
        const goals = [];
        ideas.forEach((idea, _index) => {
            goals.push({
                id: `goal_${Date.now()}_${idea.id}`,
                description: `Implement creative idea: ${idea.title}`,
                priority: idea.originality,
                deadline: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
                dependencies: [],
                metrics: {
                    progress: 0,
                    efficiency: 0,
                    satisfaction: 0,
                    completion: 0
                }
            });
        });
        return goals;
    }
    updateCreativePerformance(ideas) {
        if (ideas.length === 0)
            return;
        const averageOriginality = ideas.reduce((sum, idea) => sum + idea.originality, 0) / ideas.length;
        const averageFeasibility = ideas.reduce((sum, idea) => sum + idea.feasibility, 0) / ideas.length;
        const averageImpact = ideas.reduce((sum, idea) => sum + idea.impact, 0) / ideas.length;
        this.updatePerformance({
            creativity: averageOriginality,
            accuracy: averageFeasibility,
            efficiency: averageImpact
        });
    }
    calculateCreativeConfidence(ideas) {
        if (ideas.length === 0)
            return 0.5;
        const originalities = ideas.map(idea => idea.originality);
        const feasibilities = ideas.map(idea => idea.feasibility);
        const impacts = ideas.map(idea => idea.impact);
        const avgOriginality = originalities.reduce((sum, val) => sum + val, 0) / originalities.length;
        const avgFeasibility = feasibilities.reduce((sum, val) => sum + val, 0) / feasibilities.length;
        const avgImpact = impacts.reduce((sum, val) => sum + val, 0) / impacts.length;
        return (avgOriginality * 0.4) + (avgFeasibility * 0.3) + (avgImpact * 0.3);
    }
    generateIdeaTitle(_input) {
        const titles = [
            'Innovative Solution', 'Creative Approach', 'Artistic Expression',
            'Novel Concept', 'Revolutionary Idea', 'Unique Perspective',
            'Breakthrough Innovation', 'Creative Masterpiece', 'Inspired Creation'
        ];
        return titles[Math.floor(Math.random() * titles.length)] || 'Creative Idea';
    }
    generateIdeaDescription(_input) {
        const descriptions = [
            'A novel approach that combines multiple perspectives to create something truly unique.',
            'An innovative solution that addresses complex challenges through creative thinking.',
            'A revolutionary concept that pushes boundaries and explores new possibilities.',
            'An artistic expression that captures emotions and inspires imagination.',
            'A breakthrough idea that transforms existing paradigms and creates new opportunities.'
        ];
        return descriptions[Math.floor(Math.random() * descriptions.length)] || 'A creative solution';
    }
    determineIdeaCategory(_input) {
        const categories = ['artistic', 'scientific', 'technological', 'literary', 'musical', 'architectural'];
        return categories[Math.floor(Math.random() * categories.length)] || 'general';
    }
    generateInspiration(_input) {
        const inspirations = [
            'nature', 'technology', 'emotions', 'patterns', 'contrasts',
            'movement', 'color', 'sound', 'texture', 'space', 'light',
            'shadows', 'rhythm', 'harmony', 'balance', 'tension'
        ];
        const count = Math.floor(Math.random() * 4) + 2; // 2-5 inspirations
        const selected = [];
        for (let i = 0; i < count; i++) {
            const inspiration = inspirations[Math.floor(Math.random() * inspirations.length)];
            if (inspiration && !selected.includes(inspiration)) {
                selected.push(inspiration);
            }
        }
        return selected;
    }
    generateCreativeConclusions(input) {
        const conclusions = [];
        if (Array.isArray(input)) {
            conclusions.push(`Generated ${input.length} creative ideas`);
            conclusions.push(`Average originality: ${(input.reduce((sum, idea) => sum + idea.originality, 0) / input.length * 100).toFixed(1)}%`);
            conclusions.push(`Average feasibility: ${(input.reduce((sum, idea) => sum + idea.feasibility, 0) / input.length * 100).toFixed(1)}%`);
        }
        return conclusions;
    }
    calculateCreativeReasoningConfidence(input) {
        if (Array.isArray(input) && input.length > 0) {
            return input.reduce((sum, idea) => sum + idea.originality, 0) / input.length;
        }
        return 0.5;
    }
    generateCreativeReasoningSteps(_input) {
        const steps = [];
        steps.push('Analyzed creative input');
        steps.push('Generated multiple ideas');
        steps.push('Evaluated originality and feasibility');
        steps.push('Selected best creative approaches');
        steps.push('Generated final conclusions');
        return steps;
    }
    gatherCreativeReasoningEvidence(input) {
        const evidence = [];
        if (Array.isArray(input)) {
            evidence.push(`Processed ${input.length} creative ideas`);
            evidence.push(`Average originality: ${(input.reduce((sum, idea) => sum + idea.originality, 0) / input.length * 100).toFixed(1)}%`);
        }
        return evidence;
    }
    generateCreativeReasoningAlternatives(_input) {
        return [
            'Explore different artistic domains',
            'Try alternative creative approaches',
            'Develop hybrid creative strategies'
        ];
    }
    calculateCreativeReasoningUncertainty(input) {
        if (Array.isArray(input) && input.length > 0) {
            const originalities = input.map(idea => idea.originality);
            const variance = this.calculateVariance(originalities);
            return Math.min(variance, 1.0);
        }
        return 0.5;
    }
    identifyCreativeReasoningUncertaintySources(input) {
        const sources = [];
        if (Array.isArray(input) && input.some(idea => idea.originality < 0.5)) {
            sources.push('Low originality in some ideas');
        }
        if (!Array.isArray(input) || input.length === 0) {
            sources.push('No creative ideas generated');
        }
        return sources;
    }
    suggestCreativeReasoningUncertaintyMitigation(_input) {
        return [
            'Generate more diverse creative ideas',
            'Improve originality through inspiration',
            'Develop more robust creative strategies'
        ];
    }
    determineCreativeLearningApproach(experiences, _context) {
        const creativeExperiences = experiences.filter(exp => exp.type === 'creative');
        if (creativeExperiences.length > 5) {
            return 'meta_learning';
        }
        else if (creativeExperiences.length > 2) {
            return 'transfer_learning';
        }
        else {
            return 'adaptive_learning';
        }
    }
    analyzeCreativeGoalRequirements(goal) {
        return {
            capabilities: this.getRequiredCreativeCapabilitiesForGoal(goal),
            domains: this.getRequiredArtisticDomainsForGoal(goal),
            complexity: this.calculateCreativeGoalComplexity(goal),
            resources: this.estimateCreativeGoalResources(goal)
        };
    }
    generateCreativeActionPlan(_goal, requirements, _context) {
        const actions = [];
        // Generate creative actions based on goal requirements
        requirements.capabilities.forEach((capability) => {
            actions.push({
                id: `action_${Date.now()}_${capability}`,
                type: 'create',
                parameters: {
                    capability: capability,
                    level: 1,
                    method: 'creative_development'
                },
                preconditions: [],
                effects: [],
                cost: { type: 'time', value: 1000, unit: 'ms' },
                risk: { level: 'low', probability: 0.1, impact: 0.1, mitigation: [] }
            });
        });
        return actions;
    }
    prioritizeCreativeActions(actions, goalPriority) {
        return actions.map(action => ({
            ...action,
            priority: action.priority * goalPriority
        })).sort((a, b) => b.priority - a.priority);
    }
    canExecuteCreativeAction(action) {
        return this.isCapableOf(action.type);
    }
    async executeCreativeAction(_action, _context) {
        // Simulate creative action execution
        const success = Math.random() > 0.2; // 80% success rate
        const result = success ? { message: 'Creative action executed successfully' } : null;
        const feedback = { creativity: Math.random() };
        return { success, result, feedback };
    }
    // private generateCreativeActionFeedback(_action: Action, _result: any): any {
    //   return {
    //     actionId: _action.id,
    //     success: _result.success,
    //     creativity: _result.feedback?.creativity || 0,
    //     timestamp: Date.now()
    //   };
    // }
    updateCreativeActionPerformance(_action, _success) {
        const currentCreativity = this.getCreativity();
        const newCreativity = _success ?
            Math.min(1.0, currentCreativity + 0.01) :
            Math.max(0.0, currentCreativity - 0.01);
        this.updatePerformance({ creativity: newCreativity });
    }
    analyzeCreativePerformance(performance) {
        return {
            creativeAccuracy: performance.accuracy || 0,
            creativeEfficiency: performance.efficiency || 0,
            creativityLevel: performance.creativity || 0
        };
    }
    identifyCreativeImprovements(analysis) {
        const improvements = [];
        if (analysis.creativityLevel < 0.8) {
            improvements.push({ type: 'creativity', target: 0.8 });
        }
        if (analysis.creativeEfficiency < 0.7) {
            improvements.push({ type: 'efficiency', target: 0.7 });
        }
        if (analysis.creativeAccuracy < 0.6) {
            improvements.push({ type: 'accuracy', target: 0.6 });
        }
        return improvements;
    }
    async adaptCreativeStrategies(improvements) {
        improvements.forEach(improvement => {
            if (improvement.type === 'creativity') {
                this.addInnovationStrategy('divergent_thinking');
            }
            if (improvement.type === 'efficiency') {
                this.addInnovationStrategy('rapid_prototyping');
            }
            if (improvement.type === 'accuracy') {
                this.addInnovationStrategy('iterative_refinement');
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
    getRequiredCreativeCapabilitiesForGoal(goal) {
        const goalCapabilityMap = {
            'create': ['creativity', 'originality'],
            'innovate': ['innovation', 'problem_solving'],
            'express': ['artistic_expression', 'communication'],
            'design': ['design_thinking', 'aesthetics']
        };
        return goalCapabilityMap[goal.type] || ['creativity'];
    }
    getRequiredArtisticDomainsForGoal(_goal) {
        return this.artisticDomains.slice(0, 2); // Use first two domains
    }
    calculateCreativeGoalComplexity(goal) {
        return goal.priority * 0.5 + Math.random() * 0.5;
    }
    estimateCreativeGoalResources(goal) {
        return {
            time: goal.priority * 3000, // milliseconds
            memory: goal.priority * 300, // MB
            processing: goal.priority * 0.9 // CPU usage
        };
    }
    calculateVariance(values) {
        if (values.length === 0)
            return 0;
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        return Math.sqrt(variance);
    }
}
//# sourceMappingURL=CreativeAgent.js.map