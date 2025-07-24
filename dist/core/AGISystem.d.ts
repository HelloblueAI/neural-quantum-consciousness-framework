/**
 * AGI Superintelligence System
 * Next-generation artificial general intelligence with advanced reasoning, learning, and autonomous capabilities
 */
import { EventEmitter } from 'events';
import { Agent, AgentInput, ReasoningResult, LearningResult, ActionPlan, ActionResult, SystemConfig, SystemMetrics } from '../types';
import { SystemCoordinator } from './SystemCoordinator';
import { KnowledgeBase } from './KnowledgeBase';
import { LearningEngine } from './LearningEngine';
import { ReasoningEngine } from './ReasoningEngine';
import { CommunicationProtocol } from './CommunicationProtocol';
/**
 * AGI Superintelligence System
 *
 * This is the core system that implements artificial general intelligence
 * with advanced capabilities including:
 * - Multi-agent orchestration
 * - Advanced reasoning and problem solving
 * - Continuous learning and adaptation
 * - Meta-reasoning and self-reflection
 * - Creative problem solving
 * - Consciousness simulation
 * - Autonomous decision making
 */
export declare class AGISystem extends EventEmitter {
    private readonly id;
    private readonly name;
    private readonly version;
    private readonly config;
    readonly agents: Agent[];
    coordinator: SystemCoordinator;
    knowledgeBase: KnowledgeBase;
    learningEngine: LearningEngine;
    reasoningEngine: ReasoningEngine;
    communicationProtocol: CommunicationProtocol;
    private readonly securityManager;
    private readonly performanceMonitor;
    private readonly errorHandler;
    private readonly logger;
    private _isInitialized;
    private _isRunning;
    private startupTime;
    constructor(config: SystemConfig);
    /**
     * Initialize the AGI system
     */
    initialize(): Promise<void>;
    /**
     * Start the AGI system
     */
    start(): Promise<void>;
    /**
     * Stop the AGI system
     */
    stop(): Promise<void>;
    /**
     * Process input through the AGI system
     */
    processInput(input: AgentInput): Promise<ReasoningResult>;
    /**
     * Execute an action plan
     */
    executePlan(plan: ActionPlan): Promise<ActionResult>;
    /**
     * Learn from experience
     */
    learn(experience: any): Promise<LearningResult>;
    /**
     * Perform meta-reasoning (thinking about thinking)
     */
    performMetaReasoning(): Promise<any>;
    /**
     * Generate creative solutions
     */
    generateCreativeSolution(problem: any): Promise<any>;
    /**
     * Get system metrics
     */
    getMetrics(): Promise<SystemMetrics>;
    /**
     * Get system status
     */
    getStatus(): Promise<any>;
    getSystemStatus(): any;
    getAgents(): Agent[];
    getPerformanceMetrics(): any;
    reason(input: string, context?: any): Promise<any>;
    create(prompt: string, type: string, constraints?: any): Promise<any>;
    /**
     * Check if system is initialized
     */
    isInitialized(): boolean;
    /**
     * Check if system is running
     */
    isRunning(): boolean;
    /**
     * Shutdown the system
     */
    shutdown(): Promise<{
        success: boolean;
    }>;
    reset(): Promise<void>;
    private initializeAgents;
    private createAgent;
    private createAgentContext;
    private startAgent;
    private stopAgent;
    private initializeAdvancedCapabilities;
    private generateMetaReasoningInsights;
    private get _creativity();
}
//# sourceMappingURL=AGISystem.d.ts.map