import { describe, expect, it } from "vitest";
import type { LearnedEmbeddingProvider } from "@/retrieval/embeddingProvider";
import {
  cosineSimilarity,
  rankTextsByOverlap,
  rankTextsWithProvider,
  SEMANTIC_RETRIEVAL_EVAL,
} from "@/retrieval/semanticRetrieval";

describe("semanticRetrieval", () => {
  it("ranks the Iran capital passage first without an API", () => {
    const ranked = rankTextsByOverlap(
      SEMANTIC_RETRIEVAL_EVAL.query,
      SEMANTIC_RETRIEVAL_EVAL.passages,
    );

    expect(ranked[0]?.text).toBe(SEMANTIC_RETRIEVAL_EVAL.expectedTop);
    expect(ranked[0]?.score ?? 0).toBeGreaterThan(ranked[1]?.score ?? 0);
  });

  it("returns 0 cosine for mismatched or empty vectors", () => {
    expect(cosineSimilarity([1, 0], [1])).toBe(0);
    expect(cosineSimilarity([], [1])).toBe(0);
    expect(cosineSimilarity([1, 0], [1, 0])).toBeCloseTo(1);
  });

  it("ranks with a learned embedding provider", async () => {
    const provider: LearnedEmbeddingProvider = {
      getDimension: () => 2,
      generateEmbedding: async (text: string) =>
        text.includes("Tehran") || text.includes("Iran") ? [1, 0] : [0, 1],
      generateBatchEmbeddings: async (texts: string[]) =>
        texts.map((text) =>
          text.includes("Tehran") || text.includes("Iran") ? [1, 0] : [0, 1],
        ),
    };

    const ranked = await rankTextsWithProvider(provider, "capital of Iran", [
      "XOR is a logic gate",
      "Tehran is the capital city of Iran.",
    ]);

    expect(ranked[0]?.text).toContain("Tehran");
    expect(ranked[0]?.score).toBeGreaterThan(ranked[1]?.score ?? 0);
  });
});
