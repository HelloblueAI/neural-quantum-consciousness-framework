import { AgentState, Goal, Capability, Action, Experience, ReasoningResult, LearningResult } from '../types';
import { Logger } from '../utils/Logger';
export interface AgentConfig {
    id: string;
    name: string;
    type: string;
    capabilities: Capability[];
    goals: Goal[];
    parameters: Map<string, any>;
    metadata: Map<string, any>;
}
export interface AgentMemory {
    experiences: Experience[];
    knowledge: Map<string, any>;
    skills: Map<string, number>;
    preferences: Map<string, number>;
    history: Map<string, any[]>;
}
export interface AgentPerformance {
    efficiency: number;
    accuracy: number;
    adaptability: number;
    creativity: number;
    collaboration: number;
}
export declare abstract class Agent {
    protected config: AgentConfig;
    protected state: {
        current: AgentState;
        consciousness: {
            level: number;
            awareness: number;
            selfReflection: number;
            metaCognition: number;
        };
        emotions: {
            happiness: number;
            curiosity: number;
            confidence: number;
            motivation: number;
        };
        cognition: {
            attention: number;
            memory: number;
            reasoning: number;
            creativity: number;
        };
        behavior: {
            activity: number;
            responsiveness: number;
            adaptability: number;
            consistency: number;
        };
        creativity: {
            imagination: number;
            innovation: number;
            expression: number;
            originality: number;
        };
    };
    protected memory: AgentMemory;
    protected performance: AgentPerformance;
    protected logger: Logger;
    protected isActive: boolean;
    constructor(config: AgentConfig);
    abstract process(input: any, context?: Record<string, any>): Promise<{
        output: any;
        reasoning: ReasoningResult;
        learning: LearningResult;
        actions: Action[];
    }>;
    abstract reason(input: any, context?: Record<string, any>): Promise<ReasoningResult>;
    abstract learn(experiences: Experience[], context?: Record<string, any>): Promise<LearningResult>;
    abstract plan(goals: Goal[], context?: Record<string, any>): Promise<Action[]>;
    abstract execute(action: Action, context?: Record<string, any>): Promise<{
        success: boolean;
        result: any;
        feedback: any;
    }>;
    processTask(task: any): Promise<{
        success: boolean;
        result: any;
        reasoning: ReasoningResult;
        learning: LearningResult;
    }>;
    processExperience(experience: Experience): Promise<{
        success: boolean;
        result: any;
        learning: LearningResult;
    }>;
    abstract adapt(performance: AgentPerformance, context?: Record<string, any>): Promise<void>;
    start(): void;
    stop(): void;
    pause(): void;
    resume(): void;
    getState(): {
        current: AgentState;
        consciousness: {
            level: number;
            awareness: number;
            selfReflection: number;
            metaCognition: number;
        };
        emotions: {
            happiness: number;
            curiosity: number;
            confidence: number;
            motivation: number;
        };
        cognition: {
            attention: number;
            memory: number;
            reasoning: number;
            creativity: number;
        };
        behavior: {
            activity: number;
            responsiveness: number;
            adaptability: number;
            consistency: number;
        };
        creativity: {
            imagination: number;
            innovation: number;
            expression: number;
            originality: number;
        };
    };
    getMemory(): AgentMemory;
    getPerformance(): AgentPerformance;
    getConfig(): AgentConfig;
    getType(): string;
    updateState(newState: Partial<{
        current: AgentState;
        consciousness: {
            level: number;
            awareness: number;
            selfReflection: number;
            metaCognition: number;
        };
        emotions: {
            happiness: number;
            curiosity: number;
            confidence: number;
            motivation: number;
        };
        cognition: {
            attention: number;
            memory: number;
            reasoning: number;
            creativity: number;
        };
        behavior: {
            activity: number;
            responsiveness: number;
            adaptability: number;
            consistency: number;
        };
        creativity: {
            imagination: number;
            innovation: number;
            expression: number;
            originality: number;
        };
    }>): void;
    addExperience(experience: Experience): void;
    updateKnowledge(key: string, value: any): void;
    updateSkill(skill: string, level: number): void;
    updatePreference(preference: string, value: number): void;
    addToHistory(category: string, entry: any): void;
    updatePerformance(performance: Partial<AgentPerformance>): void;
    hasCapability(capability: string): boolean;
    getCapabilityLevel(capability: string): number;
    hasGoal(goal: string): boolean;
    getGoalPriority(goal: string): number;
    getParameter(key: string): any;
    setParameter(key: string, value: any): void;
    getMetadata(key: string): any;
    setMetadata(key: string, value: any): void;
    isCapableOf(action: string): boolean;
    canAchieveGoal(goal: Goal): boolean;
    getEfficiency(): number;
    getAccuracy(): number;
    getAdaptability(): number;
    getCreativity(): number;
    getCollaboration(): number;
    getExperienceCount(): number;
    getKnowledgeSize(): number;
    getSkillCount(): number;
    getHistorySize(): number;
    getRecentExperiences(count?: number): Experience[];
    getExperiencesByType(type: string): Experience[];
    getExperiencesByConfidence(minConfidence: number): Experience[];
    getTopSkills(count?: number): Array<{
        skill: string;
        level: number;
    }>;
    getTopPreferences(count?: number): Array<{
        preference: string;
        value: number;
    }>;
    getHistoryByCategory(category: string): any[];
    clearHistory(category?: string): void;
    clearExperiences(): void;
    clearKnowledge(): void;
    resetSkills(): void;
    resetPreferences(): void;
    getStatus(): {
        isActive: boolean;
        experienceCount: number;
        knowledgeSize: number;
        skillCount: number;
        performance: AgentPerformance;
    };
    getSummary(): {
        id: string;
        name: string;
        type: string;
        capabilities: Capability[];
        goals: Goal[];
        performance: AgentPerformance;
        experienceCount: number;
        knowledgeSize: number;
        skillCount: number;
    };
    protected initializeState(): {
        current: AgentState;
        consciousness: {
            level: number;
            awareness: number;
            selfReflection: number;
            metaCognition: number;
        };
        emotions: {
            happiness: number;
            curiosity: number;
            confidence: number;
            motivation: number;
        };
        cognition: {
            attention: number;
            memory: number;
            reasoning: number;
            creativity: number;
        };
        behavior: {
            activity: number;
            responsiveness: number;
            adaptability: number;
            consistency: number;
        };
        creativity: {
            imagination: number;
            innovation: number;
            expression: number;
            originality: number;
        };
    };
    protected initializeMemory(): AgentMemory;
    protected initializePerformance(): AgentPerformance;
    protected getRequiredCapabilities(action: string): string[];
    protected getRequiredCapabilitiesForGoal(goal: Goal): string[];
    protected logActivity(activity: string, details?: Record<string, any>): void;
    protected updatePerformanceMetrics(metric: keyof AgentPerformance, value: number): void;
}
//# sourceMappingURL=Agent.d.ts.map