import { Experience, LearningResult } from '../../types';
export interface ReinforcementLearningConfig {
    learningRate: number;
    discountFactor: number;
    explorationRate: number;
    maxEpisodes: number;
    convergenceThreshold: number;
}
export interface QValue {
    stateId: string;
    actionId: string;
    value: number;
    visits: number;
    lastUpdate: number;
}
export interface Policy {
    id: string;
    type: 'epsilon_greedy' | 'softmax' | 'ucb';
    parameters: Map<string, number>;
    performance: number;
}
export interface Episode {
    id: string;
    steps: EpisodeStep[];
    totalReward: number;
    length: number;
    success: boolean;
}
export interface EpisodeStep {
    state: string;
    action: string;
    reward: number;
    nextState: string;
    timestamp: number;
}
export declare class ReinforcementLearning {
    private readonly config;
    private readonly logger;
    private readonly qValues;
    private readonly policies;
    private performanceMetrics;
    constructor(config: ReinforcementLearningConfig);
    initialize(): Promise<void>;
    getMetrics(): any;
    getPerformanceMetrics(): any;
    learn(experiences: Experience[]): LearningResult;
    private createEpisodes;
    private updateQValues;
    private updatePolicy;
    private getMaxQValue;
    private extractState;
    private extractAction;
    private extractReward;
    private extractNextState;
    private isEpisodeEnd;
    private initializePolicies;
    private updatePolicyParameters;
    private updatePerformanceMetrics;
}
//# sourceMappingURL=ReinforcementLearning.d.ts.map