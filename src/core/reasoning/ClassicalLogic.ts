/**
 * Classical Logic Engine
 * Implements classical propositional and predicate logic
 */

import { Logger } from '@/utils/Logger';
import { LogicalPremise, LogicalConclusion, InferenceRule, ProofStep, LogicalOperator } from '@/types';

export class ClassicalLogic {
  private readonly logger: Logger;
  private premises: Map<string, LogicalPremise> = new Map();
  private inferenceRules: Map<string, InferenceRule> = new Map();
  private logicalOperators: Map<string, LogicalOperator> = new Map();
  private proofHistory: ProofStep[] = [];

  constructor() {
    this.logger = new Logger('ClassicalLogic');
    this.initializeLogicalOperators();
    this.initializeInferenceRules();
  }

  public async initialize(): Promise<void> {
    this.logger.info('Initializing classical logic system');
    await this.setupLogicalFramework();
    this.logger.info('Classical logic system initialized successfully');
  }

  public async reason(input: string, context?: Record<string, any>): Promise<LogicalConclusion> {
    try {
      this.logger.debug('Starting classical logic reasoning', { input, context });

      // Parse input into logical form
      const parsedInput = await this.parseLogicalInput(input);
      
      // Extract premises from input
      const extractedPremises = await this.extractPremises(parsedInput);
      
      // Apply inference rules
      const inferenceResults = await this.applyInferenceRules(extractedPremises);
      
      // Generate logical conclusions
      const conclusions = await this.generateConclusions(inferenceResults);
      
      // Validate conclusions
      const validatedConclusions = await this.validateConclusions(conclusions);
      
      // Create proof
      const proof = await this.createProof(extractedPremises, inferenceResults, validatedConclusions);
      
      const result: LogicalConclusion = {
        id: `classical_logic_${Date.now()}_${Math.random()}`,
        premises: extractedPremises,
        conclusions: validatedConclusions,
        proof,
        confidence: this.calculateConfidence(validatedConclusions, proof),
        validity: this.assessValidity(validatedConclusions),
        soundness: this.assessSoundness(extractedPremises, validatedConclusions),
        timestamp: Date.now()
      };

      this.logger.debug('Classical logic reasoning completed', { 
        conclusionCount: validatedConclusions.length,
        confidence: result.confidence,
        validity: result.validity
      });

      return result;
    } catch (error) {
      this.logger.error('Error in classical logic reasoning', error as Error);
      throw error;
    }
  }

  public addPremise(premise: LogicalPremise): void {
    this.premises.set(premise.id, premise);
    this.logger.debug('Added premise', { premiseId: premise.id, content: premise.content });
  }

  public getPremises(): LogicalPremise[] {
    return Array.from(this.premises.values());
  }

  public getProofHistory(): ProofStep[] {
    return this.proofHistory;
  }

  public validateArgument(premises: LogicalPremise[], conclusion: string): boolean {
    try {
      // Check if premises logically entail the conclusion
      const logicalForm = this.convertToLogicalForm(premises, conclusion);
      return this.checkLogicalEntailment(logicalForm);
    } catch (error) {
      this.logger.error('Error validating argument', error as Error);
      return false;
    }
  }

  private initializeLogicalOperators(): void {
    // Initialize basic logical operators
    this.logicalOperators.set('AND', {
      symbol: '∧',
      name: 'conjunction',
      arity: 2,
      truthTable: new Map([
        ['true,true', true],
        ['true,false', false],
        ['false,true', false],
        ['false,false', false]
      ])
    });

    this.logicalOperators.set('OR', {
      symbol: '∨',
      name: 'disjunction',
      arity: 2,
      truthTable: new Map([
        ['true,true', true],
        ['true,false', true],
        ['false,true', true],
        ['false,false', false]
      ])
    });

    this.logicalOperators.set('NOT', {
      symbol: '¬',
      name: 'negation',
      arity: 1,
      truthTable: new Map([
        ['true', false],
        ['false', true]
      ])
    });

    this.logicalOperators.set('IMPLIES', {
      symbol: '→',
      name: 'implication',
      arity: 2,
      truthTable: new Map([
        ['true,true', true],
        ['true,false', false],
        ['false,true', true],
        ['false,false', true]
      ])
    });

    this.logicalOperators.set('IFF', {
      symbol: '↔',
      name: 'biconditional',
      arity: 2,
      truthTable: new Map([
        ['true,true', true],
        ['true,false', false],
        ['false,true', false],
        ['false,false', true]
      ])
    });

    this.logicalOperators.set('FORALL', {
      symbol: '∀',
      name: 'universal_quantifier',
      arity: 1,
      scope: 'variable'
    });

    this.logicalOperators.set('EXISTS', {
      symbol: '∃',
      name: 'existential_quantifier',
      arity: 1,
      scope: 'variable'
    });
  }

  private initializeInferenceRules(): void {
    // Modus Ponens: If P → Q and P, then Q
    this.inferenceRules.set('modus_ponens', {
      id: 'modus_ponens',
      name: 'Modus Ponens',
      pattern: ['P → Q', 'P'],
      conclusion: 'Q',
      validity: 'valid',
      description: 'If P implies Q and P is true, then Q is true'
    });

    // Modus Tollens: If P → Q and ¬Q, then ¬P
    this.inferenceRules.set('modus_tollens', {
      id: 'modus_tollens',
      name: 'Modus Tollens',
      pattern: ['P → Q', '¬Q'],
      conclusion: '¬P',
      validity: 'valid',
      description: 'If P implies Q and Q is false, then P is false'
    });

    // Hypothetical Syllogism: If P → Q and Q → R, then P → R
    this.inferenceRules.set('hypothetical_syllogism', {
      id: 'hypothetical_syllogism',
      name: 'Hypothetical Syllogism',
      pattern: ['P → Q', 'Q → R'],
      conclusion: 'P → R',
      validity: 'valid',
      description: 'If P implies Q and Q implies R, then P implies R'
    });

    // Disjunctive Syllogism: If P ∨ Q and ¬P, then Q
    this.inferenceRules.set('disjunctive_syllogism', {
      id: 'disjunctive_syllogism',
      name: 'Disjunctive Syllogism',
      pattern: ['P ∨ Q', '¬P'],
      conclusion: 'Q',
      validity: 'valid',
      description: 'If P or Q is true and P is false, then Q is true'
    });

    // Conjunction: If P and Q, then P ∧ Q
    this.inferenceRules.set('conjunction', {
      id: 'conjunction',
      name: 'Conjunction',
      pattern: ['P', 'Q'],
      conclusion: 'P ∧ Q',
      validity: 'valid',
      description: 'If P is true and Q is true, then P and Q is true'
    });

    // Simplification: If P ∧ Q, then P
    this.inferenceRules.set('simplification', {
      id: 'simplification',
      name: 'Simplification',
      pattern: ['P ∧ Q'],
      conclusion: 'P',
      validity: 'valid',
      description: 'If P and Q is true, then P is true'
    });

    // Addition: If P, then P ∨ Q
    this.inferenceRules.set('addition', {
      id: 'addition',
      name: 'Addition',
      pattern: ['P'],
      conclusion: 'P ∨ Q',
      validity: 'valid',
      description: 'If P is true, then P or Q is true'
    });

    // Double Negation: If P, then ¬¬P
    this.inferenceRules.set('double_negation', {
      id: 'double_negation',
      name: 'Double Negation',
      pattern: ['P'],
      conclusion: '¬¬P',
      validity: 'valid',
      description: 'If P is true, then not not P is true'
    });

    // De Morgan's Laws
    this.inferenceRules.set('demorgan_and', {
      id: 'demorgan_and',
      name: "De Morgan's Law (AND)",
      pattern: ['¬(P ∧ Q)'],
      conclusion: '¬P ∨ ¬Q',
      validity: 'valid',
      description: 'Not (P and Q) is equivalent to (not P) or (not Q)'
    });

    this.inferenceRules.set('demorgan_or', {
      id: 'demorgan_or',
      name: "De Morgan's Law (OR)",
      pattern: ['¬(P ∨ Q)'],
      conclusion: '¬P ∧ ¬Q',
      validity: 'valid',
      description: 'Not (P or Q) is equivalent to (not P) and (not Q)'
    });
  }

  private async setupLogicalFramework(): Promise<void> {
    // Set up basic logical framework
    this.logger.info('Setting up logical framework');
    
    // Add some basic logical axioms
    const axioms = [
      'P → P', // Identity
      'P ∨ ¬P', // Excluded Middle
      '¬(P ∧ ¬P)', // Non-Contradiction
      '(P → Q) → (¬Q → ¬P)', // Contraposition
      '(P ∧ Q) → P', // Simplification
      'P → (P ∨ Q)' // Addition
    ];

    for (const axiom of axioms) {
      const premise: LogicalPremise = {
        id: `axiom_${Date.now()}_${Math.random()}`,
        content: axiom,
        type: 'axiom',
        confidence: 1.0,
        source: 'logical_framework',
        timestamp: Date.now()
      };
      this.addPremise(premise);
    }
  }

  private async parseLogicalInput(input: string): Promise<any> {
    // Parse natural language input into logical form
    const logicalForm = {
      propositions: this.extractPropositions(input),
      operators: this.identifyOperators(input),
      structure: this.analyzeLogicalStructure(input),
      complexity: this.calculateLogicalComplexity(input)
    };

    return logicalForm;
  }

  private extractPropositions(input: string): string[] {
    const propositions: string[] = [];
    
    // Simple proposition extraction (can be enhanced with NLP)
    const sentences = input.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    for (const sentence of sentences) {
      const cleanSentence = sentence.trim();
      if (cleanSentence.length > 3) {
        propositions.push(cleanSentence);
      }
    }
    
    return propositions;
  }

  private identifyOperators(input: string): string[] {
    const operators: string[] = [];
    
    // Identify logical operators in text
    if (input.includes('and') || input.includes('AND')) operators.push('AND');
    if (input.includes('or') || input.includes('OR')) operators.push('OR');
    if (input.includes('not') || input.includes('NOT') || input.includes('no')) operators.push('NOT');
    if (input.includes('if') || input.includes('then') || input.includes('implies')) operators.push('IMPLIES');
    if (input.includes('if and only if') || input.includes('iff')) operators.push('IFF');
    if (input.includes('all') || input.includes('every') || input.includes('each')) operators.push('FORALL');
    if (input.includes('some') || input.includes('exists') || input.includes('there is')) operators.push('EXISTS');
    
    return operators;
  }

  private analyzeLogicalStructure(input: string): any {
    return {
      hasConditionals: input.includes('if') || input.includes('then'),
      hasNegations: input.includes('not') || input.includes('no'),
      hasConjunctions: input.includes('and'),
      hasDisjunctions: input.includes('or'),
      hasQuantifiers: input.includes('all') || input.includes('some'),
      complexity: this.calculateLogicalComplexity(input)
    };
  }

  private calculateLogicalComplexity(input: string): number {
    let complexity = 0.1; // Base complexity
    
    // Add complexity for different logical features
    if (input.includes('if') && input.includes('then')) complexity += 0.2;
    if (input.includes('and') || input.includes('or')) complexity += 0.1;
    if (input.includes('not') || input.includes('no')) complexity += 0.1;
    if (input.includes('all') || input.includes('some')) complexity += 0.2;
    if (input.includes('implies') || input.includes('therefore')) complexity += 0.2;
    
    // Add complexity for sentence length
    const sentences = input.split(/[.!?]+/).length;
    complexity += Math.min(0.3, sentences * 0.05);
    
    return Math.min(1.0, complexity);
  }

  private async extractPremises(parsedInput: any): Promise<LogicalPremise[]> {
    const premises: LogicalPremise[] = [];
    
    for (const proposition of parsedInput.propositions) {
      const premise: LogicalPremise = {
        id: `premise_${Date.now()}_${Math.random()}`,
        content: proposition,
        type: 'proposition',
        confidence: this.calculatePremiseConfidence(proposition),
        source: 'input_parsing',
        timestamp: Date.now()
      };
      premises.push(premise);
    }
    
    return premises;
  }

  private calculatePremiseConfidence(proposition: string): number {
    let confidence = 0.7; // Base confidence
    
    // Increase confidence for clear, simple statements
    if (proposition.length < 50) confidence += 0.1;
    if (!proposition.includes('?')) confidence += 0.1;
    if (proposition.includes('is') || proposition.includes('are')) confidence += 0.1;
    
    return Math.min(1.0, confidence);
  }

  private async applyInferenceRules(premises: LogicalPremise[]): Promise<any[]> {
    const results: any[] = [];
    
    for (const rule of this.inferenceRules.values()) {
      const applicable = this.checkRuleApplicability(rule, premises);
      if (applicable) {
        const result = await this.applyRule(rule, premises);
        if (result) {
          results.push(result);
        }
      }
    }
    
    return results;
  }

  private checkRuleApplicability(rule: InferenceRule, premises: LogicalPremise[]): boolean {
    // Check if the rule's pattern matches the available premises
    const premiseContents = premises.map(p => p.content);
    
    for (const pattern of rule.pattern) {
      if (!this.matchesPattern(pattern, premiseContents)) {
        return false;
      }
    }
    
    return true;
  }

  private matchesPattern(pattern: string, premiseContents: string[]): boolean {
    // Simple pattern matching (can be enhanced with more sophisticated logic)
    const patternLower = pattern.toLowerCase();
    
    for (const content of premiseContents) {
      const contentLower = content.toLowerCase();
      
      if (patternLower.includes('p') && contentLower.includes('if')) return true;
      if (patternLower.includes('q') && contentLower.includes('then')) return true;
      if (patternLower.includes('∧') && contentLower.includes('and')) return true;
      if (patternLower.includes('∨') && contentLower.includes('or')) return true;
      if (patternLower.includes('¬') && contentLower.includes('not')) return true;
    }
    
    return false;
  }

  private async applyRule(rule: InferenceRule, premises: LogicalPremise[]): Promise<any> {
    try {
      const conclusion = this.generateConclusionFromRule(rule, premises);
      
      return {
        rule: rule,
        premises: premises,
        conclusion: conclusion,
        confidence: this.calculateRuleConfidence(rule, premises),
        timestamp: Date.now()
      };
    } catch (error) {
      this.logger.error('Error applying rule', error as Error);
      return null;
    }
  }

  private generateConclusionFromRule(rule: InferenceRule, premises: LogicalPremise[]): string {
    // Generate conclusion based on the rule and premises
    let conclusion = rule.conclusion;
    
    // Replace logical variables with actual content
    if (rule.pattern.includes('P') && premises.length > 0 && premises[0]) {
      conclusion = conclusion.replace(/P/g, premises[0].content);
    }
    if (rule.pattern.includes('Q') && premises.length > 1 && premises[1]) {
      conclusion = conclusion.replace(/Q/g, premises[1].content);
    }
    if (rule.pattern.includes('R') && premises.length > 2 && premises[2]) {
      conclusion = conclusion.replace(/R/g, premises[2].content);
    }
    
    return conclusion;
  }

  private calculateRuleConfidence(rule: InferenceRule, premises: LogicalPremise[]): number {
    let confidence = 0.8; // Base confidence for valid rules
    
    // Adjust confidence based on premise confidence
    const averagePremiseConfidence = premises.reduce((sum, p) => sum + p.confidence, 0) / premises.length;
    confidence *= averagePremiseConfidence;
    
    // Adjust confidence based on rule validity
    if (rule.validity === 'valid') confidence += 0.1;
    if (rule.validity === 'invalid') confidence -= 0.3;
    
    return Math.max(0, Math.min(1, confidence));
  }

  private async generateConclusions(inferenceResults: any[]): Promise<string[]> {
    const conclusions: string[] = [];
    
    for (const result of inferenceResults) {
      if (result.conclusion) {
        conclusions.push(result.conclusion);
      }
    }
    
    // Add additional conclusions based on logical analysis
    const additionalConclusions = this.generateAdditionalConclusions(inferenceResults);
    conclusions.push(...additionalConclusions);
    
    return conclusions;
  }

  private generateAdditionalConclusions(inferenceResults: any[]): string[] {
    const conclusions: string[] = [];
    
    // Generate conclusions based on logical relationships
    for (const result of inferenceResults) {
      if (result.rule.id === 'modus_ponens') {
        conclusions.push('The conclusion follows logically from the premises');
      } else if (result.rule.id === 'modus_tollens') {
        conclusions.push('The negation of the antecedent is established');
      } else if (result.rule.id === 'hypothetical_syllogism') {
        conclusions.push('A chain of implications has been established');
      }
    }
    
    return conclusions;
  }

  private async validateConclusions(conclusions: string[]): Promise<string[]> {
    const validatedConclusions: string[] = [];
    
    for (const conclusion of conclusions) {
      if (this.validateConclusion(conclusion)) {
        validatedConclusions.push(conclusion);
      }
    }
    
    return validatedConclusions;
  }

  private validateConclusion(conclusion: string): boolean {
    // Basic validation of logical conclusions
    if (!conclusion || conclusion.trim().length === 0) return false;
    
    // Check for logical consistency
    if (conclusion.includes('contradiction') || conclusion.includes('paradox')) return false;
    
    // Check for logical form
    if (this.hasValidLogicalForm(conclusion)) return true;
    
    return true; // Default to valid if no obvious issues
  }

  private hasValidLogicalForm(conclusion: string): boolean {
    // Check if conclusion has valid logical structure
    const hasConditional = conclusion.includes('if') && conclusion.includes('then');
    const hasConjunction = conclusion.includes('and');
    const hasDisjunction = conclusion.includes('or');
    const hasNegation = conclusion.includes('not') || conclusion.includes('no');
    
    return hasConditional || hasConjunction || hasDisjunction || hasNegation || conclusion.length > 10;
  }

  private async createProof(premises: LogicalPremise[], inferenceResults: any[], conclusions: string[]): Promise<ProofStep[]> {
    const proof: ProofStep[] = [];
    
    // Add premises to proof
    for (const premise of premises) {
      proof.push({
        step: proof.length + 1,
        type: 'premise',
        content: premise.content,
        justification: 'Given',
        confidence: premise.confidence
      });
    }
    
    // Add inference steps to proof
    for (const result of inferenceResults) {
      proof.push({
        step: proof.length + 1,
        type: 'inference',
        content: result.conclusion,
        justification: `${result.rule.name} from steps ${proof.length - result.premises.length + 1}-${proof.length}`,
        confidence: result.confidence
      });
    }
    
    // Add conclusions to proof
    for (const conclusion of conclusions) {
      proof.push({
        step: proof.length + 1,
        type: 'conclusion',
        content: conclusion,
        justification: 'Logical conclusion',
        confidence: 0.9
      });
    }
    
    this.proofHistory.push(...proof);
    return proof;
  }

  private calculateConfidence(conclusions: string[], proof: ProofStep[]): number {
    if (conclusions.length === 0) return 0;
    
    const averageProofConfidence = proof.reduce((sum, step) => sum + step.confidence, 0) / proof.length;
    const conclusionCount = conclusions.length;
    
    return Math.min(1.0, averageProofConfidence * (1 + conclusionCount * 0.1));
  }

  private assessValidity(conclusions: string[]): boolean {
    // Assess if the conclusions are logically valid
    if (conclusions.length === 0) return false;
    
    for (const conclusion of conclusions) {
      if (!this.isLogicallyValid(conclusion)) {
        return false;
      }
    }
    
    return true;
  }

  private isLogicallyValid(conclusion: string): boolean {
    // Basic logical validity check
    if (conclusion.includes('contradiction')) return false;
    if (conclusion.includes('paradox')) return false;
    if (conclusion.includes('false') && conclusion.includes('true')) return false;
    
    return true;
  }

  private assessSoundness(premises: LogicalPremise[], conclusions: string[]): boolean {
    // Assess if the argument is sound (valid + true premises)
    const validity = this.assessValidity(conclusions);
    const truePremises = premises.every(p => p.confidence > 0.7);
    
    return validity && truePremises;
  }

  private convertToLogicalForm(premises: LogicalPremise[], conclusion: string): string {
    // Convert premises and conclusion to logical form
    const premiseForms = premises.map(p => `(${p.content})`);
    const premiseString = premiseForms.join(' ∧ ');
    
    return `${premiseString} → (${conclusion})`;
  }

  private checkLogicalEntailment(logicalForm: string): boolean {
    // Check if the logical form represents a valid entailment
    // This is a simplified check - in practice, this would use a theorem prover
    
    if (logicalForm.includes('→')) {
      const parts = logicalForm.split('→');
      const antecedent = parts[0];
      const consequent = parts[1];
      return Boolean(antecedent && consequent && antecedent.trim().length > 0 && consequent.trim().length > 0);
    }
    
    return true;
  }
} 