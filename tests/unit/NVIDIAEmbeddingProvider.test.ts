import { afterEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULT_NVIDIA_EMBED_MODEL,
  DEFAULT_NVIDIA_EMBED_URL,
  NVIDIAEmbeddingProvider,
} from "@/retrieval/NVIDIAEmbeddingProvider";

describe("NVIDIAEmbeddingProvider", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("requests query embeddings from the NVIDIA NIM endpoint", async () => {
    const fetchMock = vi.fn(async () =>
      Response.json({
        data: [{ index: 0, embedding: [0.1, 0.2, 0.3] }],
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const provider = new NVIDIAEmbeddingProvider("nvapi_test");
    const vector = await provider.generateEmbedding("capital of Iran");

    expect(vector).toEqual([0.1, 0.2, 0.3]);
    expect(provider.getDimension()).toBe(2048);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(DEFAULT_NVIDIA_EMBED_URL);
    expect(init.headers).toMatchObject({
      Authorization: "Bearer nvapi_test",
    });
    const body = JSON.parse(String(init.body));
    expect(body).toMatchObject({
      model: DEFAULT_NVIDIA_EMBED_MODEL,
      input: ["capital of Iran"],
      input_type: "query",
    });
  });

  it("preserves batch order using NVIDIA index fields", async () => {
    const fetchMock = vi.fn(async () =>
      Response.json({
        data: [
          { index: 1, embedding: [0, 1] },
          { index: 0, embedding: [1, 0] },
        ],
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const provider = new NVIDIAEmbeddingProvider("nvapi_test");
    const vectors = await provider.generateBatchEmbeddings(["first", "second"]);

    expect(vectors).toEqual([
      [1, 0],
      [0, 1],
    ]);
    const body = JSON.parse(
      String((fetchMock.mock.calls[0] as [string, RequestInit])[1].body),
    );
    expect(body.input_type).toBe("passage");
  });

  it("throws on NVIDIA embedding HTTP errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({ error: "unauthorized" }, { status: 401 }),
      ),
    );

    const provider = new NVIDIAEmbeddingProvider("bad_key");
    await expect(provider.generateEmbedding("hi")).rejects.toThrow(
      /NVIDIA embedding API error: 401/,
    );
  });
});
