import { ReasoningAgent } from './ReasoningAgent';
import { LearningAgent } from './LearningAgent';
import { CreativeAgent } from './CreativeAgent';
import { Logger } from '../utils/Logger';
export class AgentFactory {
    config;
    templates = new Map();
    instances = new Map();
    logger;
    constructor(config) {
        this.config = config;
        this.logger = new Logger('AgentFactory');
        this.initializeDefaultTemplates();
        this.logger.info('AgentFactory initialized', {
            defaultCapabilities: this.config?.defaultCapabilities?.length || 0,
            defaultGoals: this.config?.defaultGoals?.length || 0
        });
    }
    createAgent(templateId, customConfig) {
        this.logger.debug('Creating agent', { templateId, customConfig });
        try {
            const template = this.templates.get(templateId);
            if (!template) {
                throw new Error(`Template not found: ${templateId}`);
            }
            const agentConfig = this.buildAgentConfig(template, customConfig);
            let agent;
            switch (template.type) {
                case 'reasoning':
                    agent = this.createReasoningAgent(agentConfig);
                    break;
                case 'learning':
                    agent = this.createLearningAgent(agentConfig);
                    break;
                case 'creative':
                    agent = this.createCreativeAgent(agentConfig);
                    break;
                case 'hybrid':
                    agent = this.createHybridAgent(agentConfig);
                    break;
                default:
                    throw new Error(`Unknown agent type: ${template.type}`);
            }
            // Create agent instance
            const instance = {
                id: agentConfig.id,
                agent,
                template,
                status: 'inactive',
                performance: {},
                metadata: new Map([
                    ['created_at', Date.now()],
                    ['template_id', templateId],
                    ['agent_type', template.type]
                ])
            };
            this.instances.set(agentConfig.id, instance);
            this.logger.info('Agent created successfully', {
                agentId: agentConfig.id,
                agentType: template.type,
                templateId: templateId
            });
            return agent;
        }
        catch (error) {
            this.logger.error('Failed to create agent', error);
            throw error;
        }
    }
    createReasoningAgent(config) {
        return new ReasoningAgent(config);
    }
    createLearningAgent(config) {
        return new LearningAgent(config);
    }
    createCreativeAgent(config) {
        return new CreativeAgent(config);
    }
    createHybridAgent(config) {
        // For now, return a reasoning agent as the base hybrid
        // In a full implementation, this would be a custom hybrid agent class
        const reasoningConfig = {
            ...config,
            reasoningEngine: this.config.reasoningEngine,
            reasoningCapabilities: ['logic', 'problem_solving', 'analysis'],
            problemSolvingStrategies: ['systematic', 'heuristic', 'creative'],
            logicalFrameworks: ['classical', 'fuzzy', 'probabilistic']
        };
        return new ReasoningAgent(reasoningConfig);
    }
    getAgent(agentId) {
        const instance = this.instances.get(agentId);
        return instance ? instance.agent : null;
    }
    getAgentInstance(agentId) {
        return this.instances.get(agentId) || null;
    }
    getAllAgents() {
        return Array.from(this.instances.values()).map(instance => instance.agent);
    }
    getAllInstances() {
        return Array.from(this.instances.values());
    }
    getAgentsByType(type) {
        return Array.from(this.instances.values())
            .filter(instance => instance.template.type === type)
            .map(instance => instance.agent);
    }
    getActiveAgents() {
        return Array.from(this.instances.values())
            .filter(instance => instance.status === 'active')
            .map(instance => instance.agent);
    }
    startAgent(agentId) {
        const instance = this.instances.get(agentId);
        if (instance) {
            instance.agent.start();
            instance.status = 'active';
            this.logger.info('Agent started', { agentId });
        }
        else {
            this.logger.warn('Agent not found for start', { agentId });
        }
    }
    stopAgent(agentId) {
        const instance = this.instances.get(agentId);
        if (instance) {
            instance.agent.stop();
            instance.status = 'inactive';
            this.logger.info('Agent stopped', { agentId });
        }
        else {
            this.logger.warn('Agent not found for stop', { agentId });
        }
    }
    pauseAgent(agentId) {
        const instance = this.instances.get(agentId);
        if (instance) {
            instance.agent.pause();
            instance.status = 'inactive';
            this.logger.info('Agent paused', { agentId });
        }
        else {
            this.logger.warn('Agent not found for pause', { agentId });
        }
    }
    resumeAgent(agentId) {
        const instance = this.instances.get(agentId);
        if (instance) {
            instance.agent.resume();
            instance.status = 'active';
            this.logger.info('Agent resumed', { agentId });
        }
        else {
            this.logger.warn('Agent not found for resume', { agentId });
        }
    }
    removeAgent(agentId) {
        const instance = this.instances.get(agentId);
        if (instance) {
            instance.agent.stop();
            this.instances.delete(agentId);
            this.logger.info('Agent removed', { agentId });
            return true;
        }
        else {
            this.logger.warn('Agent not found for removal', { agentId });
            return false;
        }
    }
    updateAgentStatus(agentId, status) {
        const instance = this.instances.get(agentId);
        if (instance) {
            instance.status = status;
            this.logger.debug('Agent status updated', { agentId, status });
        }
        else {
            this.logger.warn('Agent not found for status update', { agentId });
        }
    }
    updateAgentPerformance(agentId, performance) {
        const instance = this.instances.get(agentId);
        if (instance) {
            instance.performance = { ...instance.performance, ...performance };
            this.logger.debug('Agent performance updated', { agentId, performance });
        }
        else {
            this.logger.warn('Agent not found for performance update', { agentId });
        }
    }
    addTemplate(template) {
        this.templates.set(template.id, template);
        this.logger.info('Agent template added', { templateId: template.id, templateName: template.name });
    }
    getTemplate(templateId) {
        return this.templates.get(templateId) || null;
    }
    getAllTemplates() {
        return Array.from(this.templates.values());
    }
    getTemplatesByType(type) {
        return Array.from(this.templates.values()).filter(template => template.type === type);
    }
    removeTemplate(templateId) {
        const removed = this.templates.delete(templateId);
        if (removed) {
            this.logger.info('Agent template removed', { templateId });
        }
        else {
            this.logger.warn('Template not found for removal', { templateId });
        }
        return removed;
    }
    getAgentSummary() {
        const agents = Array.from(this.instances.values());
        const agentsByType = {};
        const agentsByStatus = {};
        agents.forEach(instance => {
            const type = instance.template.type;
            const status = instance.status;
            agentsByType[type] = (agentsByType[type] || 0) + 1;
            agentsByStatus[status] = (agentsByStatus[status] || 0) + 1;
        });
        return {
            totalAgents: agents.length,
            activeAgents: agentsByStatus['active'] || 0,
            agentsByType,
            agentsByStatus
        };
    }
    getPerformanceMetrics() {
        const agents = Array.from(this.instances.values());
        if (agents.length === 0) {
            return {
                averageEfficiency: 0,
                averageAccuracy: 0,
                averageCreativity: 0,
                averageCollaboration: 0
            };
        }
        const performances = agents.map(instance => instance.agent.getPerformance());
        return {
            averageEfficiency: performances.reduce((sum, perf) => sum + perf.efficiency, 0) / performances.length,
            averageAccuracy: performances.reduce((sum, perf) => sum + perf.accuracy, 0) / performances.length,
            averageCreativity: performances.reduce((sum, perf) => sum + perf.creativity, 0) / performances.length,
            averageCollaboration: performances.reduce((sum, perf) => sum + perf.collaboration, 0) / performances.length
        };
    }
    initializeDefaultTemplates() {
        // Reasoning Agent Template
        const reasoningTemplate = {
            id: 'reasoning-agent',
            name: 'Reasoning Agent',
            type: 'reasoning',
            description: 'Specialized in logical reasoning and problem-solving',
            capabilities: [
                {
                    type: 'logical_reasoning',
                    level: 0.8,
                    reliability: 0.9,
                    limitations: []
                },
                {
                    type: 'problem_solving',
                    level: 0.7,
                    reliability: 0.8,
                    limitations: []
                },
                {
                    type: 'decision_making',
                    level: 0.6,
                    reliability: 0.7,
                    limitations: []
                },
                {
                    type: 'analysis',
                    level: 0.8,
                    reliability: 0.9,
                    limitations: []
                },
                {
                    type: 'synthesis',
                    level: 0.6,
                    reliability: 0.7,
                    limitations: []
                }
            ],
            goals: [
                {
                    id: 'improve_reasoning',
                    description: 'Improve logical reasoning capabilities',
                    priority: 0.9,
                    dependencies: [],
                    metrics: {
                        progress: 0.5,
                        efficiency: 0.7,
                        satisfaction: 0.6,
                        completion: 0.4
                    }
                },
                {
                    id: 'enhance_problem_solving',
                    description: 'Enhance problem-solving skills',
                    priority: 0.8,
                    dependencies: [],
                    metrics: {
                        progress: 0.6,
                        efficiency: 0.8,
                        satisfaction: 0.7,
                        completion: 0.5
                    }
                }
            ],
            parameters: new Map([
                ['reasoning_confidence_threshold', 0.7],
                ['max_reasoning_steps', 10],
                ['problem_solving_timeout', 30000]
            ]),
            metadata: new Map([
                ['specialization', 'logical_reasoning'],
                ['complexity_level', 'advanced'],
                ['performance_rating', 0.8]
            ])
        };
        // Learning Agent Template
        const learningTemplate = {
            id: 'learning-agent',
            name: 'Learning Agent',
            type: 'learning',
            description: 'Specialized in learning and adaptation',
            capabilities: [
                {
                    type: 'pattern_recognition',
                    level: 0.8,
                    reliability: 0.9,
                    limitations: []
                },
                {
                    type: 'knowledge_acquisition',
                    level: 0.9,
                    reliability: 0.8,
                    limitations: []
                },
                {
                    type: 'skill_development',
                    level: 0.7,
                    reliability: 0.8,
                    limitations: []
                },
                {
                    type: 'adaptation',
                    level: 0.8,
                    reliability: 0.7,
                    limitations: []
                },
                {
                    type: 'generalization',
                    level: 0.6,
                    reliability: 0.7,
                    limitations: []
                }
            ],
            goals: [
                {
                    id: 'acquire_knowledge',
                    description: 'Acquire new knowledge and skills',
                    priority: 0.9,
                    dependencies: [],
                    metrics: {
                        progress: 0.7,
                        efficiency: 0.8,
                        satisfaction: 0.8,
                        completion: 0.6
                    }
                },
                {
                    id: 'improve_adaptation',
                    description: 'Improve adaptation capabilities',
                    priority: 0.8,
                    dependencies: [],
                    metrics: {
                        progress: 0.6,
                        efficiency: 0.7,
                        satisfaction: 0.7,
                        completion: 0.5
                    }
                }
            ],
            parameters: new Map([
                ['learning_rate', 0.1],
                ['forgetting_rate', 0.05],
                ['adaptation_threshold', 0.6]
            ]),
            metadata: new Map([
                ['specialization', 'learning'],
                ['complexity_level', 'intermediate'],
                ['performance_rating', 0.8]
            ])
        };
        // Creative Agent Template
        const creativeTemplate = {
            id: 'creative-agent',
            name: 'Creative Agent',
            type: 'creative',
            description: 'Specialized in creativity and innovation',
            capabilities: [
                {
                    type: 'idea_generation',
                    level: 0.8,
                    reliability: 0.7,
                    limitations: []
                },
                {
                    type: 'innovation',
                    level: 0.7,
                    reliability: 0.6,
                    limitations: []
                },
                {
                    type: 'artistic_expression',
                    level: 0.6,
                    reliability: 0.7,
                    limitations: []
                },
                {
                    type: 'divergent_thinking',
                    level: 0.8,
                    reliability: 0.7,
                    limitations: []
                },
                {
                    type: 'synthesis',
                    level: 0.7,
                    reliability: 0.8,
                    limitations: []
                }
            ],
            goals: [
                {
                    id: 'generate_ideas',
                    description: 'Generate novel and useful ideas',
                    priority: 0.9,
                    dependencies: [],
                    metrics: {
                        progress: 0.6,
                        efficiency: 0.7,
                        satisfaction: 0.8,
                        completion: 0.5
                    }
                },
                {
                    id: 'enhance_creativity',
                    description: 'Enhance creative capabilities',
                    priority: 0.8,
                    dependencies: [],
                    metrics: {
                        progress: 0.5,
                        efficiency: 0.6,
                        satisfaction: 0.7,
                        completion: 0.4
                    }
                }
            ],
            parameters: new Map([
                ['creativity_threshold', 0.6],
                ['innovation_rate', 0.3],
                ['exploration_factor', 0.8]
            ]),
            metadata: new Map([
                ['specialization', 'creativity'],
                ['complexity_level', 'advanced'],
                ['performance_rating', 0.7]
            ])
        };
        // Register templates with both full and short IDs
        this.templates.set('reasoning-agent', reasoningTemplate);
        this.templates.set('reasoning', reasoningTemplate);
        this.templates.set('learning-agent', learningTemplate);
        this.templates.set('learning', learningTemplate);
        this.templates.set('creative-agent', creativeTemplate);
        this.templates.set('creative', creativeTemplate);
    }
    buildAgentConfig(template, customConfig) {
        const baseConfig = {
            id: customConfig?.id || `agent_${template.type}_${Date.now()}`,
            name: customConfig?.name || template.name,
            type: customConfig?.type || template.type,
            capabilities: customConfig?.capabilities || template.capabilities,
            goals: customConfig?.goals || template.goals,
            parameters: new Map([...template.parameters, ...(customConfig?.parameters || new Map())]),
            metadata: new Map([...template.metadata, ...(customConfig?.metadata || new Map())])
        };
        // Add type-specific configurations
        switch (template.type) {
            case 'reasoning':
                return {
                    ...baseConfig,
                    reasoningEngine: this.config?.reasoningEngine,
                    reasoningCapabilities: ['logic', 'problem_solving', 'analysis'],
                    problemSolvingStrategies: ['systematic', 'heuristic', 'creative'],
                    logicalFrameworks: ['classical', 'fuzzy', 'probabilistic']
                };
            case 'learning':
                return {
                    ...baseConfig,
                    learningEngine: this.config?.learningEngine,
                    learningAlgorithms: ['supervised', 'unsupervised', 'reinforcement'],
                    knowledgeDomains: ['general', 'specialized'],
                    learningStrategies: ['adaptive', 'meta', 'transfer']
                };
            case 'creative':
                return {
                    ...baseConfig,
                    reasoningEngine: this.config?.reasoningEngine,
                    learningEngine: this.config?.learningEngine,
                    creativeCapabilities: ['creativity', 'innovation', 'artistic_expression'],
                    artisticDomains: ['visual', 'musical', 'literary'],
                    innovationStrategies: ['divergent_thinking', 'rapid_prototyping', 'iterative_refinement']
                };
            case 'hybrid':
                return baseConfig;
            default:
                return baseConfig;
        }
    }
}
//# sourceMappingURL=AgentFactory.js.map