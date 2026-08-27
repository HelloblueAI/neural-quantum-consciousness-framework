### BleuJS Reasoning Lab

> **Product:** BleuJS Reasoning Lab — live at https://agi.bleujs.org  
> **Repository:** https://github.com/HelloblueAI/bleujs-reasoning-lab  
> **API (workers.dev):** https://agi-primary.morning-star-e026.workers.dev  
> **Mission:** Measurable reasoning—not simulated AGI theater.

> **v5.1** (June 2026) — Removed simulated consciousness/quantum API payloads; honest `/capabilities` endpoint.

| Endpoint | Purpose |
|----------|---------|
| `GET /metrics` | Measured system state (no random telemetry); includes `llmRouting` provider counts |
| `GET /capabilities` | Capability scores from learning engine (replaces `/consciousness`) |
| `GET /eval` | Run evaluation suite, return pass rate |
| `GET /goals` | Active autonomous goals |
| `POST /reason` | Reasoning via BleuJS API (`bleujs-chat`); NVIDIA Nemotron Lightning, then Anthropic/OpenAI fallback |

See [docs/AGI_LAB_PLAN.md](docs/AGI_LAB_PLAN.md) for the 90-day roadmap and [docs/deployment/API_ACCESS.md](docs/deployment/API_ACCESS.md) if the custom domain returns a bot challenge.

---

## Quick start

```bash
pnpm install
pnpm run worker:dev          # local Cloudflare worker
pnpm run eval                # benchmark suite (CLI)
pnpm run test:eval           # vitest eval harness
pnpm run deploy:worker:prod  # deploy primary worker
```

### Example API calls

```bash
# Health & metrics
curl https://agi-primary.morning-star-e026.workers.dev/health
curl https://agi-primary.morning-star-e026.workers.dev/metrics
# data.llmRouting: bleujs / nvidia / anthropic / openai / local / none counts + fallbackRate (global when AGI_CACHE KV is bound)

# Capabilities & reasoning
curl https://agi-primary.morning-star-e026.workers.dev/capabilities
curl -X POST https://agi-primary.morning-star-e026.workers.dev/reason \
  -H "Content-Type: application/json" \
  -d '{"input": "where is tehran"}'
```

Example response (BleuJS primary path):

```json
{
  "success": true,
  "data": {
    "system": "BleuJS Reasoning Lab",
    "answer": "Tehran is the capital city of Iran...",
    "llmUsed": true,
    "llmProvider": "bleujs"
  }
}
```

`llmProvider` identifies which backend answered: `bleujs` (BleuJS API / `api.bleujs.org`), `nvidia` (Nemotron 3.5 Lightning), `anthropic`, or `openai`. Simple arithmetic may use local math instead (`llmUsed: false`).

Set `BLEUJS_API_KEY` via `npx wrangler secret put BLEUJS_API_KEY --env production` for live reasoning. BleuJS is the primary LLM. Optional fallbacks (when `ALLOW_LLM_FALLBACK=true`): NVIDIA Inception (`NVIDIA_API_KEY`, Nemotron Lightning), then Anthropic, then OpenAI. `nemotron-3-embed-1b` is available as a learned embedding provider for retrieval.

Production sets `BLEUJS_CHAT_URL` to `https://bleujs-org.vercel.app/api/v1/chat` so this Cloudflare Worker calls Vercel directly (avoids intermittent **522** on `api.bleujs.org` Worker-to-Worker hops). Public SDK clients should still use `https://api.bleujs.org`.

---

## What this is

A **research lab** for orchestrated reasoning: multi-agent pipelines, BleuJS API as the primary LLM (`bleujs-chat` via `api.bleujs.org`), NVIDIA/Anthropic/OpenAI fallback, learning-engine state, and an eval harness with honest pass rates. It is **not** a claim of artificial general intelligence or machine consciousness.

**Active production path:** `primary-agi-worker.ts` → `UltimateAGIOrchestrator`, `RealLLMIntegration`, `CapabilityDisplayMetrics` (honest capability scores from the learning engine).

**Archived (reference only):** legacy workers, quantum/consciousness engines, and pre-v5 entry points live under [`src/archive/`](src/archive/README.md). Do not deploy from there.

---

## Architecture (v5.0)

```
primary-agi-worker.ts
├── UltimateAGIOrchestrator   # reasoning / learning / creative agents
├── RealLLMIntegration        # BleuJS API primary; NVIDIA Lightning then Anthropic/OpenAI fallback
├── AutonomousGoalSystem      # goals API (execution loop: planned)
├── lab/honestMetrics         # measured counters, no Math.random()
├── lab/reasonResponse        # slim /reason payload
└── eval/                     # tasks, runner, CLI
```

---

## Development

| Script | Purpose |
|--------|---------|
| `pnpm run worker:dev` | Wrangler dev for primary worker |
| `pnpm run eval` | Run eval tasks locally |
| `pnpm run test:eval` | Vitest eval tests |
| `pnpm run test:unit` | Unit tests |
| `pnpm run type-check` | TypeScript check |

Legacy `enhanced-agi`, `neuralcore`, `sentientcore`, and multi-worker deploy scripts were removed in v5.2 — use `worker:dev` and `deploy:worker:prod` only. Archived workers live under `src/archive/`.

---

## Contributing

We welcome PRs for eval tasks, honest API improvements, docs, and lab features aligned with [docs/AGI_LAB_PLAN.md](docs/AGI_LAB_PLAN.md).

1. Read [CONTRIBUTING.md](CONTRIBUTING.md) and pick a task from [docs/GOOD_FIRST_ISSUES.md](docs/GOOD_FIRST_ISSUES.md)
2. Run `pnpm run test:eval`, `pnpm run test:unit`, and `pnpm run type-check` before opening a PR
3. CI runs the same checks on every pull request ([`.github/workflows/lab-ci.yml`](.github/workflows/lab-ci.yml))

Please follow our [Code of Conduct](CODE_OF_CONDUCT.md). For help channels see [SUPPORT.md](SUPPORT.md). Report security issues per [SECURITY.md](SECURITY.md) — do not file public issues for vulnerabilities.

Production deploy is maintainer-only; you do not need Cloudflare access to contribute.

---

<div align="center">

[![Live](https://img.shields.io/badge/Live-BleuJS%20Reasoning-brightgreen?style=for-the-badge)](https://agi.bleujs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange.svg)](https://workers.cloudflare.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[![Contributors](https://img.shields.io/github/contributors/HelloblueAI/bleujs-reasoning-lab?style=flat-square)](https://github.com/HelloblueAI/bleujs-reasoning-lab/graphs/contributors)
[![Issues](https://img.shields.io/github/issues/HelloblueAI/bleujs-reasoning-lab?style=flat-square)](https://github.com/HelloblueAI/bleujs-reasoning-lab/issues)

</div>
