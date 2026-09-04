# Architecture

The lab runs as a **single Cloudflare Worker** with process-scoped engines. There
is one request entry point and no external database; optional Cloudflare KV is
used only for caching and routing counters.

## Request path

```
HTTP request
   │
   ▼
src/worker/index.ts            # routing, validation, dashboard, CORS
   │
   ├── routing/RealLLMIntegration     # BleuJS → NVIDIA → Anthropic → OpenAI
   ├── routing/arithmeticReason       # local math, no LLM round-trip
   ├── reasoning/ReasoningOrchestrator# coordinates the engines below
   │      ├── RealLearningEngine / RealNeuralNetwork
   │      ├── RealReasoningEngine
   │      ├── ChainOfThoughtReasoning
   │      ├── MultiAgentSystem
   │      ├── ToolSystem
   │      ├── MemorySystem
   │      └── SelfImprovementLoop
   ├── reasoning/RealUnderstandingEngine + CrossDomainReasoningEngine
   ├── reasoning/AutonomousGoalSystem
   ├── retrieval/semanticRetrieval (+ embedding providers)
   ├── metrics/* (capability + request metrics, status payloads)
   └── evals/runner (GET /eval)
```

## Design principles

- **One application path.** No alternate workers or entry points on `main`.
- **Measured, not simulated.** Every metric in an API response is derived from
  real learning-engine state or request counters — never `Math.random()`.
- **Offline-capable core.** Arithmetic, retrieval, tool selection, routing, and
  the benchmark suite run without any API keys. LLM calls are strictly optional.
- **Process-scoped state.** Engines are instantiated per Worker isolate; durable
  state (goals, concept graph) is a roadmap item backed by Cloudflare KV.

## Provider routing

`RealLLMIntegration` tries providers in order and records which one answered so
`/metrics` can report per-provider counts and a fallback rate:

1. BleuJS API (`BLEUJS_API_KEY`)
2. NVIDIA Nemotron Lightning (fallback, when `ALLOW_LLM_FALLBACK=true`)
3. Anthropic
4. OpenAI

Simple arithmetic short-circuits the chain entirely via `arithmeticReason`.

## Evaluations

- **Component / smoke evaluations** (`src/evals/`) confirm each component runs.
- **Reproducible benchmarks** (`src/evals/benchmarks/`) score fixed datasets with
  exact scoring and write `src/evals/results/latest.json`.

See [PROJECT_STRUCTURE.md](../PROJECT_STRUCTURE.md) for the full file layout.
