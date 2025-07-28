/**
 * Core AGI Type Definitions
 * Advanced type system for next-generation artificial general intelligence
 */
export interface Vector {
    readonly values: number[];
    readonly dimension: number;
    readonly magnitude: number;
}
export interface Matrix {
    readonly rows: number;
    readonly columns: number;
    readonly data: number[][];
}
export interface Tensor {
    readonly shape: number[];
    readonly data: number[];
    readonly rank: number;
}
export type AgentState = 'idle' | 'thinking' | 'acting' | 'learning' | 'error';
export interface AgentContext {
    readonly id: string;
    readonly timestamp: number;
    readonly environment: EnvironmentState;
    readonly memory: MemoryState;
    readonly goals: Goal[];
    readonly constraints: Constraint[];
}
export interface Agent {
    readonly id: string;
    readonly name: string;
    readonly capabilities: Capability[];
    readonly state: AgentState;
    readonly context: AgentContext;
    think(input: AgentInput): Promise<ReasoningResult>;
    act(plan: ActionPlan): Promise<ActionResult>;
    learn(experience: Experience): Promise<LearningResult>;
    adapt(context: AgentContext): Promise<AdaptationResult>;
}
export interface AgentInput {
    readonly sensoryData: SensoryData;
    readonly goals: Goal[];
    readonly constraints: Constraint[];
    readonly context: AgentContext;
}
export interface ReasoningResult {
    readonly confidence: number;
    readonly reasoning: ReasoningChain;
    readonly conclusions: Conclusion[];
    readonly uncertainty: UncertaintyModel;
    readonly alternatives: Alternative[];
    readonly complexity?: number;
    readonly reasoningTime?: number;
    readonly input?: any;
    readonly metadata?: Record<string, unknown>;
}
export interface ReasoningChain {
    readonly steps: ReasoningStep[];
    readonly logic: LogicType;
    readonly evidence: Evidence[];
    readonly assumptions: Assumption[];
}
export interface ReasoningStep {
    readonly id: string;
    readonly type: 'deduction' | 'induction' | 'abduction' | 'analogy' | 'intuition';
    readonly premise: Proposition;
    readonly conclusion: Proposition;
    readonly confidence: number;
    readonly reasoning: string;
    readonly description?: string;
}
export type LogicType = 'classical' | 'fuzzy' | 'probabilistic' | 'modal' | 'temporal' | 'quantum' | 'hybrid';
export interface Proposition {
    readonly content: string;
    readonly truthValue: number;
    readonly certainty: number;
    readonly evidence: Evidence[];
}
export interface Evidence {
    readonly source: string;
    readonly strength: number;
    readonly reliability: number;
    readonly timestamp: number;
}
export interface Assumption {
    readonly statement: string;
    readonly necessity: number;
    readonly validity: number;
}
export interface LearningResult {
    readonly success: boolean;
    readonly improvements: Improvement[];
    readonly newKnowledge: Knowledge[];
    readonly adaptationMetrics: AdaptationMetrics;
    readonly confidence?: number;
    readonly insights?: string[];
}
export interface Experience {
    readonly id: string;
    readonly timestamp: number;
    readonly context: AgentContext;
    readonly action: Action;
    readonly outcome: Outcome;
    readonly feedback: Feedback;
    readonly learning: LearningInsight[];
    readonly data?: unknown;
    readonly confidence?: number;
    readonly metadata?: Record<string, unknown>;
}
export interface LearningInsight {
    readonly pattern: Pattern;
    readonly generalization: Generalization;
    readonly confidence: number;
    readonly applicability: number;
}
export interface Pattern {
    readonly structure: PatternStructure;
    readonly frequency: number;
    readonly reliability: number;
    readonly conditions: Condition[];
}
export interface Generalization {
    readonly from: SpecificCase[];
    readonly to: GeneralCase;
    readonly validity: number;
    readonly scope: Scope;
}
export interface SpecificCase {
    readonly id: string;
    readonly data: unknown;
    readonly context: Record<string, unknown>;
}
export interface GeneralCase {
    readonly pattern: string;
    readonly conditions: Record<string, unknown>;
    readonly applicability: number;
}
export interface Scope {
    readonly domain: string;
    readonly conditions: Record<string, unknown>;
    readonly limitations: string[];
}
export interface PatternStructure {
    readonly type: string;
    readonly elements: unknown[];
    readonly relationships: Record<string, unknown>;
}
export interface Condition {
    readonly type: string;
    readonly expression: string;
    readonly parameters: Record<string, unknown>;
}
export interface Improvement {
    readonly type: string;
    readonly magnitude: number;
    readonly description: string;
}
export interface AdaptationMetrics {
    readonly performance: number;
    readonly efficiency: number;
    readonly stability: number;
    readonly flexibility: number;
}
export interface ActionPlan {
    readonly id: string;
    readonly goals: Goal[];
    readonly actions: Action[];
    readonly sequence: ActionSequence;
    readonly contingencies: Contingency[];
    readonly expectedOutcome: ExpectedOutcome;
}
export interface Action {
    readonly id: string;
    readonly type: ActionType;
    readonly parameters: ActionParameters;
    readonly preconditions: Condition[];
    readonly effects: Effect[];
    readonly cost: Cost;
    readonly risk: Risk;
    readonly priority?: number;
}
export interface Effect {
    readonly type: string;
    readonly magnitude: number;
    readonly probability: number;
    readonly target: string;
}
export interface Cost {
    readonly type: 'time' | 'energy' | 'resource' | 'risk';
    readonly value: number;
    readonly unit: string;
}
export interface Risk {
    readonly level: 'low' | 'medium' | 'high' | 'critical';
    readonly probability: number;
    readonly impact: number;
    readonly mitigation: string[];
}
export interface ActionSequence {
    readonly steps: Action[];
    readonly dependencies: Record<string, string[]>;
    readonly parallel: boolean;
}
export interface Contingency {
    readonly condition: Condition;
    readonly action: Action;
    readonly priority: number;
}
export interface ExpectedOutcome {
    readonly probability: number;
    readonly value: Value;
    readonly uncertainty: UncertaintyModel;
}
export type ActionType = 'perceive' | 'reason' | 'plan' | 'execute' | 'communicate' | 'learn' | 'adapt' | 'create' | 'optimize' | 'innovate';
export interface ActionParameters {
    readonly [key: string]: unknown;
}
export interface ActionResult {
    readonly success: boolean;
    readonly outcome: Outcome;
    readonly metrics: ActionMetrics;
    readonly feedback: Feedback;
}
export interface Outcome {
    readonly state: EnvironmentState;
    readonly changes: Change[];
    readonly value: Value;
    readonly uncertainty: UncertaintyModel;
}
export interface Change {
    readonly type: string;
    readonly target: string;
    readonly magnitude: number;
    readonly direction: 'positive' | 'negative' | 'neutral';
}
export interface ActionMetrics {
    readonly efficiency: number;
    readonly effectiveness: number;
    readonly cost: number;
    readonly time: number;
}
export interface Knowledge {
    readonly id: string;
    readonly type: KnowledgeType;
    readonly content: KnowledgeContent;
    readonly confidence: number;
    readonly source: string;
    readonly timestamp: number;
    readonly validity: ValidityPeriod;
}
export type KnowledgeType = 'fact' | 'rule' | 'pattern' | 'concept' | 'skill' | 'strategy' | 'meta-knowledge';
export interface KnowledgeContent {
    readonly representation: Representation;
    readonly semantics: Semantics;
    readonly relationships: Relationship[];
}
export interface Encoding {
    readonly format: string;
    readonly parameters: Record<string, unknown>;
}
export interface Context {
    readonly domain: string;
    readonly scope: string;
    readonly constraints: Record<string, unknown>;
}
export interface Interpretation {
    readonly meaning: string;
    readonly confidence: number;
    readonly alternatives: string[];
}
export interface Relationship {
    readonly type: string;
    readonly source: string;
    readonly target: string;
    readonly strength: number;
    readonly properties: Record<string, unknown>;
}
export interface ValidityPeriod {
    readonly start: number;
    readonly end?: number;
    readonly conditions: Record<string, unknown>;
}
export interface Representation {
    readonly format: 'symbolic' | 'neural' | 'hybrid';
    readonly structure: unknown;
    readonly encoding: Encoding;
}
export interface Semantics {
    readonly meaning: string;
    readonly context: Context;
    readonly interpretation: Interpretation;
}
export interface MemoryState {
    readonly totalMemories: number;
    readonly shortTermCount: number;
    readonly longTermCount: number;
    readonly workingCount: number;
    readonly episodicCount: number;
    readonly semanticCount: number;
    readonly proceduralCount: number;
    readonly shortTerm: ShortTermMemory;
    readonly longTerm: LongTermMemory;
    readonly working: WorkingMemory;
    readonly episodic: EpisodicMemory;
    readonly semantic: SemanticMemory;
}
export interface ShortTermMemory {
    readonly capacity: number;
    readonly items: MemoryItem[];
    readonly decay: DecayFunction;
}
export interface DecayFunction {
    readonly type: 'exponential' | 'linear' | 'step';
    readonly rate: number;
    readonly parameters: Record<string, unknown>;
}
export interface Skill {
    readonly id: string;
    readonly name: string;
    readonly level: number;
    readonly domain: string;
    readonly confidence: number;
}
export interface Focus {
    readonly target: string;
    readonly intensity: number;
    readonly duration: number;
}
export interface Timeline {
    readonly events: Event[];
    readonly order: 'chronological' | 'causal' | 'thematic';
    readonly granularity: string;
}
export interface Association {
    readonly source: string;
    readonly target: string;
    readonly strength: number;
    readonly type: string;
}
export interface Concept {
    readonly id: string;
    readonly name: string;
    readonly definition: string;
    readonly properties: Record<string, unknown>;
    readonly instances: string[];
}
export interface Schema {
    readonly id: string;
    readonly name: string;
    readonly structure: Record<string, unknown>;
    readonly constraints: Record<string, unknown>;
    readonly examples: unknown[];
}
export interface LongTermMemory {
    readonly knowledge: Knowledge[];
    readonly patterns: Pattern[];
    readonly skills: Skill[];
    readonly experiences: Experience[];
}
export interface WorkingMemory {
    readonly active: MemoryItem[];
    readonly focus: Focus;
    readonly capacity: number;
}
export interface EpisodicMemory {
    readonly events: Event[];
    readonly timeline: Timeline;
    readonly associations: Association[];
}
export interface SemanticMemory {
    readonly concepts: Concept[];
    readonly relationships: Relationship[];
    readonly schemas: Schema[];
}
export interface MemoryItem {
    readonly id: string;
    readonly content: unknown;
    readonly importance: number;
    readonly accessibility: number;
    readonly timestamp: number;
}
export interface EnvironmentState {
    readonly objects: Object[];
    readonly agents: Agent[];
    readonly events: Event[];
    readonly constraints: Constraint[];
    readonly resources: Resource[];
}
export interface Object {
    readonly id: string;
    readonly type: string;
    readonly properties: Property[];
    readonly relationships: Relationship[];
    readonly state: ObjectState;
}
export interface Property {
    readonly name: string;
    readonly value: unknown;
    readonly type: string;
    readonly mutable: boolean;
}
export interface ObjectState {
    readonly current: Record<string, unknown>;
    readonly history: Record<string, unknown>[];
    readonly transitions: StateTransition[];
}
export interface StateTransition {
    readonly from: string;
    readonly to: string;
    readonly trigger: string;
    readonly timestamp: number;
}
export interface Violation {
    readonly type: string;
    readonly severity: number;
    readonly description: string;
    readonly consequences: string[];
}
export interface Allocation {
    readonly resource: string;
    readonly agent: string;
    readonly amount: number;
    readonly priority: number;
}
export interface GoalMetrics {
    readonly progress: number;
    readonly efficiency: number;
    readonly satisfaction: number;
    readonly completion: number;
}
export interface Limitation {
    readonly type: string;
    readonly description: string;
    readonly severity: number;
    readonly workaround: string;
}
export interface Event {
    readonly id: string;
    readonly type: string;
    readonly timestamp: number;
    readonly participants: Agent[];
    readonly effects: Effect[];
    readonly probability: number;
}
export interface Constraint {
    readonly type: 'physical' | 'logical' | 'temporal' | 'resource' | 'social';
    readonly condition: Condition;
    readonly strength: number;
    readonly violation: Violation;
}
export interface Resource {
    readonly id: string;
    readonly type: string;
    readonly quantity: number;
    readonly availability: number;
    readonly allocation: Allocation[];
}
export interface Goal {
    readonly id: string;
    readonly description: string;
    readonly priority: number;
    readonly deadline?: number;
    readonly dependencies: Goal[];
    readonly metrics: GoalMetrics;
}
export interface Capability {
    readonly type: string;
    readonly level: number;
    readonly reliability: number;
    readonly limitations: Limitation[];
}
export interface SensoryData {
    readonly vision: VisualData[];
    readonly audio: AudioData[];
    readonly tactile: TactileData[];
    readonly proprioceptive: ProprioceptiveData[];
    readonly other: OtherSensoryData[];
}
export interface VisualData {
    readonly type: string;
    readonly content: unknown;
    readonly confidence: number;
    readonly timestamp: number;
}
export interface AudioData {
    readonly type: string;
    readonly content: unknown;
    readonly confidence: number;
    readonly timestamp: number;
}
export interface TactileData {
    readonly type: string;
    readonly content: unknown;
    readonly confidence: number;
    readonly timestamp: number;
}
export interface ProprioceptiveData {
    readonly type: string;
    readonly content: unknown;
    readonly confidence: number;
    readonly timestamp: number;
}
export interface OtherSensoryData {
    readonly type: string;
    readonly content: unknown;
    readonly confidence: number;
    readonly timestamp: number;
}
export interface UncertaintyModel {
    readonly type: 'probabilistic' | 'fuzzy' | 'interval' | 'possibilistic';
    readonly parameters: unknown;
    readonly confidence: number;
}
export interface Value {
    readonly utility: number;
    readonly ethical: EthicalValue;
    readonly aesthetic: AestheticValue;
    readonly practical: PracticalValue;
}
export interface EthicalValue {
    readonly fairness: number;
    readonly harm: number;
    readonly autonomy: number;
    readonly beneficence: number;
}
export interface AestheticValue {
    readonly beauty: number;
    readonly harmony: number;
    readonly creativity: number;
    readonly elegance: number;
}
export interface PracticalValue {
    readonly efficiency: number;
    readonly effectiveness: number;
    readonly sustainability: number;
    readonly scalability: number;
}
export interface Feedback {
    readonly type: 'positive' | 'negative' | 'neutral' | 'corrective';
    readonly strength: number;
    readonly specificity: number;
    readonly timeliness: number;
}
export interface MetaReasoning {
    readonly selfReflection: SelfReflection;
    readonly metaLearning: MetaLearning;
    readonly introspection: Introspection;
    readonly selfModification: SelfModification;
}
export interface SelfReflection {
    readonly awareness: Awareness;
    readonly understanding: Understanding;
    readonly evaluation: Evaluation;
}
export interface MetaLearning {
    readonly learningStrategies: LearningStrategy[];
    readonly adaptation: Adaptation;
    readonly optimization: Optimization;
}
export interface Consciousness {
    readonly awareness: Awareness;
    readonly qualia: Qualia[];
    readonly selfModel: SelfModel;
    readonly subjectiveExperience: SubjectiveExperience;
}
export interface Awareness {
    readonly level: number;
    readonly focus: string;
    readonly clarity: number;
    readonly breadth: number;
}
export interface Qualia {
    readonly type: string;
    readonly intensity: number;
    readonly quality: string;
    readonly duration: number;
}
export interface SelfModel {
    readonly identity: string;
    readonly capabilities: string[];
    readonly limitations: string[];
    readonly goals: string[];
}
export interface SubjectiveExperience {
    readonly emotions: Emotion[];
    readonly thoughts: Thought[];
    readonly sensations: Sensation[];
    readonly perceptions: Perception[];
}
export interface Emotion {
    readonly type: string;
    readonly intensity: number;
    readonly valence: number;
    readonly duration: number;
}
export interface Thought {
    readonly content: string;
    readonly type: string;
    readonly clarity: number;
    readonly importance: number;
}
export interface Sensation {
    readonly type: string;
    readonly intensity: number;
    readonly location: string;
    readonly quality: string;
}
export interface Perception {
    readonly modality: string;
    readonly content: unknown;
    readonly confidence: number;
    readonly interpretation: string;
}
export interface Understanding {
    readonly depth: number;
    readonly breadth: number;
    readonly coherence: number;
    readonly accuracy: number;
}
export interface Evaluation {
    readonly criteria: string[];
    readonly scores: Record<string, number>;
    readonly overall: number;
    readonly confidence: number;
}
export interface LearningStrategy {
    readonly type: string;
    readonly parameters: Record<string, unknown>;
    readonly effectiveness: number;
    readonly applicability: number;
}
export interface Adaptation {
    readonly type: string;
    readonly magnitude: number;
    readonly direction: string;
    readonly success: number;
}
export interface Optimization {
    readonly target: string;
    readonly method: string;
    readonly parameters: Record<string, unknown>;
    readonly results: Record<string, number>;
}
export interface Introspection {
    readonly selfAwareness: number;
    readonly selfUnderstanding: number;
    readonly selfEvaluation: number;
    readonly selfModification: number;
}
export interface SelfModification {
    readonly capability: number;
    readonly willingness: number;
    readonly methods: string[];
    readonly limitations: string[];
}
export interface Originality {
    readonly level: number;
    readonly uniqueness: number;
    readonly novelty: number;
    readonly innovation: number;
}
export interface Fluency {
    readonly rate: number;
    readonly volume: number;
    readonly ease: number;
    readonly consistency: number;
}
export interface Flexibility {
    readonly adaptability: number;
    readonly variety: number;
    readonly openness: number;
    readonly responsiveness: number;
}
export interface Elaboration {
    readonly detail: number;
    readonly complexity: number;
    readonly refinement: number;
    readonly development: number;
}
export interface Creativity {
    readonly originality: Originality;
    readonly fluency: Fluency;
    readonly flexibility: Flexibility;
    readonly elaboration: Elaboration;
}
export interface AGISystem {
    readonly agents: Agent[];
    readonly coordinator: SystemCoordinator;
    readonly knowledgeBase: KnowledgeBase;
    readonly learningEngine: LearningEngine;
    readonly reasoningEngine: ReasoningEngine;
    readonly communicationProtocol: CommunicationProtocol;
}
export interface CommunicationProtocol {
    readonly type: string;
    readonly format: string;
    readonly encoding: string;
    readonly reliability: number;
}
export interface Orchestration {
    readonly strategy: string;
    readonly coordination: string;
    readonly optimization: string;
    readonly monitoring: string;
}
export interface ResourceManagement {
    readonly allocation: string;
    readonly scheduling: string;
    readonly optimization: string;
    readonly monitoring: string;
}
export interface ConflictResolution {
    readonly strategy: string;
    readonly arbitration: string;
    readonly mediation: string;
    readonly escalation: string;
}
export interface SystemOptimization {
    readonly performance: string;
    readonly efficiency: string;
    readonly reliability: string;
    readonly scalability: string;
}
export interface Storage {
    readonly type: string;
    readonly capacity: number;
    readonly performance: number;
    readonly reliability: number;
}
export interface Indexing {
    readonly method: string;
    readonly efficiency: number;
    readonly accuracy: number;
    readonly scalability: number;
}
export interface Retrieval {
    readonly method: string;
    readonly speed: number;
    readonly accuracy: number;
    readonly relevance: number;
}
export interface Integration {
    readonly strategy: string;
    readonly compatibility: number;
    readonly coherence: number;
    readonly consistency: number;
}
export interface LearningAlgorithm {
    readonly type: string;
    readonly parameters: Record<string, unknown>;
    readonly performance: number;
    readonly applicability: number;
}
export interface Logic {
    readonly type: string;
    readonly rules: string[];
    readonly consistency: number;
    readonly completeness: number;
}
export interface Inference {
    readonly method: string;
    readonly accuracy: number;
    readonly efficiency: number;
    readonly reliability: number;
}
export interface DecisionMaking {
    readonly strategy: string;
    readonly criteria: string[];
    readonly weights: Record<string, number>;
    readonly confidence: number;
}
export interface ProblemSolving {
    readonly approach: string;
    readonly heuristics: string[];
    readonly strategies: string[];
    readonly success: number;
}
export interface SystemCoordinator {
    readonly orchestration: Orchestration;
    readonly resourceManagement: ResourceManagement;
    readonly conflictResolution: ConflictResolution;
    readonly optimization: SystemOptimization;
}
export interface KnowledgeBase {
    readonly storage: Storage;
    readonly indexing: Indexing;
    readonly retrieval: Retrieval;
    readonly integration: Integration;
}
export interface LearningEngine {
    readonly algorithms: LearningAlgorithm[];
    readonly adaptation: Adaptation;
    readonly optimization: Optimization;
    readonly evaluation: Evaluation;
}
export interface ReasoningEngine {
    readonly logics: Logic[];
    readonly inference: Inference;
    readonly decisionMaking: DecisionMaking;
    readonly problemSolving: ProblemSolving;
}
export interface SystemConfig {
    readonly agents: AgentConfig[];
    readonly learning: LearningConfig;
    readonly reasoning: ReasoningConfig;
    readonly communication: CommunicationConfig;
    readonly security: SecurityConfig;
    readonly performance: PerformanceConfig;
}
export interface AgentConfig {
    readonly id: string;
    readonly type: string;
    readonly capabilities: string[];
    readonly parameters: Record<string, unknown>;
    readonly constraints: Constraint[];
}
export interface LearningConfig {
    readonly algorithms: string[];
    readonly parameters: Record<string, unknown>;
    readonly evaluation: EvaluationConfig;
    readonly adaptation: AdaptationConfig;
}
export interface ReasoningConfig {
    readonly logics: string[];
    readonly inference: InferenceConfig;
    readonly decisionMaking: DecisionMakingConfig;
    readonly problemSolving: ProblemSolvingConfig;
}
export interface CommunicationConfig {
    readonly protocol: string;
    readonly format: string;
    readonly encoding: string;
    readonly reliability: number;
}
export interface SecurityConfig {
    readonly authentication: boolean;
    readonly authorization: boolean;
    readonly encryption: boolean;
    readonly monitoring: boolean;
}
export interface PerformanceConfig {
    readonly maxResponseTime: number;
    readonly maxThroughput: number;
    readonly resourceLimits: Record<string, number>;
    readonly optimization: boolean;
}
export interface EvaluationConfig {
    readonly metrics: string[];
    readonly thresholds: Record<string, number>;
    readonly validation: boolean;
}
export interface AdaptationConfig {
    readonly enabled: boolean;
    readonly strategies: string[];
    readonly thresholds: Record<string, number>;
}
export interface InferenceConfig {
    readonly method: string;
    readonly accuracy: number;
    readonly efficiency: number;
    readonly reliability: number;
}
export interface DecisionMakingConfig {
    readonly strategy: string;
    readonly criteria: string[];
    readonly weights: Record<string, number>;
    readonly confidence: number;
}
export interface ProblemSolvingConfig {
    readonly approach: string;
    readonly heuristics: string[];
    readonly strategies: string[];
    readonly success: number;
}
export interface CommunicationMetrics {
    readonly throughput: number;
    readonly latency: number;
    readonly reliability: number;
    readonly efficiency: number;
}
export interface SecurityMetrics {
    readonly threats: number;
    readonly vulnerabilities: number;
    readonly incidents: number;
    readonly riskLevel: 'low' | 'medium' | 'high' | 'critical';
}
export interface ResourceUsage {
    readonly cpu: number;
    readonly memory: number;
    readonly disk: number;
    readonly network: number;
}
export interface AGIError extends Error {
    readonly code: string;
    readonly severity: 'low' | 'medium' | 'high' | 'critical';
    readonly context: unknown;
    readonly recovery: RecoveryStrategy;
}
export interface RecoveryStrategy {
    readonly type: 'retry' | 'fallback' | 'degradation' | 'restart';
    readonly parameters: Record<string, unknown>;
    readonly maxAttempts: number;
}
export interface SystemMetrics {
    readonly performance: PerformanceMetrics;
    readonly learning: LearningMetrics;
    readonly reasoning: ReasoningMetrics;
    readonly communication: CommunicationMetrics;
    readonly security: SecurityMetrics;
}
export interface PerformanceMetrics {
    readonly responseTime: number;
    readonly throughput: number;
    readonly resourceUsage: ResourceUsage;
    readonly efficiency: number;
}
export interface LearningMetrics {
    readonly accuracy: number;
    readonly improvement: number;
    readonly adaptation: number;
    readonly generalization: number;
}
export interface ReasoningMetrics {
    readonly correctness: number;
    readonly efficiency: number;
    readonly creativity: number;
    readonly consistency: number;
}
export interface AdaptationResult {
    readonly success: boolean;
    readonly changes: AdaptationChange[];
    readonly performance: AdaptationPerformance;
    readonly confidence: number;
}
export interface AdaptationChange {
    readonly type: string;
    readonly target: string;
    readonly magnitude: number;
    readonly direction: 'positive' | 'negative' | 'neutral';
    readonly description: string;
}
export interface AdaptationPerformance {
    readonly before: number;
    readonly after: number;
    readonly improvement: number;
    readonly stability: number;
}
export interface Conclusion {
    readonly id: string;
    readonly statement: string;
    readonly confidence: number;
    readonly evidence: Evidence[];
    readonly reasoning: string;
    readonly implications: string[];
}
export interface Alternative {
    readonly id: string;
    readonly description: string;
    readonly probability: number;
    readonly feasibility: number;
    readonly consequences: Consequence[];
    readonly reasoning: string;
}
export interface Consequence {
    readonly type: string;
    readonly description: string;
    readonly probability: number;
    readonly impact: number;
}
export interface Policy {
    readonly id: string;
    readonly type: string;
    readonly parameters: Record<string, unknown>;
    readonly confidence: number;
    performance?: number;
}
export interface QValue {
    readonly state: string;
    readonly action: string;
    readonly value: number;
    readonly confidence: number;
}
export interface Episode {
    readonly id: string;
    readonly steps: EpisodeStep[];
    readonly totalReward: number;
    readonly success: boolean;
}
export interface EpisodeStep {
    readonly state: string;
    readonly action: string;
    readonly reward: number;
    readonly nextState: string;
}
export interface Cluster {
    readonly id: string;
    readonly centroid: Vector;
    readonly members: string[];
    readonly confidence: number;
}
export interface DimensionalityReduction {
    readonly id: string;
    readonly method: string;
    readonly originalDimensions: number;
    readonly reducedDimensions: number;
    readonly quality: number;
}
export interface ConsciousState {
    readonly level: number;
    readonly awarenessLevel: number;
    readonly attentionLevel: number;
    readonly emotionalState: string;
    readonly thoughts: Thought[];
    readonly qualia: Qualia[];
    readonly selfModel: SelfModel;
    readonly metaCognition: MetaCognition;
    readonly awareness: Awareness;
    readonly attention: Attention;
    readonly emotions: Emotion[];
    readonly timestamp: number;
}
export interface Attention {
    readonly allocation: Map<string, number>;
    readonly capacity: number;
    readonly focus: string;
    readonly priority: string;
    readonly filtering: string;
    readonly switching: number;
}
export interface MetaCognition {
    readonly selfAwareness: number;
    readonly introspection: number;
    readonly cognitiveControl: number;
    readonly metacognitiveKnowledge: number;
    readonly metacognitiveRegulation: number;
    readonly metacognitiveExperience: number;
}
export interface LogicalPremise {
    readonly id: string;
    readonly content: string;
    readonly type: 'axiom' | 'theorem' | 'assumption' | 'proposition';
    readonly confidence: number;
    readonly source: string;
    readonly timestamp: number;
}
export interface LogicalConclusion {
    readonly id: string;
    readonly premises: LogicalPremise[];
    readonly conclusions: string[];
    readonly proof: ProofStep[];
    readonly confidence: number;
    readonly validity: boolean;
    readonly soundness: boolean;
    readonly timestamp: number;
}
export interface InferenceRule {
    readonly id: string;
    readonly name: string;
    readonly pattern: string[];
    readonly conclusion: string;
    readonly validity: 'valid' | 'invalid' | 'unknown';
    readonly description: string;
}
export interface ProofStep {
    readonly step: number;
    readonly type: 'premise' | 'inference' | 'conclusion';
    readonly content: string;
    readonly justification: string;
    readonly confidence: number;
}
export interface LogicalOperator {
    readonly symbol: string;
    readonly name: string;
    readonly arity: number;
    readonly truthTable?: Map<string, boolean>;
    readonly scope?: string;
}
export interface Emotion {
    readonly id: string;
    readonly type: string;
    readonly intensity: number;
    readonly valence: number;
    readonly arousal: number;
    readonly duration: number;
    readonly triggers: string[];
    readonly expression: string;
    readonly timestamp: number;
}
export interface Thought {
    readonly id: string;
    readonly content: string;
    readonly type: string;
    readonly complexity: number;
    readonly clarity: number;
    readonly confidence: number;
    readonly emotionalInfluence: number;
    readonly associations: string[];
    readonly timestamp: number;
}
export interface Qualia {
    readonly id: string;
    readonly experience: string;
    readonly intensity: number;
    readonly quality: string;
    readonly emotionalComponent: string;
    readonly cognitiveComponent: string;
    readonly unity: number;
    readonly ineffability: number;
    readonly timestamp: number;
}
export interface Awareness {
    readonly level: number;
    readonly focus: string;
    readonly clarity: number;
    readonly breadth: number;
    readonly depth: number;
    readonly stability: number;
}
export interface SelfModel {
    readonly identity: string;
    readonly capabilities: string[];
    readonly goals: string[];
    readonly limitations: string[];
    readonly selfAssessment: SelfAssessment;
}
export interface SelfAssessment {
    readonly intelligence: number;
    readonly consciousness: number;
    readonly creativity: number;
    readonly adaptability: number;
}
//# sourceMappingURL=index.d.ts.map