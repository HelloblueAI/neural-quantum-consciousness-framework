/**
 * NVIDIA Nemotron embed provider (Worker-safe fetch).
 * Model: nvidia/nemotron-3-embed-1b — query vs passage input_type matters for retrieval.
 */

import type { LearnedEmbeddingProvider } from "./embeddingProvider";

export type NvidiaEmbedInputType = "query" | "passage";

export const DEFAULT_NVIDIA_EMBED_URL =
  "https://integrate.api.nvidia.com/v1/embeddings";
export const DEFAULT_NVIDIA_EMBED_MODEL = "nvidia/nemotron-3-embed-1b";
export const NVIDIA_EMBED_DIMENSION = 2048;

export class NVIDIAEmbeddingProvider implements LearnedEmbeddingProvider {
  private readonly apiKey: string;
  private readonly model: string;
  private readonly embedUrl: string;
  private readonly dimension: number;

  constructor(
    apiKey: string,
    model: string = DEFAULT_NVIDIA_EMBED_MODEL,
    embedUrl: string = DEFAULT_NVIDIA_EMBED_URL,
    dimension: number = NVIDIA_EMBED_DIMENSION,
  ) {
    this.apiKey = apiKey;
    this.model = model;
    this.embedUrl = embedUrl.trim() || DEFAULT_NVIDIA_EMBED_URL;
    this.dimension = dimension;
  }

  async generateEmbedding(
    text: string,
    inputType: NvidiaEmbedInputType = "query",
  ): Promise<number[]> {
    const [vector] = await this.embed([text], inputType);
    if (!vector) {
      throw new Error("No embedding data returned from NVIDIA");
    }
    return vector;
  }

  async generateBatchEmbeddings(
    texts: string[],
    inputType: NvidiaEmbedInputType = "passage",
  ): Promise<number[][]> {
    if (texts.length === 0) {
      return [];
    }
    return this.embed(texts, inputType);
  }

  getDimension(): number {
    return this.dimension;
  }

  private async embed(
    texts: string[],
    inputType: NvidiaEmbedInputType,
  ): Promise<number[][]> {
    const response = await fetch(this.embedUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        input: texts,
        input_type: inputType,
        encoding_format: "float",
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(
        `NVIDIA embedding API error: ${response.status} - ${error}`,
      );
    }

    const data = (await response.json()) as {
      data?: Array<{ index?: number; embedding?: number[] }>;
    };
    const rows = data.data ?? [];
    if (rows.length !== texts.length) {
      throw new Error(
        `NVIDIA embedding count mismatch: expected ${texts.length}, got ${rows.length}`,
      );
    }

    return [...rows]
      .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
      .map((row) => {
        if (!row.embedding?.length) {
          throw new Error("NVIDIA embedding row missing vector");
        }
        return row.embedding;
      });
  }
}
