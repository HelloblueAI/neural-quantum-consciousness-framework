import { Agent, AgentConfig } from './Agent';
import { ReasoningAgent, ReasoningAgentConfig } from './ReasoningAgent';
import { LearningAgent, LearningAgentConfig } from './LearningAgent';
import { CreativeAgent, CreativeAgentConfig } from './CreativeAgent';
import { ReasoningEngine } from '@/core/ReasoningEngine';
import { LearningEngine } from '@/core/LearningEngine';
import { Capability, Goal } from '@/types';
export interface AgentFactoryConfig {
    reasoningEngine: ReasoningEngine;
    learningEngine: LearningEngine;
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
export declare class AgentFactory {
    private config;
    private templates;
    private instances;
    private logger;
    constructor(config: AgentFactoryConfig);
    createAgent(templateId: string, customConfig?: Partial<AgentConfig>): Agent;
    createReasoningAgent(config: ReasoningAgentConfig): ReasoningAgent;
    createLearningAgent(config: LearningAgentConfig): LearningAgent;
    createCreativeAgent(config: CreativeAgentConfig): CreativeAgent;
    createHybridAgent(config: AgentConfig): Agent;
    getAgent(agentId: string): Agent | null;
    getAgentInstance(agentId: string): AgentInstance | null;
    getAllAgents(): Agent[];
    getAllInstances(): AgentInstance[];
    getAgentsByType(type: string): Agent[];
    getActiveAgents(): Agent[];
    startAgent(agentId: string): void;
    stopAgent(agentId: string): void;
    pauseAgent(agentId: string): void;
    resumeAgent(agentId: string): void;
    removeAgent(agentId: string): boolean;
    updateAgentStatus(agentId: string, status: AgentInstance['status']): void;
    updateAgentPerformance(agentId: string, performance: Record<string, number>): void;
    addTemplate(template: AgentTemplate): void;
    getTemplate(templateId: string): AgentTemplate | null;
    getAllTemplates(): AgentTemplate[];
    getTemplatesByType(type: string): AgentTemplate[];
    removeTemplate(templateId: string): boolean;
    getAgentSummary(): {
        totalAgents: number;
        activeAgents: number;
        agentsByType: Record<string, number>;
        agentsByStatus: Record<string, number>;
    };
    getPerformanceMetrics(): {
        averageEfficiency: number;
        averageAccuracy: number;
        averageCreativity: number;
        averageCollaboration: number;
    };
    private initializeDefaultTemplates;
    private buildAgentConfig;
}
//# sourceMappingURL=AgentFactory.d.ts.map