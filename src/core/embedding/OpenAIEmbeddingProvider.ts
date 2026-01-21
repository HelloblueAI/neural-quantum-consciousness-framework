/**
 * OpenAI Embedding Provider
 * Provides learned embeddings using OpenAI's embedding API
 */

import { OpenAI } from 'openai';
import { LearnedEmbeddingProvider } from '../TensorLogicEngineEnhancements';
import { Logger } from '../../utils/Logger';

export class OpenAIEmbeddingProvider implements LearnedEmbeddingProvider {
  private openai: OpenAI;
  private logger: Logger;
  private model: string;
  private dimension: number;

  constructor(apiKey: string, model: string = 'text-embedding-3-small') {
    this.openai = new OpenAI({ apiKey });
    this.logger = new Logger('OpenAIEmbeddingProvider');
    this.model = model;
    
    // Set dimension based on model
    this.dimension = model.includes('3-large') ? 3072 : 
                     model.includes('3-small') ? 1536 : 1536;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: this.model,
        input: text,
      });

      const firstData = response.data[0];
      if (!firstData) {
        throw new Error('No embedding data returned from OpenAI');
      }
      return firstData.embedding;
    } catch (error) {
      this.logger.error('Failed to generate OpenAI embedding', error as Error);
      throw error;
    }
  }

  async generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
    try {
      const response = await this.openai.embeddings.create({
        model: this.model,
        input: texts,
      });

      return response.data.map(item => item.embedding);
    } catch (error) {
      this.logger.error('Failed to generate batch OpenAI embeddings', error as Error);
      throw error;
    }
  }

  getDimension(): number {
    return this.dimension;
  }
}

