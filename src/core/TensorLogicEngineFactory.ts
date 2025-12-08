/**
 * Tensor Logic Engine Factory
 * Creates and configures Tensor Logic Engine with enhancements
 */

import { TensorLogicEngine } from './TensorLogicEngine';
import { TensorLogicEngineEnhancements } from './TensorLogicEngineEnhancements';
import { OpenAIEmbeddingProvider } from './embedding/OpenAIEmbeddingProvider';
import { TensorFlowEmbeddingProvider } from './embedding/TensorFlowEmbeddingProvider';
import { LearnedEmbeddingProvider } from './TensorLogicEngineEnhancements';

export interface TensorLogicConfig {
  embeddingDimension?: number;
  useLearnedEmbeddings?: boolean;
  embeddingProvider?: 'openai' | 'tensorflow' | 'none';
  openaiApiKey?: string;
  openaiModel?: string;
  tensorflowModelUrl?: string;
  enableRuleLearning?: boolean;
  enableGraphicalModels?: boolean;
  enableKernelMachines?: boolean;
}

export class TensorLogicEngineFactory {
  /**
   * Create a fully configured Tensor Logic Engine
   */
  static async create(config: TensorLogicConfig = {}): Promise<{
    engine: TensorLogicEngine;
    enhancements: TensorLogicEngineEnhancements;
  }> {
    const embeddingDimension = config.embeddingDimension || 128;
    const engine = new TensorLogicEngine(embeddingDimension);

    // Create enhancements
    const enhancements = new TensorLogicEngineEnhancements(engine);
    engine.setEnhancements(enhancements);

    // Configure embedding provider if requested
    if (config.useLearnedEmbeddings && config.embeddingProvider !== 'none') {
      let provider: LearnedEmbeddingProvider | undefined;

      if (config.embeddingProvider === 'openai' && config.openaiApiKey) {
        provider = new OpenAIEmbeddingProvider(
          config.openaiApiKey,
          config.openaiModel || 'text-embedding-3-small'
        );
        enhancements.setEmbeddingProvider(provider);
      } else if (config.embeddingProvider === 'tensorflow') {
        provider = new TensorFlowEmbeddingProvider(
          embeddingDimension,
          config.tensorflowModelUrl
        );
        await (provider as TensorFlowEmbeddingProvider).initialize();
        enhancements.setEmbeddingProvider(provider);
      }
    }

    // Initialize default rules
    await engine.initializeDefaultRules();

    return { engine, enhancements };
  }

  /**
   * Create a simple Tensor Logic Engine without enhancements
   */
  static createSimple(embeddingDimension: number = 128): TensorLogicEngine {
    return new TensorLogicEngine(embeddingDimension);
  }
}

