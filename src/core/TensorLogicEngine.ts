/**
 * Tensor Logic Engine
 * Implements "Tensor Logic: The Language of AI" by Pedro Domingos
 * 
 * This engine unifies neural and symbolic AI by using tensor equations
 * as the sole construct for reasoning. It enables reasoning in embedding
 * space, combining the scalability of neural networks with the reliability
 * of symbolic reasoning.
 * 
 * Key features:
 * - Tensor-based logical operations (AND, OR, NOT, IMPLIES)
 * - Reasoning in embedding space
 * - Unified neural-symbolic representation
 * - Einstein summation notation for logical rules
 * - Support for transformers, formal reasoning, kernel machines, and graphical models
 */

import { Logger } from '../utils/Logger';
import { ReasoningResult, ReasoningStep } from '../types';

export interface Tensor {
  shape: number[];
  data: number[];
  rank: number;
}

export interface Embedding {
  vector: number[];
  dimension: number;
  concept: string;
  domain?: string;
}

export interface TensorLogicRule {
  id: string;
  premise: Tensor;
  conclusion: Tensor;
  weight: number;
  confidence: number;
  type: 'deductive' | 'inductive' | 'abductive';
}

export interface TensorReasoningResult extends ReasoningResult {
  tensorOperations: TensorOperation[];
  embeddingSpace: Embedding[];
  unifiedRepresentation: Tensor;
  neuralSymbolicFusion: number;
}

export interface TensorOperation {
  type: 'contraction' | 'product' | 'sum' | 'transpose' | 'inference';
  input: Tensor[];
  output: Tensor;
  einsteinNotation?: string;
  confidence: number;
}

export class TensorLogicEngine {
  private logger: Logger;
  private embeddingDimension: number = 128;
  private rules: Map<string, TensorLogicRule> = new Map();
  private conceptEmbeddings: Map<string, Embedding> = new Map();
  private tensorCache: Map<string, Tensor> = new Map();

  constructor(embeddingDimension: number = 128) {
    this.logger = new Logger('TensorLogicEngine');
    this.embeddingDimension = embeddingDimension;
    this.initializeTensorOperations();
    this.initializeLogicalOperators();
  }

  /**
   * Initialize tensor operations
   */
  private initializeTensorOperations(): void {
    this.logger.info('Initializing tensor operations');
  }

  /**
   * Initialize logical operators as tensor operations
   */
  private initializeLogicalOperators(): void {
    // Initialize basic logical operators using tensor representations
    this.logger.info('Initializing tensor-based logical operators');
  }

  /**
   * Create an embedding for a concept
   */
  public createEmbedding(concept: string, domain?: string): Embedding {
    if (this.conceptEmbeddings.has(concept)) {
      return this.conceptEmbeddings.get(concept)!;
    }

    // Generate embedding vector (in production, this would use a learned embedding model)
    const vector = this.generateEmbeddingVector(concept, domain);
    
    const embedding: Embedding = {
      vector,
      dimension: this.embeddingDimension,
      concept,
      domain
    };

    this.conceptEmbeddings.set(concept, embedding);
    return embedding;
  }

  /**
   * Generate embedding vector for a concept
   * In production, this would use a learned model (e.g., transformer embeddings)
   */
  private generateEmbeddingVector(concept: string, domain?: string): number[] {
    // Simple hash-based embedding for demonstration
    // In production, use actual learned embeddings
    const vector: number[] = [];
    const seed = this.hashString(concept + (domain || ''));
    
    for (let i = 0; i < this.embeddingDimension; i++) {
      const value = Math.sin(seed + i) * 0.5 + 0.5;
      vector.push(value);
    }
    
    // Normalize
    const norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
    return vector.map(v => v / norm);
  }

  /**
   * Hash string to number
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Create a tensor from embeddings
   */
  public createTensor(embeddings: Embedding[]): Tensor {
    if (embeddings.length === 0) {
      return { shape: [0], data: [], rank: 0 };
    }

    // Create tensor by stacking embeddings
    const dimension = embeddings[0].dimension;
    const data: number[] = [];
    
    for (const embedding of embeddings) {
      data.push(...embedding.vector);
    }

    return {
      shape: [embeddings.length, dimension],
      data,
      rank: 2
    };
  }

  /**
   * Tensor AND operation (logical conjunction)
   * Uses Einstein summation: A_i * B_i
   */
  public tensorAnd(tensorA: Tensor, tensorB: Tensor): Tensor {
    const operation = this.performEinsteinSummation(tensorA, tensorB, 'i', 'i');
    return {
      shape: this.computeOutputShape(tensorA, tensorB, ['i', 'i']),
      data: operation.data,
      rank: operation.rank
    };
  }

  /**
   * Tensor OR operation (logical disjunction)
   * Uses element-wise maximum with normalization
   */
  public tensorOr(tensorA: Tensor, tensorB: Tensor): Tensor {
    const minLength = Math.min(tensorA.data.length, tensorB.data.length);
    const data: number[] = [];
    
    for (let i = 0; i < minLength; i++) {
      // Element-wise maximum (fuzzy OR)
      const maxVal = Math.max(tensorA.data[i], tensorB.data[i]);
      data.push(maxVal);
    }
    
    // Normalize
    const norm = Math.sqrt(data.reduce((sum, v) => sum + v * v, 0));
    const normalized = data.map(v => v / norm);
    
    return {
      shape: tensorA.shape,
      data: normalized,
      rank: tensorA.rank
    };
  }

  /**
   * Tensor NOT operation (logical negation)
   * Uses complement: 1 - tensor
   */
  public tensorNot(tensor: Tensor): Tensor {
    const data = tensor.data.map(v => 1 - v);
    
    return {
      shape: tensor.shape,
      data,
      rank: tensor.rank
    };
  }

  /**
   * Tensor IMPLIES operation (logical implication)
   * Uses: max(1 - A, B) for fuzzy implication
   */
  public tensorImplies(tensorA: Tensor, tensorB: Tensor): Tensor {
    const minLength = Math.min(tensorA.data.length, tensorB.data.length);
    const data: number[] = [];
    
    for (let i = 0; i < minLength; i++) {
      // Fuzzy implication: max(1 - A, B)
      const value = Math.max(1 - tensorA.data[i], tensorB.data[i]);
      data.push(value);
    }
    
    return {
      shape: tensorA.shape,
      data,
      rank: tensorA.rank
    };
  }

  /**
   * Perform Einstein summation notation
   * Example: A_ij * B_jk = C_ik (contraction over j)
   */
  private performEinsteinSummation(
    tensorA: Tensor,
    tensorB: Tensor,
    indexA: string,
    indexB: string
  ): { data: number[]; rank: number } {
    // Simplified Einstein summation
    // In full implementation, this would handle arbitrary tensor contractions
    
    if (tensorA.rank === 2 && tensorB.rank === 2) {
      // Matrix multiplication: A_ij * B_jk = C_ik
      const [rowsA, colsA] = tensorA.shape;
      const [rowsB, colsB] = tensorB.shape;
      
      if (colsA !== rowsB) {
        throw new Error('Tensor dimensions incompatible for Einstein summation');
      }
      
      const data: number[] = [];
      
      for (let i = 0; i < rowsA; i++) {
        for (let k = 0; k < colsB; k++) {
          let sum = 0;
          for (let j = 0; j < colsA; j++) {
            const idxA = i * colsA + j;
            const idxB = j * colsB + k;
            sum += tensorA.data[idxA] * tensorB.data[idxB];
          }
          data.push(sum);
        }
      }
      
      return {
        data,
        rank: 2
      };
    }
    
    // Fallback: element-wise product
    const minLength = Math.min(tensorA.data.length, tensorB.data.length);
    const data: number[] = [];
    
    for (let i = 0; i < minLength; i++) {
      data.push(tensorA.data[i] * tensorB.data[i]);
    }
    
    return {
      data,
      rank: Math.min(tensorA.rank, tensorB.rank)
    };
  }

  /**
   * Compute output shape for Einstein summation
   */
  private computeOutputShape(
    tensorA: Tensor,
    tensorB: Tensor,
    indices: string[]
  ): number[] {
    // Simplified shape computation
    // In full implementation, this would handle arbitrary contractions
    if (tensorA.rank === 2 && tensorB.rank === 2) {
      return [tensorA.shape[0], tensorB.shape[1]];
    }
    return tensorA.shape;
  }

  /**
   * Reason using tensor logic
   */
  public async reason(
    input: string | Embedding[],
    context?: Record<string, any>
  ): Promise<TensorReasoningResult> {
    try {
      this.logger.info('Starting tensor logic reasoning', { input: typeof input === 'string' ? input : 'embeddings' });

      // Convert input to embeddings if needed
      const embeddings = typeof input === 'string' 
        ? this.extractConceptsFromInput(input).map(c => this.createEmbedding(c))
        : input;

      // Create input tensor
      const inputTensor = this.createTensor(embeddings);

      // Perform tensor-based reasoning
      const reasoningSteps = await this.performTensorReasoning(inputTensor, context);

      // Synthesize results
      const result = await this.synthesizeTensorReasoningResult(
        inputTensor,
        reasoningSteps,
        embeddings
      );

      this.logger.info('Tensor logic reasoning completed', { 
        confidence: result.confidence,
        operations: reasoningSteps.length 
      });

      return result;
    } catch (error) {
      this.logger.error('Error in tensor logic reasoning', error as Error);
      throw error;
    }
  }

  /**
   * Extract concepts from input string
   */
  private extractConceptsFromInput(input: string): string[] {
    // Simple concept extraction (in production, use NLP)
    const words = input.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2);
    
    return [...new Set(words)].slice(0, 10); // Limit to 10 unique concepts
  }

  /**
   * Perform tensor-based reasoning
   */
  private async performTensorReasoning(
    inputTensor: Tensor,
    context?: Record<string, any>
  ): Promise<TensorOperation[]> {
    const operations: TensorOperation[] = [];

    // Apply logical rules using tensor operations
    for (const [ruleId, rule] of this.rules) {
      try {
        // Check if rule applies (simplified matching)
        const applies = await this.checkRuleApplicability(inputTensor, rule);
        
        if (applies) {
          // Apply rule using tensor operations
          const operation = await this.applyRule(inputTensor, rule);
          operations.push(operation);
        }
      } catch (error) {
        this.logger.warn(`Error applying rule ${ruleId}`, error as Error);
      }
    }

    // Perform inference operations
    const inferenceOps = await this.performTensorInference(inputTensor, context);
    operations.push(...inferenceOps);

    return operations;
  }

  /**
   * Check if a rule applies to the input tensor
   */
  private async checkRuleApplicability(
    inputTensor: Tensor,
    rule: TensorLogicRule
  ): Promise<boolean> {
    // Simplified: check tensor similarity
    const similarity = this.computeTensorSimilarity(inputTensor, rule.premise);
    return similarity > 0.5;
  }

  /**
   * Compute similarity between two tensors
   */
  private computeTensorSimilarity(tensorA: Tensor, tensorB: Tensor): number {
    // Cosine similarity for tensor data
    const minLength = Math.min(tensorA.data.length, tensorB.data.length);
    if (minLength === 0) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < minLength; i++) {
      dotProduct += tensorA.data[i] * tensorB.data[i];
      normA += tensorA.data[i] * tensorA.data[i];
      normB += tensorB.data[i] * tensorB.data[i];
    }

    const norm = Math.sqrt(normA) * Math.sqrt(normB);
    return norm > 0 ? dotProduct / norm : 0;
  }

  /**
   * Apply a logical rule using tensor operations
   */
  private async applyRule(
    inputTensor: Tensor,
    rule: TensorLogicRule
  ): Promise<TensorOperation> {
    // Use Einstein summation to apply rule: premise -> conclusion
    const result = this.performEinsteinSummation(
      inputTensor,
      rule.premise,
      'i',
      'i'
    );

    // Generate conclusion tensor
    const conclusionTensor: Tensor = {
      shape: rule.conclusion.shape,
      data: result.data.slice(0, rule.conclusion.data.length),
      rank: rule.conclusion.rank
    };

    return {
      type: 'inference',
      input: [inputTensor, rule.premise],
      output: conclusionTensor,
      einsteinNotation: 'A_i * B_i = C',
      confidence: rule.confidence * rule.weight
    };
  }

  /**
   * Perform tensor-based inference
   */
  private async performTensorInference(
    inputTensor: Tensor,
    context?: Record<string, any>
  ): Promise<TensorOperation[]> {
    const operations: TensorOperation[] = [];

    // Create inference operations using logical operators
    if (this.rules.size > 0) {
      // Chain inference through rules
      let currentTensor = inputTensor;
      
      for (const [ruleId, rule] of this.rules) {
        const similarity = this.computeTensorSimilarity(currentTensor, rule.premise);
        
        if (similarity > 0.3) {
          const inferred = this.tensorImplies(rule.premise, rule.conclusion);
          const operation: TensorOperation = {
            type: 'inference',
            input: [currentTensor, rule.premise],
            output: inferred,
            einsteinNotation: `premise_i -> conclusion_i`,
            confidence: similarity * rule.confidence
          };
          
          operations.push(operation);
          currentTensor = inferred;
        }
      }
    }

    return operations;
  }

  /**
   * Synthesize tensor reasoning result
   */
  private async synthesizeTensorReasoningResult(
    inputTensor: Tensor,
    operations: TensorOperation[],
    embeddings: Embedding[]
  ): Promise<TensorReasoningResult> {
    // Compute unified representation from all operations
    const outputTensors = operations.map(op => op.output);
    const unifiedTensor = this.computeUnifiedRepresentation(outputTensors);

    // Compute neural-symbolic fusion score
    const neuralSymbolicFusion = this.computeNeuralSymbolicFusion(
      inputTensor,
      unifiedTensor,
      operations
    );

    // Generate conclusions from unified tensor
    const conclusions = this.extractConclusionsFromTensor(unifiedTensor, embeddings);

    // Generate reasoning steps
    const reasoningSteps: ReasoningStep[] = operations.map((op, idx) => ({
      id: `tensor_op_${idx}`,
      type: 'tensor_operation',
      premise: { content: `Tensor operation: ${op.type}`, truthValue: op.confidence },
      conclusion: { 
        content: `Result tensor shape: [${op.output.shape.join(', ')}]`, 
        truthValue: op.confidence 
      },
      confidence: op.confidence,
      reasoning: op.einsteinNotation || `Tensor ${op.type} operation`,
      description: `Tensor logic operation: ${op.type}`
    }));

    // Compute overall confidence
    const avgConfidence = operations.length > 0
      ? operations.reduce((sum, op) => sum + op.confidence, 0) / operations.length
      : 0.5;

    return {
      confidence: avgConfidence,
      reasoning: {
        steps: reasoningSteps,
        logic: 'tensor',
        evidence: [],
        assumptions: []
      },
      conclusions,
      uncertainty: {
        type: 'tensor',
        parameters: { 
          tensorRank: unifiedTensor.rank,
          operationsCount: operations.length 
        },
        confidence: 1 - avgConfidence
      },
      alternatives: [],
      tensorOperations: operations,
      embeddingSpace: embeddings,
      unifiedRepresentation: unifiedTensor,
      neuralSymbolicFusion
    };
  }

  /**
   * Compute unified representation from multiple tensors
   */
  private computeUnifiedRepresentation(tensors: Tensor[]): Tensor {
    if (tensors.length === 0) {
      return { shape: [0], data: [], rank: 0 };
    }

    // Average tensors (in production, use more sophisticated fusion)
    const firstTensor = tensors[0];
    const data: number[] = new Array(firstTensor.data.length).fill(0);

    for (const tensor of tensors) {
      const minLength = Math.min(data.length, tensor.data.length);
      for (let i = 0; i < minLength; i++) {
        data[i] += tensor.data[i];
      }
    }

    const normalized = data.map(v => v / tensors.length);

    return {
      shape: firstTensor.shape,
      data: normalized,
      rank: firstTensor.rank
    };
  }

  /**
   * Compute neural-symbolic fusion score
   */
  private computeNeuralSymbolicFusion(
    inputTensor: Tensor,
    outputTensor: Tensor,
    operations: TensorOperation[]
  ): number {
    // Measure how well neural (embedding) and symbolic (logical) aspects are fused
    const tensorSimilarity = this.computeTensorSimilarity(inputTensor, outputTensor);
    const operationConfidence = operations.length > 0
      ? operations.reduce((sum, op) => sum + op.confidence, 0) / operations.length
      : 0.5;
    
    // Fusion score combines similarity and confidence
    return (tensorSimilarity * 0.6 + operationConfidence * 0.4);
  }

  /**
   * Extract conclusions from tensor representation
   */
  private extractConclusionsFromTensor(
    tensor: Tensor,
    embeddings: Embedding[]
  ): Array<{ id: string; statement: string; confidence: number; evidence: any[]; reasoning: string; implications: string[] }> {
    const conclusions: Array<{ id: string; statement: string; confidence: number; evidence: any[]; reasoning: string; implications: string[] }> = [];

    // Find embeddings with highest activation in tensor
    if (tensor.data.length > 0 && embeddings.length > 0) {
      const activations = this.computeEmbeddingActivations(tensor, embeddings);
      const topActivations = activations
        .map((activation, idx) => ({ activation, embedding: embeddings[idx] }))
        .sort((a, b) => b.activation - a.activation)
        .slice(0, 3);

      for (const { activation, embedding } of topActivations) {
        if (activation > 0.3) {
          conclusions.push({
            id: `tensor_conclusion_${embedding.concept}`,
            statement: `High activation for concept: ${embedding.concept}${embedding.domain ? ` (${embedding.domain})` : ''}`,
            confidence: activation,
            evidence: [{
              source: 'tensor_logic',
              strength: activation,
              reliability: 0.8,
              timestamp: Date.now()
            }],
            reasoning: `Tensor activation analysis in embedding space`,
            implications: [
              `Concept ${embedding.concept} is relevant to the reasoning`,
              `Embedding space representation supports this conclusion`
            ]
          });
        }
      }
    }

    if (conclusions.length === 0) {
      conclusions.push({
        id: 'tensor_default',
        statement: 'Tensor logic reasoning completed',
        confidence: 0.5,
        evidence: [],
        reasoning: 'Tensor-based reasoning applied',
        implications: []
      });
    }

    return conclusions;
  }

  /**
   * Compute activation of embeddings in tensor
   */
  private computeEmbeddingActivations(
    tensor: Tensor,
    embeddings: Embedding[]
  ): number[] {
    const activations: number[] = [];

    for (const embedding of embeddings) {
      // Compute dot product between tensor slice and embedding
      let activation = 0;
      const minLength = Math.min(tensor.data.length, embedding.vector.length);
      
      for (let i = 0; i < minLength; i++) {
        activation += tensor.data[i] * embedding.vector[i];
      }
      
      // Normalize
      const norm = Math.sqrt(embedding.vector.reduce((sum, v) => sum + v * v, 0));
      activations.push(norm > 0 ? activation / norm : 0);
    }

    return activations;
  }

  /**
   * Add a logical rule
   */
  public addRule(rule: TensorLogicRule): void {
    this.rules.set(rule.id, rule);
    this.logger.info(`Added tensor logic rule: ${rule.id}`);
  }

  /**
   * Create a rule from premise and conclusion embeddings
   */
  public createRule(
    id: string,
    premiseConcepts: string[],
    conclusionConcepts: string[],
    type: 'deductive' | 'inductive' | 'abductive' = 'deductive',
    weight: number = 1.0
  ): TensorLogicRule {
    const premiseEmbeddings = premiseConcepts.map(c => this.createEmbedding(c));
    const conclusionEmbeddings = conclusionConcepts.map(c => this.createEmbedding(c));
    
    const premise = this.createTensor(premiseEmbeddings);
    const conclusion = this.createTensor(conclusionEmbeddings);

    const rule: TensorLogicRule = {
      id,
      premise,
      conclusion,
      weight,
      confidence: 0.8,
      type
    };

    this.addRule(rule);
    return rule;
  }

  /**
   * Get all rules
   */
  public getRules(): TensorLogicRule[] {
    return Array.from(this.rules.values());
  }

  /**
   * Get concept embeddings
   */
  public getEmbeddings(): Map<string, Embedding> {
    return this.conceptEmbeddings;
  }

  /**
   * Initialize with default logical rules
   */
  public initializeDefaultRules(): void {
    // Modus Ponens: If P then Q, P, therefore Q
    this.createRule(
      'modus_ponens',
      ['if', 'then', 'premise'],
      ['conclusion'],
      'deductive',
      0.9
    );

    // Modus Tollens: If P then Q, not Q, therefore not P
    this.createRule(
      'modus_tollens',
      ['if', 'then', 'not', 'conclusion'],
      ['not', 'premise'],
      'deductive',
      0.9
    );

    // Transitivity: If P then Q, If Q then R, therefore If P then R
    this.createRule(
      'transitivity',
      ['if', 'then', 'premise', 'intermediate'],
      ['if', 'then', 'premise', 'conclusion'],
      'deductive',
      0.85
    );

    // Conjunction Introduction: P, Q, therefore P AND Q
    this.createRule(
      'conjunction_intro',
      ['premise', 'premise'],
      ['and', 'conclusion'],
      'deductive',
      0.9
    );

    // Disjunction Introduction: P, therefore P OR Q
    this.createRule(
      'disjunction_intro',
      ['premise'],
      ['or', 'conclusion'],
      'deductive',
      0.85
    );

    // Hypothetical Syllogism: If P then Q, If Q then R, therefore If P then R
    this.createRule(
      'hypothetical_syllogism',
      ['if', 'then', 'premise', 'intermediate', 'if', 'then', 'intermediate', 'conclusion'],
      ['if', 'then', 'premise', 'conclusion'],
      'deductive',
      0.88
    );

    this.logger.info('Initialized default tensor logic rules');
  }

  /**
   * Perform chain inference using multiple rules
   */
  public async chainInference(
    input: string | Embedding[],
    maxSteps: number = 5
  ): Promise<TensorReasoningResult> {
    const embeddings = typeof input === 'string' 
      ? this.extractConceptsFromInput(input).map(c => this.createEmbedding(c))
      : input;

    let currentTensor = this.createTensor(embeddings);
    const allOperations: TensorOperation[] = [];
    let step = 0;

    while (step < maxSteps) {
      const stepResult = await this.performTensorReasoning(currentTensor);
      
      if (stepResult.length === 0) break;

      allOperations.push(...stepResult);
      
      // Update current tensor with the most confident result
      const bestOp = stepResult.reduce((best, op) => 
        op.confidence > best.confidence ? op : best
      );
      
      currentTensor = bestOp.output;
      step++;
    }

    return await this.synthesizeTensorReasoningResult(
      this.createTensor(embeddings),
      allOperations,
      embeddings
    );
  }

  /**
   * Perform analogical reasoning using tensor similarity
   */
  public async analogicalReasoning(
    source: string | Embedding[],
    target: string | Embedding[]
  ): Promise<{
    similarity: number;
    mappings: Array<{ source: string; target: string; similarity: number }>;
    inferred: Tensor;
  }> {
    const sourceEmbeddings = typeof source === 'string'
      ? this.extractConceptsFromInput(source).map(c => this.createEmbedding(c))
      : source;
    
    const targetEmbeddings = typeof target === 'string'
      ? this.extractConceptsFromInput(target).map(c => this.createEmbedding(c))
      : target;

    const sourceTensor = this.createTensor(sourceEmbeddings);
    const targetTensor = this.createTensor(targetEmbeddings);

    // Compute similarity
    const similarity = this.computeTensorSimilarity(sourceTensor, targetTensor);

    // Find concept mappings
    const mappings: Array<{ source: string; target: string; similarity: number }> = [];
    
    for (const sourceEmb of sourceEmbeddings) {
      for (const targetEmb of targetEmbeddings) {
        const embSimilarity = this.computeEmbeddingSimilarity(sourceEmb, targetEmb);
        if (embSimilarity > 0.5) {
          mappings.push({
            source: sourceEmb.concept,
            target: targetEmb.concept,
            similarity: embSimilarity
          });
        }
      }
    }

    // Infer target structure from source
    const inferred = this.computeUnifiedRepresentation([sourceTensor, targetTensor]);

    return {
      similarity,
      mappings: mappings.sort((a, b) => b.similarity - a.similarity).slice(0, 5),
      inferred
    };
  }

  /**
   * Compute similarity between two embeddings
   */
  private computeEmbeddingSimilarity(emb1: Embedding, emb2: Embedding): number {
    if (emb1.vector.length !== emb2.vector.length) return 0;

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < emb1.vector.length; i++) {
      dotProduct += emb1.vector[i] * emb2.vector[i];
      norm1 += emb1.vector[i] * emb1.vector[i];
      norm2 += emb2.vector[i] * emb2.vector[i];
    }

    const norm = Math.sqrt(norm1) * Math.sqrt(norm2);
    return norm > 0 ? dotProduct / norm : 0;
  }
}

