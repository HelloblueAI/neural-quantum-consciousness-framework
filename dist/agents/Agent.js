import { Logger } from '@/utils/Logger';
export class Agent {
    config;
    state;
    memory;
    performance;
    logger;
    isActive = false;
    constructor(config) {
        this.config = config;
        this.state = this.initializeState();
        this.memory = this.initializeMemory();
        this.performance = this.initializePerformance();
        this.logger = new Logger(`Agent:${config.name}`);
        this.logger.info('Agent initialized', {
            agentId: config.id,
            agentName: config.name,
            agentType: config.type
        });
    }
    async processTask(task) {
        try {
            // Process the task using the agent's capabilities
            const reasoningResult = await this.reason(task.input || task);
            const learningResult = await this.learn([task]);
            const success = reasoningResult.confidence > 0.5;
            const result = {
                taskId: task.id,
                type: task.type,
                success,
                confidence: reasoningResult.confidence,
                output: reasoningResult.conclusions
            };
            return {
                success,
                result,
                reasoning: reasoningResult,
                learning: learningResult
            };
        }
        catch (error) {
            this.logger.error('Error processing task');
            return {
                success: false,
                result: null,
                reasoning: {
                    confidence: 0,
                    reasoning: {
                        steps: [],
                        logic: 'classical',
                        evidence: [],
                        assumptions: []
                    },
                    conclusions: [],
                    uncertainty: { type: 'probabilistic', parameters: {}, confidence: 0 },
                    alternatives: []
                },
                learning: {
                    success: false,
                    improvements: [],
                    newKnowledge: [],
                    adaptationMetrics: {
                        performance: 0,
                        efficiency: 0,
                        stability: 0,
                        flexibility: 0
                    },
                    insights: [],
                    confidence: 0
                }
            };
        }
    }
    async processExperience(experience) {
        try {
            // Process the experience for learning
            const learningResult = await this.learn([experience]);
            const success = learningResult.success;
            const result = {
                experienceId: experience.id,
                type: experience.type || 'unknown',
                success,
                improvements: learningResult.improvements,
                newKnowledge: learningResult.newKnowledge
            };
            return {
                success,
                result,
                learning: learningResult
            };
        }
        catch (error) {
            this.logger.error('Error processing experience');
            return {
                success: false,
                result: null,
                learning: {
                    success: false,
                    improvements: [],
                    newKnowledge: [],
                    adaptationMetrics: {
                        performance: 0,
                        efficiency: 0,
                        stability: 0,
                        flexibility: 0
                    },
                    insights: [],
                    confidence: 0
                }
            };
        }
    }
    start() {
        this.isActive = true;
        this.logger.info('Agent started', { agentId: this.config.id });
    }
    stop() {
        this.isActive = false;
        this.logger.info('Agent stopped', { agentId: this.config.id });
    }
    pause() {
        this.isActive = false;
        this.logger.info('Agent paused', { agentId: this.config.id });
    }
    resume() {
        this.isActive = true;
        this.logger.info('Agent resumed', { agentId: this.config.id });
    }
    getState() {
        return this.state;
    }
    getMemory() {
        return this.memory;
    }
    getPerformance() {
        return { ...this.performance };
    }
    getConfig() {
        return { ...this.config };
    }
    getType() {
        return this.config.type;
    }
    updateState(newState) {
        this.state = { ...this.state, ...newState };
        this.logger.debug('Agent state updated', {
            agentId: this.config.id,
            stateChanges: Object.keys(newState)
        });
    }
    addExperience(experience) {
        this.memory.experiences.push(experience);
        this.logger.debug('Experience added', {
            agentId: this.config.id,
            experienceId: experience.id
        });
    }
    updateKnowledge(key, value) {
        this.memory.knowledge.set(key, value);
        this.logger.debug('Knowledge updated', {
            agentId: this.config.id,
            knowledgeKey: key
        });
    }
    updateSkill(skill, level) {
        this.memory.skills.set(skill, Math.max(0, Math.min(1, level)));
        this.logger.debug('Skill updated', {
            agentId: this.config.id,
            skill,
            level
        });
    }
    updatePreference(preference, value) {
        this.memory.preferences.set(preference, Math.max(0, Math.min(1, value)));
        this.logger.debug('Preference updated', {
            agentId: this.config.id,
            preference,
            value
        });
    }
    addToHistory(category, entry) {
        if (!this.memory.history.has(category)) {
            this.memory.history.set(category, []);
        }
        this.memory.history.get(category).push(entry);
        this.logger.debug('History entry added', {
            agentId: this.config.id,
            category,
            entryType: typeof entry
        });
    }
    updatePerformance(performance) {
        this.performance = { ...this.performance, ...performance };
        this.logger.debug('Performance updated', {
            agentId: this.config.id,
            performanceChanges: Object.keys(performance)
        });
    }
    hasCapability(capability) {
        return this.config.capabilities.some((cap) => cap.name === capability);
    }
    getCapabilityLevel(capability) {
        const cap = this.config.capabilities.find((cap) => cap.name === capability);
        return cap ? cap.level || 0 : 0;
    }
    hasGoal(goal) {
        return this.config.goals.some((g) => g.name === goal);
    }
    getGoalPriority(goal) {
        const g = this.config.goals.find((g) => g.name === goal);
        return g ? g.priority || 0 : 0;
    }
    getParameter(key) {
        return this.config.parameters.get(key);
    }
    setParameter(key, value) {
        this.config.parameters.set(key, value);
        this.logger.debug('Parameter updated', {
            agentId: this.config.id,
            parameter: key,
            value
        });
    }
    getMetadata(key) {
        return this.config.metadata.get(key);
    }
    setMetadata(key, value) {
        this.config.metadata.set(key, value);
        this.logger.debug('Metadata updated', {
            agentId: this.config.id,
            metadataKey: key,
            value
        });
    }
    isCapableOf(action) {
        // Check if agent has the capability to perform the action
        const requiredCapabilities = this.getRequiredCapabilities(action);
        return requiredCapabilities.every(cap => this.hasCapability(cap));
    }
    canAchieveGoal(goal) {
        // Check if agent has the capabilities to achieve the goal
        const requiredCapabilities = this.getRequiredCapabilitiesForGoal(goal);
        return requiredCapabilities.every(cap => this.hasCapability(cap));
    }
    getEfficiency() {
        return this.performance.efficiency;
    }
    getAccuracy() {
        return this.performance.accuracy;
    }
    getAdaptability() {
        return this.performance.adaptability;
    }
    getCreativity() {
        return this.performance.creativity;
    }
    getCollaboration() {
        return this.performance.collaboration;
    }
    getExperienceCount() {
        return this.memory.experiences.length;
    }
    getKnowledgeSize() {
        return this.memory.knowledge.size;
    }
    getSkillCount() {
        return this.memory.skills.size;
    }
    getHistorySize() {
        return Array.from(this.memory.history.values()).reduce((sum, entries) => sum + entries.length, 0);
    }
    getRecentExperiences(count = 10) {
        return this.memory.experiences.slice(-count);
    }
    getExperiencesByType(type) {
        return this.memory.experiences.filter((exp) => exp.type === type);
    }
    getExperiencesByConfidence(minConfidence) {
        return this.memory.experiences.filter(exp => (exp.confidence || 0) >= minConfidence);
    }
    getTopSkills(count = 5) {
        return Array.from(this.memory.skills.entries())
            .sort(([, a], [, b]) => b - a)
            .slice(0, count)
            .map(([skill, level]) => ({ skill, level }));
    }
    getTopPreferences(count = 5) {
        return Array.from(this.memory.preferences.entries())
            .sort(([, a], [, b]) => b - a)
            .slice(0, count)
            .map(([preference, value]) => ({ preference, value }));
    }
    getHistoryByCategory(category) {
        return this.memory.history.get(category) || [];
    }
    clearHistory(category) {
        if (category) {
            this.memory.history.delete(category);
            this.logger.debug('History category cleared', {
                agentId: this.config.id,
                category
            });
        }
        else {
            this.memory.history.clear();
            this.logger.debug('All history cleared', { agentId: this.config.id });
        }
    }
    clearExperiences() {
        this.memory.experiences = [];
        this.logger.debug('All experiences cleared', { agentId: this.config.id });
    }
    clearKnowledge() {
        this.memory.knowledge.clear();
        this.logger.debug('All knowledge cleared', { agentId: this.config.id });
    }
    resetSkills() {
        this.memory.skills.clear();
        this.logger.debug('All skills reset', { agentId: this.config.id });
    }
    resetPreferences() {
        this.memory.preferences.clear();
        this.logger.debug('All preferences reset', { agentId: this.config.id });
    }
    getStatus() {
        return {
            isActive: this.isActive,
            experienceCount: this.getExperienceCount(),
            knowledgeSize: this.getKnowledgeSize(),
            skillCount: this.getSkillCount(),
            performance: this.getPerformance()
        };
    }
    getSummary() {
        return {
            id: this.config.id,
            name: this.config.name,
            type: this.config.type,
            capabilities: this.config.capabilities,
            goals: this.config.goals,
            performance: this.getPerformance(),
            experienceCount: this.getExperienceCount(),
            knowledgeSize: this.getKnowledgeSize(),
            skillCount: this.getSkillCount()
        };
    }
    initializeState() {
        return {
            current: 'idle',
            consciousness: {
                level: 0.5,
                awareness: 0.5,
                selfReflection: 0.5,
                metaCognition: 0.5
            },
            emotions: {
                happiness: 0.5,
                curiosity: 0.5,
                confidence: 0.5,
                motivation: 0.5
            },
            cognition: {
                attention: 0.5,
                memory: 0.5,
                reasoning: 0.5,
                creativity: 0.5
            },
            behavior: {
                activity: 0.5,
                responsiveness: 0.5,
                adaptability: 0.5,
                consistency: 0.5
            },
            creativity: {
                imagination: 0.5,
                innovation: 0.5,
                expression: 0.5,
                originality: 0.5
            }
        };
    }
    initializeMemory() {
        return {
            experiences: [],
            knowledge: new Map(),
            skills: new Map(),
            preferences: new Map(),
            history: new Map()
        };
    }
    initializePerformance() {
        return {
            efficiency: 0.7,
            accuracy: 0.8,
            adaptability: 0.6,
            creativity: 0.5,
            collaboration: 0.7
        };
    }
    getRequiredCapabilities(action) {
        // Map actions to required capabilities
        const actionCapabilityMap = {
            'reason': ['reasoning', 'logic'],
            'learn': ['learning', 'memory'],
            'plan': ['reasoning', 'problemSolving'],
            'execute': ['physical', 'coordination'],
            'communicate': ['communication', 'expression'],
            'collaborate': ['social', 'cooperation'],
            'create': ['creativity', 'originality'],
            'adapt': ['learning', 'adaptability']
        };
        return actionCapabilityMap[action] || [];
    }
    getRequiredCapabilitiesForGoal(goal) {
        // Implementation depends on goal type
        // const _goalType = (goal as any).type || 'unknown';
        const goalAlgorithmMap = {
            'learning': ['learning', 'memory', 'adaptation'],
            'reasoning': ['reasoning', 'logic', 'analysis'],
            'creativity': ['creativity', 'imagination', 'synthesis'],
            'planning': ['planning', 'organization', 'execution'],
            'communication': ['communication', 'expression', 'understanding'],
            'problem_solving': ['analysis', 'synthesis', 'evaluation'],
            'decision_making': ['evaluation', 'judgment', 'reasoning'],
            'collaboration': ['communication', 'cooperation', 'teamwork'],
            'adaptation': ['learning', 'flexibility', 'resilience'],
            'optimization': ['analysis', 'evaluation', 'improvement']
        };
        return goalAlgorithmMap[goal.type] || ['adaptive_learning'];
    }
    logActivity(activity, details) {
        this.addToHistory('activities', {
            timestamp: Date.now(),
            activity,
            details: details || {}
        });
    }
    updatePerformanceMetrics(metric, value) {
        const currentValue = this.performance[metric];
        const newValue = Math.max(0, Math.min(1, value));
        this.performance[metric] = newValue;
        this.logger.debug('Performance metric updated', {
            agentId: this.config.id,
            metric,
            oldValue: currentValue,
            newValue
        });
    }
}
