/**
 * Fuzzy Logic Engine
 * Implements fuzzy logic for handling uncertainty and imprecision
 */
import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '../../utils/Logger';
export class FuzzyLogic extends EventEmitter {
    id;
    logger;
    isInitialized = false;
    membershipFunctions = new Map();
    performanceMetrics = {
        totalInferences: 0,
        averageConfidence: 0,
        uncertaintyHandled: 0
    };
    constructor() {
        super();
        this.id = uuidv4();
        this.logger = new Logger('FuzzyLogic');
        this.logger.info('Fuzzy Logic Engine constructed', { id: this.id });
        this.initializeFuzzyRules();
    }
    /**
     * Initialize the fuzzy logic component
     */
    async initialize() {
        try {
            this.logger.info('Initializing Fuzzy Logic...');
            // Initialize fuzzy rules
            this.initializeFuzzyRules();
            // Initialize performance metrics
            this.performanceMetrics = {
                totalInferences: 0,
                averageConfidence: 0,
                uncertaintyHandled: 0
            };
            this.logger.info('Fuzzy Logic initialized successfully');
        }
        catch (error) {
            this.logger.error('Failed to initialize Fuzzy Logic', error instanceof Error ? error : undefined);
            throw error;
        }
    }
    async reason(input) {
        if (!this.isInitialized) {
            throw new Error('Fuzzy Logic Engine not initialized');
        }
        try {
            this.logger.debug('Performing fuzzy reasoning');
            // Fuzzify input
            const fuzzifiedInput = this.fuzzifyInput(input);
            // Apply fuzzy rules
            const fuzzyConclusions = this.applyFuzzyRules(fuzzifiedInput);
            // Defuzzify results
            const defuzzifiedResults = this.defuzzifyResults(fuzzyConclusions);
            const result = {
                confidence: this.calculateFuzzyConfidence(defuzzifiedResults),
                reasoning: {
                    steps: this.generateFuzzySteps(fuzzifiedInput, fuzzyConclusions),
                    logic: 'fuzzy',
                    evidence: [],
                    assumptions: []
                },
                conclusions: defuzzifiedResults,
                uncertainty: this.calculateUncertainty(defuzzifiedResults)
            };
            // Update metrics
            this.updateMetrics(result);
            return result;
        }
        catch (error) {
            this.logger.error('Fuzzy reasoning failed', error instanceof Error ? error : undefined);
            throw error;
        }
    }
    async infer(premises) {
        try {
            this.logger.debug('Performing fuzzy inference', { premisesCount: premises.length });
            const conclusions = [];
            for (const premise of premises) {
                const fuzzifiedPremise = this.fuzzifyInput(premise);
                const fuzzyConclusion = this.applyFuzzyInference(fuzzifiedPremise);
                const defuzzifiedConclusion = this.defuzzifyResults([fuzzyConclusion]);
                conclusions.push({
                    type: 'fuzzy_inference',
                    content: defuzzifiedConclusion[0]?.content || 'Fuzzy inference result',
                    confidence: defuzzifiedConclusion[0]?.confidence || 0.7,
                    uncertainty: this.calculateUncertainty(defuzzifiedConclusion)
                });
            }
            return conclusions;
        }
        catch (error) {
            this.logger.error('Fuzzy inference failed', error instanceof Error ? error : undefined);
            throw error;
        }
    }
    getMetrics() {
        return {
            ...this.performanceMetrics,
            engineType: 'fuzzy',
            isInitialized: this.isInitialized,
            membershipFunctionsCount: this.membershipFunctions.size
        };
    }
    // Private methods
    initializeFuzzyRules() {
        // Initialize fuzzy inference rules
        this.logger.debug('Initialized fuzzy rules');
    }
    fuzzifyInput(input) {
        // Convert crisp input to fuzzy sets
        const fuzzified = {};
        // Fuzzify goals
        if (input.goals) {
            fuzzified.goals = input.goals.map((goal) => ({
                original: goal,
                fuzzy: this.calculateMembership(goal.priority || 0.5, 'medium')
            }));
        }
        // Fuzzify constraints
        if (input.constraints) {
            fuzzified.constraints = input.constraints.map((constraint) => ({
                original: constraint,
                fuzzy: this.calculateMembership(constraint.strength || 0.5, 'medium')
            }));
        }
        // Fuzzify context
        if (input.context) {
            fuzzified.context = {
                original: input.context,
                fuzzy: this.calculateMembership(0.5, 'uncertain')
            };
        }
        return fuzzified;
    }
    calculateMembership(value, functionName) {
        const membershipFunction = this.membershipFunctions.get(functionName);
        if (!membershipFunction) {
            return 0.5; // Default membership
        }
        // Simple membership calculation
        switch (membershipFunction.type) {
            case 'triangular':
                return this.calculateTriangularMembership(value, membershipFunction.parameters);
            case 'trapezoidal':
                return this.calculateTrapezoidalMembership(value, membershipFunction.parameters);
            case 'gaussian':
                return this.calculateGaussianMembership(value, membershipFunction.parameters);
            default:
                return 0.5;
        }
    }
    calculateTriangularMembership(value, params) {
        const [a, b, c] = params;
        if (a === undefined || b === undefined || c === undefined)
            return 0;
        if (value <= a || value >= c)
            return 0;
        if (value === b)
            return 1;
        if (value < b)
            return (value - a) / (b - a);
        return (c - value) / (c - b);
    }
    calculateTrapezoidalMembership(value, params) {
        const [a, b, c, d] = params;
        if (a === undefined || b === undefined || c === undefined || d === undefined)
            return 0;
        if (value <= a || value >= d)
            return 0;
        if (value >= b && value <= c)
            return 1;
        if (value < b)
            return (value - a) / (b - a);
        return (d - value) / (d - c);
    }
    calculateGaussianMembership(value, params) {
        const [mean, std] = params;
        if (mean === undefined || std === undefined || std === 0)
            return 0;
        return Math.exp(-Math.pow(value - mean, 2) / (2 * Math.pow(std, 2)));
    }
    applyFuzzyRules(fuzzifiedInput) {
        const conclusions = [];
        // Apply fuzzy rules based on fuzzified input
        if (fuzzifiedInput.goals) {
            const goalConclusions = this.applyGoalRules(fuzzifiedInput.goals);
            conclusions.push(...goalConclusions);
        }
        if (fuzzifiedInput.constraints) {
            const constraintConclusions = this.applyConstraintRules(fuzzifiedInput.constraints);
            conclusions.push(...constraintConclusions);
        }
        if (fuzzifiedInput.context) {
            const contextConclusions = this.applyContextRules(fuzzifiedInput.context);
            conclusions.push(...contextConclusions);
        }
        return conclusions;
    }
    applyGoalRules(goals) {
        const conclusions = [];
        for (const goal of goals) {
            const membership = goal.fuzzy;
            if (membership > 0.7) {
                conclusions.push({
                    type: 'high_priority_goal',
                    content: `Goal ${goal.original.description} has high priority`,
                    confidence: membership,
                    reasoning: 'Applied fuzzy rule for high priority goals'
                });
            }
            else if (membership > 0.3) {
                conclusions.push({
                    type: 'medium_priority_goal',
                    content: `Goal ${goal.original.description} has medium priority`,
                    confidence: membership,
                    reasoning: 'Applied fuzzy rule for medium priority goals'
                });
            }
            else {
                conclusions.push({
                    type: 'low_priority_goal',
                    content: `Goal ${goal.original.description} has low priority`,
                    confidence: membership,
                    reasoning: 'Applied fuzzy rule for low priority goals'
                });
            }
        }
        return conclusions;
    }
    applyConstraintRules(constraints) {
        const conclusions = [];
        for (const constraint of constraints) {
            const membership = constraint.fuzzy;
            if (membership > 0.8) {
                conclusions.push({
                    type: 'strict_constraint',
                    content: `Constraint ${constraint.original.type} is very strict`,
                    confidence: membership,
                    reasoning: 'Applied fuzzy rule for strict constraints'
                });
            }
            else if (membership > 0.5) {
                conclusions.push({
                    type: 'moderate_constraint',
                    content: `Constraint ${constraint.original.type} is moderate`,
                    confidence: membership,
                    reasoning: 'Applied fuzzy rule for moderate constraints'
                });
            }
            else {
                conclusions.push({
                    type: 'flexible_constraint',
                    content: `Constraint ${constraint.original.type} is flexible`,
                    confidence: membership,
                    reasoning: 'Applied fuzzy rule for flexible constraints'
                });
            }
        }
        return conclusions;
    }
    applyContextRules(context) {
        const conclusions = [];
        const membership = context.fuzzy;
        conclusions.push({
            type: 'context_uncertainty',
            content: 'Context has moderate uncertainty',
            confidence: membership,
            reasoning: 'Applied fuzzy rule for context uncertainty'
        });
        return conclusions;
    }
    defuzzifyResults(fuzzyConclusions) {
        // Convert fuzzy conclusions back to crisp values
        return fuzzyConclusions.map(conclusion => ({
            type: conclusion.type,
            content: conclusion.content,
            confidence: conclusion.confidence,
            reasoning: conclusion.reasoning
        }));
    }
    calculateFuzzyConfidence(results) {
        if (results.length === 0)
            return 0;
        const totalConfidence = results.reduce((sum, r) => sum + r.confidence, 0);
        return totalConfidence / results.length;
    }
    calculateUncertainty(results) {
        // Calculate uncertainty in fuzzy results
        const uncertainties = results.map(r => 1 - r.confidence);
        const averageUncertainty = uncertainties.reduce((sum, u) => sum + u, 0) / uncertainties.length;
        return {
            type: 'fuzzy',
            parameters: { averageUncertainty },
            confidence: 1 - averageUncertainty
        };
    }
    generateFuzzySteps(fuzzifiedInput, fuzzyConclusions) {
        const steps = [];
        // Add fuzzification step
        steps.push({
            id: '1',
            type: 'fuzzification',
            premise: 'Input fuzzification',
            conclusion: `Fuzzified ${Object.keys(fuzzifiedInput).length} input categories`,
            confidence: 0.9,
            reasoning: 'Applied membership functions to crisp input'
        });
        // Add rule application steps
        fuzzyConclusions.forEach((conclusion, index) => {
            steps.push({
                id: String(index + 2),
                type: 'fuzzy_rule_application',
                premise: conclusion.reasoning,
                conclusion: conclusion.content,
                confidence: conclusion.confidence,
                reasoning: `Applied fuzzy rule: ${conclusion.type}`
            });
        });
        // Add defuzzification step
        steps.push({
            id: String(fuzzyConclusions.length + 2),
            type: 'defuzzification',
            premise: 'Fuzzy conclusions',
            conclusion: `Defuzzified ${fuzzyConclusions.length} conclusions`,
            confidence: 0.85,
            reasoning: 'Converted fuzzy results to crisp values'
        });
        return steps;
    }
    applyFuzzyInference(fuzzifiedPremise) {
        // Apply fuzzy inference to a single premise
        const membership = fuzzifiedPremise.fuzzy || 0.5;
        return {
            type: 'fuzzy_inference',
            content: `Fuzzy inference result with membership ${membership.toFixed(2)}`,
            confidence: membership,
            reasoning: 'Applied fuzzy inference rules'
        };
    }
    updateMetrics(result) {
        this.performanceMetrics.totalInferences++;
        this.performanceMetrics.averageConfidence =
            (this.performanceMetrics.averageConfidence * (this.performanceMetrics.totalInferences - 1) + result.confidence) /
                this.performanceMetrics.totalInferences;
        this.performanceMetrics.uncertaintyHandled += result.uncertainty?.parameters?.averageUncertainty || 0;
    }
}
//# sourceMappingURL=FuzzyLogic.js.map