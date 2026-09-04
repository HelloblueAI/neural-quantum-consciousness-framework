#!/usr/bin/env tsx
/**
 * CLI for the reasoning lab evaluations.
 *
 *   pnpm run eval            # component/smoke evaluations + reproducible benchmarks
 *   pnpm run eval --llm      # also exercise LLM-dependent smoke checks
 *
 * Writes the combined results to src/evals/results/latest.json for trend tracking.
 */

import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runEvalSuite } from "./runner";
import { runBenchmarkSuite } from "./benchmarks/runner";
import { LAB_VERSION } from "@/metrics/labStatus";
import type { EvalResultsFile } from "./schema";

const llm = process.argv.includes("--llm");

function getGitSha(): string | null {
  try {
    return execSync("git rev-parse --short HEAD", { encoding: "utf8" }).trim();
  } catch {
    return null;
  }
}

async function main() {
  const gitSha = getGitSha();

  console.log("BleuJS Reasoning Lab — Evaluations\n");

  // 1) Component / smoke evaluations
  console.log(
    "Component / smoke evaluations (execution checks, not intelligence):",
  );
  const smoke = await runEvalSuite(llm);
  for (const r of smoke.results) {
    const icon = r.skipped ? "○" : r.passed ? "✓" : "✗";
    console.log(
      `  ${icon} ${r.name} (${r.category}) — ${r.message} [${r.durationMs}ms]`,
    );
  }
  console.log(
    `  → ${smoke.passed}/${smoke.total - smoke.skipped} passed` +
      (smoke.skipped ? ` (${smoke.skipped} skipped)` : "") +
      ` — pass rate ${(smoke.passRate * 100).toFixed(1)}%\n`,
  );

  // 2) Reproducible benchmarks (fixed datasets, exact scoring)
  console.log("Reproducible benchmarks (fixed datasets, exact scoring):");
  const benchmark = await runBenchmarkSuite(gitSha);
  for (const b of benchmark.benchmarks) {
    const icon = b.passed ? "✓" : "✗";
    console.log(
      `  ${icon} ${b.name} — ${b.correct}/${b.total} ${b.metric} ` +
        `(${(b.score * 100).toFixed(1)}%) [${b.durationMs}ms]`,
    );
  }
  console.log(
    `  → ${benchmark.passed}/${benchmark.total} benchmarks passed — ` +
      `pass rate ${(benchmark.passRate * 100).toFixed(1)}%\n`,
  );

  // Persist combined results.
  const here = dirname(fileURLToPath(import.meta.url));
  const outPath = resolve(here, "results", "latest.json");
  const payload: EvalResultsFile = {
    labVersion: LAB_VERSION,
    gitSha,
    generatedAt: new Date().toISOString(),
    smoke: {
      suite: "smoke",
      labVersion: LAB_VERSION,
      timestamp: smoke.timestamp,
      total: smoke.total,
      passed: smoke.passed,
      failed: smoke.failed,
      skipped: smoke.skipped,
      passRate: smoke.passRate,
    },
    benchmark,
  };
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(payload, null, 2) + "\n");
  console.log(`Results written to ${outPath}`);

  const failed = smoke.failed + benchmark.failed;
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
