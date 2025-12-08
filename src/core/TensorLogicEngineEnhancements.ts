/**
 * Tensor Logic Engine Enhancements
 * Advanced features for Tensor Logic Engine including:
 * - Learned embeddings from transformer models
 * - Advanced Einstein summation for arbitrary tensor ranks
 * - Automatic rule learning
 * - Probabilistic graphical models
 * - Kernel machine integration
 */

import { Logger } from '../utils/Logger';
import { Tensor, Embedding, TensorLogicRule, TensorOperation } from './TensorLogicEngine';
import { TensorLogicEngine } from './TensorLogicEngine';

export interface LearnedEmbeddingProvider {
  generateEmbedding(text: string): Promise<number[]>;
  generateBatchEmbeddings(texts: string[]): Promise<number[][]>;
  getDimension(): number;
}

export interface RuleLearningConfig {
  minConfidence: number;
  maxRules: number;
  learningRate: number;
  similarityThreshold: number;
}

export interface GraphicalModelNode {
  id: string;
  variable: string;
  parents: string[];
  tensor: Tensor;
  conditionalProbability?: Tensor;
}

export interface KernelFunction {
  (x: Tensor, y: Tensor): number;
  name: string;
}

export class TensorLogicEngineEnhancements {
  private logger: Logger;
  private baseEngine: TensorLogicEngine;
  private embeddingProvider?: LearnedEmbeddingProvider;
  private learnedRules: Map<string, TensorLogicRule> = new Map();
  private graphicalModel: Map<string, GraphicalModelNode> = new Map();
  private kernelFunctions: Map<string, KernelFunction> = new Map();

  constructor(baseEngine: TensorLogicEngine) {
    this.logger = new Logger('TensorLogicEngineEnhancements');
    this.baseEngine = baseEngine;
    this.initializeKernelFunctions();
  }

  /**
   * Set learned embedding provider (e.g., OpenAI, sentence-transformers)
   */
  public setEmbeddingProvider(provider: LearnedEmbeddingProvider): void {
    this.embeddingProvider = provider;
    this.logger.info('Learned embedding provider configured', { 
      dimension: provider.getDimension() 
    });
  }

  /**
   * Generate learned embedding using transformer model
   */
  public async generateLearnedEmbedding(text: string): Promise<Embedding> {
    if (this.embeddingProvider) {
      try {
        const vector = await this.embeddingProvider.generateEmbedding(text);
        return {
          vector,
          dimension: vector.length,
          concept: text,
          domain: undefined
        };
      } catch (error) {
        this.logger.warn('Failed to generate learned embedding, falling back to hash-based', error as Error);
      }
    }

    // Fallback to base engine's hash-based embedding
    return this.baseEngine.createEmbedding(text);
  }

  /**
   * Generate batch embeddings efficiently
   */
  public async generateBatchEmbeddings(texts: string[]): Promise<Embedding[]> {
    if (this.embeddingProvider) {
      try {
        const vectors = await this.embeddingProvider.generateBatchEmbeddings(texts);
        return vectors.map((vector, idx) => ({
          vector,
          dimension: vector.length,
          concept: texts[idx],
          domain: undefined
        }));
      } catch (error) {
        this.logger.warn('Failed to generate batch embeddings, falling back', error as Error);
      }
    }

    // Fallback to individual generation
    return Promise.all(texts.map(text => this.generateLearnedEmbedding(text)));
  }

  /**
   * Advanced Einstein summation for arbitrary tensor ranks
   * Supports complex contractions like: A_ijkl * B_jkmn = C_ilmn
   */
  public advancedEinsteinSummation(
    tensorA: Tensor,
    tensorB: Tensor,
    indicesA: string[],
    indicesB: string[],
    outputIndices: string[]
  ): Tensor {
    this.logger.debug('Performing advanced Einstein summation', {
      shapeA: tensorA.shape,
      shapeB: tensorB.shape,
      indicesA,
      indicesB,
      outputIndices
    });

    // Validate indices
    if (indicesA.length !== tensorA.rank || indicesB.length !== tensorB.rank) {
      throw new Error('Index count must match tensor rank');
    }

    // Find contracted indices (appear in both A and B)
    const contractedIndices = indicesA.filter(idx => indicesB.includes(idx));
    
    // Find output indices (appear in A or B but not both)
    const outputIndicesSet = new Set(outputIndices);
    
    // Compute output shape
    const outputShape = this.computeOutputShapeAdvanced(
      tensorA,
      tensorB,
      indicesA,
      indicesB,
      outputIndices
    );

    // Perform contraction
    const outputData = this.performContraction(
      tensorA,
      tensorB,
      indicesA,
      indicesB,
      outputIndices,
      outputShape
    );

    return {
      shape: outputShape,
      data: outputData,
      rank: outputShape.length
    };
  }

  /**
   * Compute output shape for advanced Einstein summation
   */
  private computeOutputShapeAdvanced(
    tensorA: Tensor,
    tensorB: Tensor,
    indicesA: string[],
    indicesB: string[],
    outputIndices: string[]
  ): number[] {
    const shapeMap = new Map<string, number>();
    
    // Map indices to dimensions from tensor A
    indicesA.forEach((idx, pos) => {
      if (!shapeMap.has(idx)) {
        shapeMap.set(idx, tensorA.shape[pos]);
      } else {
        // Verify consistency
        if (shapeMap.get(idx) !== tensorA.shape[pos]) {
          throw new Error(`Inconsistent dimension for index ${idx}`);
        }
      }
    });

    // Map indices to dimensions from tensor B
    indicesB.forEach((idx, pos) => {
      if (shapeMap.has(idx)) {
        // Verify consistency for contracted indices
        if (shapeMap.get(idx) !== tensorB.shape[pos]) {
          throw new Error(`Inconsistent dimension for contracted index ${idx}`);
        }
      } else {
        shapeMap.set(idx, tensorB.shape[pos]);
      }
    });

    // Build output shape from output indices
    return outputIndices.map(idx => {
      const dim = shapeMap.get(idx);
      if (dim === undefined) {
        throw new Error(`Output index ${idx} not found in input tensors`);
      }
      return dim;
    });
  }

  /**
   * Perform tensor contraction
   */
  private performContraction(
    tensorA: Tensor,
    tensorB: Tensor,
    indicesA: string[],
    indicesB: string[],
    outputIndices: string[],
    outputShape: number[]
  ): number[] {
    const outputSize = outputShape.reduce((a, b) => a * b, 1);
    const output: number[] = new Array(outputSize).fill(0);

    // Get all unique indices
    const allIndices = Array.from(new Set([...indicesA, ...indicesB]));
    const contractedIndices = indicesA.filter(idx => indicesB.includes(idx));

    // Iterate over all possible index combinations
    this.iterateOverIndices(
      tensorA,
      tensorB,
      indicesA,
      indicesB,
      outputIndices,
      outputShape,
      allIndices,
      contractedIndices,
      output
    );

    return output;
  }

  /**
   * Iterate over all index combinations and perform contraction
   */
  private iterateOverIndices(
    tensorA: Tensor,
    tensorB: Tensor,
    indicesA: string[],
    indicesB: string[],
    outputIndices: string[],
    outputShape: number[],
    allIndices: string[],
    contractedIndices: string[],
    output: number[]
  ): void {
    // Create index value maps
    const indexRanges = new Map<string, number[]>();
    allIndices.forEach(idx => {
      const dim = this.getIndexDimension(idx, indicesA, indicesB, tensorA, tensorB);
      indexRanges.set(idx, Array.from({ length: dim }, (_, i) => i));
    });

    // Recursive iteration helper
    const iterate = (currentIndices: Map<string, number>, depth: number) => {
      if (depth === allIndices.length) {
        // Compute indices for tensor A
        const idxA = this.computeTensorIndex(tensorA, indicesA, currentIndices);
        // Compute indices for tensor B
        const idxB = this.computeTensorIndex(tensorB, indicesB, currentIndices);
        // Compute output index
        const outIdx = this.computeOutputIndex(outputShape, outputIndices, currentIndices);

        // Perform contraction: sum over contracted indices
        if (contractedIndices.length > 0) {
          // This is a simplified version - full implementation would handle all contractions
          output[outIdx] += tensorA.data[idxA] * tensorB.data[idxB];
        } else {
          output[outIdx] = tensorA.data[idxA] * tensorB.data[idxB];
        }
        return;
      }

      const currentIdx = allIndices[depth];
      const ranges = indexRanges.get(currentIdx)!;
      
      for (const value of ranges) {
        currentIndices.set(currentIdx, value);
        iterate(currentIndices, depth + 1);
      }
    };

    iterate(new Map(), 0);
  }

  /**
   * Get dimension for an index
   */
  private getIndexDimension(
    idx: string,
    indicesA: string[],
    indicesB: string[],
    tensorA: Tensor,
    tensorB: Tensor
  ): number {
    const posA = indicesA.indexOf(idx);
    if (posA >= 0) return tensorA.shape[posA];
    
    const posB = indicesB.indexOf(idx);
    if (posB >= 0) return tensorB.shape[posB];
    
    throw new Error(`Index ${idx} not found`);
  }

  /**
   * Compute linear index for tensor A or B
   */
  private computeTensorIndex(
    tensor: Tensor,
    indices: string[],
    indexValues: Map<string, number>
  ): number {
    let index = 0;
    let stride = 1;

    for (let i = tensor.rank - 1; i >= 0; i--) {
      const idx = indices[i];
      const value = indexValues.get(idx)!;
      index += value * stride;
      stride *= tensor.shape[i];
    }

    return index;
  }

  /**
   * Compute linear index for output tensor
   */
  private computeOutputIndex(
    outputShape: number[],
    outputIndices: string[],
    indexValues: Map<string, number>
  ): number {
    let index = 0;
    let stride = 1;

    for (let i = outputShape.length - 1; i >= 0; i--) {
      const idx = outputIndices[i];
      const value = indexValues.get(idx)!;
      index += value * stride;
      stride *= outputShape[i];
    }

    return index;
  }

  /**
   * Learn rules automatically from data
   */
  public async learnRules(
    examples: Array<{ premise: string[]; conclusion: string[] }>,
    config: RuleLearningConfig
  ): Promise<TensorLogicRule[]> {
    this.logger.info('Learning rules from examples', { exampleCount: examples.length });

    const learnedRules: TensorLogicRule[] = [];
    const rulePatterns = new Map<string, { count: number; confidence: number }>();

    for (const example of examples) {
      // Generate embeddings for premise and conclusion
      const premiseEmbeddings = await this.generateBatchEmbeddings(example.premise);
      const conclusionEmbeddings = await this.generateBatchEmbeddings(example.conclusion);

      const premiseTensor = this.baseEngine.createTensor(premiseEmbeddings);
      const conclusionTensor = this.baseEngine.createTensor(conclusionEmbeddings);

      // Create rule pattern key
      const patternKey = `${example.premise.join('|')}->${example.conclusion.join('|')}`;
      
      if (!rulePatterns.has(patternKey)) {
        rulePatterns.set(patternKey, { count: 0, confidence: 0 });
      }

      const pattern = rulePatterns.get(patternKey)!;
      pattern.count++;

      // Compute confidence based on tensor similarity
      const similarity = this.computeTensorSimilarity(premiseTensor, conclusionTensor);
      pattern.confidence = (pattern.confidence * (pattern.count - 1) + similarity) / pattern.count;

      // Create rule if pattern is frequent and confident enough
      if (pattern.count >= 2 && pattern.confidence >= config.minConfidence) {
        const ruleId = `learned_rule_${learnedRules.length}`;
        const rule: TensorLogicRule = {
          id: ruleId,
          premise: premiseTensor,
          conclusion: conclusionTensor,
          weight: pattern.count / examples.length,
          confidence: pattern.confidence,
          type: 'inductive'
        };

        if (!this.learnedRules.has(ruleId)) {
          this.learnedRules.set(ruleId, rule);
          learnedRules.push(rule);
          this.baseEngine.addRule(rule);
        }
      }
    }

    // Keep only top rules
    learnedRules.sort((a, b) => b.confidence - a.confidence);
    const topRules = learnedRules.slice(0, config.maxRules);

    this.logger.info('Rule learning completed', {
      totalRules: learnedRules.length,
      topRules: topRules.length
    });

    return topRules;
  }

  /**
   * Compute tensor similarity (helper method)
   */
  private computeTensorSimilarity(tensorA: Tensor, tensorB: Tensor): number {
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
   * Initialize kernel functions
   */
  private initializeKernelFunctions(): void {
    // Linear kernel: K(x, y) = x^T * y
    this.kernelFunctions.set('linear', ((x: Tensor, y: Tensor) => {
      const minLength = Math.min(x.data.length, y.data.length);
      let dotProduct = 0;
      for (let i = 0; i < minLength; i++) {
        dotProduct += x.data[i] * y.data[i];
      }
      return dotProduct;
    }) as KernelFunction);

    // Polynomial kernel: K(x, y) = (x^T * y + c)^d
    this.kernelFunctions.set('polynomial', ((x: Tensor, y: Tensor) => {
      const linear = this.kernelFunctions.get('linear')!(x, y);
      const c = 1;
      const d = 2;
      return Math.pow(linear + c, d);
    }) as KernelFunction);

    // RBF (Gaussian) kernel: K(x, y) = exp(-gamma * ||x - y||^2)
    this.kernelFunctions.set('rbf', ((x: Tensor, y: Tensor) => {
      const minLength = Math.min(x.data.length, y.data.length);
      let squaredDiff = 0;
      for (let i = 0; i < minLength; i++) {
        const diff = x.data[i] - y.data[i];
        squaredDiff += diff * diff;
      }
      const gamma = 1.0;
      return Math.exp(-gamma * squaredDiff);
    }) as KernelFunction);
  }

  /**
   * Apply kernel function to tensors
   */
  public applyKernel(kernelName: string, tensorA: Tensor, tensorB: Tensor): number {
    const kernel = this.kernelFunctions.get(kernelName);
    if (!kernel) {
      throw new Error(`Kernel function ${kernelName} not found`);
    }
    return kernel(tensorA, tensorB);
  }

  /**
   * Add custom kernel function
   */
  public addKernelFunction(name: string, kernel: KernelFunction): void {
    this.kernelFunctions.set(name, kernel);
    this.logger.info(`Added custom kernel function: ${name}`);
  }

  /**
   * Create probabilistic graphical model node
   */
  public createGraphicalModelNode(
    id: string,
    variable: string,
    parents: string[],
    tensor: Tensor,
    conditionalProbability?: Tensor
  ): GraphicalModelNode {
    const node: GraphicalModelNode = {
      id,
      variable,
      parents,
      tensor,
      conditionalProbability
    };

    this.graphicalModel.set(id, node);
    this.logger.info(`Created graphical model node: ${id}`, { variable, parents: parents.length });

    return node;
  }

  /**
   * Perform inference in graphical model
   */
  public async graphicalModelInference(
    queryVariables: string[],
    evidence: Map<string, Tensor>
  ): Promise<Map<string, Tensor>> {
    this.logger.info('Performing graphical model inference', {
      queryVariables: queryVariables.length,
      evidence: evidence.size
    });

    const results = new Map<string, Tensor>();

    // Simple inference: propagate through graph
    for (const queryVar of queryVariables) {
      const node = Array.from(this.graphicalModel.values()).find(n => n.variable === queryVar);
      if (!node) {
        this.logger.warn(`Node not found for variable: ${queryVar}`);
        continue;
      }

      // Compute conditional probability given parents
      let resultTensor = node.tensor;

      for (const parentId of node.parents) {
        const parentEvidence = evidence.get(parentId);
        if (parentEvidence && node.conditionalProbability) {
          // Multiply with conditional probability
          resultTensor = this.multiplyTensors(resultTensor, node.conditionalProbability);
        }
      }

      results.set(queryVar, resultTensor);
    }

    return results;
  }

  /**
   * Multiply two tensors element-wise
   */
  private multiplyTensors(tensorA: Tensor, tensorB: Tensor): Tensor {
    const minLength = Math.min(tensorA.data.length, tensorB.data.length);
    const data = tensorA.data.slice(0, minLength).map((val, i) => val * tensorB.data[i]);

    return {
      shape: tensorA.shape,
      data,
      rank: tensorA.rank
    };
  }

  /**
   * Get learned rules
   */
  public getLearnedRules(): TensorLogicRule[] {
    return Array.from(this.learnedRules.values());
  }

  /**
   * Get graphical model
   */
  public getGraphicalModel(): Map<string, GraphicalModelNode> {
    return this.graphicalModel;
  }
}

