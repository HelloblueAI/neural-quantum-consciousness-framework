export interface SystemConfig {
    system: {
        name: string;
        version: string;
        environment: 'development' | 'staging' | 'production';
        debug: boolean;
        logLevel: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
        maxConcurrency: number;
        timeout: number;
    };
    agi: {
        reasoningEnabled: boolean;
        learningEnabled: boolean;
        creativityEnabled: boolean;
        consciousnessEnabled: boolean;
        multiAgentEnabled: boolean;
        maxAgents: number;
        agentTimeout: number;
        reasoningTimeout: number;
        learningTimeout: number;
    };
    memory: {
        shortTermCapacity: number;
        longTermCapacity: number;
        workingMemoryCapacity: number;
        consolidationThreshold: number;
        decayRate: number;
        optimizationInterval: number;
    };
    performance: {
        maxResponseTime: number;
        maxThroughput: number;
        resourceLimit: number;
        cacheEnabled: boolean;
        cacheSize: number;
        cacheTTL: number;
    };
    security: {
        authenticationEnabled: boolean;
        authorizationEnabled: boolean;
        encryptionEnabled: boolean;
        rateLimitEnabled: boolean;
        maxRequestsPerMinute: number;
        allowedOrigins: string[];
        apiKeyRequired: boolean;
    };
    services: {
        openai: {
            enabled: boolean;
            apiKey: string;
            model: string;
            maxTokens: number;
            temperature: number;
        };
        anthropic: {
            enabled: boolean;
            apiKey: string;
            model: string;
            maxTokens: number;
        };
        database: {
            enabled: boolean;
            type: 'postgres' | 'mysql' | 'sqlite' | 'mongodb';
            url: string;
            username: string;
            password: string;
            poolSize: number;
        };
        redis: {
            enabled: boolean;
            url: string;
            password: string;
            db: number;
        };
    };
    features: {
        advancedReasoning: boolean;
        metaLearning: boolean;
        creativeProblemSolving: boolean;
        consciousnessSimulation: boolean;
        multiModalProcessing: boolean;
        realTimeLearning: boolean;
        adaptiveBehavior: boolean;
        selfImprovement: boolean;
    };
    monitoring: {
        enabled: boolean;
        metricsEnabled: boolean;
        healthCheckEnabled: boolean;
        alertingEnabled: boolean;
        logRetention: number;
        performanceTracking: boolean;
    };
}
export interface ConfigValidation {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}
export interface ConfigUpdate {
    path: string[];
    oldValue: any;
    newValue: any;
    timestamp: number;
    source: string;
}
export declare class ConfigurationManager {
    private config;
    private configHistory;
    private validationRules;
    private watchers;
    private logger;
    constructor();
    private createDefaultConfig;
    private initializeValidationRules;
    private loadConfiguration;
    private loadFromEnvironment;
    private loadFromFile;
    getConfiguration(): SystemConfig;
    getValue(path: string): any;
    setValue(path: string, value: any, source?: string): boolean;
    validateConfiguration(): ConfigValidation;
    watchConfiguration(path: string, callback: (config: SystemConfig) => void): void;
    unwatchConfiguration(path: string, callback: (config: SystemConfig) => void): void;
    private notifyWatchers;
    getConfigurationHistory(): ConfigUpdate[];
    resetConfiguration(): void;
    exportConfiguration(): string;
    importConfiguration(configJson: string): boolean;
    getFeatureFlags(): Record<string, boolean>;
    isFeatureEnabled(feature: keyof SystemConfig['features']): boolean;
    enableFeature(feature: keyof SystemConfig['features']): void;
    disableFeature(feature: keyof SystemConfig['features']): void;
    getServiceConfig(serviceName: keyof SystemConfig['services']): any;
    isServiceEnabled(serviceName: keyof SystemConfig['services']): boolean;
    getEnvironment(): string;
    isDevelopment(): boolean;
    isProduction(): boolean;
    isDebugEnabled(): boolean;
    getLogLevel(): string;
    getPerformanceConfig(): SystemConfig['performance'];
    getSecurityConfig(): SystemConfig['security'];
    getMemoryConfig(): SystemConfig['memory'];
    getAGIConfig(): SystemConfig['agi'];
    getMonitoringConfig(): SystemConfig['monitoring'];
}
//# sourceMappingURL=ConfigurationManager.d.ts.map