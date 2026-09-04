# BleuJS Reasoning Lab — measurable roadmap

**Live site:** https://agi.bleujs.org
**Canonical code:** `src/worker/index.ts` + `src/reasoning/ReasoningOrchestrator.ts`

## North star

Build **one measurable reasoning loop** whose benchmark scores improve over time —
not more modules, and not simulated capability percentages. The deliverable is a
**credible, honest lab**, not a claim of general intelligence.

---

## Phase 1: Foundation (done)

- [x] Single production Worker (`src/worker/index.ts`)
- [x] Legacy consciousness/quantum/true-AGI code removed from `main` (history retained)
- [x] Worker-first layout: `worker / reasoning / routing / retrieval / metrics / evals`
- [x] Honest metrics — no `Math.random()` in any live API field
- [x] Endpoints: `GET /metrics`, `GET /capabilities`, `GET /eval`, `GET /goals`, `POST /reason`
- [x] Slimmed dependencies (removed TFJS, ONNX, pg/redis/typeorm, Express, Jest, FFI)
- [x] `pnpm check` (format + lint + type-check + tests + evals) enforced in CI
- [x] Evaluations split into component/smoke checks and reproducible benchmarks
- [x] Benchmark results committed to `src/evals/results/latest.json`

---

## Phase 2: Autonomous goal loop

**Focus:** the system sets sub-goals, acts, evaluates, and updates strategy.

1. Goal execution pipeline: `AutonomousGoalSystem` → pick top goal → call the
   orchestrator → record outcome → update progress.
2. `POST /goals/execute` runs one safe, rate-limited cycle.
3. Failed benchmark items become goal candidates.
4. Persist goal state across requests via a Cloudflare KV binding.

**Measure:** benchmark pass rate holds at 100% on fixed datasets while the
autonomous loop logs completed goals.

---

## Phase 3: Reasoning depth

1. Persist `RealUnderstandingEngine` concepts across requests.
2. Logic-first path: try `RealReasoningEngine` before the LLM on factual queries.
3. Expand benchmarks: more held-out logic puzzles and retrieval queries with
   exact scoring.
4. Publish a benchmark pass-rate trend on the dashboard.

---

## Phase 4: Self-improvement loop

1. Strategy registry in `SelfImprovementLoop`: direct LLM / multi-agent / tool / logic-only.
2. A/B strategies on the benchmark suite; keep the best per category.
3. Auto-generated weekly benchmark report.

**Measure:** benchmark pass rate improves from the recorded baseline, with each
strategy change logged with before/after numbers.

---

## What we are NOT doing

- Claiming consciousness, sentience, or AGI achievement
- Adding new worker variants or "quantum" modules
- Vanity node/connection counts or simulated telemetry

## Commands

```bash
pnpm run eval                 # smoke evaluations + benchmarks
pnpm run worker:dev           # local worker
pnpm run deploy:worker:prod   # production deploy (maintainers)
pnpm run check                # full CI gate locally
```

## Success criteria

1. One worker, one story — `agi.bleujs.org` is the lab, not a demo graveyard.
2. Published benchmark trend with honest methodology.
3. Autonomous loop generates, executes, and scores goals without manual wiring.
4. A demonstrably useful path (logic+graph or self-improving routing) beyond a
   plain LLM wrapper.

This is not AGI — but it is an honest foundation someone could build on.
