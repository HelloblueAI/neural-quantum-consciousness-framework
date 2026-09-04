/**
 * Component / smoke evaluations.
 *
 * These confirm that individual components execute and produce sane output.
 * They are NOT evidence of advanced reasoning or general intelligence — see
 * `src/evals/benchmarks/` for scored, fixed-dataset benchmarks.
 * Each task is runnable offline (no LLM required unless noted).
 */

export type EvalCategory =
  | "learning"
  | "understanding"
  | "reasoning"
  | "goals"
  | "orchestration";

export interface EvalTask {
  id: string;
  name: string;
  category: EvalCategory;
  description: string;
  requiresLlm?: boolean;
}

export const EVAL_TASKS: EvalTask[] = [
  {
    id: "xor-learning",
    name: "XOR neural learning",
    category: "learning",
    description:
      "Smoke check: train on XOR (one-hot, 100 epochs) and learn above chance (accuracy >= 50%)",
  },
  {
    id: "concept-extraction",
    name: "Concept extraction",
    category: "understanding",
    description: "Extract concepts from a multi-domain prompt",
  },
  {
    id: "deductive-reasoning",
    name: "Deductive reasoning",
    category: "reasoning",
    description: "Apply classical rules to reach a valid conclusion",
  },
  {
    id: "autonomous-goals",
    name: "Autonomous goals",
    category: "goals",
    description:
      "Smoke check: goal system constructor seeds at least two active goals",
  },
  {
    id: "cross-domain-links",
    name: "Cross-domain linking",
    category: "understanding",
    description: "Identify multiple knowledge domains in input",
  },
  {
    id: "memory-recall",
    name: "Memory recall",
    category: "orchestration",
    description: "Store and retrieve conversation context",
  },
  {
    id: "tool-detection",
    name: "Tool need detection",
    category: "orchestration",
    description: "Detect when a query needs external tools",
  },
  {
    id: "chain-of-thought",
    name: "Chain-of-thought availability",
    category: "reasoning",
    description:
      "Smoke check: reports whether an LLM key is configured (skipped offline; not a quality score)",
    requiresLlm: true,
  },
  {
    id: "logic-puzzle",
    name: "Logic puzzle",
    category: "reasoning",
    description:
      "Solve the Bleu Lab wing assignment (agents → pipeline modules) from clues",
  },
  {
    id: "semantic-retrieval",
    name: "Semantic retrieval",
    category: "understanding",
    description:
      "Rank passages for a factual query (bag-of-words cosine; NVIDIA embed when configured)",
  },
];
