import { Logger } from '@/utils/Logger';
import { ReasoningResult } from '@/types';

export interface ModalOperator {
  symbol: string;
  name: string;
  description: string;
  strength: number; // 0-1 scale of logical strength
  dual?: string; // Dual operator
}

export interface ModalWorld {
  id: string;
  name: string;
  accessibleFrom: string[];
  propositions: Map<string, boolean>;
  accessibility: Map<string, number>; // Accessibility relation strength
}

export interface ModalRule {
  id: string;
  antecedent: string;
  consequent: string;
  operator: string;
  confidence: number;
  evidence: string[];
}

export class ModalLogic {
  private operators: Map<string, ModalOperator> = new Map();
  private worlds: Map<string, ModalWorld> = new Map();
  private rules: ModalRule[] = [];
  private logger: Logger;
  private performanceMetrics = {
    totalModalInferences: 0,
    averageConfidence: 0,
    worldsExplored: 0,
    operatorsApplied: 0
  };

  constructor() {
    this.logger = new Logger('ModalLogic');
    this.initializeModalOperators();
    this.initializeModalRules();
  }

  public async initialize(): Promise<void> {
    try {
      this.logger.info('Initializing Modal Logic...');
      
      // Initialize modal operators
      this.initializeModalOperators();
      
      // Initialize modal rules
      this.initializeModalRules();
      
      // Initialize performance metrics
      this.performanceMetrics = {
        totalModalInferences: 0,
        averageConfidence: 0,
        worldsExplored: 0,
        operatorsApplied: 0
      };
      
      this.logger.info('Modal Logic initialized successfully');
      
    } catch (error) {
      this.logger.error('Failed to initialize Modal Logic', error instanceof Error ? error : undefined);
      throw error;
    }
  }

  private initializeModalOperators(): void {
    // Initialize standard modal operators
    const standardOperators: ModalOperator[] = [
      {
        symbol: '□',
        name: 'necessity',
        description: 'It is necessary that',
        strength: 1.0,
        dual: '◇'
      },
      {
        symbol: '◇',
        name: 'possibility',
        description: 'It is possible that',
        strength: 0.8,
        dual: '□'
      },
      {
        symbol: 'B',
        name: 'belief',
        description: 'It is believed that',
        strength: 0.7
      },
      {
        symbol: 'K',
        name: 'knowledge',
        description: 'It is known that',
        strength: 0.9
      },
      {
        symbol: 'O',
        name: 'obligation',
        description: 'It is obligatory that',
        strength: 0.85
      },
      {
        symbol: 'P',
        name: 'permission',
        description: 'It is permitted that',
        strength: 0.75
      }
    ];

    standardOperators.forEach(op => {
      this.operators.set(op.symbol, op);
    });

    this.logger.info('ModalLogic initialized with standard operators');
  }

  private initializeModalRules(): void {
    // Initialize modal reasoning rules
    this.rules = [
      {
        id: 'necessity_elimination',
        antecedent: '□A',
        consequent: 'A',
        operator: '□',
        confidence: 0.95,
        evidence: ['Necessity elimination rule', 'Modal logic axiom']
      },
      {
        id: 'possibility_introduction',
        antecedent: 'A',
        consequent: '◇A',
        operator: '◇',
        confidence: 0.9,
        evidence: ['Possibility introduction rule', 'Modal logic axiom']
      },
      {
        id: 'dual_relation',
        antecedent: '□A',
        consequent: '¬◇¬A',
        operator: 'dual',
        confidence: 0.9,
        evidence: ['Dual relation', 'Modal logic theorem']
      },
      {
        id: 'knowledge_implies_belief',
        antecedent: 'KA',
        consequent: 'BA',
        operator: 'K',
        confidence: 0.85,
        evidence: ['Knowledge implies belief', 'Epistemic logic']
      },
      {
        id: 'belief_consistency',
        antecedent: 'BA ∧ B¬A',
        consequent: '⊥',
        operator: 'B',
        confidence: 0.8,
        evidence: ['Belief consistency', 'Doxastic logic']
      }
    ];

    this.logger.info('ModalLogic initialized with reasoning rules');
  }

  public reason(input: string, context?: Record<string, any>): ReasoningResult {
    this.logger.debug('Starting modal reasoning', { input });

    try {
      const startTime = Date.now();
      const modalOperators = this.extractModalOperators(input);
      const worlds = this.explorePossibleWorlds(input, context);
      const accessibility = this.analyzeAccessibility(input, worlds);
      const confidence = this.calculateModalConfidence(input, modalOperators, worlds);

      const reasoningTime = Date.now() - startTime;
      this.updatePerformanceMetrics(reasoningTime, confidence, worlds.length);

      const result: ReasoningResult = {
        confidence: confidence,
        reasoning: {
          steps: [
            {
              id: 'modal_analysis',
              type: 'deduction',
              premise: { content: input, truthValue: 1, certainty: 0.8, evidence: [] },
              conclusion: { content: `Modal analysis completed with ${worlds.length} worlds`, truthValue: confidence, certainty: confidence, evidence: [] },
              confidence: confidence,
              reasoning: `Modal operators detected: ${modalOperators.map(op => op.name).join(', ')}`
            }
          ],
          logic: 'modal',
          evidence: this.gatherModalEvidence(input, modalOperators, worlds).map(() => ({
            source: 'modal_logic',
            strength: 1,
            reliability: 1,
            timestamp: Date.now()
          })),
          assumptions: []
        },
        conclusions: [
          {
            id: 'modal_conclusion',
            statement: this.generateModalConclusion(input, modalOperators, worlds, accessibility),
            confidence: confidence,
            evidence: [],
            reasoning: 'Modal analysis completed',
            implications: ['Possible worlds explored', 'Accessibility relations analyzed']
          }
        ],
        alternatives: this.generateModalAlternatives(input, modalOperators).map(alt => ({
          id: `alt_${Date.now()}`,
          description: alt,
          probability: 0.3,
          feasibility: 0.7,
          consequences: [],
          reasoning: 'Alternative modal interpretation'
        })),
        uncertainty: {
          type: 'probabilistic',
          parameters: {
            level: this.calculateModalUncertainty(input, modalOperators, worlds),
            sources: this.identifyModalUncertaintySources(input, modalOperators),
            mitigation: this.suggestModalUncertaintyMitigation(input, modalOperators)
          },
          confidence: 1 - this.calculateModalUncertainty(input, modalOperators, worlds)
        }
      };

      this.logger.info('Modal reasoning completed', {
        input,
        confidence: result.confidence,
        worldsExplored: worlds.length,
        reasoningTime
      });

      return result;

    } catch (error) {
      this.logger.error('Error in modal reasoning', error instanceof Error ? error : undefined);
      throw error;
    }
  }

  private extractModalOperators(input: string): ModalOperator[] {
    const detectedOperators: ModalOperator[] = [];

    for (const [symbol, operator] of this.operators) {
      if (input.includes(symbol) || input.toLowerCase().includes(operator.name)) {
        detectedOperators.push(operator);
      }
    }

    // Also detect implicit modal operators through keywords
    const modalKeywords: Record<string, string> = {
      'must': 'necessity',
      'necessarily': 'necessity',
      'certainly': 'necessity',
      'definitely': 'necessity',
      'can': 'possibility',
      'possibly': 'possibility',
      'might': 'possibility',
      'could': 'possibility',
      'believe': 'belief',
      'think': 'belief',
      'know': 'knowledge',
      'certain': 'knowledge',
      'should': 'obligation',
      'allowed': 'permission',
      'permitted': 'permission'
    };

    const words = input.toLowerCase().split(/\s+/);
    for (const word of words) {
      if (modalKeywords[word]) {
        const operatorName = modalKeywords[word];
        const operator = Array.from(this.operators.values()).find(op => op.name === operatorName);
        if (operator && !detectedOperators.some(op => op.name === operatorName)) {
          detectedOperators.push(operator);
        }
      }
    }

    return detectedOperators;
  }

  private explorePossibleWorlds(input: string, _context?: Record<string, any>): ModalWorld[] {
    const worlds: ModalWorld[] = [];
    
    // Create base world
    const baseWorld: ModalWorld = {
      id: 'w0',
      name: 'Actual World',
      accessibleFrom: [],
      propositions: new Map(),
      accessibility: new Map()
    };

    // Extract propositions from input
    const propositions = this.extractPropositions(input);
    propositions.forEach((value, prop) => {
      baseWorld.propositions.set(prop, value);
    });

    worlds.push(baseWorld);

    // Generate alternative worlds based on modal operators
    const modalOperators = this.extractModalOperators(input);
    
    for (const operator of modalOperators) {
      if (operator.name === 'possibility') {
        // Create worlds where the proposition might be true
        const possibleWorld: ModalWorld = {
          id: `w_possible_${worlds.length}`,
          name: `Possible World (${operator.name})`,
          accessibleFrom: [baseWorld.id],
          propositions: new Map(baseWorld.propositions),
          accessibility: new Map([[baseWorld.id, 0.8]])
        };
        worlds.push(possibleWorld);
      } else if (operator.name === 'necessity') {
        // Create worlds where the proposition must be true
        const necessaryWorld: ModalWorld = {
          id: `w_necessary_${worlds.length}`,
          name: `Necessary World (${operator.name})`,
          accessibleFrom: [baseWorld.id],
          propositions: new Map(baseWorld.propositions),
          accessibility: new Map([[baseWorld.id, 1.0]])
        };
        worlds.push(necessaryWorld);
      }
    }

    this.performanceMetrics.worldsExplored += worlds.length;
    return worlds;
  }

  private analyzeAccessibility(_input: string, worlds: ModalWorld[]): number {
    if (worlds.length <= 1) return 1.0;

    let totalAccessibility = 0;
    let accessibilityChecks = 0;

    for (const world of worlds) {
      for (const [_fromWorld, strength] of world.accessibility) {
        if (strength > 0.5) {
          // accessibleWorlds++;
        }
      }
    }

    this.performanceMetrics.operatorsApplied += accessibilityChecks;
    
    return accessibilityChecks > 0 ? totalAccessibility / accessibilityChecks : 1.0;
  }

  private generateModalConclusion(_input: string, operators: ModalOperator[], worlds: ModalWorld[], accessibility: number): string {
    if (operators.length === 0) {
      return 'No modal operators detected in the input.';
    }

    const strongestOperator = operators.reduce((strongest, current) => 
      current.strength > strongest.strength ? current : strongest
    );

    const worldCount = worlds.length;
    const accessibilityLevel = accessibility > 0.8 ? 'high' : accessibility > 0.5 ? 'moderate' : 'low';

    return `Based on modal analysis with ${strongestOperator.name} operator (strength: ${strongestOperator.strength}), exploring ${worldCount} possible worlds with ${accessibilityLevel} accessibility (${(accessibility * 100).toFixed(1)}%).`;
  }

  private calculateModalConfidence(input: string, operators: ModalOperator[], worlds: ModalWorld[]): number {
    if (operators.length === 0) return 0.5;

    // Calculate confidence based on operator strength and world exploration
    const averageOperatorStrength = operators.reduce((sum, op) => sum + op.strength, 0) / operators.length;
    const worldExplorationFactor = Math.min(worlds.length / 5, 1.0);
    const inputComplexityFactor = Math.min(input.length / 100, 1.0);

    const confidence = (averageOperatorStrength * 0.6) + (worldExplorationFactor * 0.3) + (inputComplexityFactor * 0.1);
    
    return Math.max(0, Math.min(1, confidence));
  }

  private calculateModalUncertainty(input: string, operators: ModalOperator[], worlds: ModalWorld[]): number {
    if (operators.length === 0) return 0.5;

    // Calculate uncertainty based on modal complexity
    const operatorUncertainty = operators.some(op => op.name === 'possibility') ? 0.3 : 0.1;
    const worldUncertainty = worlds.length > 3 ? 0.2 : 0.1;
    const inputUncertainty = input.includes('?') || input.includes('maybe') ? 0.2 : 0.1;

    return Math.min(operatorUncertainty + worldUncertainty + inputUncertainty, 1.0);
  }

  private extractPropositions(input: string): Map<string, boolean> {
    const propositions = new Map<string, boolean>();
    
    // Simple proposition extraction - could be enhanced with NLP
    const sentences = input.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    sentences.forEach((sentence, index) => {
      const cleanSentence = sentence.trim().toLowerCase();
      if (cleanSentence.length > 3) {
        propositions.set(`P${index}`, !cleanSentence.includes('not') && !cleanSentence.includes('no'));
      }
    });

    return propositions;
  }

  private gatherModalEvidence(_input: string, operators: ModalOperator[], worlds: ModalWorld[]): string[] {
    const evidence: string[] = [];

    // Add operator-based evidence
    operators.forEach(op => {
      evidence.push(`Detected ${op.name} operator: ${op.description}`);
    });

    // Add world-based evidence
    if (worlds.length > 1) {
      evidence.push(`Explored ${worlds.length} possible worlds`);
    }

    // Add rule-based evidence
    for (const rule of this.rules) {
      if (operators.some(op => op.symbol === rule.operator)) {
        evidence.push(`Applied modal rule: ${rule.antecedent} → ${rule.consequent}`);
      }
    }

    return evidence;
  }

  private generateModalAlternatives(_input: string, operators: ModalOperator[]): string[] {
    const alternatives: string[] = [];

    operators.forEach(operator => {
      alternatives.push(`Alternative using ${operator.name}: ${operator.description}`);
    });

    return alternatives;
  }

  private identifyModalUncertaintySources(input: string, operators: ModalOperator[]): string[] {
    const sources: string[] = [];

    if (operators.some(op => op.name === 'possibility')) {
      sources.push('Possibility operators introduce uncertainty');
    }
    if (input.includes('?')) {
      sources.push('Question format indicates uncertainty');
    }
    if (operators.length > 2) {
      sources.push('Multiple modal operators create complexity');
    }

    return sources;
  }

  private suggestModalUncertaintyMitigation(_input: string, operators: ModalOperator[]): string[] {
    const mitigations: string[] = [];

    // Check for weak modal operators
    const weakOperators = operators.filter(op => op.strength < 0.7);
    if (weakOperators.length > 0) {
      mitigations.push('Strengthen weak modal operators with additional evidence');
    }

    return mitigations;
  }

  private updatePerformanceMetrics(_reasoningTime: number, confidence: number, worldsExplored: number): void {
    this.performanceMetrics.totalModalInferences++;
    this.performanceMetrics.averageConfidence = 
      (this.performanceMetrics.averageConfidence * (this.performanceMetrics.totalModalInferences - 1) + confidence) / 
      this.performanceMetrics.totalModalInferences;
    this.performanceMetrics.worldsExplored += worldsExplored;
  }

  public getPerformanceMetrics(): Record<string, any> {
    return {
      ...this.performanceMetrics,
      averageReasoningTime: this.calculateAverageReasoningTime()
    };
  }

  private calculateAverageReasoningTime(): number {
    // This would be calculated from actual timing data
    return 75; // Placeholder
  }

  public addModalOperator(operator: ModalOperator): void {
    this.operators.set(operator.symbol, operator);
    this.logger.info('Added new modal operator', { symbol: operator.symbol, name: operator.name });
  }

  public addModalRule(rule: ModalRule): void {
    this.rules.push(rule);
    this.logger.info('Added new modal rule', { ruleId: rule.id });
  }

  public addModalWorld(world: ModalWorld): void {
    this.worlds.set(world.id, world);
    this.logger.info('Added modal world', { worldId: world.id, name: world.name });
  }
} 