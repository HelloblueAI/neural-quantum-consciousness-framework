/**
 * Advanced Learning Engine
 * Multi-algorithm learning with continuous adaptation and meta-learning capabilities
 */
import { EventEmitter } from 'events';
import { LearningResult, Experience } from '@/types';
/**
 * Advanced Learning Engine
 *
 * Implements sophisticated learning capabilities including:
 * - Multi-algorithm learning (supervised, unsupervised, reinforcement)
 * - Meta-learning and learning-to-learn
 * - Transfer learning across domains
 * - Active learning and exploration
 * - Online learning and continuous adaptation
 * - Pattern recognition and generalization
 * - Knowledge integration and synthesis
 */
export declare class LearningEngine extends EventEmitter {
    private readonly id;
    private readonly logger;
    private readonly supervisedLearning;
    private readonly unsupervisedLearning;
    private readonly reinforcementLearning;
    private readonly metaLearning;
    private readonly transferLearning;
    private readonly activeLearning;
    private readonly onlineLearning;
    private readonly adaptiveLearning;
    private isInitialized;
    private learningHistory;
    private knowledgeBase;
    private patterns;
    private performanceMetrics;
    constructor(_config: any);
    /**
     * Initialize the learning engine
     */
    initialize(): Promise<void>;
    /**
     * Learn from experience
     */
    learn(experience: Experience): Promise<LearningResult>;
    /**
     * Process experience for learning
     */
    processExperience(experience: Experience): Promise<LearningResult>;
    /**
     * Get current learning state
     */
    getLearningState(): any;
    /**
     * Learn from action execution
     */
    learnFromExecution(plan: any, result: any): Promise<LearningResult>;
    /**
     * Perform meta-learning
     */
    performMetaLearning(): Promise<any>;
    /**
     * Transfer knowledge to new domain
     */
    transferKnowledgeToDomain(sourceDomain: string, targetDomain: string): Promise<LearningResult>;
    /**
     * Actively learn through exploration
     */
    activeLearn(_context: any): Promise<LearningResult>;
    /**
     * Learn online from streaming data
     */
    onlineLearn(dataStream: any): Promise<LearningResult>;
    /**
     * Analyze learning patterns
     */
    analyzePatterns(): Promise<any>;
    /**
     * Get learning metrics
     */
    getMetrics(): any;
    private analyzeExperience;
    private determineExperienceType;
    private analyzeComplexity;
    private analyzeNovelty;
    private analyzeValue;
    private analyzeApplicability;
    private calculateSimilarity;
    private calculateContextSimilarity;
    private extractValueFromOutcome;
    private determineLearningStrategy;
    private applyLearningAlgorithms;
    private applyAlgorithm;
    private extractLearningInsights;
    private generateAdditionalInsights;
    private recognizePatterns;
    private findSequencePattern;
    private findStructuralPattern;
    private analyzeCausalRelationships;
    private generateGeneralizations;
    private updateKnowledgeBase;
    private convertInsightToKnowledge;
    private implementMetaLearning;
    private discoverLearningStrategies;
    private implementAdaptationMechanisms;
    private optimizeLearningProcesses;
    private synthesizeKnowledge;
    private implementSelfImprovement;
    private implementTransferLearning;
    private performDomainAdaptation;
    private transferKnowledge;
    private evaluateTransferPerformance;
    private implementActiveLearning;
    private implementQueryFunction;
    private defineStoppingCriteria;
    private calculateActiveLearningMetrics;
    private implementOnlineLearning;
    private implementOnlineAdaptation;
    private implementCatastrophicForgetting;
    private monitorOnlinePerformance;
    private implementSelfImprovingLearning;
    private calculateLearningImprovement;
    private implementLearningAdaptation;
}
//# sourceMappingURL=LearningEngine.d.ts.map