import { ReasoningResult } from '@/types';
import { Logger } from '@/utils/Logger';

export interface DecisionOption {
  id: string;
  name: string;
  description: string;
  criteria: Map<string, number>; // Criterion name -> score
  utilities: Map<string, number>; // Utility name -> value
  risks: Map<string, number>; // Risk name -> probability
  confidence: number;
}

export interface DecisionCriterion {
  id: string;
  name: string;
  weight: number;
  type: 'benefit' | 'cost' | 'risk' | 'uncertainty';
  importance: number; // 0-1 scale
}

export interface DecisionRule {
  id: string;
  name: string;
  type: 'maximax' | 'maximin' | 'minimax_regret' | 'expected_value' | 'utility_maximization';
  description: string;
  confidence: number;
  evidence: string[];
}

export interface DecisionAnalysis {
  selectedOption: string;
  reasoning: string;
  confidence: number;
  alternatives: string[];
  risks: string[];
  recommendations: string[];
}

export class DecisionEngine {
  private options: Map<string, DecisionOption> = new Map();
  private criteria: Map<string, DecisionCriterion> = new Map();
  private rules: Map<string, DecisionRule> = new Map();
  private logger: Logger;
  private isInitialized = false;
  private performanceMetrics = {
    totalDecisions: 0,
    averageConfidence: 0,
    optionsAnalyzed: 0,
    rulesApplied: 0
  };

  constructor() {
    this.logger = new Logger('DecisionEngine');
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      this.logger.info('Initializing Decision Engine...');

      // Initialize decision rules
      this.initializeDecisionRules();

      // Initialize performance metrics
      this.performanceMetrics = {
        totalDecisions: 0,
        averageConfidence: 0,
        optionsAnalyzed: 0,
        rulesApplied: 0
      };

      this.isInitialized = true;
      this.logger.info('Decision Engine initialized successfully');

    } catch (error) {
      this.logger.error('Failed to initialize Decision Engine', error instanceof Error ? error : undefined);
      throw error;
    }
  }

  private initializeDecisionRules(): void {
    // Initialize decision-making rules
    const standardRules: DecisionRule[] = [
      {
        id: 'maximax',
        name: 'Maximax (Optimistic)',
        type: 'maximax',
        description: 'Choose option with highest possible payoff',
        confidence: 0.7,
        evidence: ['Optimistic decision theory', 'Risk-seeking behavior']
      },
      {
        id: 'maximin',
        name: 'Maximin (Conservative)',
        type: 'maximin',
        description: 'Choose option with best worst-case outcome',
        confidence: 0.8,
        evidence: ['Conservative decision theory', 'Risk-averse behavior']
      },
      {
        id: 'minimax_regret',
        name: 'Minimax Regret',
        type: 'minimax_regret',
        description: 'Choose option that minimizes maximum regret',
        confidence: 0.75,
        evidence: ['Regret minimization', 'Bounded rationality']
      },
      {
        id: 'expected_value',
        name: 'Expected Value',
        type: 'expected_value',
        description: 'Choose option with highest expected value',
        confidence: 0.85,
        evidence: ['Expected utility theory', 'Rational choice theory']
      },
      {
        id: 'utility_maximization',
        name: 'Utility Maximization',
        type: 'utility_maximization',
        description: 'Choose option that maximizes utility',
        confidence: 0.9,
        evidence: ['Utility theory', 'Rational decision making']
      }
    ];

    standardRules.forEach(rule => {
      this.rules.set(rule.id, rule);
    });

    this.logger.info('DecisionEngine initialized with standard rules');
  }

  public reason(input: string, context?: Record<string, any>): ReasoningResult {
    return this.decide(input, context);
  }

  public decide(input: string, context?: Record<string, any>): ReasoningResult {
    if (!this.isInitialized) {
      throw new Error('Decision Engine not initialized');
    }

    try {
      this.logger.debug('Performing decision reasoning', { input });

      const options = this.extractDecisionOptions(input, context);
      const criteria = this.extractDecisionCriteria(input, context);
      const applicableRules = this.findApplicableRules(input, options, criteria);
      const analysis = this.performDecisionAnalysis(input, options, criteria, applicableRules);
      const confidence = this.calculateDecisionConfidence(input, options, analysis);
      const uncertainty = this.calculateDecisionUncertainty(input, options, analysis);

      const result: ReasoningResult = {
        confidence: confidence,
        reasoning: {
          logic: 'classical',
          steps: [
            {
              id: 'options_extracted',
              type: 'deduction',
              premise: { content: `Decision options identified: ${options.length}`, truthValue: 1, certainty: 1, evidence: [] },
              conclusion: { content: '', truthValue: 1, certainty: 1, evidence: [] },
              confidence: 1,
              reasoning: 'Options extraction step'
            },
            {
              id: 'criteria_extracted',
              type: 'deduction',
              premise: { content: `Decision criteria identified: ${criteria.length}`, truthValue: 1, certainty: 1, evidence: [] },
              conclusion: { content: '', truthValue: 1, certainty: 1, evidence: [] },
              confidence: 1,
              reasoning: 'Criteria extraction step'
            },
            {
              id: 'rules_applied',
              type: 'deduction',
              premise: { content: `Applicable rules found: ${applicableRules.length}`, truthValue: 1, certainty: 1, evidence: [] },
              conclusion: { content: '', truthValue: 1, certainty: 1, evidence: [] },
              confidence: 1,
              reasoning: 'Rules application step'
            },
            {
              id: 'analysis_completed',
              type: 'deduction',
              premise: { content: `Decision analysis completed with confidence: ${confidence.toFixed(3)}`, truthValue: 1, certainty: 1, evidence: [] },
              conclusion: { content: '', truthValue: 1, certainty: 1, evidence: [] },
              confidence: confidence,
              reasoning: 'Analysis completion step'
            }
          ],
          evidence: this.gatherDecisionEvidence(input, options, criteria, applicableRules, analysis).map(() => ({
            source: 'decision_engine',
            strength: 1,
            reliability: 1,
            timestamp: Date.now()
          })),
          assumptions: []
        },
        conclusions: [],
        uncertainty: {
          type: 'probabilistic',
          parameters: { confidence: 1 - uncertainty },
          confidence: 1 - uncertainty
        },
        alternatives: this.generateAlternatives(options, analysis.selectedOption).map((alt, i) => ({
          id: `alt_${i}`,
          description: alt,
          probability: 0.5,
          feasibility: 1,
          consequences: [],
          reasoning: 'Alternative generated'
        }))
      };

      this.updatePerformanceMetrics(Date.now(), confidence, applicableRules.length);
      this.logger.info('Decision reasoning completed', { confidence, selectedOption: analysis.selectedOption });

      return result;

    } catch (error) {
      this.logger.error('Error in decision reasoning', error instanceof Error ? error : undefined);
      throw error;
    }
  }

  private extractDecisionOptions(input: string, context?: Record<string, any>): DecisionOption[] {
    const options: DecisionOption[] = [];

    // Extract decision options from input using pattern matching
    const optionPatterns = [
      /(?:choose|select|pick|decide)\s+(?:between|among)\s+(.+?)(?:\s+or|\s+and|\s*,)/gi,
      /(?:option|choice|alternative)\s+(\w+)/gi,
      /(?:should|could|might)\s+(.+?)(?:\s+or|\s+and|\s*,)/gi
    ];

    let optionId = 0;
    for (const pattern of optionPatterns) {
      const matches = input.matchAll(pattern);
      for (const match of matches) {
        const option: DecisionOption = {
          id: `option_${optionId++}`,
          name: match[1] || `Option_${optionId}`,
          description: match[0].trim(),
          criteria: this.extractCriteria(match[0]),
          utilities: this.extractUtilities(match[0]),
          risks: this.extractRisks(match[0]),
          confidence: this.calculateOptionConfidence(match[0])
        };
        options.push(option);
      }
    }

    // Add context options if provided
    if (context?.decisionOptions) {
      for (const contextOption of context.decisionOptions) {
        options.push({
          id: `context_${optionId++}`,
          name: contextOption.name || 'Context Option',
          description: contextOption.description || 'Context decision option',
          criteria: new Map(Object.entries(contextOption.criteria || {})),
          utilities: new Map(Object.entries(contextOption.utilities || {})),
          risks: new Map(Object.entries(contextOption.risks || {})),
          confidence: contextOption.confidence || 0.7
        });
      }
    }

    this.performanceMetrics.optionsAnalyzed += options.length;
    return options;
  }

  private extractDecisionCriteria(input: string, context?: Record<string, any>): DecisionCriterion[] {
    const criteria: DecisionCriterion[] = [];

    // Extract decision criteria from input
    const criterionPatterns = [
      /(?:based on|considering|evaluating)\s+(.+?)(?:\s+and|\s+or|\s*,)/gi,
      /(?:criterion|factor|aspect)\s+(\w+)/gi,
      /(?:important|key|critical)\s+(.+?)(?:\s+and|\s+or|\s*,)/gi
    ];

    let criterionId = 0;
    for (const pattern of criterionPatterns) {
      const matches = input.matchAll(pattern);
      for (const match of matches) {
        const criterion: DecisionCriterion = {
          id: `criterion_${criterionId++}`,
          name: match[1] || `Criterion_${criterionId}`,
          weight: this.calculateCriterionWeight(match[0]),
          type: this.determineCriterionType(match[0]),
          importance: this.calculateCriterionImportance(match[0])
        };
        criteria.push(criterion);
      }
    }

    // Add context criteria if provided
    if (context?.decisionCriteria) {
      for (const contextCriterion of context.decisionCriteria) {
        criteria.push({
          id: `context_${criterionId++}`,
          name: contextCriterion.name || 'Context Criterion',
          weight: contextCriterion.weight || 1.0,
          type: contextCriterion.type || 'benefit',
          importance: contextCriterion.importance || 0.7
        });
      }
    }

    return criteria;
  }

  private findApplicableRules(input: string, options: DecisionOption[], criteria: DecisionCriterion[]): DecisionRule[] {
    const applicableRules: DecisionRule[] = [];

    for (const rule of this.rules.values()) {
      if (this.isRuleApplicable(input, options, criteria, rule)) {
        applicableRules.push(rule);
      }
    }

    return applicableRules;
  }

  private isRuleApplicable(_input: string, _options: DecisionOption[], _criteria: DecisionCriterion[], rule: DecisionRule): boolean {
    // Simplified rule applicability check
    return rule.confidence > 0.5;
  }

  private performDecisionAnalysis(_input: string, options: DecisionOption[], criteria: DecisionCriterion[], rules: DecisionRule[]): DecisionAnalysis {
    if (options.length === 0) {
      return {
        selectedOption: 'none',
        reasoning: 'No options available',
        confidence: 0,
        alternatives: [],
        risks: [],
        recommendations: []
      };
    }

    let bestResult = { selectedOption: 'unknown', reasoning: '', confidence: 0 };

    for (const rule of rules) {
      const result = this.applyDecisionRule(rule, options, criteria);
      if (result.confidence > bestResult.confidence) {
        bestResult = result;
      }
    }

    return {
      selectedOption: bestResult.selectedOption,
      reasoning: bestResult.reasoning,
      confidence: bestResult.confidence,
      alternatives: this.generateAlternatives(options, bestResult.selectedOption),
      risks: this.identifyRisks(options, bestResult.selectedOption),
      recommendations: this.generateRecommendations(options, criteria)
    };
  }

  private applyDecisionRule(rule: DecisionRule, options: DecisionOption[], criteria: DecisionCriterion[]): { selectedOption: string; reasoning: string; confidence: number } {
    switch (rule.type) {
      case 'maximax':
        return this.applyMaximaxRule(options);
      case 'maximin':
        return this.applyMaximinRule(options);
      case 'minimax_regret':
        return this.applyMinimaxRegretRule(options);
      case 'expected_value':
        return this.applyExpectedValueRule(options);
      case 'utility_maximization':
        return this.applyUtilityMaximizationRule(options, criteria);
      default:
        return {
          selectedOption: options[0]?.id || 'none',
          reasoning: `Applied ${rule.name} rule`,
          confidence: rule.confidence
        };
    }
  }

  private applyMaximaxRule(options: DecisionOption[]): { selectedOption: string; reasoning: string; confidence: number } {
    let bestOption = options[0];
    let maxUtility = -Infinity;

    for (const option of options) {
      const utilities = Array.from(option.utilities.values());
      const maxOptionUtility = Math.max(...utilities);
      
      if (maxOptionUtility > maxUtility) {
        maxUtility = maxOptionUtility;
        bestOption = option;
      }
    }

    return {
      selectedOption: bestOption?.id || 'unknown',
      reasoning: `Maximax rule: Selected ${bestOption?.name || 'unknown'} with maximum possible utility ${maxUtility}`,
      confidence: 0.8
    };
  }

  private applyMaximinRule(options: DecisionOption[]): { selectedOption: string; reasoning: string; confidence: number } {
    let bestOption = options[0];
    let maxMinUtility = -Infinity;

    for (const option of options) {
      const utilities = Array.from(option.utilities.values());
      const minOptionUtility = Math.min(...utilities);
      
      if (minOptionUtility > maxMinUtility) {
        maxMinUtility = minOptionUtility;
        bestOption = option;
      }
    }

    return {
      selectedOption: bestOption?.id || 'unknown',
      reasoning: `Maximin rule: Selected ${bestOption?.name || 'unknown'} with best worst-case utility ${maxMinUtility}`,
      confidence: 0.85
    };
  }

  private applyMinimaxRegretRule(options: DecisionOption[]): { selectedOption: string; reasoning: string; confidence: number } {
    let bestOption = options[0];
    let minMaxRegret = Infinity;

    for (const option of options) {
      const maxRegret = Math.max(...Array.from(option.risks.values()));
      if (maxRegret < minMaxRegret) {
        minMaxRegret = maxRegret;
        bestOption = option;
      }
    }

    return {
      selectedOption: bestOption?.id || 'unknown',
      reasoning: `Minimax regret rule: Selected ${bestOption?.name || 'unknown'} with minimum maximum regret ${minMaxRegret}`,
      confidence: 0.75
    };
  }

  private applyExpectedValueRule(options: DecisionOption[]): { selectedOption: string; reasoning: string; confidence: number } {
    let bestOption = options[0];
    let maxExpectedValue = -Infinity;

    for (const option of options) {
      const utilities = Array.from(option.utilities.values());
      const expectedValue = utilities.reduce((sum, util) => sum + util, 0) / utilities.length;
      
      if (expectedValue > maxExpectedValue) {
        maxExpectedValue = expectedValue;
        bestOption = option;
      }
    }

    return {
      selectedOption: bestOption?.id || 'unknown',
      reasoning: `Expected value rule: Selected ${bestOption?.name || 'unknown'} with expected value ${maxExpectedValue.toFixed(3)}`,
      confidence: 0.85
    };
  }

  private applyUtilityMaximizationRule(options: DecisionOption[], criteria: DecisionCriterion[]): { selectedOption: string; reasoning: string; confidence: number } {
    let bestOption = options[0];
    let maxWeightedUtility = -Infinity;

    for (const option of options) {
      let weightedUtility = 0;
      let totalWeight = 0;

      for (const criterion of criteria) {
        const criterionScore = option.criteria.get(criterion.name) || 0;
        weightedUtility += criterionScore * criterion.weight;
        totalWeight += criterion.weight;
      }

      const normalizedUtility = totalWeight > 0 ? weightedUtility / totalWeight : 0;
      
      if (normalizedUtility > maxWeightedUtility) {
        maxWeightedUtility = normalizedUtility;
        bestOption = option;
      }
    }

    return {
      selectedOption: bestOption?.id || 'unknown',
      reasoning: `Utility maximization rule: Selected ${bestOption?.name || 'unknown'} with weighted utility ${maxWeightedUtility.toFixed(3)}`,
      confidence: 0.9
    };
  }

  private calculateDecisionConfidence(input: string, options: DecisionOption[], analysis: DecisionAnalysis): number {
    if (options.length === 0) return 0.5;

    const optionConfidence = options.length > 0 ? 
      options.reduce((sum, opt) => sum + opt.confidence, 0) / options.length : 0.5;
    const analysisConfidence = analysis.confidence;
    const inputComplexityFactor = Math.min(input.length / 100, 1.0);

    const confidence = (optionConfidence * 0.3) + (analysisConfidence * 0.6) + (inputComplexityFactor * 0.1);
    
    return Math.max(0, Math.min(1, confidence));
  }

  private calculateDecisionUncertainty(input: string, options: DecisionOption[], analysis: DecisionAnalysis): number {
    if (options.length === 0) return 0.5;

    const optionUncertainty = options.some(opt => opt.risks.size > 0) ? 0.3 : 0.1;
    const analysisUncertainty = analysis.confidence < 0.7 ? 0.3 : 0.1;
    const inputUncertainty = input.includes('?') || input.includes('maybe') ? 0.2 : 0.1;

    return Math.min(optionUncertainty + analysisUncertainty + inputUncertainty, 1.0);
  }

  private extractCriteria(text: string): Map<string, number> {
    const criteria = new Map<string, number>();
    
    // Extract criteria scores from text
    const criterionPatterns = [
      /(\w+)\s+score:\s*(\d+)/gi,
      /(\w+)\s+rating:\s*(\d+)/gi,
      /(\w+)\s+value:\s*(\d+)/gi
    ];

    for (const pattern of criterionPatterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        if (match[1] && match[2]) {
          criteria.set(match[1], parseInt(match[2]) / 10); // Normalize to 0-1
        }
      }
    }

    return criteria;
  }

  private extractUtilities(text: string): Map<string, number> {
    const utilities = new Map<string, number>();
    
    // Extract utility values from text
    const utilityPatterns = [
      /(\w+)\s+utility:\s*(\d+)/gi,
      /(\w+)\s+benefit:\s*(\d+)/gi,
      /(\w+)\s+value:\s*(\d+)/gi
    ];

    for (const pattern of utilityPatterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        if (match[1] && match[2]) {
          utilities.set(match[1], parseInt(match[2]) / 10); // Normalize to 0-1
        }
      }
    }

    return utilities;
  }

  private extractRisks(text: string): Map<string, number> {
    const risks = new Map<string, number>();
    
    // Extract risk probabilities from text
    const riskPatterns = [
      /(\w+)\s+risk:\s*(\d+)/gi,
      /(\w+)\s+probability:\s*(\d+)/gi,
      /(\w+)\s+chance:\s*(\d+)/gi
    ];

    for (const pattern of riskPatterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        if (match[1] && match[2]) {
          risks.set(match[1], parseInt(match[2]) / 100); // Normalize to 0-1
        }
      }
    }

    return risks;
  }

  private calculateOptionConfidence(text: string): number {
    const words = text.toLowerCase().split(/\s+/);
    const confidenceIndicators = ['certain', 'sure', 'definite', 'clear'];
    const uncertaintyIndicators = ['maybe', 'possibly', 'uncertain', 'doubt'];
    
    const confidenceCount = words.filter(word => 
      confidenceIndicators.some(indicator => word.includes(indicator))
    ).length;
    
    const uncertaintyCount = words.filter(word => 
      uncertaintyIndicators.some(indicator => word.includes(indicator))
    ).length;
    
    const baseConfidence = 0.5 + (confidenceCount * 0.1) - (uncertaintyCount * 0.1);
    return Math.max(0, Math.min(1, baseConfidence));
  }

  private calculateCriterionWeight(text: string): number {
    const words = text.toLowerCase().split(/\s+/);
    const importanceIndicators = ['important', 'critical', 'key', 'essential'];
    
    const importanceCount = words.filter(word => 
      importanceIndicators.some(indicator => word.includes(indicator))
    ).length;
    
    return Math.min(importanceCount * 0.2, 1.0);
  }

  private determineCriterionType(text: string): DecisionCriterion['type'] {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('cost') || lowerText.includes('expense')) return 'cost';
    else if (lowerText.includes('risk') || lowerText.includes('danger')) return 'risk';
    else if (lowerText.includes('uncertain') || lowerText.includes('unknown')) return 'uncertainty';
    else return 'benefit';
  }

  private calculateCriterionImportance(text: string): number {
    const words = text.toLowerCase().split(/\s+/);
    const importanceIndicators = ['important', 'critical', 'key', 'essential', 'vital'];
    
    const importanceCount = words.filter(word => 
      importanceIndicators.some(indicator => word.includes(indicator))
    ).length;
    
    return Math.min(importanceCount * 0.2, 1.0);
  }

  private generateAlternatives(options: DecisionOption[], selectedOption: string): string[] {
    const alternatives: string[] = [];
    
    for (const option of options) {
      if (option.id !== selectedOption) {
        alternatives.push(`Consider ${option.name} as alternative`);
      }
    }

    return alternatives;
  }

  private identifyRisks(options: DecisionOption[], selectedOption: string): string[] {
    const risks: string[] = [];
    
    const selected = options.find(opt => opt.id === selectedOption);
    if (selected) {
      for (const [riskName, probability] of selected.risks) {
        if (probability > 0.3) {
          risks.push(`High risk of ${riskName} (${(probability * 100).toFixed(1)}%)`);
        }
      }
    }

    return risks;
  }

  private generateRecommendations(options: DecisionOption[], criteria: DecisionCriterion[]): string[] {
    const recommendations: string[] = [];
    
    // Generate recommendations based on options and criteria
    if (options.length > 0) {
      recommendations.push(`Consider ${options.length} available options`);
    }
    
    if (criteria.length > 0) {
      recommendations.push(`Evaluate based on ${criteria.length} criteria`);
    }
    
    return recommendations;
  }

  private gatherDecisionEvidence(_input: string, options: DecisionOption[], criteria: DecisionCriterion[], rules: DecisionRule[], analysis: DecisionAnalysis): string[] {
    const evidence: string[] = [];
    
    evidence.push(`Analyzed ${options.length} decision options`);
    evidence.push(`Applied ${rules.length} decision rules`);
    evidence.push(`Evaluated ${criteria.length} decision criteria`);
    evidence.push(`Selected option: ${analysis.selectedOption}`);
    
    return evidence;
  }

  private identifyDecisionUncertaintySources(input: string, options: DecisionOption[]): string[] {
    const sources: string[] = [];

    if (options.some(opt => opt.risks.size > 0)) {
      sources.push('Risk factors introduce uncertainty');
    }
    if (options.some(opt => opt.confidence < 0.7)) {
      sources.push('Low confidence in option evaluations');
    }
    if (input.includes('?')) {
      sources.push('Question format indicates decision uncertainty');
    }

    return sources;
  }

  private suggestDecisionUncertaintyMitigation(_input: string, options: DecisionOption[]): string[] {
    const mitigations: string[] = [];
    
    if (options.length === 0) {
      mitigations.push('Gather more decision options');
    }
    
    mitigations.push('Collect additional information');
    mitigations.push('Consider multiple decision criteria');
    
    return mitigations;
  }

  private updatePerformanceMetrics(_reasoningTime: number, confidence: number, rulesApplied: number): void {
    this.performanceMetrics.totalDecisions++;
    this.performanceMetrics.averageConfidence = 
      (this.performanceMetrics.averageConfidence * (this.performanceMetrics.totalDecisions - 1) + confidence) / this.performanceMetrics.totalDecisions;
    this.performanceMetrics.rulesApplied += rulesApplied;
  }

  public getPerformanceMetrics(): Record<string, any> {
    return {
      ...this.performanceMetrics,
      averageReasoningTime: this.calculateAverageReasoningTime()
    };
  }

  private calculateAverageReasoningTime(): number {
    // This would be calculated from actual timing data
    return 90; // Placeholder
  }

  public addDecisionOption(option: DecisionOption): void {
    this.options.set(option.id, option);
    this.logger.info('Added decision option', { optionId: option.id, name: option.name });
  }

  public addDecisionCriterion(criterion: DecisionCriterion): void {
    this.criteria.set(criterion.id, criterion);
    this.logger.info('Added decision criterion', { criterionId: criterion.id, name: criterion.name });
  }

  public addDecisionRule(rule: DecisionRule): void {
    this.rules.set(rule.id, rule);
    this.logger.info('Added decision rule', { ruleId: rule.id, name: rule.name });
  }
} 