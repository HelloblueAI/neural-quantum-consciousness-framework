import { vi } from "vitest";

// Mock the only external SDK used by the retrieval embedding provider.
vi.mock("openai", () => ({
  OpenAI: vi.fn().mockImplementation(() => ({
    embeddings: {
      create: vi.fn().mockResolvedValue({
        data: [{ embedding: new Array(1536).fill(0.1) }],
      }),
    },
  })),
}));

// Deterministic test environment.
process.env.NODE_ENV = "test";

// Suppress console output during tests unless explicitly needed.
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

vi.setConfig({
  testTimeout: 10000,
  hookTimeout: 10000,
});
