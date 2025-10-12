/**
 * Self-Improvement Loop
 * Tracks performance and improves strategies over time
 */

import { MemorySystem } from './MemorySystem';

export interface PerformanceMetric {
  task: string;
  strategy: string;
  success: boolean;
  confidence: number;
  timestamp: number;
  feedback?: string;
}

export interface ImprovementSuggestion {
  area: string;
  suggestion: string;
  priority: number;
  expectedImprovement: number;
}

export class SelfImprovementLoop {
  private performanceHistory: PerformanceMetric[] = [];
  private memory: MemorySystem;
  private strategyScores: Map<string, number[]> = new Map();

  constructor(memory: MemorySystem) {
    this.memory = memory;
  }

  /**
   * Record a performance metric
   */
  public recordPerformance(metric: PerformanceMetric): void {
    this.performanceHistory.push(metric);

    // Update strategy scores
    const strategy = metric.strategy;
    if (!this.strategyScores.has(strategy)) {
      this.strategyScores.set(strategy, []);
    }

    const score = metric.success ? (metric.confidence * 100) : 0;
    this.strategyScores.get(strategy)!.push(score);

    // Store as learning memory
    this.memory.store(
      `Task: ${metric.task}, Strategy: ${metric.strategy}, Success: ${metric.success}, Confidence: ${metric.confidence}`,
      'learning',
      [metric.task, metric.strategy, metric.success ? 'success' : 'failure'],
      metric.confidence
    );

    // Keep last 1000 metrics
    if (this.performanceHistory.length > 1000) {
      this.performanceHistory = this.performanceHistory.slice(-1000);
    }
  }

  /**
   * Analyze performance and generate improvement suggestions
   */
  public analyzePerformance(): ImprovementSuggestion[] {
    const suggestions: ImprovementSuggestion[] = [];

    // Analyze strategy effectiveness
    for (const [strategy, scores] of this.strategyScores.entries()) {
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      const recentScores = scores.slice(-10);
      const recentAvg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;

      // If recent performance is declining
      if (recentAvg < avgScore * 0.8) {
        suggestions.push({
          area: 'strategy',
          suggestion: `Strategy "${strategy}" showing declining performance. Consider alternative approaches.`,
          priority: 0.8,
          expectedImprovement: (avgScore - recentAvg) / 100
        });
      }

      // If strategy is consistently poor
      if (avgScore < 50) {
        suggestions.push({
          area: 'strategy',
          suggestion: `Strategy "${strategy}" has low success rate (${avgScore.toFixed(1)}%). Needs improvement or replacement.`,
          priority: 0.9,
          expectedImprovement: (50 - avgScore) / 100
        });
      }
    }

    // Analyze task-specific performance
    const taskPerformance = new Map<string, number[]>();
    for (const metric of this.performanceHistory) {
      if (!taskPerformance.has(metric.task)) {
        taskPerformance.set(metric.task, []);
      }
      taskPerformance.get(metric.task)!.push(metric.success ? 100 : 0);
    }

    for (const [task, scores] of taskPerformance.entries()) {
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      
      if (avgScore < 60 && scores.length > 5) {
        suggestions.push({
          area: 'task_capability',
          suggestion: `Task "${task}" has low success rate (${avgScore.toFixed(1)}%). Consider additional training or tool use.`,
          priority: 0.7,
          expectedImprovement: (60 - avgScore) / 100
        });
      }
    }

    // Sort by priority
    suggestions.sort((a, b) => b.priority - a.priority);

    return suggestions;
  }

  /**
   * Get best strategy for a task type
   */
  public getBestStrategy(taskType: string): string {
    const relevantMetrics = this.performanceHistory.filter(m => 
      m.task.toLowerCase().includes(taskType.toLowerCase())
    );

    if (relevantMetrics.length === 0) {
      return 'multi_agent_approach'; // Default
    }

    // Calculate strategy success rates
    const strategySuccess = new Map<string, { success: number; total: number }>();
    
    for (const metric of relevantMetrics) {
      if (!strategySuccess.has(metric.strategy)) {
        strategySuccess.set(metric.strategy, { success: 0, total: 0 });
      }

      const stats = strategySuccess.get(metric.strategy)!;
      stats.total++;
      if (metric.success) stats.success++;
    }

    // Find best strategy
    let bestStrategy = 'multi_agent_approach';
    let bestRate = 0;

    for (const [strategy, stats] of strategySuccess.entries()) {
      const rate = stats.success / stats.total;
      if (rate > bestRate) {
        bestRate = rate;
        bestStrategy = strategy;
      }
    }

    return bestStrategy;
  }

  /**
   * Adapt and improve based on feedback
   */
  public adapt(feedback: { task: string; success: boolean; improvement: string }): void {
    // Store feedback as high-importance memory
    this.memory.store(
      `Feedback on ${feedback.task}: ${feedback.improvement}`,
      'learning',
      [feedback.task, 'feedback', 'improvement'],
      0.9
    );

    // If failure, try to learn what went wrong
    if (!feedback.success) {
      this.memory.store(
        `Failed task: ${feedback.task}. Needs: ${feedback.improvement}`,
        'experience',
        [feedback.task, 'failure', 'needs_improvement'],
        0.8
      );
    }
  }

  /**
   * Get performance statistics
   */
  public getStats() {
    const totalTasks = this.performanceHistory.length;
    const successfulTasks = this.performanceHistory.filter(m => m.success).length;
    const successRate = totalTasks > 0 ? (successfulTasks / totalTasks) * 100 : 0;

    const avgConfidence = totalTasks > 0
      ? this.performanceHistory.reduce((sum, m) => sum + m.confidence, 0) / totalTasks
      : 0;

    // Recent performance (last 20 tasks)
    const recentTasks = this.performanceHistory.slice(-20);
    const recentSuccessRate = recentTasks.length > 0
      ? (recentTasks.filter(m => m.success).length / recentTasks.length) * 100
      : 0;

    return {
      totalTasks,
      successRate,
      recentSuccessRate,
      avgConfidence,
      strategiesEvaluated: this.strategyScores.size,
      improvementTrend: recentSuccessRate - successRate
    };
  }

  /**
   * Generate self-assessment report
   */
  public selfAssess(): {
    strengths: string[];
    weaknesses: string[];
    improvements: ImprovementSuggestion[];
    overallScore: number;
  } {
    const stats = this.getStats();
    const suggestions = this.analyzePerformance();

    const strengths: string[] = [];
    const weaknesses: string[] = [];

    // Identify strengths
    if (stats.successRate > 75) {
      strengths.push('High overall success rate');
    }
    if (stats.avgConfidence > 0.8) {
      strengths.push('High confidence in responses');
    }
    if (stats.improvementTrend > 0) {
      strengths.push('Improving performance over time');
    }

    // Identify weaknesses
    if (stats.successRate < 60) {
      weaknesses.push('Below target success rate');
    }
    if (stats.recentSuccessRate < stats.successRate) {
      weaknesses.push('Declining recent performance');
    }
    if (suggestions.length > 5) {
      weaknesses.push('Multiple areas needing improvement');
    }

    const overallScore = (stats.successRate + (stats.avgConfidence * 100)) / 2;

    return {
      strengths,
      weaknesses,
      improvements: suggestions,
      overallScore
    };
  }
}

