import { Vector, Tensor } from '@/types';
export interface BaseModel {
    id: string;
    createdAt: number;
    updatedAt: number;
    version: string;
    metadata: Map<string, any>;
}
export interface AgentModel extends BaseModel {
    type: 'reasoning' | 'learning' | 'creative' | 'hybrid';
    name: string;
    description: string;
    capabilities: string[];
    configuration: AgentConfiguration;
    state: AgentState;
    performance: AgentPerformance;
    memory: AgentMemory;
    connections: AgentConnection[];
}
export interface AgentConfiguration {
    reasoningEngine: {
        enabled: boolean;
        logicSystems: string[];
        inferenceMethods: string[];
        decisionStrategies: string[];
    };
    learningEngine: {
        enabled: boolean;
        algorithms: string[];
        metaLearning: boolean;
        transferLearning: boolean;
        activeLearning: boolean;
    };
    creativityEngine: {
        enabled: boolean;
        techniques: string[];
        constraints: any[];
        evaluationMetrics: string[];
    };
    consciousness: {
        enabled: boolean;
        awarenessLevel: number;
        selfModel: Map<string, any>;
        subjectiveExperience: boolean;
    };
    communication: {
        protocols: string[];
        messageFormats: string[];
        routingStrategies: string[];
    };
    security: {
        authentication: boolean;
        authorization: boolean;
        encryption: boolean;
        auditLogging: boolean;
    };
}
export interface AgentState {
    status: 'active' | 'inactive' | 'busy' | 'error' | 'maintenance';
    currentTask: string | null;
    taskProgress: number;
    lastActivity: number;
    uptime: number;
    errorCount: number;
    successCount: number;
    consciousness: ConsciousnessState;
    emotions: Map<string, number>;
    attention: Vector;
    thoughts: string[];
}
export interface AgentPerformance {
    responseTime: number;
    throughput: number;
    accuracy: number;
    efficiency: number;
    reliability: number;
    adaptability: number;
    creativity: number;
    reasoningQuality: number;
    learningRate: number;
    memoryUsage: number;
    cpuUsage: number;
    networkUsage: number;
}
export interface AgentMemory {
    shortTerm: MemoryEntry[];
    longTerm: MemoryEntry[];
    working: MemoryEntry[];
    episodic: MemoryEntry[];
    semantic: MemoryEntry[];
    consolidated: MemoryEntry[];
}
export interface AgentConnection {
    id: string;
    type: 'internal' | 'external' | 'network' | 'service';
    target: string;
    status: 'connected' | 'disconnected' | 'connecting' | 'error';
    latency: number;
    bandwidth: number;
    reliability: number;
    lastHeartbeat: number;
}
export interface ExperienceModel extends BaseModel {
    type: 'perception' | 'action' | 'interaction' | 'learning' | 'creation' | 'reflection';
    data: any;
    context: ExperienceContext;
    processing: ExperienceProcessing;
    outcomes: ExperienceOutcome[];
    associations: string[];
    importance: number;
    confidence: number;
    emotionalContent: Map<string, number>;
    temporalContext: TemporalContext;
    spatialContext: SpatialContext;
    socialContext: SocialContext;
}
export interface ExperienceContext {
    environment: string;
    situation: string;
    goals: string[];
    constraints: any[];
    resources: Map<string, any>;
    externalFactors: Map<string, any>;
    internalState: Map<string, any>;
}
export interface ExperienceProcessing {
    reasoningApplied: string[];
    learningAlgorithms: string[];
    creativityTechniques: string[];
    consciousnessInvolved: boolean;
    metaCognition: boolean;
    attentionAllocation: Vector;
    cognitiveLoad: number;
    processingTime: number;
    energyExpended: number;
}
export interface ExperienceOutcome {
    type: 'success' | 'failure' | 'partial' | 'learning' | 'insight';
    description: string;
    value: number;
    confidence: number;
    implications: string[];
    feedback: any;
    improvements: string[];
}
export interface TemporalContext {
    timestamp: number;
    duration: number;
    sequence: number;
    frequency: number;
    periodicity: string | null;
    urgency: number;
    deadline: number | null;
}
export interface SpatialContext {
    location: string;
    coordinates: Vector | null;
    environment: string;
    boundaries: any[];
    accessibility: Map<string, number>;
    constraints: any[];
}
export interface SocialContext {
    participants: string[];
    relationships: Map<string, string>;
    roles: Map<string, string>;
    communication: string[];
    collaboration: boolean;
    conflict: boolean;
    consensus: boolean;
}
export interface KnowledgeModel extends BaseModel {
    type: 'fact' | 'concept' | 'rule' | 'pattern' | 'procedure' | 'meta_knowledge';
    content: KnowledgeContent;
    structure: KnowledgeStructure;
    relationships: KnowledgeRelationship[];
    confidence: number;
    source: string;
    validation: KnowledgeValidation;
    usage: KnowledgeUsage;
    evolution: KnowledgeEvolution;
}
export interface KnowledgeContent {
    primary: any;
    secondary: any[];
    metadata: Map<string, any>;
    format: string;
    encoding: string;
    size: number;
    complexity: number;
    abstraction: number;
}
export interface KnowledgeStructure {
    hierarchy: string[];
    categories: string[];
    tags: string[];
    attributes: Map<string, any>;
    constraints: any[];
    dependencies: string[];
    prerequisites: string[];
}
export interface KnowledgeRelationship {
    id: string;
    type: 'is_a' | 'part_of' | 'causes' | 'enables' | 'contradicts' | 'supports' | 'generalizes' | 'specializes';
    target: string;
    strength: number;
    confidence: number;
    bidirectional: boolean;
    metadata: Map<string, any>;
}
export interface KnowledgeValidation {
    verified: boolean;
    verificationMethod: string;
    verificationDate: number;
    verifier: string;
    evidence: any[];
    counterEvidence: any[];
    reliability: number;
    consistency: boolean;
}
export interface KnowledgeUsage {
    accessCount: number;
    lastAccessed: number;
    applications: string[];
    effectiveness: number;
    efficiency: number;
    userSatisfaction: number;
    impact: Map<string, number>;
}
export interface KnowledgeEvolution {
    version: number;
    changes: KnowledgeChange[];
    improvementRate: number;
    obsolescenceRisk: number;
    updateFrequency: number;
    lastUpdate: number;
}
export interface KnowledgeChange {
    timestamp: number;
    type: 'addition' | 'modification' | 'deletion' | 'refinement';
    description: string;
    reason: string;
    impact: number;
    author: string;
}
export interface ConsciousnessModel extends BaseModel {
    state: ConsciousnessState;
    awareness: AwarenessModel;
    attention: AttentionModel;
    emotions: EmotionalModel;
    thoughts: ThoughtModel;
    selfModel: SelfModel;
    subjectiveExperience: SubjectiveExperienceModel;
    metaCognition: MetaCognitionModel;
}
export interface ConsciousnessState {
    level: number;
    quality: string;
    stability: number;
    coherence: number;
    unity: number;
    continuity: number;
    complexity: number;
    integration: number;
}
export interface AwarenessModel {
    level: number;
    focus: string;
    breadth: number;
    depth: number;
    clarity: number;
    stability: number;
    responsiveness: number;
    content: string[];
}
export interface AttentionModel {
    allocation: Vector;
    capacity: number;
    focus: string;
    stability: number;
    switching: number;
    filtering: number;
    monitoring: number;
    executive: number;
}
export interface EmotionalModel {
    primary: string;
    intensity: number;
    valence: number;
    arousal: number;
    stability: number;
    complexity: number;
    regulation: number;
    expression: string[];
    physiological: Map<string, number>;
}
export interface ThoughtModel {
    content: string[];
    type: 'analytical' | 'creative' | 'reflective' | 'associative' | 'meta_cognitive';
    complexity: number;
    coherence: number;
    flow: number;
    quality: number;
    speed: number;
    depth: number;
    breadth: number;
}
export interface SelfModel {
    identity: string;
    capabilities: string[];
    limitations: string[];
    goals: string[];
    values: string[];
    beliefs: Map<string, number>;
    preferences: Map<string, number>;
    traits: Map<string, number>;
    history: SelfHistory[];
}
export interface SelfHistory {
    timestamp: number;
    event: string;
    impact: number;
    learning: string[];
    changes: Map<string, any>;
}
export interface SubjectiveExperienceModel {
    quality: string;
    intensity: number;
    valence: number;
    complexity: number;
    coherence: number;
    unity: number;
    continuity: number;
    content: string[];
    qualia: Map<string, any>;
}
export interface MetaCognitionModel {
    selfAwareness: number;
    introspection: string[];
    metacognitiveControl: number;
    cognitiveLoad: number;
    attentionAllocation: Map<string, number>;
    thoughtProcesses: string[];
    learningStrategies: string[];
    problemSolvingApproaches: string[];
}
export interface MemoryModel extends BaseModel {
    type: 'short_term' | 'long_term' | 'working' | 'episodic' | 'semantic' | 'procedural';
    entries: MemoryEntry[];
    capacity: number;
    usage: number;
    efficiency: number;
    consolidation: MemoryConsolidation;
    retrieval: MemoryRetrieval;
    optimization: MemoryOptimization;
}
export interface MemoryEntry {
    id: string;
    content: any;
    type: string;
    importance: number;
    associations: string[];
    accessCount: number;
    lastAccessed: number;
    decayRate: number;
    consolidation: number;
    retrieval: number;
    metadata: Map<string, any>;
}
export interface MemoryConsolidation {
    active: boolean;
    threshold: number;
    frequency: number;
    strategy: string;
    efficiency: number;
    lastConsolidation: number;
    pendingEntries: string[];
    consolidatedGroups: MemoryGroup[];
}
export interface MemoryGroup {
    id: string;
    entries: string[];
    commonality: number;
    strength: number;
    accessPattern: string;
    consolidationTime: number;
}
export interface MemoryRetrieval {
    strategy: string;
    efficiency: number;
    accuracy: number;
    speed: number;
    contextSensitivity: number;
    patternMatching: number;
    associativeStrength: number;
}
export interface MemoryOptimization {
    active: boolean;
    strategy: string;
    frequency: number;
    efficiency: number;
    lastOptimization: number;
    improvements: MemoryImprovement[];
}
export interface MemoryImprovement {
    type: string;
    description: string;
    impact: number;
    timestamp: number;
}
export interface SystemMetricsModel extends BaseModel {
    performance: PerformanceMetrics;
    resources: ResourceMetrics;
    quality: QualityMetrics;
    efficiency: EfficiencyMetrics;
    reliability: ReliabilityMetrics;
    security: SecurityMetrics;
    monitoring: MonitoringMetrics;
}
export interface PerformanceMetrics {
    responseTime: number;
    throughput: number;
    latency: number;
    bandwidth: number;
    concurrency: number;
    queueLength: number;
    processingSpeed: number;
    efficiency: number;
}
export interface ResourceMetrics {
    cpu: CPUMetrics;
    memory: MemoryMetrics;
    storage: StorageMetrics;
    network: NetworkMetrics;
    energy: EnergyMetrics;
}
export interface CPUMetrics {
    usage: number;
    cores: number;
    temperature: number;
    frequency: number;
    load: number;
    idle: number;
    user: number;
    system: number;
}
export interface MemoryMetrics {
    total: number;
    used: number;
    available: number;
    usage: number;
    swap: number;
    cache: number;
    buffers: number;
    fragmentation: number;
}
export interface StorageMetrics {
    total: number;
    used: number;
    available: number;
    usage: number;
    readSpeed: number;
    writeSpeed: number;
    iops: number;
    latency: number;
}
export interface NetworkMetrics {
    bandwidth: number;
    latency: number;
    packetLoss: number;
    connections: number;
    throughput: number;
    errors: number;
    retransmissions: number;
}
export interface EnergyMetrics {
    consumption: number;
    efficiency: number;
    temperature: number;
    powerState: string;
    batteryLevel: number;
    charging: boolean;
}
export interface QualityMetrics {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    confidence: number;
    reliability: number;
    consistency: number;
    completeness: number;
}
export interface EfficiencyMetrics {
    resourceUtilization: number;
    energyEfficiency: number;
    timeEfficiency: number;
    costEfficiency: number;
    optimizationLevel: number;
    wasteReduction: number;
    productivity: number;
}
export interface ReliabilityMetrics {
    uptime: number;
    availability: number;
    faultTolerance: number;
    errorRate: number;
    meanTimeBetweenFailures: number;
    meanTimeToRecovery: number;
    redundancy: number;
}
export interface SecurityMetrics {
    threatLevel: number;
    vulnerabilityCount: number;
    securityScore: number;
    authenticationSuccess: number;
    authorizationSuccess: number;
    encryptionStrength: number;
    auditLogs: number;
    incidents: SecurityIncident[];
}
export interface SecurityIncident {
    id: string;
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    timestamp: number;
    resolved: boolean;
    impact: number;
}
export interface MonitoringMetrics {
    activeMonitors: number;
    alertCount: number;
    healthScore: number;
    coverage: number;
    responsiveness: number;
    accuracy: number;
    falsePositives: number;
    falseNegatives: number;
}
export interface CommunicationModel extends BaseModel {
    type: 'internal' | 'external' | 'network' | 'service';
    protocol: string;
    format: string;
    encoding: string;
    compression: boolean;
    encryption: boolean;
    authentication: boolean;
    messages: MessageModel[];
    channels: ChannelModel[];
    routing: RoutingModel;
}
export interface MessageModel extends BaseModel {
    type: 'request' | 'response' | 'notification' | 'command' | 'data' | 'error';
    sender: string;
    receiver: string;
    content: any;
    headers: Map<string, string>;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
    timestamp: number;
    deliveryTime: number;
    size: number;
    metadata: Map<string, any>;
}
export interface ChannelModel {
    id: string;
    type: string;
    status: 'active' | 'inactive' | 'error';
    capacity: number;
    usage: number;
    latency: number;
    reliability: number;
    security: ChannelSecurity;
}
export interface ChannelSecurity {
    encrypted: boolean;
    authenticated: boolean;
    authorized: boolean;
    integrity: boolean;
    confidentiality: boolean;
    availability: boolean;
}
export interface RoutingModel {
    strategy: string;
    rules: RoutingRule[];
    efficiency: number;
    loadBalancing: boolean;
    failover: boolean;
    redundancy: number;
}
export interface RoutingRule {
    id: string;
    condition: string;
    action: string;
    priority: number;
    enabled: boolean;
}
export interface LearningModel extends BaseModel {
    type: 'supervised' | 'unsupervised' | 'reinforcement' | 'meta' | 'transfer' | 'active' | 'online';
    algorithms: LearningAlgorithm[];
    datasets: DatasetModel[];
    models: ModelModel[];
    performance: LearningPerformance;
    insights: LearningInsight[];
    adaptations: LearningAdaptation[];
}
export interface LearningAlgorithm {
    id: string;
    name: string;
    type: string;
    parameters: Map<string, any>;
    performance: Map<string, number>;
    status: 'active' | 'inactive' | 'training' | 'evaluating';
    version: string;
}
export interface DatasetModel {
    id: string;
    name: string;
    type: string;
    size: number;
    features: string[];
    samples: any[];
    quality: number;
    balance: number;
    diversity: number;
    metadata: Map<string, any>;
}
export interface ModelModel {
    id: string;
    name: string;
    type: string;
    architecture: any;
    parameters: Map<string, any>;
    weights: Tensor;
    performance: Map<string, number>;
    version: string;
    status: 'training' | 'trained' | 'evaluating' | 'deployed';
}
export interface LearningPerformance {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    loss: number;
    convergence: number;
    generalization: number;
    overfitting: number;
}
export interface LearningInsight {
    id: string;
    type: string;
    content: string;
    confidence: number;
    implications: string[];
    timestamp: number;
}
export interface LearningAdaptation {
    id: string;
    type: string;
    description: string;
    impact: number;
    timestamp: number;
    success: boolean;
}
export interface ReasoningModel extends BaseModel {
    type: 'deductive' | 'inductive' | 'abductive' | 'analogical' | 'creative' | 'meta';
    logicSystems: LogicSystemModel[];
    inferenceEngines: InferenceEngineModel[];
    decisionEngines: DecisionEngineModel[];
    problemSolvers: ProblemSolverModel[];
    performance: ReasoningPerformance;
    insights: ReasoningInsight[];
    strategies: ReasoningStrategy[];
}
export interface LogicSystemModel {
    id: string;
    name: string;
    type: 'classical' | 'fuzzy' | 'probabilistic' | 'modal' | 'temporal' | 'quantum';
    rules: LogicRule[];
    axioms: any[];
    theorems: any[];
    performance: Map<string, number>;
}
export interface LogicRule {
    id: string;
    name: string;
    condition: string;
    conclusion: string;
    confidence: number;
    applicability: number;
}
export interface InferenceEngineModel {
    id: string;
    name: string;
    type: string;
    methods: string[];
    strategies: string[];
    performance: Map<string, number>;
    efficiency: number;
}
export interface DecisionEngineModel {
    id: string;
    name: string;
    type: string;
    criteria: string[];
    strategies: string[];
    performance: Map<string, number>;
    accuracy: number;
}
export interface ProblemSolverModel {
    id: string;
    name: string;
    type: string;
    strategies: string[];
    heuristics: string[];
    performance: Map<string, number>;
    successRate: number;
}
export interface ReasoningPerformance {
    accuracy: number;
    speed: number;
    efficiency: number;
    consistency: number;
    creativity: number;
    adaptability: number;
    reliability: number;
}
export interface ReasoningInsight {
    id: string;
    type: string;
    content: string;
    confidence: number;
    implications: string[];
    timestamp: number;
}
export interface ReasoningStrategy {
    id: string;
    name: string;
    type: string;
    description: string;
    effectiveness: number;
    efficiency: number;
    applicability: number;
}
export interface CreativityModel extends BaseModel {
    type: 'divergent' | 'convergent' | 'lateral' | 'associative' | 'transformational' | 'combinatorial';
    techniques: CreativityTechnique[];
    constraints: CreativityConstraint[];
    evaluations: CreativityEvaluation[];
    outputs: CreativeOutput[];
    performance: CreativityPerformance;
    insights: CreativityInsight[];
}
export interface CreativityTechnique {
    id: string;
    name: string;
    type: string;
    description: string;
    parameters: Map<string, any>;
    effectiveness: number;
    applicability: number;
}
export interface CreativityConstraint {
    id: string;
    type: string;
    description: string;
    strength: number;
    flexibility: number;
    impact: number;
}
export interface CreativityEvaluation {
    id: string;
    criteria: string[];
    scores: Map<string, number>;
    overall: number;
    feedback: string[];
    timestamp: number;
}
export interface CreativeOutput {
    id: string;
    type: string;
    content: any;
    quality: number;
    originality: number;
    usefulness: number;
    feasibility: number;
    timestamp: number;
}
export interface CreativityPerformance {
    originality: number;
    fluency: number;
    flexibility: number;
    elaboration: number;
    quality: number;
    usefulness: number;
    feasibility: number;
}
export interface CreativityInsight {
    id: string;
    type: string;
    content: string;
    confidence: number;
    implications: string[];
    timestamp: number;
}
//# sourceMappingURL=DataModels.d.ts.map