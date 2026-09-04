/**
 * Shared result schema for the reproducible benchmark suite.
 *
 * Benchmarks use fixed datasets and exact scoring so results are comparable
 * across releases. Model/cost fields are null for offline benchmarks.
 */

export type BenchmarkId =
  | "arithmetic"
  | "logic-puzzle"
  | "retrieval"
  | "tool-selection"
  | "routing"
  | "abstention";

export interface BenchmarkItemResult {
  /** Stable identifier for the individual item within the benchmark. */
  id: string;
  passed: boolean;
  /** What the system produced (stringified for the report). */
  got: string;
  /** The exact expected value. */
  expected: string;
}

export interface BenchmarkResult {
  id: BenchmarkId;
  name: string;
  /** How the benchmark is scored (e.g. "exact match", "top-1 accuracy"). */
  metric: string;
  /** Number of items in the fixed dataset. */
  total: number;
  correct: number;
  /** correct / total. */
  score: number;
  passed: boolean;
  /** Number of repeated runs (>1 only for stochastic benchmarks). */
  runs: number;
  /** True when the benchmark is fully deterministic offline. */
  deterministic: boolean;
  durationMs: number;
  /** Model identifier when an LLM was used; null for offline benchmarks. */
  model: string | null;
  /** Measured USD cost when applicable; null for offline benchmarks. */
  costUsd: number | null;
  items: BenchmarkItemResult[];
}

export interface BenchmarkSuiteResult {
  suite: "benchmark";
  labVersion: string;
  gitSha: string | null;
  timestamp: number;
  total: number;
  passed: number;
  failed: number;
  passRate: number;
  durationMs: number;
  benchmarks: BenchmarkResult[];
}

export interface SmokeSuiteReport {
  suite: "smoke";
  labVersion: string;
  timestamp: number;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  passRate: number;
}

export interface EvalResultsFile {
  labVersion: string;
  gitSha: string | null;
  generatedAt: string;
  smoke: SmokeSuiteReport;
  benchmark: BenchmarkSuiteResult;
}
