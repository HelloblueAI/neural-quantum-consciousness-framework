# GitHub Actions

**Active workflow:** [`.github/workflows/lab-ci.yml`](../../.github/workflows/lab-ci.yml)

**Repository:** https://github.com/HelloblueAI/bleujs-reasoning-lab

---

## Lab CI (`lab-ci.yml`)

**Triggers:** push to `main`, pull requests targeting `main`.

**Job:** a single `check` job that mirrors `pnpm run check` locally:

1. `pnpm install --frozen-lockfile`
2. `pnpm run format:check` — Prettier
3. `pnpm run lint` — ESLint (`--max-warnings 0`)
4. `pnpm run type-check` — `tsc --noEmit`
5. `pnpm run test:unit -- --run` — Vitest unit tests
6. `pnpm run test:eval` — smoke + benchmark suites
7. Worker bundle dry-run — `wrangler deploy --dry-run`

All steps run without API keys; the evaluation and benchmark suites are offline.

## Reproduce locally

```bash
pnpm install
pnpm run check
```

If a step fails in CI, run the same script locally to reproduce it. There is no
Docker build or external deployment in CI — production deploys are performed
manually by maintainers with `pnpm run deploy:worker:prod`.
