import { Agent, AgentConfig } from './Agent';
import { Goal, Action, Experience, ReasoningResult, LearningResult } from '@/types';
import { LearningEngine } from '@/core/LearningEngine';
export interface LearningAgentConfig extends AgentConfig {
    learningEngine: LearningEngine;
    learningAlgorithms: string[];
    knowledgeDomains: string[];
    learningStrategies: string[];
}
export interface LearningTask {
    id: string;
    name: string;
    type: 'supervised' | 'unsupervised' | 'reinforcement' | 'meta' | 'transfer' | 'active' | 'online' | 'adaptive';
    input: any;
    target?: any;
    context: Record<string, any>;
    constraints: Map<string, any>;
    expectedOutput: any;
    complexity: number;
    priority: number;
}
export interface LearningSession {
    id: string;
    taskId: string;
    startTime: number;
    endTime?: number;
    algorithm: string;
    iterations: number;
    convergence: boolean;
    finalResult: any;
    confidence: number;
    metadata: Map<string, any>;
}
export declare class LearningAgent extends Agent {
    process(_input: any, context?: Record<string, any>): Promise<{
        output: any;
        reasoning: ReasoningResult;
        learning: LearningResult;
        actions: Action[];
    }>;
    reason(_input: any, _context?: Record<string, any>): Promise<ReasoningResult>;
    learn(_experiences: Experience[], _context?: Record<string, any>): Promise<LearningResult>;
    plan(_goals: Goal[], _context?: Record<string, any>): Promise<Action[]>;
    execute(_action: Action, _context?: Record<string, any>): Promise<{
        success: boolean;
        result: any;
        feedback: any;
    }>;
    adapt(_performance: any, _context?: Record<string, any>): Promise<void>;
    getLearningAlgorithms(): string[];
    getKnowledgeDomains(): string[];
    getLearningStrategies(): string[];
    getActiveTasks(): LearningTask[];
    getLearningSessions(): LearningSession[];
    addLearningAlgorithm(_algorithm: string): void;
    addKnowledgeDomain(_domain: string): void;
    addLearningStrategy(_strategy: string): void;
}
//# sourceMappingURL=LearningAgent.d.ts.map