/**
 * AGI Demonstration System
 * Comprehensive demonstration of advanced artificial general intelligence capabilities
 *
 * This demonstration showcases:
 * - Autonomous goal generation and pursuit
 * - Genuine understanding and comprehension
 * - Self-modification and self-improvement
 * - Emergent creativity and insight generation
 * - Cross-domain knowledge synthesis
 * - Meta-cognitive awareness
 * - Autonomous decision making
 * - Consciousness simulation
 * - Multi-agent coordination
 */
interface DemonstrationScenario {
    id: string;
    name: string;
    description: string;
    input: any;
    expectedCapabilities: string[];
    complexity: 'basic' | 'intermediate' | 'advanced';
}
interface DemonstrationResult {
    scenario: DemonstrationScenario;
    result: any;
    performance: any;
    insights: string[];
    timestamp: Date;
}
export declare class AGIDemonstration {
    private readonly logger;
    private agiSystem;
    private consciousnessSimulator;
    private results;
    constructor();
    initialize(): Promise<void>;
    /**
     * Run comprehensive AGI demonstration
     */
    runComprehensiveDemonstration(): Promise<any>;
    /**
     * Run individual demonstration scenario
     */
    private runScenario;
    /**
     * Create comprehensive demonstration scenarios
     */
    private createDemonstrationScenarios;
    /**
     * Generate insights from scenario results
     */
    private generateScenarioInsights;
    /**
     * Generate comprehensive demonstration summary
     */
    private generateDemonstrationSummary;
    /**
     * Generate overall assessment of AGI capabilities
     */
    private generateOverallAssessment;
    /**
     * Get demonstration results
     */
    getResults(): DemonstrationResult[];
    /**
     * Get system status
     */
    getSystemStatus(): Promise<any>;
}
export {};
//# sourceMappingURL=AGIDemonstration.d.ts.map