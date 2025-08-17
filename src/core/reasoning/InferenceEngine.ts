import { ReasoningResult } from '@/types';
import { Logger } from '@/utils/Logger';

export interface InferenceRule {
  id: string;
  name: string;
  type: 'deduction' | 'induction' | 'abduction' | 'analogy';
  antecedent: string[];
  consequent: string;
  confidence: number;
  evidence: string[];
}

export interface InferenceChain {
  id: string;
  steps: InferenceStep[];
  conclusion: string;
  confidence: number;
  type: 'deductive' | 'inductive' | 'abductive' | 'mixed';
}

export interface InferenceStep {
  ruleId: string;
  inputs: string[];
  output: string;
  confidence: number;
  reasoning: string;
}

export interface LogicalPremise {
  id: string;
  statement: string;
  type: 'fact' | 'assumption' | 'hypothesis' | 'observation';
  confidence: number;
  source: string;
}

export class InferenceEngine {
  private rules: Map<string, InferenceRule> = new Map();
  private premises: Map<string, LogicalPremise> = new Map();
  private chains: InferenceChain[] = [];
  private logger: Logger;
  private performanceMetrics = {
    totalInferences: 0,
    averageConfidence: 0,
    rulesApplied: 0,
    chainsGenerated: 0
  };
  private isInitialized = false;

  constructor() {
    this.logger = new Logger('InferenceEngine');
    this.initializeInferenceRules();
  }

  /**
   * Initialize the inference engine component
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      this.logger.info('Initializing Inference Engine...');

      // Initialize inference rules
      this.initializeInferenceRules();

      // Initialize performance metrics
      this.performanceMetrics = {
        totalInferences: 0,
        averageConfidence: 0,
        rulesApplied: 0,
        chainsGenerated: 0
      };

      this.isInitialized = true;
      this.logger.info('Inference Engine initialized successfully');

    } catch (error) {
      this.logger.error('Failed to initialize Inference Engine', error instanceof Error ? error : undefined);
      throw error;
    }
  }

  private initializeInferenceRules(): void {
    // Initialize basic inference rules
    const standardRules: InferenceRule[] = [
      {
        id: 'modus_ponens',
        name: 'Modus Ponens',
        type: 'deduction',
        antecedent: ['If A then B', 'A'],
        consequent: 'B',
        confidence: 0.95,
        evidence: ['Classical logic', 'Deductive reasoning']
      },
      {
        id: 'modus_tollens',
        name: 'Modus Tollens',
        type: 'deduction',
        antecedent: ['If A then B', 'Not B'],
        consequent: 'Not A',
        confidence: 0.9,
        evidence: ['Classical logic', 'Deductive reasoning']
      },
      {
        id: 'syllogism',
        name: 'Syllogism',
        type: 'deduction',
        antecedent: ['All A are B', 'All B are C'],
        consequent: 'All A are C',
        confidence: 0.9,
        evidence: ['Classical logic', 'Syllogistic reasoning']
      },
      {
        id: 'inductive_generalization',
        name: 'Inductive Generalization',
        type: 'induction',
        antecedent: ['A1 is B', 'A2 is B', 'A3 is B'],
        consequent: 'All A are B',
        confidence: 0.7,
        evidence: ['Inductive logic', 'Pattern recognition']
      },
      {
        id: 'abductive_inference',
        name: 'Abductive Inference',
        type: 'abduction',
        antecedent: ['B is observed', 'If A then B'],
        consequent: 'A is the best explanation',
        confidence: 0.6,
        evidence: ['Abductive logic', 'Best explanation']
      },
      {
        id: 'analogical_reasoning',
        name: 'Analogical Reasoning',
        type: 'analogy',
        antecedent: ['A is similar to B', 'B has property C'],
        consequent: 'A likely has property C',
        confidence: 0.5,
        evidence: ['Analogical reasoning', 'Similarity-based inference']
      }
    ];

    standardRules.forEach(rule => {
      this.rules.set(rule.id, rule);
    });

    this.logger.info('InferenceEngine initialized with standard rules');
  }

  public async reason(input: any): Promise<any> {
    return this.infer(input);
  }

  public async infer(input: any): Promise<any> {
    if (!this.isInitialized) {
      throw new Error('Inference Engine not initialized');
    }

    try {
      this.logger.debug('Performing inference reasoning', { input });

      const premises = this.extractPremises(input);
      const applicableRules = this.findApplicableRules(input, premises);
      const inferenceChains = this.generateInferenceChains(input, premises, applicableRules);
      const confidence = this.calculateInferenceConfidence(input, premises, applicableRules);
      const uncertainty = this.calculateInferenceUncertainty(input, premises, inferenceChains);

      const evidenceArr = this.gatherInferenceEvidence(input, premises, applicableRules, inferenceChains).map(() => ({
        source: 'inference_engine',
        strength: 1,
        reliability: 1,
        timestamp: Date.now()
      }));
      const result: ReasoningResult = {
        confidence: confidence,
        reasoning: {
          logic: 'classical',
          steps: [
            {
              id: 'premises_extracted',
              type: 'deduction',
              premise: { content: `Premises extracted: ${premises.length}`, truthValue: 1, certainty: 1, evidence: [] },
              conclusion: { content: '', truthValue: 1, certainty: 1, evidence: [] },
              confidence: 1,
              reasoning: 'Premises extraction step'
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
              id: 'chains_generated',
              type: 'deduction',
              premise: { content: `Inference chains generated: ${inferenceChains.length}`, truthValue: 1, certainty: 1, evidence: [] },
              conclusion: { content: '', truthValue: 1, certainty: 1, evidence: [] },
              confidence: confidence,
              reasoning: 'Chain generation step'
            }
          ],
          evidence: evidenceArr,
          assumptions: []
        },
        conclusions: [],
        uncertainty: {
          type: 'probabilistic',
          parameters: { confidence: 1 - uncertainty },
          confidence: 1 - uncertainty
        },
        alternatives: this.generateInferenceAlternatives(input, applicableRules).map((alt, i) => ({
          id: `alt_${i}`,
          description: alt,
          probability: 0.5,
          feasibility: 1,
          consequences: [],
          reasoning: 'Alternative generated'
        }))
      };

      this.updatePerformanceMetrics(Date.now(), confidence, applicableRules.length);
      this.logger.info('Inference reasoning completed', { confidence, chainsGenerated: inferenceChains.length });

      return result;

    } catch (error) {
      this.logger.error('Error in inference reasoning', error instanceof Error ? error : undefined);
      throw error;
    }
  }

  private extractPremises(input: string, context?: Record<string, any>): LogicalPremise[] {
    const premises: LogicalPremise[] = [];

    // Extract premises from input using pattern matching
    const premisePatterns = [
      /(?:if|when|suppose)\s+(.+?)(?:\s+then|\s+,\s+)/gi, // Conditional premises
      /(?:all|every|each)\s+(\w+)\s+(?:is|are)\s+(\w+)/gi, // Universal premises
      /(?:some|many|most)\s+(\w+)\s+(?:is|are)\s+(\w+)/gi, // Existential premises
      /(\w+)\s+(?:is|are)\s+(\w+)/gi, // Simple statements
      /(?:not|no)\s+(\w+)\s+(?:is|are)\s+(\w+)/gi // Negative statements
    ];

    let premiseId = 0;
    for (const pattern of premisePatterns) {
      const matches = input.matchAll(pattern);
      for (const match of matches) {
        const premise: LogicalPremise = {
          id: `premise_${premiseId++}`,
          statement: match[0].trim(),
          type: this.determinePremiseType(match[0]),
          confidence: this.calculatePremiseConfidence(match[0]),
          source: 'input_extraction'
        };
        premises.push(premise);
      }
    }

    // Add context premises if provided
    if (context?.['premises']) {
      for (const contextPremise of context['premises']) {
        premises.push({
          id: `context_${premiseId++}`,
          statement: contextPremise.statement || 'Context premise',
          type: contextPremise.type || 'assumption',
          confidence: contextPremise.confidence || 0.7,
          source: contextPremise.source || 'context'
        });
      }
    }

    return premises;
  }

  private findApplicableRules(input: string, premises: LogicalPremise[]): InferenceRule[] {
    const applicableRules: InferenceRule[] = [];

    for (const rule of this.rules.values()) {
      if (this.isRuleApplicable(input, premises, rule)) {
        applicableRules.push(rule);
      }
    }

    return applicableRules;
  }

  private isRuleApplicable(input: string, premises: LogicalPremise[], rule: InferenceRule): boolean {
    // Check if rule antecedents match input or premises
    const inputLower = input.toLowerCase();
    const premiseStatements = premises.map(p => p.statement.toLowerCase());

    for (const antecedent of rule.antecedent) {
      const antecedentLower = antecedent.toLowerCase();
      
      // Check if antecedent appears in input or premises
      const matchesInput = inputLower.includes(antecedentLower);
      const matchesPremise = premiseStatements.some(stmt => stmt.includes(antecedentLower));
      
      if (!matchesInput && !matchesPremise) {
        return false;
      }
    }

    return true;
  }

  private generateInferenceChains(input: string, premises: LogicalPremise[], rules: InferenceRule[]): InferenceChain[] {
    const chains: InferenceChain[] = [];

    for (const rule of rules) {
      const chain: InferenceChain = {
        id: `chain_${chains.length}`,
        steps: this.generateStepsForRule(input, premises, rule),
        conclusion: rule.consequent,
        confidence: rule.confidence,
        type: rule.type === 'deduction' ? 'deductive' : 
               rule.type === 'induction' ? 'inductive' : 
               rule.type === 'abduction' ? 'abductive' : 'mixed'
      };
      chains.push(chain);
    }

    // Generate mixed chains combining multiple rules
    if (rules.length > 1) {
      const mixedChain = this.generateMixedChain(input, premises, rules);
      if (mixedChain) {
        chains.push(mixedChain);
      }
    }

    this.performanceMetrics.chainsGenerated += chains.length;
    return chains;
  }

  private generateStepsForRule(_input: string, premises: LogicalPremise[], rule: InferenceRule): InferenceStep[] {
    const steps: InferenceStep[] = [];

    // Create steps based on rule antecedents
    for (let i = 0; i < rule.antecedent.length; i++) {
      const antecedent = rule.antecedent[i];
      if (!antecedent) continue;
      
      const matchingPremise = premises.find(p => 
        p.statement.toLowerCase().includes(antecedent.toLowerCase())
      );

      const step: InferenceStep = {
        ruleId: rule.id,
        inputs: [antecedent],
        output: i === rule.antecedent.length - 1 ? rule.consequent : '',
        confidence: matchingPremise?.confidence || 0.7,
        reasoning: `Applied ${rule.name} rule with antecedent: ${antecedent}`
      };
      steps.push(step);
    }

    return steps;
  }

  private generateMixedChain(input: string, premises: LogicalPremise[], rules: InferenceRule[]): InferenceChain | null {
    if (rules.length < 2) return null;

    const steps: InferenceStep[] = [];
    let currentConclusion = '';

    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      if (!rule) continue;
      
      const ruleSteps = this.generateStepsForRule(input, premises, rule);
      
      steps.push(...ruleSteps);
      currentConclusion = rule.consequent;
    }

    return {
      id: `mixed_chain_${Date.now()}`,
      steps: steps,
      conclusion: currentConclusion,
      confidence: rules.reduce((sum, rule) => sum + (rule?.confidence || 0), 0) / rules.length,
      type: 'mixed'
    };
  }

  private synthesizeConclusion(_input: string, chains: InferenceChain[]): string {
    if (chains.length === 0) {
      return 'No applicable inference rules found for the input.';
    }

    // Find the chain with highest confidence
    const bestChain = chains.reduce((best, current) => 
      current.confidence > best.confidence ? current : best
    );

    const chainCount = chains.length;
    const averageConfidence = chains.reduce((sum, chain) => sum + chain.confidence, 0) / chains.length;

    return `Inference analysis generated ${chainCount} inference chains with average confidence ${(averageConfidence * 100).toFixed(1)}%. The strongest conclusion is: "${bestChain.conclusion}" (confidence: ${(bestChain.confidence * 100).toFixed(1)}%).`;
  }

  private calculateInferenceConfidence(input: string, premises: LogicalPremise[], rules: InferenceRule[]): number {
    if (premises.length === 0) return 0.5;

    const premiseConfidence = premises.reduce((sum, premise) => sum + premise.confidence, 0) / premises.length;
    const ruleConfidence = rules.length > 0 ? 
      rules.reduce((sum, rule) => sum + rule.confidence, 0) / rules.length : 0.5;
    const inputComplexityFactor = Math.min(input.length / 100, 1.0);

    const confidence = (premiseConfidence * 0.4) + (ruleConfidence * 0.5) + (inputComplexityFactor * 0.1);
    
    return Math.max(0, Math.min(1, confidence));
  }

  private calculateInferenceUncertainty(input: string, premises: LogicalPremise[], chains: InferenceChain[]): number {
    if (chains.length === 0) return 0.5;

    const premiseUncertainty = premises.some(p => p.type === 'assumption') ? 0.3 : 0.1;
    const chainUncertainty = chains.some(c => c.type === 'inductive' || c.type === 'abductive') ? 0.4 : 0.2;
    const inputUncertainty = input.includes('?') || input.includes('maybe') ? 0.2 : 0.1;

    return Math.min(premiseUncertainty + chainUncertainty + inputUncertainty, 1.0);
  }

  private determinePremiseType(statement: string): LogicalPremise['type'] {
    const lowerStatement = statement.toLowerCase();
    
    if (lowerStatement.includes('if') || lowerStatement.includes('when')) {
      return 'hypothesis';
    } else if (lowerStatement.includes('all') || lowerStatement.includes('every')) {
      return 'fact';
    } else if (lowerStatement.includes('some') || lowerStatement.includes('many')) {
      return 'observation';
    } else {
      return 'assumption';
    }
  }

  private calculatePremiseConfidence(statement: string): number {
    const lowerStatement = statement.toLowerCase();
    
    // Higher confidence for more specific statements
    if (lowerStatement.includes('all') || lowerStatement.includes('every')) {
      return 0.8;
    } else if (lowerStatement.includes('some') || lowerStatement.includes('many')) {
      return 0.6;
    } else if (lowerStatement.includes('if') || lowerStatement.includes('when')) {
      return 0.7;
    } else {
      return 0.5;
    }
  }

  private gatherInferenceEvidence(_input: string, premises: LogicalPremise[], rules: InferenceRule[], chains: InferenceChain[]): string[] {
    const evidence: string[] = [];
    
    evidence.push(`Analyzed ${premises.length} logical premises`);
    evidence.push(`Applied ${rules.length} inference rules`);
    evidence.push(`Generated ${chains.length} inference chains`);
    
    return evidence;
  }

  private generateInferenceAlternatives(_input: string, rules: InferenceRule[]): string[] {
    const alternatives: string[] = [];
    
    alternatives.push(`Consider ${rules.length} alternative inference approaches`);
    alternatives.push('Explore different logical frameworks');
    alternatives.push('Apply multiple reasoning strategies');
    
    return alternatives;
  }

  private identifyInferenceUncertaintySources(input: string, premises: LogicalPremise[]): string[] {
    const sources: string[] = [];

    if (premises.some(p => p.type === 'assumption')) {
      sources.push('Assumptions introduce uncertainty');
    }
    if (premises.some(p => p.type === 'observation')) {
      sources.push('Observational premises may be incomplete');
    }
    if (input.includes('?')) {
      sources.push('Question format indicates uncertainty');
    }

    return sources;
  }

  private suggestInferenceUncertaintyMitigation(_input: string, premises: LogicalPremise[]): string[] {
    const mitigations: string[] = [];
    
    if (premises.length === 0) {
      mitigations.push('Gather more logical premises');
    }
    
    mitigations.push('Collect additional evidence');
    mitigations.push('Apply multiple inference methods');
    
    return mitigations;
  }

  private updatePerformanceMetrics(_reasoningTime: number, confidence: number, rulesApplied: number): void {
    this.performanceMetrics.totalInferences++;
    this.performanceMetrics.averageConfidence = 
      (this.performanceMetrics.averageConfidence * (this.performanceMetrics.totalInferences - 1) + confidence) / 
      this.performanceMetrics.totalInferences;
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
    return 80; // Placeholder
  }

  public addInferenceRule(rule: InferenceRule): void {
    this.rules.set(rule.id, rule);
    this.logger.info('Added new inference rule', { ruleId: rule.id, name: rule.name });
  }

  public addPremise(premise: LogicalPremise): void {
    this.premises.set(premise.id, premise);
    this.logger.info('Added logical premise', { premiseId: premise.id, statement: premise.statement });
  }

  public getInferenceChains(): InferenceChain[] {
    return this.chains;
  }
} 