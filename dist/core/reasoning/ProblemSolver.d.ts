import { ReasoningResult } from '../../types';
export interface Problem {
    id: string;
    name: string;
    description: string;
    type: 'optimization' | 'classification' | 'planning' | 'diagnosis' | 'design';
    constraints: string[];
    objectives: string[];
    complexity: number;
    urgency: number;
}
export interface Solution {
    id: string;
    description: string;
    strategy: ProblemSolverStrategy;
    quality: number;
    feasibility: number;
    cost: number;
    time: number;
    risks: string[];
    confidence: number;
    steps?: SolutionStep[];
    approach?: string;
    problemId?: string;
}
export interface ProblemSolverStrategy {
    id: string;
    name: string;
    type: 'algorithmic' | 'heuristic' | 'metaheuristic' | 'hybrid';
    description: string;
    applicability: string[];
    complexity: number;
}
export interface SolutionStep {
    id: string;
    description: string;
    action: string;
    parameters: Map<string, any>;
}
export declare class ProblemSolver {
    private strategies;
    private problems;
    private solutions;
    private logger;
    private performanceMetrics;
    constructor();
    initialize(): Promise<void>;
    private initializeProblemSolverStrategies;
    reason(input: string, context?: Record<string, any>): ReasoningResult;
    solve(input: string, context?: Record<string, any>): ReasoningResult;
    private extractProblem;
    private findApplicableStrategies;
    private isStrategyApplicable;
    private generateSolutions;
    private generateSolutionForStrategy;
    private generateDecomposedSolution;
    private selectBestSolution;
    private calculateProblemSolverConfidence;
    private calculateProblemSolverUncertainty;
    private extractConstraints;
    private extractObjectives;
    private calculateProblemComplexity;
    private decomposeProblem;
    private createSubproblem;
    private createSolutionStep;
    private calculateSolutionQuality;
    private calculateSolutionFeasibility;
    private generateProblemSolverConclusion;
    private gatherProblemSolverEvidence;
    private generateProblemSolverAlternatives;
    private identifyProblemSolverUncertaintySources;
    private suggestProblemSolverUncertaintyMitigation;
    private updatePerformanceMetrics;
    getPerformanceMetrics(): Record<string, any>;
    private calculateAverageReasoningTime;
    addProblem(problem: Problem): void;
    addSolution(solution: Solution): void;
    addStrategy(strategy: ProblemSolverStrategy): void;
}
//# sourceMappingURL=ProblemSolver.d.ts.map