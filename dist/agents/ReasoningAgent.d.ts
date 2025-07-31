import { Agent, AgentConfig } from './Agent';
import { Goal, Action, Experience, ReasoningResult, LearningResult } from '../types';
import { ReasoningEngine } from '../core/ReasoningEngine';
export interface ReasoningAgentConfig extends AgentConfig {
    reasoningEngine: ReasoningEngine;
    reasoningCapabilities: string[];
    problemSolvingStrategies: string[];
    logicalFrameworks: string[];
}
export interface ReasoningTask {
    id: string;
    name: string;
    type: 'deduction' | 'induction' | 'abduction' | 'analogy' | 'creative';
    input: any;
    context: Record<string, any>;
    constraints: Map<string, any>;
    expectedOutput: any;
    complexity: number;
    priority: number;
}
export interface ReasoningSession {
    id: string;
    taskId: string;
    startTime: number;
    endTime?: number;
    steps: string[];
    intermediateResults: any[];
    finalResult: any;
    confidence: number;
    metadata: Map<string, any>;
}
export declare class ReasoningAgent extends Agent {
    private reasoningEngine;
    private reasoningCapabilities;
    private problemSolvingStrategies;
    private logicalFrameworks;
    private activeTasks;
    private reasoningSessions;
    private reasoningLogger;
    constructor(config: ReasoningAgentConfig);
    process(input: any, context?: Record<string, any>): Promise<{
        output: any;
        reasoning: ReasoningResult;
        learning: LearningResult;
        actions: Action[];
    }>;
    reason(input: any, context?: Record<string, any>): Promise<ReasoningResult>;
    learn(experiences: Experience[], _context?: Record<string, any>): Promise<LearningResult>;
    plan(goals: Goal[], context?: Record<string, any>): Promise<Action[]>;
    execute(action: Action, context?: Record<string, any>): Promise<{
        success: boolean;
        result: any;
        feedback: any;
    }>;
    adapt(performance: any, context?: Record<string, any>): Promise<void>;
    getReasoningCapabilities(): string[];
    getProblemSolvingStrategies(): string[];
    getLogicalFrameworks(): string[];
    getActiveTasks(): ReasoningTask[];
    getReasoningSessions(): ReasoningSession[];
    addReasoningCapability(capability: string): void;
    addProblemSolvingStrategy(strategy: string): void;
    addLogicalFramework(framework: string): void;
}
//# sourceMappingURL=ReasoningAgent.d.ts.map