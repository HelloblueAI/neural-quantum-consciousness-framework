import express, { Request, Response, NextFunction } from 'express';
import { AGISystem } from '../core/AGISystem';
import { ConfigurationManager } from '../config/ConfigurationManager';
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
    private handleNotFound;
    private handleError;
    getApp(): express.Application;
    isRunning(): boolean;
    getPort(): number;
}
//# sourceMappingURL=APIServer.d.ts.map