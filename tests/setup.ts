import { vi } from 'vitest';

// Mock external dependencies
vi.mock('@tensorflow/tfjs-node', () => ({
  default: {
    ready: vi.fn().mockResolvedValue(true),
    tensor: vi.fn(),
    loadLayersModel: vi.fn(),
    sequential: vi.fn(),
    layers: {
      dense: vi.fn(),
      conv2d: vi.fn(),
      maxPooling2d: vi.fn(),
      flatten: vi.fn(),
      dropout: vi.fn()
    }
  }
}));

vi.mock('onnxruntime-node', () => ({
  InferenceSession: {
    create: vi.fn().mockResolvedValue({
      run: vi.fn().mockResolvedValue({}),
      inputNames: [],
      outputNames: []
    })
  }
}));

vi.mock('openai', () => ({
  OpenAI: vi.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: vi.fn().mockResolvedValue({
          choices: [{ message: { content: 'Mocked response' } }]
        })
      }
    },
    embeddings: {
      create: vi.fn().mockResolvedValue({
        data: [{ embedding: new Array(1536).fill(0.1) }]
      })
    }
  }))
}));

vi.mock('@anthropic-ai/sdk', () => ({
  Anthropic: vi.fn().mockImplementation(() => ({
    messages: {
      create: vi.fn().mockResolvedValue({
        content: [{ text: 'Mocked Anthropic response' }]
      })
    }
  }))
}));



// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.ENABLE_RATE_LIMIT = 'true'; // Enable rate limiting for rate limit tests
process.env.TEST_API_KEY = 'test-api-key'; // Default API key for tests
process.env.OPENAI_API_KEY = 'test-openai-key';
process.env.ANTHROPIC_API_KEY = 'test-anthropic-key';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.REDIS_URL = 'redis://localhost:6379';

// Global test utilities
global.console = {
  ...console,
  // Suppress console output during tests unless explicitly needed
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn()
};

// Test timeout configuration
vi.setConfig({
  testTimeout: 10000,
  hookTimeout: 10000
}); 