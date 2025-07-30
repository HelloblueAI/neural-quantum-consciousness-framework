import { Logger } from '@/utils/Logger';
export class ProblemSolver {
    strategies = new Map();
    problems = new Map();
    solutions = new Map();
    logger;
    performanceMetrics = {
        totalProblems: 0,
        totalSolutions: 0,
        averageQuality: 0,
        strategiesApplied: 0
    };
    constructor() {
        this.logger = new Logger('ProblemSolver');
        this.initializeProblemSolverStrategies();
    }
    async initialize() {
        try {
            this.logger.info('Initializing Problem Solver...');
            // Initialize problem solver strategies
            this.initializeProblemSolverStrategies();
            // Initialize performance metrics
            this.performanceMetrics = {
                totalProblems: 0,
                totalSolutions: 0,
                averageQuality: 0,
                strategiesApplied: 0
            };
            this.logger.info('Problem Solver initialized successfully');
        }
        catch (error) {
            this.logger.error('Failed to initialize Problem Solver', error);
            throw error;
        }
    }
    initializeProblemSolverStrategies() {
        // Initialize problem-solving strategies
        const standardStrategies = [
            {
                id: 'decomposition',
                name: 'Problem Decomposition',
                type: 'heuristic',
                description: 'Break complex problems into simpler subproblems',
                applicability: ['complex', 'multi-objective', 'planning'],
                complexity: 0.8
            },
            {
                id: 'heuristic_search',
                name: 'Heuristic Search',
                type: 'heuristic',
                description: 'Use domain-specific heuristics to guide search',
                applicability: ['search', 'optimization', 'planning'],
                complexity: 0.7
            },
            {
                id: 'constraint_satisfaction',
                name: 'Constraint Satisfaction',
                type: 'algorithmic',
                description: 'Find solutions that satisfy all constraints',
                applicability: ['satisfaction', 'planning', 'optimization'],
                complexity: 0.85
            },
            {
                id: 'creative_solution',
                name: 'Creative Solution',
                type: 'hybrid',
                description: 'Generate innovative solutions through creative thinking',
                applicability: ['design', 'innovation', 'complex'],
                complexity: 0.9
            }
        ];
        standardStrategies.forEach(strategy => {
            this.strategies.set(strategy.id, strategy);
        });
        this.logger.info('ProblemSolver initialized with standard strategies');
    }
    reason(input, context) {
        return this.solve(input, context);
    }
    solve(input, context) {
        this.logger.debug('Starting problem-solving reasoning', { input });
        try {
            const startTime = Date.now();
            const problem = this.extractProblem(input, context);
            const applicableStrategies = this.findApplicableStrategies(input, problem);
            const solutions = this.generateSolutions(input, problem, applicableStrategies);
            const bestSolution = this.selectBestSolution(solutions);
            const confidence = this.calculateProblemSolverConfidence(input, problem, solutions);
            const reasoningTime = Date.now() - startTime;
            this.updatePerformanceMetrics(reasoningTime, confidence, applicableStrategies.length);
            const result = {
                confidence: confidence,
                reasoning: {
                    steps: [
                        {
                            id: 'problem_analysis',
                            type: 'deduction',
                            premise: { content: input, truthValue: 1, certainty: 0.8, evidence: [] },
                            conclusion: { content: `Problem analysis completed with confidence ${confidence.toFixed(3)}`, truthValue: confidence, certainty: confidence, evidence: [] },
                            confidence: confidence,
                            reasoning: `Problem identified: ${problem.description}`
                        }
                    ],
                    logic: 'classical',
                    evidence: this.gatherProblemSolverEvidence(input, problem, applicableStrategies, solutions).map(_ev => ({
                        source: 'problem_solver',
                        strength: 0.8,
                        reliability: 0.7,
                        timestamp: Date.now()
                    })),
                    assumptions: []
                },
                conclusions: [
                    {
                        id: 'problem_conclusion',
                        statement: this.generateProblemSolverConclusion(input, problem, bestSolution),
                        confidence: confidence,
                        evidence: [],
                        reasoning: 'Problem solving completed',
                        implications: ['Solution strategy selected', 'Problem decomposed']
                    }
                ],
                alternatives: this.generateProblemSolverAlternatives(input, solutions).map(alt => ({
                    id: `alt_${Date.now()}`,
                    description: alt,
                    probability: 0.3,
                    feasibility: 0.7,
                    consequences: [],
                    reasoning: 'Alternative problem-solving approach'
                })),
                uncertainty: {
                    type: 'probabilistic',
                    parameters: {
                        level: this.calculateProblemSolverUncertainty(input, problem, solutions),
                        sources: this.identifyProblemSolverUncertaintySources(input, problem),
                        mitigation: this.suggestProblemSolverUncertaintyMitigation(input, problem)
                    },
                    confidence: 1 - this.calculateProblemSolverUncertainty(input, problem, solutions)
                }
            };
            this.logger.info('Problem-solving reasoning completed', {
                input,
                confidence: result.confidence,
                solutionsGenerated: solutions.length,
                reasoningTime
            });
            return result;
        }
        catch (error) {
            this.logger.error('Error in problem-solving reasoning', error);
            throw new Error(`Problem-solving reasoning failed: ${error}`);
        }
    }
    extractProblem(_input, _context) {
        // Extract problem from input using pattern matching
        const problemPatterns = [
            /(?:solve|fix|resolve|address)\s+(.+?)(?:\s+problem|\s+issue|\s+challenge)/gi,
            /(?:problem|issue|challenge)\s+(?:with|in|of)\s+(.+?)(?:\s+is|\s+has|\s+involves)/gi,
            /(?:how to|what is|find)\s+(.+?)(?:\s+for|\s+to|\s+with)/gi
        ];
        let problemName = 'Unknown Problem';
        let problemDescription = _input;
        let problemType = 'optimization';
        for (const pattern of problemPatterns) {
            const matches = _input.matchAll(pattern);
            for (const match of matches) {
                problemName = match[1] || 'Extracted Problem';
                break;
            }
        }
        // Determine problem type based on keywords
        const lowerInput = _input.toLowerCase();
        if (lowerInput.includes('optimize') || lowerInput.includes('minimize') || lowerInput.includes('maximize')) {
            problemType = 'optimization';
        }
        else if (lowerInput.includes('classify') || lowerInput.includes('categorize') || lowerInput.includes('identify')) {
            problemType = 'classification';
        }
        else if (lowerInput.includes('plan') || lowerInput.includes('schedule') || lowerInput.includes('organize')) {
            problemType = 'planning';
        }
        else if (lowerInput.includes('diagnose') || lowerInput.includes('analyze') || lowerInput.includes('investigate')) {
            problemType = 'diagnosis';
        }
        else if (lowerInput.includes('design') || lowerInput.includes('create') || lowerInput.includes('build')) {
            problemType = 'design';
        }
        const problem = {
            id: `problem_${Date.now()}`,
            name: problemName,
            description: problemDescription,
            type: problemType,
            constraints: this.extractConstraints(_input),
            objectives: this.extractObjectives(_input),
            complexity: this.calculateProblemComplexity(_input),
            urgency: 0.5 // Default urgency
        };
        this.problems.set(problem.id, problem);
        this.performanceMetrics.totalProblems++;
        return problem;
    }
    findApplicableStrategies(input, problem) {
        const applicableStrategies = [];
        for (const strategy of this.strategies.values()) {
            if (this.isStrategyApplicable(input, problem, strategy)) {
                applicableStrategies.push(strategy);
            }
        }
        return applicableStrategies;
    }
    isStrategyApplicable(input, problem, strategy) {
        const inputLower = input.toLowerCase();
        const problemType = problem.type;
        // Check if strategy is applicable to problem type
        const typeApplicability = strategy.applicability.some(type => type === problemType || type === 'complex' || type === 'novel');
        // Check if strategy keywords appear in input
        const strategyKeywords = {
            algorithmic: ['algorithm', 'systematic', 'methodical'],
            heuristic: ['heuristic', 'rule of thumb', 'approximation'],
            metaheuristic: ['metaheuristic', 'genetic', 'simulated annealing', 'swarm'],
            hybrid: ['hybrid', 'creative', 'novel', 'innovative', 'original']
        };
        const keywords = strategyKeywords[strategy.type] || [];
        const keywordMatch = keywords.some(keyword => inputLower.includes(keyword));
        return typeApplicability || keywordMatch;
    }
    generateSolutions(input, problem, strategies) {
        const solutions = [];
        for (const strategy of strategies) {
            const solution = this.generateSolutionForStrategy(input, problem, strategy);
            if (solution) {
                solutions.push(solution);
            }
        }
        // Generate additional solutions using problem decomposition if applicable
        if (problem.complexity > 0.7) {
            const decomposedSolution = this.generateDecomposedSolution(input, problem);
            if (decomposedSolution) {
                solutions.push(decomposedSolution);
            }
        }
        this.performanceMetrics.totalSolutions += solutions.length;
        return solutions;
    }
    generateSolutionForStrategy(_input, problem, strategy) {
        const solutionSteps = [];
        let approach = '';
        switch (strategy.type) {
            case 'heuristic':
                approach = 'Heuristic-based approach';
                solutionSteps.push(this.createSolutionStep('apply_heuristics', 'Apply domain-specific heuristics', 'heuristic', new Map()), this.createSolutionStep('evaluate_solution', 'Evaluate solution quality', 'evaluation', new Map()), this.createSolutionStep('refine_solution', 'Refine solution if needed', 'refinement', new Map()));
                break;
            case 'algorithmic':
                approach = 'Algorithmic approach';
                solutionSteps.push(this.createSolutionStep('select_algorithm', 'Select appropriate algorithm', 'selection', new Map()), this.createSolutionStep('implement_algorithm', 'Implement the algorithm', 'implementation', new Map()), this.createSolutionStep('verify_solution', 'Verify solution correctness', 'verification', new Map()));
                break;
            case 'metaheuristic':
                approach = 'Metaheuristic approach';
                solutionSteps.push(this.createSolutionStep('apply_metaheuristic', 'Apply metaheuristic method', 'metaheuristic', new Map()), this.createSolutionStep('evaluate_metaheuristic', 'Evaluate metaheuristic results', 'evaluation', new Map()));
                break;
            case 'hybrid':
                approach = 'Hybrid/creative approach';
                solutionSteps.push(this.createSolutionStep('brainstorm', 'Brainstorm potential solutions', 'ideation', new Map()), this.createSolutionStep('evaluate_alternatives', 'Evaluate creative alternatives', 'evaluation', new Map()), this.createSolutionStep('synthesize_solution', 'Synthesize best creative solution', 'synthesis', new Map()));
                break;
            default:
                return null;
        }
        return {
            id: `solution_${strategy.id}_${Date.now()}`,
            problemId: problem.id,
            description: `Solution using ${strategy.name}`,
            approach: approach,
            steps: solutionSteps,
            strategy: strategy,
            quality: this.calculateSolutionQuality(problem, strategy),
            feasibility: this.calculateSolutionFeasibility(problem, strategy),
            confidence: strategy.complexity,
            cost: 1,
            time: 1,
            risks: []
        };
    }
    generateDecomposedSolution(_input, problem) {
        const subproblems = this.decomposeProblem(problem);
        if (subproblems.length === 0)
            return null;
        const solutionSteps = [];
        // Create steps for each subproblem
        subproblems.forEach((subproblem, index) => {
            solutionSteps.push(this.createSolutionStep(`solve_subproblem_${index}`, `Solve subproblem: ${subproblem.name}`, 'subproblem_solution', new Map([['subproblemId', subproblem.id]])));
        });
        solutionSteps.push(this.createSolutionStep('combine_results', 'Combine subproblem results', 'synthesis', new Map()));
        return {
            id: `decomposed_solution_${Date.now()}`,
            problemId: problem.id,
            description: 'Solution through problem decomposition',
            approach: 'Divide and conquer approach',
            steps: solutionSteps,
            strategy: this.strategies.get('decomposition') || { id: 'decomposition', name: 'Decomposition', type: 'hybrid', description: 'Decomposition', applicability: [], complexity: 0.7 },
            quality: 0.8,
            feasibility: 0.9,
            confidence: 0.85,
            cost: 1,
            time: 1,
            risks: []
        };
    }
    selectBestSolution(solutions) {
        if (solutions.length === 0)
            return null;
        // Score solutions based on quality, feasibility, and confidence
        const scoredSolutions = solutions.map(solution => ({
            solution,
            score: (solution.quality * 0.4) + (solution.feasibility * 0.3) + (solution.confidence * 0.3)
        }));
        // Return solution with highest score
        const bestScored = scoredSolutions.reduce((best, current) => current.score > best.score ? current : best);
        return bestScored.solution;
    }
    calculateProblemSolverConfidence(_input, problem, solutions) {
        if (solutions.length === 0)
            return 0.5;
        const problemComplexityFactor = 1.0 - problem.complexity; // Simpler problems = higher confidence
        const solutionQualityFactor = solutions.reduce((sum, sol) => sum + sol.quality, 0) / solutions.length;
        const solutionFeasibilityFactor = solutions.reduce((sum, sol) => sum + sol.feasibility, 0) / solutions.length;
        const confidence = (problemComplexityFactor * 0.3) + (solutionQualityFactor * 0.4) + (solutionFeasibilityFactor * 0.3);
        return Math.max(0, Math.min(1, confidence));
    }
    calculateProblemSolverUncertainty(input, problem, solutions) {
        if (solutions.length === 0)
            return 0.5;
        const complexityUncertainty = problem.complexity * 0.4;
        const solutionUncertainty = solutions.length < 2 ? 0.3 : 0.1;
        const inputUncertainty = input.includes('?') || input.includes('maybe') ? 0.2 : 0.1;
        return Math.min(complexityUncertainty + solutionUncertainty + inputUncertainty, 1.0);
    }
    extractConstraints(input) {
        const constraints = [];
        // Extract constraints from input
        const constraintPatterns = [
            /(?:constraint|limit|bound)\s+(\w+):\s*(.+?)(?:\s+and|\s+or|\s*,)/gi,
            /(?:must|should|need to)\s+(.+?)(?:\s+and|\s+or|\s*,)/gi,
            /(?:cannot|must not|should not)\s+(.+?)(?:\s+and|\s+or|\s*,)/gi
        ];
        for (const pattern of constraintPatterns) {
            const matches = input.matchAll(pattern);
            for (const match of matches) {
                if (typeof match[2] === 'string') {
                    constraints.push(match[2]);
                }
            }
        }
        return constraints;
    }
    extractObjectives(input) {
        const objectives = [];
        // Extract objectives from input
        const objectivePatterns = [
            /(?:maximize|minimize|optimize)\s+(\w+)/gi,
            /(?:goal|objective|target)\s+(\w+)/gi,
            /(?:improve|enhance|increase)\s+(\w+)/gi
        ];
        for (const pattern of objectivePatterns) {
            const matches = input.matchAll(pattern);
            for (const match of matches) {
                if (match[1]) {
                    objectives.push(match[1]); // Default weight of 1.0
                }
            }
        }
        return objectives;
    }
    calculateProblemComplexity(input) {
        const words = input.toLowerCase().split(/\s+/);
        const complexityIndicators = ['complex', 'difficult', 'challenging', 'complicated', 'multiple', 'many'];
        const simplicityIndicators = ['simple', 'easy', 'basic', 'straightforward', 'single'];
        const complexityCount = words.filter(word => complexityIndicators.some(indicator => word.includes(indicator))).length;
        const simplicityCount = words.filter(word => simplicityIndicators.some(indicator => word.includes(indicator))).length;
        const baseComplexity = 0.5 + (complexityCount * 0.1) - (simplicityCount * 0.1);
        return Math.max(0, Math.min(1, baseComplexity));
    }
    decomposeProblem(problem) {
        const subproblems = [];
        // Simple decomposition based on problem type
        switch (problem.type) {
            case 'optimization':
                subproblems.push(this.createSubproblem(problem, 'objective_analysis', 'Analyze objectives'), this.createSubproblem(problem, 'constraint_analysis', 'Analyze constraints'), this.createSubproblem(problem, 'solution_generation', 'Generate solutions'));
                break;
            case 'planning':
                subproblems.push(this.createSubproblem(problem, 'goal_analysis', 'Analyze goals'), this.createSubproblem(problem, 'resource_analysis', 'Analyze resources'), this.createSubproblem(problem, 'timeline_generation', 'Generate timeline'));
                break;
            default:
                // Generic decomposition
                subproblems.push(this.createSubproblem(problem, 'analysis', 'Problem analysis'), this.createSubproblem(problem, 'solution_design', 'Solution design'), this.createSubproblem(problem, 'implementation', 'Implementation'));
        }
        return subproblems;
    }
    createSubproblem(parentProblem, name, description) {
        return {
            id: `subproblem_${Date.now()}`,
            name,
            description,
            type: parentProblem.type,
            constraints: [...parentProblem.constraints],
            objectives: [...parentProblem.objectives],
            complexity: parentProblem.complexity,
            urgency: parentProblem.urgency
        };
    }
    createSolutionStep(id, description, action, parameters) {
        return {
            id: id,
            description: description,
            action: action,
            parameters: parameters,
        };
    }
    calculateSolutionQuality(problem, strategy) {
        // Calculate solution quality based on problem complexity and strategy confidence
        const complexityFactor = 1.0 - problem.complexity;
        const strategyFactor = strategy.complexity; // Use strategy's complexity as confidence
        return (complexityFactor * 0.6) + (strategyFactor * 0.4);
    }
    calculateSolutionFeasibility(problem, strategy) {
        // Calculate feasibility based on problem constraints and strategy type
        const constraintFactor = problem.constraints.length > 0 ? 0.8 : 1.0;
        const strategyFactor = strategy.type === 'algorithmic' ? 0.9 : 0.7;
        return (constraintFactor * 0.5) + (strategyFactor * 0.5);
    }
    generateProblemSolverConclusion(_input, problem, bestSolution) {
        if (!bestSolution) {
            return 'No suitable solution strategy found for the problem.';
        }
        return `Problem-solving analysis identified ${problem.description} as a ${problem.type} problem with complexity ${(problem.complexity * 100).toFixed(1)}%. The best solution uses ${bestSolution.approach} with quality ${(bestSolution.quality * 100).toFixed(1)}% and feasibility ${(bestSolution.feasibility * 100).toFixed(1)}%.`;
    }
    gatherProblemSolverEvidence(_input, problem, strategies, solutions) {
        const evidence = [];
        // Add problem-based evidence
        evidence.push(`Identified problem type: ${problem.type}`);
        evidence.push(`Problem complexity: ${(problem.complexity * 100).toFixed(1)}%`);
        // Add strategy-based evidence
        strategies.forEach(strategy => {
            evidence.push(`Applied strategy: ${strategy.name} (${strategy.type})`);
        });
        // Add solution-based evidence
        if (solutions.length > 0) {
            evidence.push(`Generated ${solutions.length} potential solutions`);
        }
        return evidence;
    }
    generateProblemSolverAlternatives(_input, solutions) {
        const alternatives = [];
        // Suggest alternative approaches
        if (solutions.some(sol => sol.approach?.includes('decomposition'))) {
            alternatives.push('Consider holistic approach instead of decomposition');
        }
        if (solutions.some(sol => sol.approach?.includes('algorithmic'))) {
            alternatives.push('Consider heuristic approach for faster solution');
        }
        if (solutions.some(sol => sol.approach?.includes('creative'))) {
            alternatives.push('Consider systematic approach for more reliable solution');
        }
        // General alternatives
        alternatives.push('Explore additional problem-solving strategies');
        alternatives.push('Consider hybrid approaches combining multiple strategies');
        return alternatives;
    }
    identifyProblemSolverUncertaintySources(input, problem) {
        const sources = [];
        if (problem.complexity > 0.7) {
            sources.push('High problem complexity introduces uncertainty');
        }
        if (problem.constraints.length > 3) {
            sources.push('Multiple constraints may conflict');
        }
        if (input.includes('?')) {
            sources.push('Question format indicates problem uncertainty');
        }
        return sources;
    }
    suggestProblemSolverUncertaintyMitigation(_input, problem) {
        const mitigations = [];
        if (problem.complexity > 0.7) {
            mitigations.push('Break down complex problem into simpler subproblems');
            mitigations.push('Use iterative refinement approach');
        }
        if (problem.constraints.length > 3) {
            mitigations.push('Prioritize constraints by importance');
            mitigations.push('Use constraint relaxation techniques');
        }
        return mitigations;
    }
    updatePerformanceMetrics(_reasoningTime, confidence, strategiesApplied) {
        this.performanceMetrics.averageQuality =
            (this.performanceMetrics.averageQuality * this.performanceMetrics.totalSolutions + confidence) /
                (this.performanceMetrics.totalSolutions + 1);
        this.performanceMetrics.strategiesApplied += strategiesApplied;
    }
    getPerformanceMetrics() {
        return {
            ...this.performanceMetrics,
            averageReasoningTime: this.calculateAverageReasoningTime()
        };
    }
    calculateAverageReasoningTime() {
        // This would be calculated from actual timing data
        return 120; // Placeholder
    }
    addProblem(problem) {
        this.problems.set(problem.id, problem);
        this.logger.info('Added problem', { problemId: problem.id, name: problem.description });
    }
    addSolution(solution) {
        this.solutions.set(solution.id, solution);
        this.logger.info('Added solution', { solutionId: solution.id, problemId: solution.problemId });
    }
    addStrategy(strategy) {
        this.strategies.set(strategy.id, strategy);
        this.logger.info('Added problem-solving strategy', { strategyId: strategy.id, name: strategy.name });
    }
}
