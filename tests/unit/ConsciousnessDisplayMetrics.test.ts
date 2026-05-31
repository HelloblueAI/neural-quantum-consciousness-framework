import { buildConsciousnessDisplayMetrics } from '../../src/core/ConsciousnessDisplayMetrics';

describe('ConsciousnessDisplayMetrics', () => {
  const mlStats = { tasksLearned: 2, conceptsAcquired: 5, averageAccuracy: 0.9 };

  it('maps real metrics without hardcoded baselines', () => {
    const result = buildConsciousnessDisplayMetrics(
      {
        quantumAdvantage: 0.8,
        consciousnessDepth: 0.76,
        neuralPlasticity: 0.81,
        crossDomainIntegration: 0.55,
        understandingDepth: 0.72,
        reasoningQuality: 0.68,
        learningEfficiency: 0.74,
      },
      mlStats
    );

    expect(result.awareness).toBe(0.68);
    expect(result.selfAwareness).toBe(0.76);
    expect(result.understanding).toBe(0.72);
    expect(result.creativity).toBe(0.81);
    expect(result.confidence).toBe(0.74);
    expect(result.sources.awareness).toContain('Request');
  });

  it('derives from ML stats when calculator is unavailable', () => {
    const result = buildConsciousnessDisplayMetrics(null, mlStats);
    expect(result.awareness).toBeGreaterThan(0);
    expect(result.awareness).toBeLessThanOrEqual(0.95);
    expect(result.sources.selfAwareness).toBe('Learning engine');
  });
});
