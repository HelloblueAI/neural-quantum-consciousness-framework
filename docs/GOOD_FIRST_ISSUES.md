# Good first issues

Tightly scoped tasks that produce a measurable improvement. Pick one, comment on
the issue (or open a PR referencing it), and ask questions if stuck. Run
`pnpm run check` before opening a PR.

---

## Benchmarks (measurable, no API keys)

1. **Add a held-out logic puzzle with exact scoring.** Add a second constraint
   puzzle to `src/evals/benchmarks/` with a known unique solution and exact
   assignment checks. Acceptance: `pnpm run eval` shows the new item at 100%.
2. **Add a retrieval query to the fixed corpus.** Extend `RETRIEVAL_QUERIES` in
   `src/evals/benchmarks/datasets.ts` with one query, three passages, and the
   exact expected top-1 passage. Acceptance: top-1 accuracy stays at 100%.
3. **Record a routing fixture for a new fallback case.** Add a fixture to
   `ROUTING_FIXTURES` and update `ROUTING_EXPECTED`. Acceptance: routing rates
   still match exactly.
4. **Expand the arithmetic benchmark by N items.** Add exact-answer cases
   (decimals, negatives, large numbers) to `ARITHMETIC_ITEMS`. Acceptance: exact
   match stays at 100%.

## Product surface

5. **Dashboard: show last benchmark pass rate.** Read the benchmark pass rate
   (from `src/evals/results/latest.json` or a new `GET /benchmarks` route) and
   render it on the embedded dashboard next to the smoke `GET /eval` rate.
6. **Optional live-LLM benchmark (skipped in CI).** Add a benchmark that calls a
   configured provider and writes `model`, latency, and `costUsd` into the
   result schema. It must be skipped when no API key is present.

## Docs & hygiene

7. **API examples.** Keep the `curl` examples in `README.md` and
   `docs/api/README.md` in sync with the actual `POST /reason` response shape.
8. **Deployment access notes.** Expand `docs/deployment/API_ACCESS.md` with
   step-by-step Cloudflare skip-rule instructions for the custom domain.

---

## Before you start

- Read [CONTRIBUTING.md](../CONTRIBUTING.md).
- Run `pnpm run check` locally; CI enforces the same gate.
- Keep claims measurable — describe what a change proves, not what it "feels" like.
