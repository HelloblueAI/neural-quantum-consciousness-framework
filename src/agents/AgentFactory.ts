import { Agent, AgentConfig } from './Agent';
import { ReasoningAgent, ReasoningAgentConfig } from './ReasoningAgent';
import { LearningAgent, LearningAgentConfig } from './LearningAgent';
import { CreativeAgent, CreativeAgentConfig } from './CreativeAgent';
import { ReasoningEngine } from '../core/ReasoningEngine';
import { LearningEngine } from '../core/LearningEngine';
import { Capability, Goal } from '../types';
import { Logger } from '../utils/Logger';

export interface AgentFactoryConfig {
  reasoningEngine: ReasoningEngine;
  learningEngine: LearningEngine;
  metaLearningEngine?: any;
  knowledgeBase?: any;
  creativeEngine?: any;
  defaultCapabilities: Capability[];
  defaultGoals: Goal[];
  agentParameters: Map<string, any>;
  agentMetadata: Map<string, any>;
}

export interface AgentTemplate {
  id: string;
  name: string;
  type: 'reasoning' | 'learning' | 'creative' | 'hybrid';
  description: string;
  capabilities: Capability[];
  goals: Goal[];
  parameters: Map<string, any>;
  metadata: Map<string, any>;
}

export interface AgentInstance {
  id: string;
  agent: Agent;
  template: AgentTemplate;
  status: 'active' | 'inactive' | 'busy' | 'error';
  performance: Record<string, number>;
  metadata: Map<string, any>;
}

export class AgentFactory {
  private config: AgentFactoryConfig;
  private templates: Map<string, AgentTemplate> = new Map();
  private instances: Map<string, AgentInstance> = new Map();
  private logger: Logger;

  constructor(config: AgentFactoryConfig) {
    this.config = config;
    this.logger = new Logger('AgentFactory');
    this.initializeDefaultTemplates();
    
    this.logger.info('AgentFactory initialized', {
      defaultCapabilities: this.config?.defaultCapabilities?.length || 0,
      defaultGoals: this.config?.defaultGoals?.length || 0
    });
  }

  public createAgent(templateId: string, customConfig?: Partial<AgentConfig>): Agent {
    this.logger.debug('Creating agent', { templateId, customConfig });

    try {
      const template = this.templates.get(templateId);
      if (!template) {
        throw new Error(`Template not found: ${templateId}`);
      }

      const agentConfig = this.buildAgentConfig(template, customConfig);
      let agent: Agent;

      switch (template.type) {
        case 'reasoning':
          agent = this.createReasoningAgent(agentConfig as ReasoningAgentConfig);
          break;
        case 'learning':
          agent = this.createLearningAgent(agentConfig as LearningAgentConfig);
          break;
        case 'creative':
          agent = this.createCreativeAgent(agentConfig as CreativeAgentConfig);
          break;
        case 'hybrid':
          agent = this.createHybridAgent(agentConfig);
          break;
        default:
          throw new Error(`Unknown agent type: ${template.type}`);
      }

      // Create agent instance
      const instance: AgentInstance = {
        id: agentConfig.id,
        agent,
        template,
        status: 'inactive',
        performance: {},
        metadata: new Map<string, any>([
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
    } catch (error) {
      this.logger.error('Failed to create agent', error as Error);
      throw error;
    }
  }

  public createReasoningAgent(config: ReasoningAgentConfig): ReasoningAgent {
    return new ReasoningAgent(config);
  }

  public createLearningAgent(config: LearningAgentConfig): LearningAgent {
    return new LearningAgent(config);
  }

  public createCreativeAgent(config: CreativeAgentConfig): CreativeAgent {
    return new CreativeAgent(config);
  }

  public createHybridAgent(config: AgentConfig): Agent {
    // For now, return a reasoning agent as the base hybrid
    // In a full implementation, this would be a custom hybrid agent class
    const reasoningConfig: ReasoningAgentConfig = {
      ...config,
      reasoningEngine: this.config.reasoningEngine,
      reasoningCapabilities: ['logic', 'problem_solving', 'analysis'],
      problemSolvingStrategies: ['systematic', 'heuristic', 'creative'],
      logicalFrameworks: ['classical', 'fuzzy', 'probabilistic']
    };
    
    return new ReasoningAgent(reasoningConfig);
  }

  public getAgent(agentId: string): Agent | null {
    const instance = this.instances.get(agentId);
    return instance ? instance.agent : null;
  }

  public getAgentInstance(agentId: string): AgentInstance | null {
    return this.instances.get(agentId) || null;
  }

  public getAllAgents(): Agent[] {
    return Array.from(this.instances.values()).map(instance => instance.agent);
  }

  public getAllInstances(): AgentInstance[] {
    return Array.from(this.instances.values());
  }

  public getAgentsByType(type: string): Agent[] {
    return Array.from(this.instances.values())
      .filter(instance => instance.template.type === type)
      .map(instance => instance.agent);
  }

  public getActiveAgents(): Agent[] {
    return Array.from(this.instances.values())
      .filter(instance => instance.status === 'active')
      .map(instance => instance.agent);
  }

  public startAgent(agentId: string): void {
    const instance = this.instances.get(agentId);
    if (instance) {
      instance.agent.start();
      instance.status = 'active';
      this.logger.info('Agent started', { agentId });
    } else {
      this.logger.warn('Agent not found for start', { agentId });
    }
  }

  public stopAgent(agentId: string): void {
    const instance = this.instances.get(agentId);
    if (instance) {
      instance.agent.stop();
      instance.status = 'inactive';
      this.logger.info('Agent stopped', { agentId });
    } else {
      this.logger.warn('Agent not found for stop', { agentId });
    }
  }

  public pauseAgent(agentId: string): void {
    const instance = this.instances.get(agentId);
    if (instance) {
      instance.agent.pause();
      instance.status = 'inactive';
      this.logger.info('Agent paused', { agentId });
    } else {
      this.logger.warn('Agent not found for pause', { agentId });
    }
  }

  public resumeAgent(agentId: string): void {
    const instance = this.instances.get(agentId);
    if (instance) {
      instance.agent.resume();
      instance.status = 'active';
      this.logger.info('Agent resumed', { agentId });
    } else {
      this.logger.warn('Agent not found for resume', { agentId });
    }
  }

  public removeAgent(agentId: string): boolean {
    const instance = this.instances.get(agentId);
    if (instance) {
      instance.agent.stop();
      this.instances.delete(agentId);
      this.logger.info('Agent removed', { agentId });
      return true;
    } else {
      this.logger.warn('Agent not found for removal', { agentId });
      return false;
    }
  }

  public updateAgentStatus(agentId: string, status: AgentInstance['status']): void {
    const instance = this.instances.get(agentId);
    if (instance) {
      instance.status = status;
      this.logger.debug('Agent status updated', { agentId, status });
    } else {
      this.logger.warn('Agent not found for status update', { agentId });
    }
  }

  public updateAgentPerformance(agentId: string, performance: Record<string, number>): void {
    const instance = this.instances.get(agentId);
    if (instance) {
      instance.performance = { ...instance.performance, ...performance };
      this.logger.debug('Agent performance updated', { agentId, performance });
    } else {
      this.logger.warn('Agent not found for performance update', { agentId });
    }
  }

  public addTemplate(template: AgentTemplate): void {
    this.templates.set(template.id, template);
    this.logger.info('Agent template added', { templateId: template.id, templateName: template.name });
  }

  public getTemplate(templateId: string): AgentTemplate | null {
    return this.templates.get(templateId) || null;
  }

  public getAllTemplates(): AgentTemplate[] {
    return Array.from(this.templates.values());
  }

  public getTemplatesByType(type: string): AgentTemplate[] {
    return Array.from(this.templates.values()).filter(template => template.type === type);
  }

  public removeTemplate(templateId: string): boolean {
    const removed = this.templates.delete(templateId);
    if (removed) {
      this.logger.info('Agent template removed', { templateId });
    } else {
      this.logger.warn('Template not found for removal', { templateId });
    }
    return removed;
  }

  public getAgentSummary(): {
    totalAgents: number;
    activeAgents: number;
    agentsByType: Record<string, number>;
    agentsByStatus: Record<string, number>;
  } {
    const agents = Array.from(this.instances.values());
    const agentsByType: Record<string, number> = {};
    const agentsByStatus: Record<string, number> = {};

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

  public getPerformanceMetrics(): {
    averageEfficiency: number;
    averageAccuracy: number;
    averageCreativity: number;
    averageCollaboration: number;
  } {
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

  private initializeDefaultTemplates(): void {
    // Reasoning Agent Template
    const reasoningTemplate: AgentTemplate = {
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
      parameters: new Map<string, any>([
        ['reasoning_confidence_threshold', 0.7],
        ['max_reasoning_steps', 10],
        ['problem_solving_timeout', 30000]
      ]),
      metadata: new Map<string, any>([
        ['specialization', 'logical_reasoning'],
        ['complexity_level', 'advanced'],
        ['performance_rating', 0.8]
      ])
    };

    // Learning Agent Template
    const learningTemplate: AgentTemplate = {
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
      parameters: new Map<string, any>([
        ['learning_rate', 0.1],
        ['forgetting_rate', 0.05],
        ['adaptation_threshold', 0.6]
      ]),
      metadata: new Map<string, any>([
        ['specialization', 'learning'],
        ['complexity_level', 'intermediate'],
        ['performance_rating', 0.8]
      ])
    };

    // Creative Agent Template
    const creativeTemplate: AgentTemplate = {
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
      parameters: new Map<string, any>([
        ['creativity_threshold', 0.6],
        ['innovation_rate', 0.3],
        ['exploration_factor', 0.8]
      ]),
      metadata: new Map<string, any>([
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

  private buildAgentConfig(template: AgentTemplate, customConfig?: Partial<AgentConfig>): AgentConfig {
    const baseConfig: AgentConfig = {
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
        } as ReasoningAgentConfig;

      case 'learning':
        return {
          ...baseConfig,
          learningEngine: this.config?.learningEngine,
          learningAlgorithms: ['supervised', 'unsupervised', 'reinforcement'],
          knowledgeDomains: ['general', 'specialized'],
          learningStrategies: ['adaptive', 'meta', 'transfer'],
          metaLearningEngine: this.config?.metaLearningEngine || {} as any,
          knowledgeBase: this.config?.knowledgeBase || {} as any,
          learningCapabilities: ['supervised', 'unsupervised', 'reinforcement', 'transfer', 'meta'],
          learningFrameworks: ['neural_networks', 'decision_trees', 'bayesian', 'reinforcement']
        } as LearningAgentConfig;

      case 'creative':
        return {
          ...baseConfig,
          creativeEngine: this.config?.creativeEngine || {} as any,
          creativeCapabilities: ['creativity', 'innovation', 'artistic_expression'],
          artisticDomains: ['visual', 'musical', 'literary'],
          innovationStrategies: ['divergent_thinking', 'rapid_prototyping', 'iterative_refinement']
        } as CreativeAgentConfig;

      case 'hybrid':
        return baseConfig;

      default:
        return baseConfig;
    }
  }
} 