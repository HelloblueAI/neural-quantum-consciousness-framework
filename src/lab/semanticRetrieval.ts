/**
 * Semantic ranking for concept-graph / RAG work.
 * Offline path uses bag-of-words cosine; NVIDIA Nemotron embed replaces it when a key is set.
 */

import type { LearnedEmbeddingProvider } from '../core/TensorLogicEngineEnhancements';

export type RankedText = {
  text: string;
  score: number;
  index: number;
};

const TOKEN_RE = /[a-z0-9]+/g;

export function tokenize(text: string): string[] {
  return (text.toLowerCase().match(TOKEN_RE) ?? []).filter((token) => token.length > 1);
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length === 0 || b.length === 0 || a.length !== b.length) {
    return 0;
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    const x = a[i] ?? 0;
    const y = b[i] ?? 0;
    dot += x * y;
    normA += x * x;
    normB += y * y;
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom > 0 ? dot / denom : 0;
}

export function bagOfWordsVector(text: string, vocab: string[]): number[] {
  const counts = new Map<string, number>();
  for (const token of tokenize(text)) {
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }
  return vocab.map((token) => counts.get(token) ?? 0);
}

export function buildVocab(texts: string[]): string[] {
  const vocab = new Set<string>();
  for (const text of texts) {
    for (const token of tokenize(text)) {
      vocab.add(token);
    }
  }
  return [...vocab].sort();
}

/** Offline retrieval: rank passages by token-overlap cosine with the query. */
export function rankTextsByOverlap(query: string, passages: string[]): RankedText[] {
  const vocab = buildVocab([query, ...passages]);
  const queryVector = bagOfWordsVector(query, vocab);
  return passages
    .map((text, index) => ({
      text,
      index,
      score: cosineSimilarity(queryVector, bagOfWordsVector(text, vocab)),
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index);
}

/** Production retrieval: rank passages with a learned embedding provider. */
export async function rankTextsWithProvider(
  provider: LearnedEmbeddingProvider,
  query: string,
  passages: string[]
): Promise<RankedText[]> {
  if (passages.length === 0) {
    return [];
  }

  const queryVector = await provider.generateEmbedding(query);
  const passageVectors = await provider.generateBatchEmbeddings(passages);

  return passages
    .map((text, index) => ({
      text,
      index,
      score: cosineSimilarity(queryVector, passageVectors[index] ?? []),
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index);
}

export const SEMANTIC_RETRIEVAL_EVAL = {
  query: 'What is the capital city of Iran?',
  passages: [
    'Paris is the capital of France and a major European city.',
    'Tehran is the capital city of Iran.',
    'XOR is a binary logic operation used in neural learning tests.',
  ],
  expectedTop: 'Tehran is the capital city of Iran.',
};
