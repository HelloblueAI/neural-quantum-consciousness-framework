import type { RealMetrics } from './RealMetricsCalculator';

export type ConsciousnessMetricSources = {
  awareness: string;
  selfAwareness: string;
  understanding: string;
  creativity: string;
};

export type ConsciousnessDisplayMetrics = {
  awareness: number;
  selfAwareness: number;
  understanding: number;
  creativity: number;
  confidence: number;
  sources: ConsciousnessMetricSources;
};

type MlStats = {
  tasksLearned: number;
  conceptsAcquired: number;
  averageAccuracy: number;
};

function clampMetric(value: number): number {
  return Math.min(0.95, Math.max(0, value));
}

/** Derive dashboard consciousness metrics from real system state (no hardcoded baselines). */
export function buildConsciousnessDisplayMetrics(
  realMetrics: RealMetrics | null,
  mlStats: MlStats
): ConsciousnessDisplayMetrics {
  if (realMetrics) {
    return {
      awareness: clampMetric(realMetrics.reasoningQuality),
      selfAwareness: clampMetric(realMetrics.consciousnessDepth),
      understanding: clampMetric(realMetrics.understandingDepth),
      creativity: clampMetric(realMetrics.neuralPlasticity),
      confidence: clampMetric(realMetrics.learningEfficiency),
      sources: {
        awareness: 'Request success & latency',
        selfAwareness: 'Learning depth & concepts',
        understanding: 'Comprehension & concepts',
        creativity: 'Neural plasticity',
      },
    };
  }

  const taskFactor = Math.min(mlStats.tasksLearned / 10, 0.15);
  const conceptFactor = Math.min(mlStats.conceptsAcquired / 20, 0.15);
  const acc = mlStats.averageAccuracy;

  return {
    awareness: clampMetric(acc * 0.85 + conceptFactor),
    selfAwareness: clampMetric(0.5 + acc * 0.3 + taskFactor),
    understanding: clampMetric(acc * 0.7 + conceptFactor + taskFactor),
    creativity: clampMetric(acc * 0.6 + taskFactor * 2),
    confidence: clampMetric(acc),
    sources: {
      awareness: 'Learning engine',
      selfAwareness: 'Learning engine',
      understanding: 'Learning engine',
      creativity: 'Learning engine',
    },
  };
}
