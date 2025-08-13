import express, { Request, Response, NextFunction } from 'express';
import { AGISystem } from '@/core/AGISystem';
import { ConfigurationManager } from '@/config/ConfigurationManager';
export interface APIEndpoint {
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    handler: (req: Request, res: Response) => Promise<void>;
    middleware?: ((req: Request, res: Response, next: NextFunction) => void)[];
    description: string;
    rateLimit?: number;
}
export interface APIResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    timestamp: number;
    requestId: string;
}
export interface SystemStatus {
    status: 'running' | 'stopped' | 'error' | 'maintenance';
    uptime: number;
    version: string;
    environment: string;
    features: Record<string, boolean>;
    performance: Record<string, number>;
    agents: {
        total: number;
        active: number;
        types: Record<string, number>;
    };
    memory: {
        shortTerm: number;
        longTerm: number;
        working: number;
        total: number;
    };
}
export declare class APIServer {
    private app;
    private agiSystem;
    private configManager;
    private logger;
    private server;
    private port;
    private readonly DEFAULT_PORT;
    private readonly MAX_REQUEST_SIZE;
    private readonly RATE_LIMIT_WINDOW;
    private readonly RATE_LIMIT_MAX;
    constructor(agiSystem: AGISystem, configManager: ConfigurationManager);
    private setupMiddleware;
    private setupRoutes;
    private setupErrorHandling;
    private requestLogger;
    private authenticateRequest;
    start(): Promise<void>;
    stop(): Promise<void>;
    private healthCheck;
    private getSystemStatus;
    private reason;
    private learn;
    private create;
    private processInput;
    private getAgents;
    private createAgent;
    private getAgent;
    private updateAgent;
    private deleteAgent;
    private getMemoryStatus;
    private consolidateMemory;
    private optimizeMemory;
    private clearMemory;
    private getConfiguration;
    private updateConfiguration;
    private resetConfiguration;
    private getFeatureFlags;
    private updateFeatureFlag;
    private getPerformanceMetrics;
    private getMonitoringData;
    private getServices;
    private connectService;
    private disconnectService;
    private checkServiceHealth;
    private getConsciousnessState;
    private generateInsight;
    private getKnowledge;
    private addKnowledge;
    private removeKnowledge;
    private v1SystemHealth;
    private v1SystemStatus;
    private v1SystemPerformance;
    private v1SystemSecurity;
    private v1ReasoningProcess;
    private v1LearningExperience;
    private v1LearningTransfer;
    private v1LearningState;
    private v1MemoryStore;
    private v1MemoryConsolidate;
    private v1MemoryState;
    private v1MemoryRetrieve;
    private v1ConsciousnessState;
    private v1ConsciousnessUpdate;
    private v1ConsciousnessInsight;
    private v1AgentsCreate;
    private v1AgentsList;
    private v1AgentTask;
    private v1KnowledgeAdd;
    private v1KnowledgeRetrieve;
    private v1KnowledgeSearch;
    private v1ConfigGet;
    private v1ConfigUpdate;
    private v1ConfigValidate;
    private v1ServicesExternal;
    private v1ServiceStatus;
    private authenticateAPIKey;
    private handleNotFound;
    private handleError;
    getApp(): express.Application;
    isRunning(): boolean;
    getPort(): number;
    getStatus(): {
        isRunning: boolean;
        port: number;
        uptime: number;
    };
    getEndpoints(): APIEndpoint[];
}
//# sourceMappingURL=APIServer.d.ts.map