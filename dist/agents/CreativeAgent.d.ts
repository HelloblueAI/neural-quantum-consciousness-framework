import { Agent, AgentConfig } from './Agent';
import { Goal, Action, Experience, ReasoningResult, LearningResult } from '@/types';
import { ReasoningEngine } from '@/core/ReasoningEngine';
import { LearningEngine } from '@/core/LearningEngine';
export interface CreativeAgentConfig extends AgentConfig {
    reasoningEngine: ReasoningEngine;
    learningEngine: LearningEngine;
    creativeCapabilities: string[];
    artisticDomains: string[];
    innovationStrategies: string[];
}
export interface CreativeTask {
    id: string;
    name: string;
    type: 'artistic' | 'scientific' | 'literary' | 'musical' | 'architectural' | 'technological';
    input: any;
    context: Record<string, any>;
    constraints: Map<string, any>;
    expectedOutput: any;
    complexity: number;
    priority: number;
}
export interface CreativeSession {
    id: string;
    taskId: string;
    startTime: number;
    endTime?: number;
    inspiration: string[];
    iterations: number;
    finalResult: any;
    originality: number;
    quality: number;
    metadata: Map<string, any>;
}
export interface CreativeIdea {
    id: string;
    title: string;
    description: string;
    category: string;
    originality: number;
    feasibility: number;
    impact: number;
    inspiration: string[];
    metadata: Map<string, any>;
}
export declare class CreativeAgent extends Agent {
    private learningEngine;
    private creativeCapabilities;
    private artisticDomains;
    private innovationStrategies;
    private activeTasks;
    private creativeSessions;
    private creativeIdeas;
    private creativeLogger;
    constructor(config: CreativeAgentConfig);
    process(input: any, context?: Record<string, any>): Promise<{
        output: any;
        reasoning: ReasoningResult;
        learning: LearningResult;
        actions: Action[];
    }>;
    reason(input: any, context?: Record<string, any>): Promise<ReasoningResult>;
    learn(experiences: Experience[], context?: Record<string, any>): Promise<LearningResult>;
    plan(goals: Goal[], context?: Record<string, any>): Promise<Action[]>;
    execute(action: Action, context?: Record<string, any>): Promise<{
        success: boolean;
        result: any;
        feedback: any;
    }>;
    adapt(performance: any, _context?: Record<string, any>): Promise<void>;
    generateCreativeIdeas(input: any, context?: Record<string, any>): Promise<CreativeIdea[]>;
    getCreativeCapabilities(): string[];
    getArtisticDomains(): string[];
    getInnovationStrategies(): string[];
    getActiveTasks(): CreativeTask[];
    getCreativeSessions(): CreativeSession[];
    getCreativeIdeas(): CreativeIdea[];
    addCreativeCapability(capability: string): void;
    addArtisticDomain(domain: string): void;
    addInnovationStrategy(strategy: string): void;
    private createCreativeTask;
    private startCreativeSession;
    private completeCreativeSession;
    private determineCreativeReasoningApproach;
    private determineCreativeTaskType;
    private calculateCreativeTaskComplexity;
    private calculateCreativeTaskPriority;
    private generateSessionInspiration;
    private createCreativeExperience;
    private extractCreativeGoals;
    private updateCreativePerformance;
    private calculateCreativeConfidence;
    private generateIdeaTitle;
    private generateIdeaDescription;
    private determineIdeaCategory;
    private generateInspiration;
    private generateCreativeConclusions;
    private calculateCreativeReasoningConfidence;
    private generateCreativeReasoningSteps;
    private gatherCreativeReasoningEvidence;
    private generateCreativeReasoningAlternatives;
    private calculateCreativeReasoningUncertainty;
    private identifyCreativeReasoningUncertaintySources;
    private suggestCreativeReasoningUncertaintyMitigation;
    private determineCreativeLearningApproach;
    private analyzeCreativeGoalRequirements;
    private generateCreativeActionPlan;
    private prioritizeCreativeActions;
    private canExecuteCreativeAction;
    private executeCreativeAction;
    private updateCreativeActionPerformance;
    private analyzeCreativePerformance;
    private identifyCreativeImprovements;
    private adaptCreativeStrategies;
    private updateCreativeCapabilities;
    private adjustCreativeParameters;
    private getRequiredCreativeCapabilitiesForGoal;
    private getRequiredArtisticDomainsForGoal;
    private calculateCreativeGoalComplexity;
    private estimateCreativeGoalResources;
    private calculateVariance;
}
//# sourceMappingURL=CreativeAgent.d.ts.map