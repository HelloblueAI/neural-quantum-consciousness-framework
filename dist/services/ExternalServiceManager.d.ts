export interface ExternalService {
    id: string;
    name: string;
    type: 'api' | 'database' | 'cloud' | 'file_system' | 'network' | 'hardware';
    endpoint: string;
    authentication: ServiceAuthentication;
    capabilities: string[];
    status: 'active' | 'inactive' | 'error' | 'maintenance';
    performance: Map<string, number>;
    metadata: Map<string, any>;
}
export interface ServiceAuthentication {
    type: 'api_key' | 'oauth' | 'basic' | 'certificate' | 'none';
    credentials: Map<string, string>;
    expiresAt?: number;
    refreshToken?: string;
}
export interface ServiceRequest {
    id: string;
    serviceId: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    endpoint: string;
    headers: Map<string, string>;
    body?: any;
    timeout: number;
    retryCount: number;
    priority: 'low' | 'medium' | 'high' | 'critical';
    timestamp: number;
}
export interface ServiceResponse {
    id: string;
    requestId: string;
    statusCode: number;
    headers: Map<string, string>;
    body: any;
    responseTime: number;
    success: boolean;
    error?: string;
    timestamp: number;
}
export interface ServiceConnection {
    id: string;
    serviceId: string;
    connectionType: 'http' | 'websocket' | 'grpc' | 'tcp' | 'udp';
    status: 'connected' | 'disconnected' | 'connecting' | 'error';
    lastHeartbeat: number;
    latency: number;
    throughput: number;
    metadata: Map<string, any>;
}
export interface ServiceMonitor {
    id: string;
    serviceId: string;
    metrics: Map<string, number>;
    alerts: string[];
    healthStatus: 'healthy' | 'warning' | 'critical';
    lastCheck: number;
    uptime: number;
}
export declare class ExternalServiceManager {
    private services;
    private connections;
    private monitors;
    private requests;
    private responses;
    private logger;
    private performanceMetrics;
    constructor();
    private initializeDefaultServices;
    addService(service: ExternalService): void;
    removeService(serviceId: string): boolean;
    connectToService(serviceId: string): Promise<ServiceConnection | null>;
    disconnectService(serviceId: string): boolean;
    makeRequest(request: ServiceRequest): Promise<ServiceResponse | null>;
    batchRequest(requests: ServiceRequest[]): Promise<ServiceResponse[]>;
    getServiceStatus(serviceId: string): ExternalService | null;
    getAllServices(): ExternalService[];
    getServiceConnections(serviceId?: string): ServiceConnection[];
    getServiceMonitor(serviceId: string): ServiceMonitor | null;
    getAllMonitors(): ServiceMonitor[];
    updateServiceAuthentication(serviceId: string, authentication: ServiceAuthentication): boolean;
    updateServiceCapabilities(serviceId: string, capabilities: string[]): boolean;
    healthCheck(serviceId: string): Promise<boolean>;
    performMaintenance(serviceId: string): Promise<boolean>;
    getPerformanceMetrics(): Record<string, any>;
    private determineConnectionType;
    private establishConnection;
    private executeRequest;
    private generateResponseBody;
    private calculateThroughput;
    private updateServicePerformance;
    private updateRequestMetrics;
    private executeMaintenanceTasks;
    private calculateAverageResponseTime;
    private calculateErrorRate;
    private calculateServiceHealth;
    clearServiceData(): void;
}
//# sourceMappingURL=ExternalServiceManager.d.ts.map