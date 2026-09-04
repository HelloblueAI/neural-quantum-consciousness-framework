# Documentation

Documentation for the **BleuJS Reasoning Lab** — an open-source TypeScript
laboratory for evaluating LLM reasoning, provider routing, retrieval, tool
selection, and agent orchestration. It is an emerging, measurable lab, not a
mature AGI framework.

## Index

| Doc | Description |
|-----|-------------|
| [LAB_PLAN.md](LAB_PLAN.md) | Measurable roadmap and north star |
| [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) | Repository layout |
| [GOOD_FIRST_ISSUES.md](GOOD_FIRST_ISSUES.md) | Scoped starter tasks |
| [api/README.md](api/README.md) | HTTP API reference |
| [architecture/README.md](architecture/README.md) | Worker + orchestrator design |
| [development/GITHUB_ACTIONS.md](development/GITHUB_ACTIONS.md) | CI pipeline |
| [deployment/](deployment/) | Cloudflare domain and Worker deployment notes |

## Evaluations

The lab separates **component/smoke evaluations** (execution checks in
`src/evals/`, served by `GET /eval`) from **reproducible benchmarks**
(fixed datasets with exact scoring in `src/evals/benchmarks/`, saved to
`src/evals/results/latest.json`). Neither is presented as evidence of general
intelligence.

```bash
pnpm run eval    # run both suites and refresh results/latest.json
```
