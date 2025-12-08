# Tensor Logic Engine Enhancements

## Overview

This document describes the advanced enhancements implemented for the Tensor Logic Engine, bringing it to production-ready status with learned embeddings, advanced tensor operations, rule learning, and more.

## Implemented Enhancements

### 1. Learned Embeddings

#### OpenAI Embedding Provider
- Uses OpenAI's embedding API (text-embedding-3-small, text-embedding-3-large)
- Supports batch embedding generation
- Automatic dimension detection based on model

**Usage:**
```typescript
import { OpenAIEmbeddingProvider } from './core/embedding/OpenAIEmbeddingProvider';
import { TensorLogicEngineEnhancements } from './core/TensorLogicEngineEnhancements';

const provider = new OpenAIEmbeddingProvider(process.env.OPENAI_API_KEY!);
const enhancements = new TensorLogicEngineEnhancements(engine);
enhancements.setEmbeddingProvider(provider);

// Now embeddings will use OpenAI's learned models
const embedding = await enhancements.generateLearnedEmbedding("neural networks");
```

#### TensorFlow.js Embedding Provider
- Supports loading pre-trained TensorFlow models
- Can use Universal Sentence Encoder or custom models
- Fallback to hash-based embeddings if model unavailable

**Usage:**
```typescript
import { TensorFlowEmbeddingProvider } from './core/embedding/TensorFlowEmbeddingProvider';

const provider = new TensorFlowEmbeddingProvider(512, 'path/to/model.json');
await provider.initialize();
enhancements.setEmbeddingProvider(provider);
```

### 2. Advanced Einstein Summation

Supports arbitrary tensor rank contractions with full Einstein notation:

```typescript
// Example: A_ijkl * B_jkmn = C_ilmn
const result = enhancements.advancedEinsteinSummation(
  tensorA,  // rank 4
  tensorB,  // rank 4
  ['i', 'j', 'k', 'l'],  // indices for A
  ['j', 'k', 'm', 'n'],  // indices for B
  ['i', 'l', 'm', 'n']   // output indices
);
```

**Features:**
- Automatic dimension validation
- Efficient contraction computation
- Support for complex multi-index contractions
- Error handling for inconsistent dimensions

### 3. Automatic Rule Learning

Learn logical rules automatically from examples:

```typescript
const examples = [
  { premise: ['if', 'rain'], conclusion: ['wet'] },
  { premise: ['if', 'snow'], conclusion: ['cold'] },
  // ... more examples
];

const config = {
  minConfidence: 0.7,
  maxRules: 10,
  learningRate: 0.1,
  similarityThreshold: 0.6
};

const learnedRules = await enhancements.learnRules(examples, config);
```

**How it works:**
- Analyzes premise-conclusion patterns
- Computes tensor similarities
- Extracts frequent, confident patterns
- Creates TensorLogicRule objects automatically

### 4. Probabilistic Graphical Models

Support for Bayesian networks and other graphical models using tensors:

```typescript
// Create nodes
const rainNode = enhancements.createGraphicalModelNode(
  'rain',
  'Rain',
  [],
  rainTensor
);

const wetNode = enhancements.createGraphicalModelNode(
  'wet',
  'Wet',
  ['rain'],
  wetTensor,
  conditionalProbabilityTensor
);

// Perform inference
const evidence = new Map([['rain', rainTensor]]);
const results = await enhancements.graphicalModelInference(
  ['wet'],
  evidence
);
```

**Features:**
- Node-based graph structure
- Conditional probability tensors
- Inference through graph propagation
- Support for complex dependencies

### 5. Kernel Machine Integration

Multiple kernel functions for kernel methods:

```typescript
// Available kernels: 'linear', 'polynomial', 'rbf'
const similarity = enhancements.applyKernel('rbf', tensorA, tensorB);

// Custom kernels
enhancements.addKernelFunction('custom', (x, y) => {
  // Custom kernel computation
  return customKernelValue;
});
```

**Available Kernels:**
- **Linear**: `K(x, y) = x^T * y`
- **Polynomial**: `K(x, y) = (x^T * y + c)^d`
- **RBF (Gaussian)**: `K(x, y) = exp(-γ * ||x - y||^2)`

### 6. Factory Pattern for Easy Setup

Use the factory to create fully configured engines:

```typescript
import { TensorLogicEngineFactory } from './core/TensorLogicEngineFactory';

const { engine, enhancements } = await TensorLogicEngineFactory.create({
  embeddingDimension: 1536,
  useLearnedEmbeddings: true,
  embeddingProvider: 'openai',
  openaiApiKey: process.env.OPENAI_API_KEY,
  openaiModel: 'text-embedding-3-small',
  enableRuleLearning: true,
  enableGraphicalModels: true,
  enableKernelMachines: true
});
```

## Integration Example

Complete example showing all enhancements:

```typescript
import { TensorLogicEngineFactory } from './core/TensorLogicEngineFactory';
import { TensorLogicEngineEnhancements } from './core/TensorLogicEngineEnhancements';

// Create engine with enhancements
const { engine, enhancements } = await TensorLogicEngineFactory.create({
  embeddingDimension: 1536,
  useLearnedEmbeddings: true,
  embeddingProvider: 'openai',
  openaiApiKey: process.env.OPENAI_API_KEY
});

// Learn rules from data
const examples = [
  { premise: ['neural', 'network'], conclusion: ['learn'] },
  { premise: ['symbolic', 'logic'], conclusion: ['reason'] }
];

const rules = await enhancements.learnRules(examples, {
  minConfidence: 0.7,
  maxRules: 5,
  learningRate: 0.1,
  similarityThreshold: 0.6
});

// Use advanced Einstein summation
const tensorA = engine.createTensor([...]);
const tensorB = engine.createTensor([...]);
const result = enhancements.advancedEinsteinSummation(
  tensorA, tensorB,
  ['i', 'j'], ['j', 'k'],
  ['i', 'k']
);

// Apply kernel functions
const kernelValue = enhancements.applyKernel('rbf', tensorA, tensorB);

// Create graphical model
const node = enhancements.createGraphicalModelNode(
  'concept',
  'Concept',
  [],
  conceptTensor
);
```

## Performance Considerations

1. **Learned Embeddings**: 
   - OpenAI API calls have latency (use batch when possible)
   - TensorFlow models require initialization time
   - Cache embeddings when possible

2. **Advanced Einstein Summation**:
   - Computational complexity grows with tensor rank
   - Use for high-rank tensors only when necessary
   - Consider approximation for very large tensors

3. **Rule Learning**:
   - Requires sufficient examples (minimum 2-3 per pattern)
   - Similarity computation can be expensive for large datasets
   - Consider sampling for very large example sets

4. **Graphical Models**:
   - Inference complexity depends on graph structure
   - Dense graphs are more expensive
   - Consider approximate inference for large models

## Future Enhancements

Potential future improvements:

1. **Distributed Tensor Operations**: Support for distributed computation
2. **GPU Acceleration**: CUDA/WebGPU support for tensor operations
3. **Incremental Rule Learning**: Update rules as new data arrives
4. **Advanced Graphical Models**: Support for dynamic Bayesian networks
5. **Custom Embedding Models**: Train domain-specific embeddings
6. **Tensor Compression**: Sparse tensor representations for efficiency

## Migration Guide

### From Basic to Enhanced

**Before:**
```typescript
const engine = new TensorLogicEngine(128);
await engine.initializeDefaultRules();
```

**After:**
```typescript
const { engine, enhancements } = await TensorLogicEngineFactory.create({
  embeddingDimension: 1536,
  useLearnedEmbeddings: true,
  embeddingProvider: 'openai',
  openaiApiKey: process.env.OPENAI_API_KEY
});
```

### Backward Compatibility

The base `TensorLogicEngine` still works without enhancements. Enhancements are optional and can be added incrementally.

## Testing

All enhancements include:
- Unit tests for individual features
- Integration tests with base engine
- Performance benchmarks
- Error handling validation

Run tests:
```bash
pnpm test src/core/TensorLogicEngineEnhancements.test.ts
pnpm test src/core/embedding/*.test.ts
```

