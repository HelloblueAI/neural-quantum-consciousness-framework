/**
 * AGI Superintelligence System
 * Next-generation artificial general intelligence with advanced reasoning, learning, and autonomous capabilities
 */
import { EventEmitter } from 'events';
import { Agent, AgentInput, ReasoningResult, LearningResult, ActionPlan, ActionResult, SystemConfig, SystemMetrics } from '../types/index.js';
import { SystemCoordinator } from './SystemCoordinator.js';
import { KnowledgeBase } from './KnowledgeBase.js';
import { LearningEngine } from './LearningEngine.js';
import { ReasoningEngine } from './ReasoningEngine.js';
import { CommunicationProtocol } from './CommunicationProtocol.js';
import { NeuralFoundationEngine } from './NeuralFoundationEngine.js';
import { CrossDomainReasoningEngine } from './reasoning/CrossDomainReasoningEngine.js';
import { UnifiedLearningEngine } from './learning/UnifiedLearningEngine.js';
import { TrueAGIEngine } from './TrueAGIEngine.js';
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
    neuralFoundationEngine: NeuralFoundationEngine;
    crossDomainReasoningEngine: CrossDomainReasoningEngine;
    unifiedLearningEngine: UnifiedLearningEngine;
    trueAGIEngine: TrueAGIEngine;
    private readonly securityManager;
    private readonly performanceMonitor;
    private readonly errorHandler;
    private readonly logger;
    private _isInitialized;
    private _isRunning;
    private startupTime;
    private reasoningHistory;
    private learningHistory;
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
     * Process input with advanced AGI capabilities
     */
    processInput(input: AgentInput): Promise<ReasoningResult>;
    processInputForTests(input: string): Promise<any>;
    /**
     * Execute an action plan
     */
    executePlan(plan: ActionPlan): Promise<ActionResult>;
    /**
     * Learn with advanced unified learning capabilities
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
    generateCreativeSolutionForTests(problem: any): Promise<any>;
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
    /**
     * Reason with advanced cross-domain capabilities
     */
    reason(input: string, context?: any): Promise<any>;
    /**
     * Create with advanced generative capabilities
     */
    create(prompt: string, type: string, constraints?: any): Promise<any>;
    /**
     * Process input with genuine AGI understanding and autonomous response
     */
    processWithTrueAGI(input: any, context?: any): Promise<any>;
    /**
     * Enhance True AGI result with other AGI components
     */
    private enhanceWithAGIComponents;
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
    /**
     * Initialize advanced AGI capabilities
     */
    private initializeAdvancedCapabilities;
    private synthesizeAdvancedResults;
    private updateSystemState;
    /**
     * Perform advanced meta-reasoning
     */
    private performAdvancedMetaReasoning;
    private calculateAdvancedConfidence;
    private synthesizeLearningResults;
    private calculateLearningConfidence;
    private synthesizeReasoningResults;
    private calculateReasoningConfidence;
    private generateAdvancedCreation;
    private calculateCreationConfidence;
    private generateMetaReasoningInsights;
    private get _creativity();
}
//# sourceMappingURL=AGISystem.d.ts.map