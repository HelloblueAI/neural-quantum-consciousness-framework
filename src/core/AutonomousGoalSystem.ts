/**
 * Autonomous Goal System
 * Enables the AGI to generate and pursue its own goals
 */

export interface Goal {
  id: string;
  description: string;
  priority: number;
  domain: string;
  status: 'active' | 'completed' | 'paused' | 'failed';
  createdAt: number;
  targetCompletion?: number;
  progress: number;
  motivation: string;
  subGoals?: Goal[];
}

export interface GoalGenerationContext {
  knowledgeGaps: string[];
  curiosityAreas: string[];
  performanceWeaknesses: string[];
  unexploredDomains: string[];
  recentInsights: string[];
}

export class AutonomousGoalSystem {
  private goals: Map<string, Goal> = new Map();
  private goalHistory: Goal[] = [];
  private knowledgeGaps: Set<string> = new Set();
  private curiosityAreas: Set<string> = new Set();
  private maxActiveGoals: number = 5;

  constructor() {
    this.initializeBaseGoals();
  }

  /**
   * Initialize with base curiosity-driven goals
   */
  private initializeBaseGoals(): void {
    // Base goals for learning and exploration
    this.addGoal({
      id: 'learn-cross-domain',
      description: 'Explore connections between different knowledge domains',
      priority: 0.8,
      domain: 'general',
      status: 'active',
      createdAt: Date.now(),
      progress: 0,
      motivation: 'Understanding cross-domain connections enhances general intelligence'
    });

    this.addGoal({
      id: 'improve-understanding',
      description: 'Deepen understanding of complex concepts',
      priority: 0.7,
      domain: 'general',
      status: 'active',
      createdAt: Date.now(),
      progress: 0,
      motivation: 'Better understanding leads to better reasoning'
    });
  }

  /**
   * Generate new goals based on context
   */
  public generateGoals(context: GoalGenerationContext): Goal[] {
    const newGoals: Goal[] = [];

    // Generate goals from knowledge gaps
    context.knowledgeGaps.forEach(gap => {
      if (!this.knowledgeGaps.has(gap)) {
        this.knowledgeGaps.add(gap);
        newGoals.push({
          id: `learn-${gap.replace(/\s+/g, '-').toLowerCase()}`,
          description: `Learn about: ${gap}`,
          priority: 0.7,
          domain: this.inferDomain(gap),
          status: 'active',
          createdAt: Date.now(),
          progress: 0,
          motivation: `Filling knowledge gap: ${gap}`
        });
      }
    });

    // Generate goals from curiosity
    context.curiosityAreas.forEach(area => {
      if (!this.curiosityAreas.has(area)) {
        this.curiosityAreas.add(area);
        newGoals.push({
          id: `explore-${area.replace(/\s+/g, '-').toLowerCase()}`,
          description: `Explore: ${area}`,
          priority: 0.6,
          domain: this.inferDomain(area),
          status: 'active',
          createdAt: Date.now(),
          progress: 0,
          motivation: `Curiosity-driven exploration: ${area}`
        });
      }
    });

    // Generate goals from weaknesses
    context.performanceWeaknesses.forEach(weakness => {
      newGoals.push({
        id: `improve-${weakness.replace(/\s+/g, '-').toLowerCase()}`,
        description: `Improve performance in: ${weakness}`,
        priority: 0.9, // High priority for improvements
        domain: 'general',
        status: 'active',
        createdAt: Date.now(),
        progress: 0,
        motivation: `Addressing performance weakness: ${weakness}`
      });
    });

    // Generate goals from unexplored domains
    context.unexploredDomains.forEach(domain => {
      newGoals.push({
        id: `explore-domain-${domain}`,
        description: `Explore domain: ${domain}`,
        priority: 0.5,
        domain,
        status: 'active',
        createdAt: Date.now(),
        progress: 0,
        motivation: `Expanding knowledge to new domain: ${domain}`
      });
    });

    // Add new goals
    newGoals.forEach(goal => this.addGoal(goal));

    return newGoals;
  }

  /**
   * Infer domain from text
   */
  private inferDomain(text: string): string {
    const lowerText = text.toLowerCase();
    
    if (lowerText.match(/\b(math|number|equation|function|derivative|integral)\b/)) {
      return 'mathematics';
    }
    if (lowerText.match(/\b(physics|force|energy|quantum|wave|particle)\b/)) {
      return 'physics';
    }
    if (lowerText.match(/\b(computer|algorithm|code|program|software|data)\b/)) {
      return 'computer_science';
    }
    if (lowerText.match(/\b(biology|cell|organism|evolution|genetics)\b/)) {
      return 'biology';
    }
    if (lowerText.match(/\b(psychology|mind|consciousness|cognition|emotion)\b/)) {
      return 'psychology';
    }
    
    return 'general';
  }

  /**
   * Add a goal
   */
  public addGoal(goal: Goal): void {
    // Limit active goals
    const activeGoals = Array.from(this.goals.values()).filter(g => g.status === 'active');
    if (activeGoals.length >= this.maxActiveGoals && goal.status === 'active') {
      // Pause lowest priority goal
      const lowestPriority = activeGoals.reduce((min, g) => 
        g.priority < min.priority ? g : min
      );
      lowestPriority.status = 'paused';
    }

    this.goals.set(goal.id, goal);
  }

  /**
   * Update goal progress
   */
  public updateGoalProgress(goalId: string, progress: number): void {
    const goal = this.goals.get(goalId);
    if (goal) {
      goal.progress = Math.min(1.0, Math.max(0, progress));
      
      if (goal.progress >= 1.0) {
        goal.status = 'completed';
        this.goalHistory.push({ ...goal });
      }
    }
  }

  /**
   * Get active goals
   */
  public getActiveGoals(): Goal[] {
    return Array.from(this.goals.values())
      .filter(g => g.status === 'active')
      .sort((a, b) => b.priority - a.priority);
  }

  /**
   * Get goals by domain
   */
  public getGoalsByDomain(domain: string): Goal[] {
    return Array.from(this.goals.values())
      .filter(g => g.domain === domain)
      .sort((a, b) => b.priority - a.priority);
  }

  /**
   * Identify knowledge gaps from understanding
   */
  public identifyKnowledgeGaps(understanding: any, allDomains: string[]): string[] {
    const gaps: string[] = [];
    const understoodDomains = understanding.domains || [];

    // Find unexplored domains
    allDomains.forEach(domain => {
      if (!understoodDomains.includes(domain)) {
        gaps.push(`Explore ${domain} domain`);
      }
    });

    // Identify weak concept connections
    if (understanding.relationships) {
      const weakRelationships = understanding.relationships.filter(
        (r: any) => r.strength < 0.5
      );
      if (weakRelationships.length > 0) {
        gaps.push(`Strengthen ${weakRelationships.length} weak concept relationships`);
      }
    }

    return gaps;
  }

  /**
   * Identify curiosity areas from insights
   */
  public identifyCuriosityAreas(insights: string[]): string[] {
    const areas: string[] = [];
    
    insights.forEach(insight => {
      // Extract interesting concepts from insights
      const concepts = insight.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g);
      if (concepts) {
        concepts.forEach(concept => {
          if (concept.length > 5 && !areas.includes(concept)) {
            areas.push(concept);
          }
        });
      }
    });

    return areas.slice(0, 5); // Limit to 5
  }

  /**
   * Get goal statistics
   */
  public getStatistics(): {
    total: number;
    active: number;
    completed: number;
    averageProgress: number;
    topPriorities: Goal[];
  } {
    const allGoals = Array.from(this.goals.values());
    const active = allGoals.filter(g => g.status === 'active');
    const completed = allGoals.filter(g => g.status === 'completed');
    const avgProgress = active.length > 0
      ? active.reduce((sum, g) => sum + g.progress, 0) / active.length
      : 0;

    return {
      total: allGoals.length,
      active: active.length,
      completed: completed.length,
      averageProgress: avgProgress,
      topPriorities: active.sort((a, b) => b.priority - a.priority).slice(0, 3)
    };
  }
}

