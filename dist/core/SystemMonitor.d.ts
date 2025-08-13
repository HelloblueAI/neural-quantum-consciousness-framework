import { PerformanceMonitor } from '@/core/PerformanceMonitor';
import { SecurityManager } from '@/core/SecurityManager';
import { ErrorHandler } from '@/core/ErrorHandler';
import { ConfigurationManager } from '@/config/ConfigurationManager';
import { MemoryManager } from '@/core/MemoryManager';
import { ConsciousnessSimulator } from '@/core/ConsciousnessSimulator';
import { ExternalServiceManager } from '@/services/ExternalServiceManager';
export interface SystemHealth {
    overall: 'healthy' | 'warning' | 'critical';
    components: {
        performance: 'healthy' | 'warning' | 'critical';
        security: 'healthy' | 'warning' | 'critical';
        memory: 'healthy' | 'warning' | 'critical';
        consciousness: 'healthy' | 'warning' | 'critical';
        externalServices: 'healthy' | 'warning' | 'critical';
        configuration: 'healthy' | 'warning' | 'critical';
    };
    metrics: {
        cpuUsage: number;
        memoryUsage: number;
        responseTime: number;
        errorRate: number;
        securityThreats: number;
        activeConnections: number;
    };
    alerts: SystemAlert[];
    timestamp: number;
}
export interface SystemAlert {
    id: string;
    level: 'info' | 'warning' | 'error' | 'critical';
    component: string;
    message: string;
    timestamp: number;
    resolved: boolean;
    metadata: Map<string, any>;
}
export interface SystemDiagnostic {
    id: string;
    component: string;
    status: 'pass' | 'fail' | 'warning';
    details: string;
    recommendations: string[];
    timestamp: number;
}
export interface PerformanceMetrics {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    networkLatency: number;
    responseTime: number;
    throughput: number;
    errorRate: number;
    uptime: number;
}
export interface SecurityMetrics {
    threatLevel: 'low' | 'medium' | 'high' | 'critical';
    activeThreats: number;
    blockedAttempts: number;
    vulnerabilities: number;
    lastScan: number;
    securityScore: number;
}
export declare class SystemMonitor {
    private logger;
    private performanceMonitor;
    private securityManager;
    private errorHandler;
    private configManager;
    private memoryManager;
    private consciousnessSimulator;
    private externalServiceManager;
    private healthHistory;
    private activeAlerts;
    private diagnostics;
    private monitoringInterval;
    private isMonitoring;
    private readonly MAX_HEALTH_HISTORY;
    private readonly MONITORING_INTERVAL;
    private readonly ALERT_THRESHOLDS;
    constructor(performanceMonitor: PerformanceMonitor, securityManager: SecurityManager, errorHandler: ErrorHandler, configManager: ConfigurationManager, memoryManager: MemoryManager, consciousnessSimulator: ConsciousnessSimulator, externalServiceManager: ExternalServiceManager);
    private initializeMonitoring;
    startMonitoring(): void;
    stopMonitoring(): void;
    getSystemHealth(): SystemHealth;
    private evaluateComponentHealth;
    private evaluatePerformanceHealth;
    private evaluateSecurityHealth;
    private evaluateMemoryHealth;
    private evaluateConsciousnessHealth;
    private evaluateExternalServicesHealth;
    private evaluateConfigurationHealth;
    private calculateOverallHealth;
    private updateHealthHistory;
    performHealthCheck(): void;
    private checkForAlerts;
    private createAlert;
    private updateDiagnostics;
    private generateRecommendations;
    private triggerEmergencyResponse;
    runInitialDiagnostics(): SystemDiagnostic[];
    private diagnoseComponent;
    private diagnoseSystemConnectivity;
    private diagnoseResourceAvailability;
    getHealthHistory(): SystemHealth[];
    getActiveAlerts(): SystemAlert[];
    getDiagnostics(): SystemDiagnostic[];
    resolveAlert(alertId: string): boolean;
    getMonitoringStatus(): {
        isActive: boolean;
        interval: number;
        lastCheck: number;
    };
    updateAlertThresholds(thresholds: Partial<typeof this.ALERT_THRESHOLDS>): void;
    getSystemMetrics(): {
        performance: PerformanceMetrics;
        security: SecurityMetrics;
        health: SystemHealth;
    };
}
//# sourceMappingURL=SystemMonitor.d.ts.map