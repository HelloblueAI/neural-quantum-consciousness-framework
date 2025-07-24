import { AgentState, Goal, Capability, Action, Experience, ReasoningResult, LearningResult } from '@/types';
import { Logger } from '@/utils/Logger';

export interface AgentConfig {
  id: string;
  name: string;
  type: string;
  capabilities: Capability[];
  goals: Goal[];
  parameters: Map<string, any>;
  metadata: Map<string, any>;
}

export interface AgentMemory {
  experiences: Experience[];
  knowledge: Map<string, any>;
  skills: Map<string, number>;
  preferences: Map<string, number>;
  history: Map<string, any[]>;
}

export interface AgentPerformance {
  efficiency: number;
  accuracy: number;
  adaptability: number;
  creativity: number;
  collaboration: number;
}

export abstract class Agent {
  protected config: AgentConfig;
  protected state: {
    current: AgentState;
    consciousness: {
      level: number;
      awareness: number;
      selfReflection: number;
      metaCognition: number;
    };
    emotions: {
      happiness: number;
      curiosity: number;
      confidence: number;
      motivation: number;
    };
    cognition: {
      attention: number;
      memory: number;
      reasoning: number;
      creativity: number;
    };
    behavior: {
      activity: number;
      responsiveness: number;
      adaptability: number;
      consistency: number;
    };
    creativity: {
      imagination: number;
      innovation: number;
      expression: number;
      originality: number;
    };
  };
  protected memory: AgentMemory;
  protected performance: AgentPerformance;
  protected logger: Logger;
  protected isActive: boolean = false;

  constructor(config: AgentConfig) {
    this.config = config;
    this.state = this.initializeState();
    this.memory = this.initializeMemory();
    this.performance = this.initializePerformance();
    this.logger = new Logger(`Agent:${config.name}`);
    
    this.logger.info('Agent initialized', { 
      agentId: config.id, 
      agentName: config.name, 
      agentType: config.type 
    });
  }

  public abstract process(input: any, context?: Record<string, any>): Promise<{
    output: any;
    reasoning: ReasoningResult;
    learning: LearningResult;
    actions: Action[];
  }>;

  public abstract reason(input: any, context?: Record<string, any>): Promise<ReasoningResult>;

  public abstract learn(experiences: Experience[], context?: Record<string, any>): Promise<LearningResult>;

  public abstract plan(goals: Goal[], context?: Record<string, any>): Promise<Action[]>;

  public abstract execute(action: Action, context?: Record<string, any>): Promise<{
    success: boolean;
    result: any;
    feedback: any;
  }>;

  public async processTask(task: any): Promise<{
    success: boolean;
    result: any;
    reasoning: ReasoningResult;
    learning: LearningResult;
  }> {
    try {
      // Process the task using the agent's capabilities
      const reasoningResult = await this.reason(task.input || task);
      const learningResult = await this.learn([task] as Experience[]);
      
      const success = reasoningResult.confidence > 0.5;
      const result = {
        taskId: task.id,
        type: task.type,
        success,
        confidence: reasoningResult.confidence,
        output: reasoningResult.conclusions
      };

      return {
        success,
        result,
        reasoning: reasoningResult,
        learning: learningResult
      };
    } catch (error) {
      this.logger.error('Error processing task');
      return {
        success: false,
        result: null,
        reasoning: {
          confidence: 0,
          reasoning: { 
            steps: [],
            logic: 'classical',
            evidence: [],
            assumptions: []
          },
          conclusions: [],
          uncertainty: { type: 'probabilistic', parameters: {}, confidence: 0 },
          alternatives: []
        },
        learning: {
          success: false,
          improvements: [],
          newKnowledge: [],
          adaptationMetrics: {
            performance: 0,
            efficiency: 0,
            stability: 0,
            flexibility: 0
          },
          insights: [],
          confidence: 0
        }
      };
    }
  }

    public async processExperience(experience: Experience): Promise<{
    success: boolean;
    result: any;
    learning: LearningResult;
  }> {
    try {
      // Process the experience for learning
      const learningResult = await this.learn([experience]);
      
      const success = learningResult.success;
      const result = {
        experienceId: experience.id,
        type: (experience as any).type || 'unknown',
        success,
        improvements: learningResult.improvements,
        newKnowledge: learningResult.newKnowledge
      };

      return {
        success,
        result,
        learning: learningResult
      };
    } catch (error) {
      this.logger.error('Error processing experience');
      return {
        success: false,
        result: null,
        learning: {
          success: false,
          improvements: [],
          newKnowledge: [],
          adaptationMetrics: {
            performance: 0,
            efficiency: 0,
            stability: 0,
            flexibility: 0
          },
          insights: [],
          confidence: 0
        }
      };
    }
  }

  public abstract adapt(performance: AgentPerformance, context?: Record<string, any>): Promise<void>;

  public start(): void {
    this.isActive = true;
    this.logger.info('Agent started', { agentId: this.config.id });
  }

  public stop(): void {
    this.isActive = false;
    this.logger.info('Agent stopped', { agentId: this.config.id });
  }

  public pause(): void {
    this.isActive = false;
    this.logger.info('Agent paused', { agentId: this.config.id });
  }

  public resume(): void {
    this.isActive = true;
    this.logger.info('Agent resumed', { agentId: this.config.id });
  }

  public getState(): {
    current: AgentState;
    consciousness: {
      level: number;
      awareness: number;
      selfReflection: number;
      metaCognition: number;
    };
    emotions: {
      happiness: number;
      curiosity: number;
      confidence: number;
      motivation: number;
    };
    cognition: {
      attention: number;
      memory: number;
      reasoning: number;
      creativity: number;
    };
    behavior: {
      activity: number;
      responsiveness: number;
      adaptability: number;
      consistency: number;
    };
    creativity: {
      imagination: number;
      innovation: number;
      expression: number;
      originality: number;
    };
  } {
    return this.state;
  }

  public getMemory(): AgentMemory {
    return this.memory;
  }

  public getPerformance(): AgentPerformance {
    return { ...this.performance };
  }

  public getConfig(): AgentConfig {
    return { ...this.config };
  }

  public getType(): string {
    return this.config.type;
  }

  public updateState(newState: Partial<{
    current: AgentState;
    consciousness: {
      level: number;
      awareness: number;
      selfReflection: number;
      metaCognition: number;
    };
    emotions: {
      happiness: number;
      curiosity: number;
      confidence: number;
      motivation: number;
    };
    cognition: {
      attention: number;
      memory: number;
      reasoning: number;
      creativity: number;
    };
    behavior: {
      activity: number;
      responsiveness: number;
      adaptability: number;
      consistency: number;
    };
    creativity: {
      imagination: number;
      innovation: number;
      expression: number;
      originality: number;
    };
  }>): void {
    this.state = { ...this.state, ...newState };
    this.logger.debug('Agent state updated', { 
      agentId: this.config.id, 
      stateChanges: Object.keys(newState) 
    });
  }

  public addExperience(experience: Experience): void {
    this.memory.experiences.push(experience);
    this.logger.debug('Experience added', { 
      agentId: this.config.id, 
      experienceId: experience.id 
    });
  }

  public updateKnowledge(key: string, value: any): void {
    this.memory.knowledge.set(key, value);
    this.logger.debug('Knowledge updated', { 
      agentId: this.config.id, 
      knowledgeKey: key 
    });
  }

  public updateSkill(skill: string, level: number): void {
    this.memory.skills.set(skill, Math.max(0, Math.min(1, level)));
    this.logger.debug('Skill updated', { 
      agentId: this.config.id, 
      skill, 
      level 
    });
  }

  public updatePreference(preference: string, value: number): void {
    this.memory.preferences.set(preference, Math.max(0, Math.min(1, value)));
    this.logger.debug('Preference updated', { 
      agentId: this.config.id, 
      preference, 
      value 
    });
  }

  public addToHistory(category: string, entry: any): void {
    if (!this.memory.history.has(category)) {
      this.memory.history.set(category, []);
    }
    this.memory.history.get(category)!.push(entry);
    this.logger.debug('History entry added', { 
      agentId: this.config.id, 
      category, 
      entryType: typeof entry 
    });
  }

  public updatePerformance(performance: Partial<AgentPerformance>): void {
    this.performance = { ...this.performance, ...performance };
    this.logger.debug('Performance updated', { 
      agentId: this.config.id, 
      performanceChanges: Object.keys(performance) 
    });
  }

  public hasCapability(capability: string): boolean {
    return this.config.capabilities.some((cap: any) => (cap as any).name === capability);
  }

  public getCapabilityLevel(capability: string): number {
    const cap = this.config.capabilities.find((cap: any) => (cap as any).name === capability);
    return cap ? (cap as any).level || 0 : 0;
  }

  public hasGoal(goal: string): boolean {
    return this.config.goals.some((g: any) => (g as any).name === goal);
  }

  public getGoalPriority(goal: string): number {
    const g = this.config.goals.find((g: any) => (g as any).name === goal);
    return g ? (g as any).priority || 0 : 0;
  }

  public getParameter(key: string): any {
    return this.config.parameters.get(key);
  }

  public setParameter(key: string, value: any): void {
    this.config.parameters.set(key, value);
    this.logger.debug('Parameter updated', { 
      agentId: this.config.id, 
      parameter: key, 
      value 
    });
  }

  public getMetadata(key: string): any {
    return this.config.metadata.get(key);
  }

  public setMetadata(key: string, value: any): void {
    this.config.metadata.set(key, value);
    this.logger.debug('Metadata updated', { 
      agentId: this.config.id, 
      metadataKey: key, 
      value 
    });
  }

  public isCapableOf(action: string): boolean {
    // Check if agent has the capability to perform the action
    const requiredCapabilities = this.getRequiredCapabilities(action);
    return requiredCapabilities.every(cap => this.hasCapability(cap));
  }

  public canAchieveGoal(goal: Goal): boolean {
    // Check if agent has the capabilities to achieve the goal
    const requiredCapabilities = this.getRequiredCapabilitiesForGoal(goal);
    return requiredCapabilities.every(cap => this.hasCapability(cap));
  }

  public getEfficiency(): number {
    return this.performance.efficiency;
  }

  public getAccuracy(): number {
    return this.performance.accuracy;
  }

  public getAdaptability(): number {
    return this.performance.adaptability;
  }

  public getCreativity(): number {
    return this.performance.creativity;
  }

  public getCollaboration(): number {
    return this.performance.collaboration;
  }

  public getExperienceCount(): number {
    return this.memory.experiences.length;
  }

  public getKnowledgeSize(): number {
    return this.memory.knowledge.size;
  }

  public getSkillCount(): number {
    return this.memory.skills.size;
  }

  public getHistorySize(): number {
    return Array.from(this.memory.history.values()).reduce((sum, entries) => sum + entries.length, 0);
  }

  public getRecentExperiences(count: number = 10): Experience[] {
    return this.memory.experiences.slice(-count);
  }

  public getExperiencesByType(type: string): Experience[] {
    return this.memory.experiences.filter((exp: any) => (exp as any).type === type);
  }

  public getExperiencesByConfidence(minConfidence: number): Experience[] {
    return this.memory.experiences.filter(exp => (exp.confidence || 0) >= minConfidence);
  }

  public getTopSkills(count: number = 5): Array<{ skill: string; level: number }> {
    return Array.from(this.memory.skills.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, count)
      .map(([skill, level]) => ({ skill, level }));
  }

  public getTopPreferences(count: number = 5): Array<{ preference: string; value: number }> {
    return Array.from(this.memory.preferences.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, count)
      .map(([preference, value]) => ({ preference, value }));
  }

  public getHistoryByCategory(category: string): any[] {
    return this.memory.history.get(category) || [];
  }

  public clearHistory(category?: string): void {
    if (category) {
      this.memory.history.delete(category);
      this.logger.debug('History category cleared', { 
        agentId: this.config.id, 
        category 
      });
    } else {
      this.memory.history.clear();
      this.logger.debug('All history cleared', { agentId: this.config.id });
    }
  }

  public clearExperiences(): void {
    this.memory.experiences = [];
    this.logger.debug('All experiences cleared', { agentId: this.config.id });
  }

  public clearKnowledge(): void {
    this.memory.knowledge.clear();
    this.logger.debug('All knowledge cleared', { agentId: this.config.id });
  }

  public resetSkills(): void {
    this.memory.skills.clear();
    this.logger.debug('All skills reset', { agentId: this.config.id });
  }

  public resetPreferences(): void {
    this.memory.preferences.clear();
    this.logger.debug('All preferences reset', { agentId: this.config.id });
  }

  public getStatus(): {
    isActive: boolean;
    experienceCount: number;
    knowledgeSize: number;
    skillCount: number;
    performance: AgentPerformance;
  } {
    return {
      isActive: this.isActive,
      experienceCount: this.getExperienceCount(),
      knowledgeSize: this.getKnowledgeSize(),
      skillCount: this.getSkillCount(),
      performance: this.getPerformance()
    };
  }

  public getSummary(): {
    id: string;
    name: string;
    type: string;
    capabilities: Capability[];
    goals: Goal[];
    performance: AgentPerformance;
    experienceCount: number;
    knowledgeSize: number;
    skillCount: number;
  } {
    return {
      id: this.config.id,
      name: this.config.name,
      type: this.config.type,
      capabilities: this.config.capabilities,
      goals: this.config.goals,
      performance: this.getPerformance(),
      experienceCount: this.getExperienceCount(),
      knowledgeSize: this.getKnowledgeSize(),
      skillCount: this.getSkillCount()
    };
  }

  protected initializeState(): {
    current: AgentState;
    consciousness: {
      level: number;
      awareness: number;
      selfReflection: number;
      metaCognition: number;
    };
    emotions: {
      happiness: number;
      curiosity: number;
      confidence: number;
      motivation: number;
    };
    cognition: {
      attention: number;
      memory: number;
      reasoning: number;
      creativity: number;
    };
    behavior: {
      activity: number;
      responsiveness: number;
      adaptability: number;
      consistency: number;
    };
    creativity: {
      imagination: number;
      innovation: number;
      expression: number;
      originality: number;
    };
  } {
    return {
      current: 'idle',
      consciousness: {
        level: 0.5,
        awareness: 0.5,
        selfReflection: 0.5,
        metaCognition: 0.5
      },
      emotions: {
        happiness: 0.5,
        curiosity: 0.5,
        confidence: 0.5,
        motivation: 0.5
      },
      cognition: {
        attention: 0.5,
        memory: 0.5,
        reasoning: 0.5,
        creativity: 0.5
      },
      behavior: {
        activity: 0.5,
        responsiveness: 0.5,
        adaptability: 0.5,
        consistency: 0.5
      },
      creativity: {
        imagination: 0.5,
        innovation: 0.5,
        expression: 0.5,
        originality: 0.5
      }
    };
  }

  protected initializeMemory(): AgentMemory {
    return {
      experiences: [],
      knowledge: new Map<string, any>(),
      skills: new Map<string, number>(),
      preferences: new Map<string, number>(),
      history: new Map<string, any[]>()
    };
  }

  protected initializePerformance(): AgentPerformance {
    return {
      efficiency: 0.7,
      accuracy: 0.8,
      adaptability: 0.6,
      creativity: 0.5,
      collaboration: 0.7
    };
  }

  protected getRequiredCapabilities(action: string): string[] {
    // Map actions to required capabilities
    const actionCapabilityMap: Record<string, string[]> = {
      'reason': ['reasoning', 'logic'],
      'learn': ['learning', 'memory'],
      'plan': ['reasoning', 'problemSolving'],
      'execute': ['physical', 'coordination'],
      'communicate': ['communication', 'expression'],
      'collaborate': ['social', 'cooperation'],
      'create': ['creativity', 'originality'],
      'adapt': ['learning', 'adaptability']
    };

    return actionCapabilityMap[action] || [];
  }

  protected getRequiredCapabilitiesForGoal(goal: Goal): string[] {
    // Implementation depends on goal type
    // const _goalType = (goal as any).type || 'unknown';
    const goalAlgorithmMap: Record<string, string[]> = {
      'learning': ['learning', 'memory', 'adaptation'],
      'reasoning': ['reasoning', 'logic', 'analysis'],
      'creativity': ['creativity', 'imagination', 'synthesis'],
      'planning': ['planning', 'organization', 'execution'],
      'communication': ['communication', 'expression', 'understanding'],
      'problem_solving': ['analysis', 'synthesis', 'evaluation'],
      'decision_making': ['evaluation', 'judgment', 'reasoning'],
      'collaboration': ['communication', 'cooperation', 'teamwork'],
      'adaptation': ['learning', 'flexibility', 'resilience'],
      'optimization': ['analysis', 'evaluation', 'improvement']
    };
    
    return goalAlgorithmMap[(goal as any).type] || ['adaptive_learning'];
  }

  protected logActivity(activity: string, details?: Record<string, any>): void {
    this.addToHistory('activities', {
      timestamp: Date.now(),
      activity,
      details: details || {}
    });
  }

  protected updatePerformanceMetrics(metric: keyof AgentPerformance, value: number): void {
    const currentValue = this.performance[metric];
    const newValue = Math.max(0, Math.min(1, value));
    this.performance[metric] = newValue;
    
    this.logger.debug('Performance metric updated', {
      agentId: this.config.id,
      metric,
      oldValue: currentValue,
      newValue
    });
  }
} 