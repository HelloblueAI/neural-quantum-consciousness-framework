import { Logger } from '../utils/Logger';
export class SystemMonitor {
    logger;
    performanceMonitor;
    securityManager;
    errorHandler;
    configManager;
    memoryManager;
    consciousnessSimulator;
    externalServiceManager;
    healthHistory = [];
    activeAlerts = new Map();
    diagnostics = new Map();
    monitoringInterval = null;
    isMonitoring = false;
    MAX_HEALTH_HISTORY = 1000;
    MONITORING_INTERVAL = 5000; // 5 seconds
    ALERT_THRESHOLDS = {
        cpuUsage: 80,
        memoryUsage: 85,
        errorRate: 5,
        responseTime: 1000,
        securityThreats: 10
    };
    constructor(performanceMonitor, securityManager, errorHandler, configManager, memoryManager, consciousnessSimulator, externalServiceManager) {
        this.logger = new Logger('SystemMonitor');
        this.performanceMonitor = performanceMonitor;
        this.securityManager = securityManager;
        this.errorHandler = errorHandler;
        this.configManager = configManager;
        this.memoryManager = memoryManager;
        this.consciousnessSimulator = consciousnessSimulator;
        this.externalServiceManager = externalServiceManager;
        this.initializeMonitoring();
    }
    initializeMonitoring() {
        this.logger.info('Initializing system monitoring');
        this.runInitialDiagnostics();
        this.startMonitoring();
    }
    startMonitoring() {
        if (this.isMonitoring) {
            this.logger.warn('Monitoring already active');
            return;
        }
        this.isMonitoring = true;
        this.monitoringInterval = setInterval(() => {
            this.performHealthCheck();
        }, this.MONITORING_INTERVAL);
        this.logger.info('System monitoring started');
    }
    stopMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
        this.isMonitoring = false;
        this.logger.info('System monitoring stopped');
    }
    getSystemHealth() {
        const performanceMetrics = this.performanceMonitor.getMetrics();
        const securityMetrics = this.securityManager.getSecurityMetrics();
        const memoryState = this.memoryManager.getMemoryState();
        const consciousnessState = this.consciousnessSimulator.getConsciousnessState();
        const externalServices = this.externalServiceManager.getPerformanceMetrics();
        const metrics = {
            cpuUsage: performanceMetrics.cpuUsage || 0,
            memoryUsage: performanceMetrics.memoryUsage || 0,
            responseTime: performanceMetrics.responseTime || 0,
            errorRate: performanceMetrics.errorRate || 0,
            securityThreats: securityMetrics.activeThreats || 0,
            activeConnections: performanceMetrics.activeConnections || 0
        };
        const components = {
            performance: this.evaluateComponentHealth('performance', metrics),
            security: this.evaluateComponentHealth('security', metrics),
            memory: this.evaluateComponentHealth('memory', memoryState),
            consciousness: this.evaluateComponentHealth('consciousness', consciousnessState),
            externalServices: this.evaluateComponentHealth('externalServices', externalServices),
            configuration: this.evaluateComponentHealth('configuration', this.configManager.getConfiguration())
        };
        const overall = this.calculateOverallHealth(components, metrics);
        const alerts = Array.from(this.activeAlerts.values()).filter(alert => !alert.resolved);
        const health = {
            overall,
            components,
            metrics,
            alerts,
            timestamp: Date.now()
        };
        this.updateHealthHistory(health);
        return health;
    }
    evaluateComponentHealth(component, data) {
        switch (component) {
            case 'performance':
                return this.evaluatePerformanceHealth(data);
            case 'security':
                return this.evaluateSecurityHealth(data);
            case 'memory':
                return this.evaluateMemoryHealth(data);
            case 'consciousness':
                return this.evaluateConsciousnessHealth(data);
            case 'externalServices':
                return this.evaluateExternalServicesHealth(data);
            case 'configuration':
                return this.evaluateConfigurationHealth(data);
            default:
                return 'healthy';
        }
    }
    evaluatePerformanceHealth(metrics) {
        if (metrics.cpuUsage > this.ALERT_THRESHOLDS.cpuUsage ||
            metrics.memoryUsage > this.ALERT_THRESHOLDS.memoryUsage ||
            metrics.errorRate > this.ALERT_THRESHOLDS.errorRate) {
            return 'critical';
        }
        if (metrics.cpuUsage > this.ALERT_THRESHOLDS.cpuUsage * 0.7 ||
            metrics.memoryUsage > this.ALERT_THRESHOLDS.memoryUsage * 0.7) {
            return 'warning';
        }
        return 'healthy';
    }
    evaluateSecurityHealth(metrics) {
        if (metrics.threatLevel === 'critical' || metrics.activeThreats > this.ALERT_THRESHOLDS.securityThreats) {
            return 'critical';
        }
        if (metrics.threatLevel === 'high' || metrics.activeThreats > this.ALERT_THRESHOLDS.securityThreats * 0.5) {
            return 'warning';
        }
        return 'healthy';
    }
    evaluateMemoryHealth(memoryState) {
        const usage = memoryState.totalMemories / (memoryState.totalMemories + 1000);
        if (usage > 0.9)
            return 'critical';
        if (usage > 0.7)
            return 'warning';
        return 'healthy';
    }
    evaluateConsciousnessHealth(consciousnessState) {
        const awarenessLevel = consciousnessState.awareness?.level || 0.5;
        const selfAwareness = consciousnessState.selfModel?.capabilities?.length > 0 ? 0.8 : 0.3;
        if (awarenessLevel < 0.3 || selfAwareness < 0.3) {
            return 'critical';
        }
        if (awarenessLevel < 0.6 || selfAwareness < 0.6) {
            return 'warning';
        }
        return 'healthy';
    }
    evaluateExternalServicesHealth(services) {
        const healthyServices = services.healthyServices || 0;
        const totalServices = services.totalServices || 1;
        const healthRatio = healthyServices / totalServices;
        if (healthRatio < 0.5)
            return 'critical';
        if (healthRatio < 0.8)
            return 'warning';
        return 'healthy';
    }
    evaluateConfigurationHealth(_config) {
        const validation = this.configManager.validateConfiguration();
        if (!validation.isValid)
            return 'critical';
        if (validation.warnings.length > 0)
            return 'warning';
        return 'healthy';
    }
    calculateOverallHealth(components, _metrics) {
        const criticalCount = Object.values(components).filter(c => c === 'critical').length;
        const warningCount = Object.values(components).filter(c => c === 'warning').length;
        if (criticalCount > 0)
            return 'critical';
        if (warningCount > 2)
            return 'warning';
        return 'healthy';
    }
    updateHealthHistory(health) {
        this.healthHistory.push(health);
        if (this.healthHistory.length > this.MAX_HEALTH_HISTORY) {
            this.healthHistory.shift();
        }
    }
    performHealthCheck() {
        try {
            const health = this.getSystemHealth();
            this.checkForAlerts(health);
            this.updateDiagnostics(health);
            if (health.overall === 'critical') {
                this.logger.error('Critical system health detected', new Error('Critical system health detected'));
                this.triggerEmergencyResponse(health);
            }
            else if (health.overall === 'warning') {
                this.logger.warn('Warning system health detected', { health });
            }
        }
        catch (error) {
            this.logger.error('Error during health check', error);
            this.errorHandler.handleError(error);
        }
    }
    checkForAlerts(health) {
        // Check performance alerts
        if (health.metrics.cpuUsage > this.ALERT_THRESHOLDS.cpuUsage) {
            this.createAlert('high_cpu_usage', 'error', 'performance', `CPU usage is ${health.metrics.cpuUsage}%`, { cpuUsage: health.metrics.cpuUsage });
        }
        if (health.metrics.memoryUsage > this.ALERT_THRESHOLDS.memoryUsage) {
            this.createAlert('high_memory_usage', 'error', 'performance', `Memory usage is ${health.metrics.memoryUsage}%`, { memoryUsage: health.metrics.memoryUsage });
        }
        if (health.metrics.errorRate > this.ALERT_THRESHOLDS.errorRate) {
            this.createAlert('high_error_rate', 'error', 'performance', `Error rate is ${health.metrics.errorRate}%`, { errorRate: health.metrics.errorRate });
        }
        if (health.metrics.securityThreats > this.ALERT_THRESHOLDS.securityThreats) {
            this.createAlert('security_threats', 'critical', 'security', `${health.metrics.securityThreats} active security threats detected`, { threatCount: health.metrics.securityThreats });
        }
        // Check component-specific alerts
        Object.entries(health.components).forEach(([component, status]) => {
            if (status === 'critical') {
                this.createAlert(`${component}_critical`, 'critical', component, `${component} component is in critical state`, { component, status });
            }
            else if (status === 'warning') {
                this.createAlert(`${component}_warning`, 'warning', component, `${component} component is in warning state`, { component, status });
            }
        });
    }
    createAlert(id, level, component, message, metadata = {}) {
        const alert = {
            id,
            level,
            component,
            message,
            timestamp: Date.now(),
            resolved: false,
            metadata: new Map(Object.entries(metadata))
        };
        this.activeAlerts.set(id, alert);
        this.logger.warn(`Alert created: ${message}`, { alert });
    }
    updateDiagnostics(health) {
        const diagnosticId = `diagnostic_${Date.now()}`;
        const diagnostic = {
            id: diagnosticId,
            component: 'system_overall',
            status: health.overall === 'healthy' ? 'pass' : health.overall === 'warning' ? 'warning' : 'fail',
            details: `System health: ${health.overall}`,
            recommendations: this.generateRecommendations(health),
            timestamp: Date.now()
        };
        this.diagnostics.set(diagnosticId, diagnostic);
    }
    generateRecommendations(health) {
        const recommendations = [];
        if (health.metrics.cpuUsage > this.ALERT_THRESHOLDS.cpuUsage) {
            recommendations.push('Consider scaling up CPU resources or optimizing workload');
        }
        if (health.metrics.memoryUsage > this.ALERT_THRESHOLDS.memoryUsage) {
            recommendations.push('Consider increasing memory allocation or implementing memory optimization');
        }
        if (health.metrics.errorRate > this.ALERT_THRESHOLDS.errorRate) {
            recommendations.push('Investigate error sources and implement error handling improvements');
        }
        if (health.metrics.securityThreats > 0) {
            recommendations.push('Review security configurations and implement additional security measures');
        }
        if (health.components.memory === 'critical') {
            recommendations.push('Perform memory cleanup and optimization');
        }
        if (health.components.externalServices === 'critical') {
            recommendations.push('Check external service connectivity and implement fallback mechanisms');
        }
        return recommendations;
    }
    triggerEmergencyResponse(_health) {
        this.logger.error('Emergency response triggered', new Error('Emergency response triggered'));
        // Implement emergency response logic
        // This could include:
        // - Scaling down non-critical services
        // - Activating backup systems
        // - Sending emergency notifications
        // - Initiating automatic recovery procedures
    }
    runInitialDiagnostics() {
        this.logger.info('Running initial system diagnostics');
        const diagnostics = [];
        // Component diagnostics
        diagnostics.push(this.diagnoseComponent('performance', this.performanceMonitor));
        diagnostics.push(this.diagnoseComponent('security', this.securityManager));
        diagnostics.push(this.diagnoseComponent('memory', this.memoryManager));
        diagnostics.push(this.diagnoseComponent('consciousness', this.consciousnessSimulator));
        diagnostics.push(this.diagnoseComponent('externalServices', this.externalServiceManager));
        diagnostics.push(this.diagnoseComponent('configuration', this.configManager));
        // System-wide diagnostics
        diagnostics.push(this.diagnoseSystemConnectivity());
        diagnostics.push(this.diagnoseResourceAvailability());
        diagnostics.forEach(diagnostic => {
            this.diagnostics.set(diagnostic.id, diagnostic);
        });
        this.logger.info('Initial diagnostics completed', {
            totalDiagnostics: diagnostics.length,
            passedDiagnostics: diagnostics.filter(d => d.status === 'pass').length
        });
        return diagnostics;
    }
    diagnoseComponent(componentName, component) {
        try {
            // Basic component health check
            const isHealthy = component && typeof component === 'object';
            return {
                id: `diagnostic_${componentName}_${Date.now()}`,
                component: componentName,
                status: isHealthy ? 'pass' : 'fail',
                details: isHealthy ? `${componentName} component is healthy` : `${componentName} component is not responding`,
                recommendations: isHealthy ? [] : [`Check ${componentName} component initialization`],
                timestamp: Date.now()
            };
        }
        catch (error) {
            return {
                id: `diagnostic_${componentName}_${Date.now()}`,
                component: componentName,
                status: 'fail',
                details: `Error diagnosing ${componentName}: ${error}`,
                recommendations: [`Investigate ${componentName} component errors`],
                timestamp: Date.now()
            };
        }
    }
    diagnoseSystemConnectivity() {
        try {
            // Check basic system connectivity
            const isConnected = true; // Placeholder for actual connectivity check
            return {
                id: `diagnostic_connectivity_${Date.now()}`,
                component: 'system_connectivity',
                status: isConnected ? 'pass' : 'fail',
                details: isConnected ? 'System connectivity is healthy' : 'System connectivity issues detected',
                recommendations: isConnected ? [] : ['Check network connectivity and firewall settings'],
                timestamp: Date.now()
            };
        }
        catch (error) {
            return {
                id: `diagnostic_connectivity_${Date.now()}`,
                component: 'system_connectivity',
                status: 'fail',
                details: `Error checking connectivity: ${error}`,
                recommendations: ['Investigate network configuration'],
                timestamp: Date.now()
            };
        }
    }
    diagnoseResourceAvailability() {
        try {
            // Check resource availability
            const availableMemory = process.memoryUsage();
            const isHealthy = availableMemory.heapUsed < availableMemory.heapTotal * 0.9;
            return {
                id: `diagnostic_resources_${Date.now()}`,
                component: 'resource_availability',
                status: isHealthy ? 'pass' : 'warning',
                details: `Memory usage: ${Math.round(availableMemory.heapUsed / 1024 / 1024)}MB / ${Math.round(availableMemory.heapTotal / 1024 / 1024)}MB`,
                recommendations: isHealthy ? [] : ['Consider memory optimization or allocation increase'],
                timestamp: Date.now()
            };
        }
        catch (error) {
            return {
                id: `diagnostic_resources_${Date.now()}`,
                component: 'resource_availability',
                status: 'fail',
                details: `Error checking resources: ${error}`,
                recommendations: ['Investigate system resource monitoring'],
                timestamp: Date.now()
            };
        }
    }
    getHealthHistory() {
        return [...this.healthHistory];
    }
    getActiveAlerts() {
        return Array.from(this.activeAlerts.values()).filter(alert => !alert.resolved);
    }
    getDiagnostics() {
        return Array.from(this.diagnostics.values());
    }
    resolveAlert(alertId) {
        const alert = this.activeAlerts.get(alertId);
        if (alert) {
            alert.resolved = true;
            this.logger.info(`Alert resolved: ${alert.message}`, { alertId });
            return true;
        }
        return false;
    }
    getMonitoringStatus() {
        return {
            isActive: this.isMonitoring,
            interval: this.MONITORING_INTERVAL,
            lastCheck: this.healthHistory.length > 0 ? this.healthHistory[this.healthHistory.length - 1]?.timestamp || 0 : 0
        };
    }
    updateAlertThresholds(thresholds) {
        Object.assign(this.ALERT_THRESHOLDS, thresholds);
        this.logger.info('Alert thresholds updated', { thresholds });
    }
    getSystemMetrics() {
        return {
            performance: this.performanceMonitor.getMetrics(),
            security: this.securityManager.getSecurityMetrics(),
            health: this.getSystemHealth()
        };
    }
}
//# sourceMappingURL=SystemMonitor.js.map