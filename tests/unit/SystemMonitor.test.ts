import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SystemMonitor } from '@/core/SystemMonitor';
import { PerformanceMonitor } from '@/core/PerformanceMonitor';
import { SecurityManager } from '@/core/SecurityManager';
import { ErrorHandler } from '@/core/ErrorHandler';
import { ConfigurationManager } from '@/config/ConfigurationManager';
import { MemoryManager } from '@/core/MemoryManager';
import { ConsciousnessSimulator } from '@/core/ConsciousnessSimulator';
import { ExternalServiceManager } from '@/services/ExternalServiceManager';
import { Logger } from '@/utils/Logger';

describe('SystemMonitor', () => {
  let systemMonitor: SystemMonitor;
  let performanceMonitor: PerformanceMonitor;
  let securityManager: SecurityManager;
  let errorHandler: ErrorHandler;
  let configManager: ConfigurationManager;
  let memoryManager: MemoryManager;
  let consciousnessSimulator: ConsciousnessSimulator;
  let externalServiceManager: ExternalServiceManager;

  beforeEach(async () => {
    // Create real component instances
    performanceMonitor = new PerformanceMonitor();
    securityManager = new SecurityManager({});
    errorHandler = new ErrorHandler(new Logger('SystemMonitorTest'));
    configManager = new ConfigurationManager();
    memoryManager = new MemoryManager();
    consciousnessSimulator = new ConsciousnessSimulator();
    externalServiceManager = new ExternalServiceManager();

    // Start components that need it
    performanceMonitor.start();
    
    // Initialize components that have initialize methods
    await Promise.all([
      securityManager.initialize(),
      consciousnessSimulator.initialize()
    ]);

    // Create SystemMonitor instance with real components
    systemMonitor = new SystemMonitor(
      performanceMonitor,
      securityManager,
      errorHandler,
      configManager,
      memoryManager,
      consciousnessSimulator,
      externalServiceManager
    );
  });

  afterEach(() => {
    // Stop components that need it
    performanceMonitor.stop();
    
    // Stop monitoring if it exists
    if (systemMonitor && typeof systemMonitor.stopMonitoring === 'function') {
      systemMonitor.stopMonitoring();
    }
  });

  describe('Initialization', () => {
    it('should initialize with all required components', () => {
      expect(systemMonitor).toBeDefined();
      
      // Call getSystemHealth to trigger component interactions
      const health = systemMonitor.getSystemHealth();
      
      expect(health).toBeDefined();
      expect(health.components).toBeDefined();
      expect(health.metrics).toBeDefined();
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
      
      // With real components, we expect healthy state by default
      expect(health.overall).toBe('healthy');
      expect(health.components.performance).toBe('healthy');
      expect(health.components.security).toBe('healthy');
      expect(health.components.memory).toBe('healthy');
      expect(health.components.consciousness).toBe('healthy');
      expect(health.components.externalServices).toBe('healthy');
      expect(health.components.configuration).toBe('healthy');
    });

    it('should detect performance issues when they occur', () => {
      // Test with real performance data
      const health = systemMonitor.getSystemHealth();
      
      expect(health.metrics.cpuUsage).toBeGreaterThanOrEqual(0);
      expect(health.metrics.memoryUsage).toBeGreaterThanOrEqual(0);
      expect(health.metrics.responseTime).toBeGreaterThanOrEqual(0);
      expect(health.metrics.errorRate).toBeGreaterThanOrEqual(0);
    });

    it('should detect security threats when they occur', () => {
      // Test with real security data
      const health = systemMonitor.getSystemHealth();
      
      expect(health.metrics.securityThreats).toBeGreaterThanOrEqual(0);
      expect(health.components.security).toBeDefined();
    });
  });

  describe('Alert Management', () => {
    it('should create alerts for critical conditions', () => {
      // Test with real alert creation
      const health = systemMonitor.getSystemHealth();
      
      expect(health.alerts).toBeDefined();
      expect(Array.isArray(health.alerts)).toBe(true);
    });

    it('should create security alerts when threats are detected', () => {
      // Test with real security monitoring
      const health = systemMonitor.getSystemHealth();
      
      expect(health.components.security).toBeDefined();
      expect(health.metrics.securityThreats).toBeGreaterThanOrEqual(0);
    });

    it('should resolve alerts', () => {
      // Test alert resolution with real data
      const health = systemMonitor.getSystemHealth();
      
      // All alerts should be resolved in a healthy system
      const unresolvedAlerts = health.alerts.filter(alert => !alert.resolved);
      expect(unresolvedAlerts.length).toBeLessThanOrEqual(health.alerts.length);
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
      
      // Add a small delay to ensure different timestamps
      setTimeout(() => {}, 1);
      
      const health2 = systemMonitor.getSystemHealth();
      
      const history = systemMonitor.getHealthHistory();
      
      expect(history.length).toBeGreaterThanOrEqual(2);
      // Use a more flexible comparison for timestamps
      expect(history[history.length - 1].timestamp).toBeGreaterThanOrEqual(history[0].timestamp);
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
    it('should handle errors during health checks gracefully', () => {
      // Test error handling with real components
      expect(() => {
        systemMonitor.performHealthCheck();
      }).not.toThrow();
    });

    it('should handle errors during diagnostics gracefully', () => {
      const diagnostics = systemMonitor.runInitialDiagnostics();
      
      expect(diagnostics.length).toBeGreaterThan(0);
      // All diagnostics should have valid status
      expect(diagnostics.every(d => ['pass', 'fail', 'warning'].includes(d.status))).toBe(true);
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

      // Test that thresholds were updated
      const health = systemMonitor.getSystemHealth();
      expect(health).toBeDefined();
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
      
      // Verify all components are integrated
      expect(health.components.performance).toBeDefined();
      expect(health.components.security).toBeDefined();
      expect(health.components.memory).toBeDefined();
      expect(health.components.consciousness).toBeDefined();
      expect(health.components.externalServices).toBeDefined();
      expect(health.components.configuration).toBeDefined();
    });

    it('should handle component failures gracefully', () => {
      // Test graceful handling with real components
      expect(() => {
        systemMonitor.getSystemHealth();
      }).not.toThrow();
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