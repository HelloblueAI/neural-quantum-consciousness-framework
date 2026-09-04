/**
 * Learned embedding provider contract used by the retrieval ranking utilities.
 * Implemented by provider-backed embedders (e.g. NVIDIA Nemotron, OpenAI).
 */
export interface LearnedEmbeddingProvider {
  generateEmbedding(text: string): Promise<number[]>;
  generateBatchEmbeddings(texts: string[]): Promise<number[][]>;
  getDimension(): number;
}
