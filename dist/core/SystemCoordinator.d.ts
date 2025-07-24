/**
 * System Coordinator
 * Orchestrates all AGI components and manages multi-agent coordination
 */
import { EventEmitter } from 'events';
import { AGISystem, AgentInput, ReasoningResult, ActionPlan, ActionResult } from '../types';
export declare class SystemCoordinator extends EventEmitter {
    private readonly id;
    private readonly logger;
    private readonly agiSystem;
    private isRunning;
    constructor(agiSystem: AGISystem);
    start(): Promise<void>;
    stop(): Promise<void>;
    processInput(input: AgentInput): Promise<ReasoningResult>;
    executePlan(plan: ActionPlan): Promise<ActionResult>;
    private routeToAgents;
    private synthesizeResults;
    private distributeActions;
    private combineResults;
}
//# sourceMappingURL=SystemCoordinator.d.ts.map