/**
 * TensorFlow.js Embedding Provider
 * Provides learned embeddings using TensorFlow.js models
 * Can use Universal Sentence Encoder or other pre-trained models
 */

import * as tf from '@tensorflow/tfjs-node';
import { LearnedEmbeddingProvider } from '../TensorLogicEngineEnhancements';
import { Logger } from '../../utils/Logger';

export class TensorFlowEmbeddingProvider implements LearnedEmbeddingProvider {
  private logger: Logger;
  private model: tf.LayersModel | null = null;
  private dimension: number;
  private modelUrl?: string;

  constructor(dimension: number = 512, modelUrl?: string) {
    this.logger = new Logger('TensorFlowEmbeddingProvider');
    this.dimension = dimension;
    this.modelUrl = modelUrl;
  }

  async initialize(): Promise<void> {
    if (this.modelUrl) {
      try {
        this.logger.info('Loading TensorFlow model', { url: this.modelUrl });
        this.model = await tf.loadLayersModel(this.modelUrl);
        this.logger.info('TensorFlow model loaded successfully');
      } catch (error) {
        this.logger.warn('Failed to load TensorFlow model, using simple encoding', error as Error);
      }
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (this.model) {
      try {
        // Preprocess text
        const input = this.preprocessText(text);
        
        // Run through model
        const prediction = this.model.predict(input) as tf.Tensor;
        const embedding = await prediction.data();
        
        // Clean up
        input.dispose();
        prediction.dispose();

        return Array.from(embedding);
      } catch (error) {
        this.logger.warn('Model inference failed, using fallback', error as Error);
      }
    }

    // Fallback: simple hash-based embedding
    return this.generateHashEmbedding(text);
  }

  async generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
    if (this.model) {
      try {
        // Batch processing
        const inputs = texts.map(text => this.preprocessText(text));
        const batch = tf.stack(inputs);
        
        const predictions = this.model.predict(batch) as tf.Tensor;
        const embeddings = await predictions.array() as number[][];
        
        // Clean up
        inputs.forEach(t => t.dispose());
        batch.dispose();
        predictions.dispose();

        return embeddings;
      } catch (error) {
        this.logger.warn('Batch model inference failed, using fallback', error as Error);
      }
    }

    // Fallback: individual hash embeddings
    return Promise.all(texts.map(text => this.generateHashEmbedding(text)));
  }

  getDimension(): number {
    return this.dimension;
  }

  /**
   * Preprocess text for model input
   */
  private preprocessText(text: string): tf.Tensor {
    // Simple tokenization (in production, use proper tokenizer)
    const tokens = text.toLowerCase().split(/\s+/).slice(0, 128);
    const vector = new Array(128).fill(0);
    
    tokens.forEach((token, idx) => {
      if (idx < 128) {
        // Simple hash-based encoding
        let hash = 0;
        for (let i = 0; i < token.length; i++) {
          hash = ((hash << 5) - hash) + token.charCodeAt(i);
          hash = hash & hash;
        }
        vector[idx] = (hash % 1000) / 1000;
      }
    });

    return tf.tensor2d([vector]);
  }

  /**
   * Generate hash-based embedding as fallback
   */
  private generateHashEmbedding(text: string): number[] {
    const vector: number[] = [];
    const seed = this.hashString(text);
    
    for (let i = 0; i < this.dimension; i++) {
      const value = Math.sin(seed + i) * 0.5 + 0.5;
      vector.push(value);
    }
    
    // Normalize
    const norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
    return vector.map(v => norm > 0 ? v / norm : 0);
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
}

