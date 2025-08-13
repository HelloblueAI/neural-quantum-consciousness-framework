/**
 * System Coordinator
 * Orchestrates all AGI components and manages multi-agent coordination
 */
import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '@/utils/Logger';
export class SystemCoordinator extends EventEmitter {
    id;
    logger;
    agiSystem;
    isRunning = false;
    constructor(agiSystem) {
        super();
        this.id = uuidv4();
        this.logger = new Logger('SystemCoordinator');
        this.agiSystem = agiSystem;
        this.logger.info('System Coordinator constructed', { id: this.id });
    }
    async start() {
        try {
            this.logger.info('Starting System Coordinator...');
            this.isRunning = true;
            this.logger.info('System Coordinator started successfully');
        }
        catch (error) {
            this.logger.error('Failed to start System Coordinator', error);
            throw error;
        }
    }
    async stop() {
        try {
            this.logger.info('Stopping System Coordinator...');
            this.isRunning = false;
            this.logger.info('System Coordinator stopped successfully');
        }
        catch (error) {
            this.logger.error('Failed to stop System Coordinator', error);
            throw error;
        }
    }
    async processInput(input) {
        if (!this.isRunning) {
            throw new Error('System Coordinator not running');
        }
        try {
            this.logger.debug('Processing input through coordinator');
            // Route input to appropriate agents
            const agentResults = await this.routeToAgents(input);
            // Synthesize results
            const synthesizedResult = await this.synthesizeResults(agentResults);
            return synthesizedResult;
        }
        catch (error) {
            this.logger.error('Input processing failed', error);
            throw error;
        }
    }
    async executePlan(plan) {
        if (!this.isRunning) {
            throw new Error('System Coordinator not running');
        }
        try {
            this.logger.debug('Executing plan through coordinator', { planId: plan.id });
            // Distribute actions to agents
            const agentResults = await this.distributeActions(plan);
            // Combine results
            const combinedResult = await this.combineResults(agentResults);
            return combinedResult;
        }
        catch (error) {
            this.logger.error('Plan execution failed', error);
            throw error;
        }
    }
    async routeToAgents(input) {
        const results = [];
        for (const agent of this.agiSystem.agents) {
            try {
                const result = await agent.think(input);
                results.push({ agentId: agent.id, result });
            }
            catch (error) {
                this.logger.warn(`Agent ${agent.id} failed to process input`, error);
            }
        }
        return results;
    }
    async synthesizeResults(agentResults) {
        // Synthesize results from multiple agents
        const confidence = agentResults.reduce((sum, r) => sum + r.result.confidence, 0) / agentResults.length;
        return {
            confidence,
            reasoning: { steps: [], logic: 'hybrid', evidence: [], assumptions: [] },
            conclusions: [],
            uncertainty: { type: 'probabilistic', parameters: {}, confidence: 0.8 },
            alternatives: []
        };
    }
    async distributeActions(plan) {
        const results = [];
        for (const action of plan.actions) {
            for (const agent of this.agiSystem.agents) {
                try {
                    const result = await agent.act({ ...plan, actions: [action] });
                    results.push({ agentId: agent.id, actionId: action.id, result });
                }
                catch (error) {
                    this.logger.warn(`Agent ${agent.id} failed to execute action ${action.id}`, error);
                }
            }
        }
        return results;
    }
    async combineResults(agentResults) {
        // Combine results from multiple agents
        const success = agentResults.every(r => r.result.success);
        return {
            success,
            results: agentResults.map(r => r.result),
            feedback: [{ type: 'positive', strength: 0.8, specificity: 0.7, timeliness: 0.9 }],
            metadata: {
                actionsExecuted: agentResults.length,
                successfulActions: agentResults.filter(r => r.result.success).length,
                totalCost: 0.2
            }
        };
    }
}
//# sourceMappingURL=SystemCoordinator.js.map