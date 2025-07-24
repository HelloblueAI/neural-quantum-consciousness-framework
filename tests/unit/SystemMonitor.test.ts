import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SystemMonitor } from '@/core/SystemMonitor';
import { PerformanceMonitor } from '@/core/PerformanceMonitor';
import { SecurityManager } from '@/core/SecurityManager';
import { ErrorHandler } from '@/core/ErrorHandler';
import { ConfigurationManager } from '@/config/ConfigurationManager';
import { MemoryManager } from '@/core/MemoryManager';
import { ConsciousnessSimulator } from '@/core/ConsciousnessSimulator';
import { ExternalServiceManager } from '@/services/ExternalServiceManager';

// Mock all dependencies
vi.mock('@/core/PerformanceMonitor');
vi.mock('@/core/SecurityManager');
vi.mock('@/core/ErrorHandler');
vi.mock('@/config/ConfigurationManager');
vi.mock('@/core/MemoryManager');
vi.mock('@/core/ConsciousnessSimulator');
vi.mock('@/services/ExternalServiceManager');
vi.mock('@/utils/Logger');

describe('SystemMonitor', () => {
  let systemMonitor: SystemMonitor;
  let mockPerformanceMonitor: any;
  let mockSecurityManager: any;
  let mockErrorHandler: any;
  let mockConfigManager: any;
  let mockMemoryManager: any;
  let mockConsciousnessSimulator: any;
  let mockExternalServiceManager: any;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Create mock instances
    mockPerformanceMonitor = {
      getMetrics: vi.fn().mockReturnValue({
        cpuUsage: 50,
        memoryUsage: 60,
        responseTime: 200,
        errorRate: 2,
        activeConnections: 10
      })
    };

    mockSecurityManager = {
      getSecurityMetrics: vi.fn().mockReturnValue({
        threatLevel: 'low',
        activeThreats: 0,
        blockedAttempts: 5,
        vulnerabilities: 0,
        lastScan: Date.now(),
        securityScore: 95
      })
    };

    mockErrorHandler = {
      handleError: vi.fn()
    };

    mockConfigManager = {
      getConfiguration: vi.fn().mockReturnValue({
        system: { debug: false },
        agi: { enabled: true },
        memory: { capacity: 1000 },
        performance: { monitoring: true },
        security: { enabled: true },
        services: { external: true },
        features: { advanced: true },
        monitoring: { enabled: true }
      }),
      validateConfiguration: vi.fn().mockReturnValue({
        isValid: true,
        errors: [],
        warnings: []
      })
    };

    mockMemoryManager = {
      getMemoryState: vi.fn().mockReturnValue({
        totalMemories: 500,
        shortTermCount: 100,
        longTermCount: 300,
        workingCount: 50,
        episodicCount: 30,
        semanticCount: 20,
        proceduralCount: 0
      })
    };

    mockConsciousnessSimulator = {
      getConsciousnessState: vi.fn().mockReturnValue({
        awareness: 0.8,
        selfAwareness: 0.7,
        subjectiveExperience: { intensity: 0.6 },
        metaCognition: { active: true },
        thoughts: ['I am processing information'],
        emotions: { curiosity: 0.5 }
      })
    };

    mockExternalServiceManager = {
      getPerformanceMetrics: vi.fn().mockReturnValue({
        totalServices: 5,
        healthyServices: 5,
        unhealthyServices: 0,
        averageResponseTime: 150
      })
    };

    // Create SystemMonitor instance
    systemMonitor = new SystemMonitor(
      mockPerformanceMonitor as any,
      mockSecurityManager as any,
      mockErrorHandler as any,
      mockConfigManager as any,
      mockMemoryManager as any,
      mockConsciousnessSimulator as any,
      mockExternalServiceManager as any
    );
  });

  afterEach(() => {
    systemMonitor.stopMonitoring();
  });

  describe('Initialization', () => {
    it('should initialize with all required components', () => {
      expect(systemMonitor).toBeDefined();
      expect(mockPerformanceMonitor.getMetrics).toHaveBeenCalled();
      expect(mockSecurityManager.getSecurityMetrics).toHaveBeenCalled();
      expect(mockMemoryManager.getMemoryState).toHaveBeenCalled();
      expect(mockConsciousnessSimulator.getConsciousnessState).toHaveBeenCalled();
    });

    it('should run initial diagnostics', () => {
      const diagnostics = systemMonitor.getDiagnostics();
      expect(diagnostics.length).toBeGreaterThan(0);
      expect(diagnostics.every(d => d.id && d.component && d.status)).toBe(true);
    });

    it('should start monitoring automatically', () => {
      const status = systemMonitor.getMonitoringStatus();
      expect(status.isActive).toBe(true);
      expect(status.interval).toBe(5000);
    });
  });

  describe('System Health Assessment', () => {
    it('should return comprehensive system health', () => {
      const health = systemMonitor.getSystemHealth();
      
      expect(health).toBeDefined();
      expect(health.overall).toBeDefined();
      expect(health.components).toBeDefined();
      expect(health.metrics).toBeDefined();
      expect(health.alerts).toBeDefined();
      expect(health.timestamp).toBeDefined();
      
      expect(health.components.performance).toBeDefined();
      expect(health.components.security).toBeDefined();
      expect(health.components.memory).toBeDefined();
      expect(health.components.consciousness).toBeDefined();
      expect(health.components.externalServices).toBeDefined();
      expect(health.components.configuration).toBeDefined();
    });

    it('should evaluate healthy system correctly', () => {
      const health = systemMonitor.getSystemHealth();
      
      expect(health.overall).toBe('healthy');
      expect(health.components.performance).toBe('healthy');
      expect(health.components.security).toBe('healthy');
      expect(health.components.memory).toBe('healthy');
      expect(health.components.consciousness).toBe('healthy');
      expect(health.components.externalServices).toBe('healthy');
      expect(health.components.configuration).toBe('healthy');
    });

    it('should detect critical performance issues', () => {
      mockPerformanceMonitor.getMetrics.mockReturnValue({
        cpuUsage: 90,
        memoryUsage: 95,
        responseTime: 2000,
        errorRate: 10,
        activeConnections: 10
      });

      const health = systemMonitor.getSystemHealth();
      
      expect(health.overall).toBe('critical');
      expect(health.components.performance).toBe('critical');
      expect(health.metrics.cpuUsage).toBe(90);
      expect(health.metrics.memoryUsage).toBe(95);
      expect(health.metrics.errorRate).toBe(10);
    });

    it('should detect security threats', () => {
      mockSecurityManager.getSecurityMetrics.mockReturnValue({
        threatLevel: 'critical',
        activeThreats: 15,
        blockedAttempts: 50,
        vulnerabilities: 3,
        lastScan: Date.now(),
        securityScore: 30
      });

      const health = systemMonitor.getSystemHealth();
      
      expect(health.components.security).toBe('critical');
      expect(health.metrics.securityThreats).toBe(15);
    });

    it('should detect memory issues', () => {
      mockMemoryManager.getMemoryState.mockReturnValue({
        totalMemories: 9500,
        shortTermCount: 2000,
        longTermCount: 5000,
        workingCount: 2000,
        episodicCount: 300,
        semanticCount: 200,
        proceduralCount: 0
      });

      const health = systemMonitor.getSystemHealth();
      
      expect(health.components.memory).toBe('critical');
    });

    it('should detect consciousness issues', () => {
      mockConsciousnessSimulator.getConsciousnessState.mockReturnValue({
        awareness: 0.2,
        selfAwareness: 0.1,
        subjectiveExperience: { intensity: 0.1 },
        metaCognition: { active: false },
        thoughts: [],
        emotions: { confusion: 0.8 }
      });

      const health = systemMonitor.getSystemHealth();
      
      expect(health.components.consciousness).toBe('critical');
    });

    it('should detect external service issues', () => {
      mockExternalServiceManager.getPerformanceMetrics.mockReturnValue({
        totalServices: 5,
        healthyServices: 2,
        unhealthyServices: 3,
        averageResponseTime: 5000
      });

      const health = systemMonitor.getSystemHealth();
      
      expect(health.components.externalServices).toBe('critical');
    });
  });

  describe('Alert Management', () => {
    it('should create alerts for critical conditions', () => {
      mockPerformanceMonitor.getMetrics.mockReturnValue({
        cpuUsage: 90,
        memoryUsage: 95,
        responseTime: 2000,
        errorRate: 10,
        activeConnections: 10
      });

      systemMonitor.performHealthCheck();
      const alerts = systemMonitor.getActiveAlerts();
      
      expect(alerts.length).toBeGreaterThan(0);
      expect(alerts.some(alert => alert.level === 'error')).toBe(true);
      expect(alerts.some(alert => alert.component === 'performance')).toBe(true);
    });

    it('should create security alerts', () => {
      mockSecurityManager.getSecurityMetrics.mockReturnValue({
        threatLevel: 'critical',
        activeThreats: 15,
        blockedAttempts: 50,
        vulnerabilities: 3,
        lastScan: Date.now(),
        securityScore: 30
      });

      systemMonitor.performHealthCheck();
      const alerts = systemMonitor.getActiveAlerts();
      
      expect(alerts.some(alert => alert.level === 'critical')).toBe(true);
      expect(alerts.some(alert => alert.component === 'security')).toBe(true);
    });

    it('should resolve alerts', () => {
      // Create an alert first
      mockPerformanceMonitor.getMetrics.mockReturnValue({
        cpuUsage: 90,
        memoryUsage: 95,
        responseTime: 2000,
        errorRate: 10,
        activeConnections: 10
      });

      systemMonitor.performHealthCheck();
      const alerts = systemMonitor.getActiveAlerts();
      expect(alerts.length).toBeGreaterThan(0);

      // Resolve the first alert
      const alertId = alerts[0].id;
      const resolved = systemMonitor.resolveAlert(alertId);
      
      expect(resolved).toBe(true);
      
      const remainingAlerts = systemMonitor.getActiveAlerts();
      expect(remainingAlerts.some(alert => alert.id === alertId && !alert.resolved)).toBe(false);
    });

    it('should handle non-existent alert resolution', () => {
      const resolved = systemMonitor.resolveAlert('non-existent-id');
      expect(resolved).toBe(false);
    });
  });

  describe('Monitoring Control', () => {
    it('should start and stop monitoring', () => {
      systemMonitor.stopMonitoring();
      
      let status = systemMonitor.getMonitoringStatus();
      expect(status.isActive).toBe(false);
      
      systemMonitor.startMonitoring();
      
      status = systemMonitor.getMonitoringStatus();
      expect(status.isActive).toBe(true);
    });

    it('should not start monitoring if already active', () => {
      const status1 = systemMonitor.getMonitoringStatus();
      expect(status1.isActive).toBe(true);
      
      systemMonitor.startMonitoring(); // Should not start again
      
      const status2 = systemMonitor.getMonitoringStatus();
      expect(status2.isActive).toBe(true);
    });

    it('should maintain monitoring interval', () => {
      const status = systemMonitor.getMonitoringStatus();
      expect(status.interval).toBe(5000);
    });
  });

  describe('Health History', () => {
    it('should maintain health history', () => {
      const health1 = systemMonitor.getSystemHealth();
      const health2 = systemMonitor.getSystemHealth();
      
      const history = systemMonitor.getHealthHistory();
      
      expect(history.length).toBeGreaterThanOrEqual(2);
      expect(history[history.length - 1].timestamp).toBeGreaterThan(history[0].timestamp);
    });

    it('should limit health history size', () => {
      // Generate many health checks
      for (let i = 0; i < 1100; i++) {
        systemMonitor.getSystemHealth();
      }
      
      const history = systemMonitor.getHealthHistory();
      expect(history.length).toBeLessThanOrEqual(1000);
    });
  });

  describe('Diagnostics', () => {
    it('should run comprehensive diagnostics', () => {
      const diagnostics = systemMonitor.getDiagnostics();
      
      expect(diagnostics.length).toBeGreaterThan(0);
      
      const componentDiagnostics = diagnostics.filter(d => 
        ['performance', 'security', 'memory', 'consciousness', 'externalServices', 'configuration'].includes(d.component)
      );
      
      expect(componentDiagnostics.length).toBeGreaterThanOrEqual(6);
    });

    it('should provide diagnostic recommendations', () => {
      const diagnostics = systemMonitor.getDiagnostics();
      
      diagnostics.forEach(diagnostic => {
        expect(diagnostic.recommendations).toBeDefined();
        expect(Array.isArray(diagnostic.recommendations)).toBe(true);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle errors during health checks', () => {
      mockPerformanceMonitor.getMetrics.mockImplementation(() => {
        throw new Error('Performance monitor error');
      });

      expect(() => {
        systemMonitor.performHealthCheck();
      }).not.toThrow();

      expect(mockErrorHandler.handleError).toHaveBeenCalled();
    });

    it('should handle errors during diagnostics', () => {
      mockMemoryManager.getMemoryState.mockImplementation(() => {
        throw new Error('Memory manager error');
      });

      const diagnostics = systemMonitor.runInitialDiagnostics();
      
      expect(diagnostics.length).toBeGreaterThan(0);
      expect(diagnostics.some(d => d.status === 'fail')).toBe(true);
    });
  });

  describe('Alert Thresholds', () => {
    it('should update alert thresholds', () => {
      const newThresholds = {
        cpuUsage: 70,
        memoryUsage: 75,
        errorRate: 3
      };

      systemMonitor.updateAlertThresholds(newThresholds);

      // Test with new thresholds
      mockPerformanceMonitor.getMetrics.mockReturnValue({
        cpuUsage: 75,
        memoryUsage: 80,
        responseTime: 200,
        errorRate: 4,
        activeConnections: 10
      });

      const health = systemMonitor.getSystemHealth();
      
      expect(health.components.performance).toBe('critical');
    });
  });

  describe('System Metrics', () => {
    it('should return comprehensive system metrics', () => {
      const metrics = systemMonitor.getSystemMetrics();
      
      expect(metrics).toBeDefined();
      expect(metrics.performance).toBeDefined();
      expect(metrics.security).toBeDefined();
      expect(metrics.health).toBeDefined();
      
      expect(metrics.performance.cpuUsage).toBeDefined();
      expect(metrics.security.threatLevel).toBeDefined();
      expect(metrics.health.overall).toBeDefined();
    });
  });

  describe('Integration with Components', () => {
    it('should integrate with all system components', () => {
      const health = systemMonitor.getSystemHealth();
      
      // Verify all components were called
      expect(mockPerformanceMonitor.getMetrics).toHaveBeenCalled();
      expect(mockSecurityManager.getSecurityMetrics).toHaveBeenCalled();
      expect(mockMemoryManager.getMemoryState).toHaveBeenCalled();
      expect(mockConsciousnessSimulator.getConsciousnessState).toHaveBeenCalled();
      expect(mockExternalServiceManager.getPerformanceMetrics).toHaveBeenCalled();
      expect(mockConfigManager.getConfiguration).toHaveBeenCalled();
      expect(mockConfigManager.validateConfiguration).toHaveBeenCalled();
    });

    it('should handle component failures gracefully', () => {
      mockPerformanceMonitor.getMetrics.mockImplementation(() => {
        throw new Error('Component failure');
      });

      expect(() => {
        systemMonitor.getSystemHealth();
      }).not.toThrow();

      expect(mockErrorHandler.handleError).toHaveBeenCalled();
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle rapid health checks efficiently', () => {
      const startTime = Date.now();
      
      for (let i = 0; i < 100; i++) {
        systemMonitor.getSystemHealth();
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete 100 health checks in reasonable time
      expect(duration).toBeLessThan(5000); // 5 seconds
    });

    it('should maintain performance under load', () => {
      const healthChecks = [];
      
      for (let i = 0; i < 50; i++) {
        healthChecks.push(systemMonitor.getSystemHealth());
      }
      
      expect(healthChecks.length).toBe(50);
      expect(healthChecks.every(h => h.timestamp > 0)).toBe(true);
    });
  });
}); 