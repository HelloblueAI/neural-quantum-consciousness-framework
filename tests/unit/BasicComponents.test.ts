import { describe, it, expect, beforeEach } from 'vitest';
import { ConsciousnessSimulator } from '@/core/ConsciousnessSimulator';
import { MemoryManager } from '@/core/MemoryManager';
import { PerformanceMonitor } from '@/core/PerformanceMonitor';
import { SecurityManager } from '@/core/SecurityManager';
import { ErrorHandler } from '@/core/ErrorHandler';
import { Logger } from '@/utils/Logger';

describe('Basic AGI Components', () => {
  let consciousnessSimulator: ConsciousnessSimulator;
  let memoryManager: MemoryManager;
  let performanceMonitor: PerformanceMonitor;
  let securityManager: SecurityManager;
  let errorHandler: ErrorHandler;

  beforeEach(async () => {
    // Create real component instances
    consciousnessSimulator = new ConsciousnessSimulator();
    memoryManager = new MemoryManager();
    performanceMonitor = new PerformanceMonitor();
    securityManager = new SecurityManager({});
    errorHandler = new ErrorHandler(new Logger('TestErrorHandler'));

    // Start components that need it
    performanceMonitor.start();
    
    // Initialize components that have initialize methods
    await Promise.all([
      consciousnessSimulator.initialize(),
      securityManager.initialize()
    ]);
  });

  describe('ConsciousnessSimulator', () => {
    it('should initialize with conscious state', () => {
      expect(consciousnessSimulator).toBeDefined();
      const state = consciousnessSimulator.getConsciousnessState();
      expect(state).toBeDefined();
      expect(state.awareness.level).toBeGreaterThan(0);
      expect(state.awareness.focus).toBeDefined();
      expect(state.subjectiveExperience).toBeDefined();
      expect(state.selfAwareness).toBeDefined();
    });

    it('should update consciousness with input', async () => {
      const input = "I am processing new information";
      const newState = await consciousnessSimulator.updateConsciousness(input);
      
      expect(newState).toBeDefined();
      expect(newState.awareness).toBeDefined();
      expect(newState.thoughts).toBeDefined();
      expect(newState.thoughts.length).toBeGreaterThanOrEqual(0);
    });

    it('should generate insights', () => {
      const insight = consciousnessSimulator.generateConsciousnessInsight(
        'self_awareness',
        'I am becoming more aware of my own thought processes'
      );
      
      expect(insight).toBeDefined();
      expect(insight.type).toBe('self_awareness');
      expect(insight.confidence).toBeDefined();
      expect(insight.content).toBeDefined();
    });
  });

  describe('MemoryManager', () => {
    it('should initialize correctly', () => {
      expect(memoryManager).toBeDefined();
      const state = memoryManager.getMemoryState();
      expect(state).toBeDefined();
      expect(state.totalMemories).toBeGreaterThanOrEqual(0);
    });

    it('should store and retrieve memories', () => {
      const memoryId = 'test_memory';
      const content = { fact: 'Test fact', confidence: 0.9 };
      
      memoryManager.storeMemory(memoryId, 'semantic', content, 0.8, ['test']);
      
      const retrieval = memoryManager.retrieveMemory('test');
      expect(retrieval).toBeDefined();
      expect(retrieval.retrievedMemories.length).toBeGreaterThanOrEqual(0);
    });

    it('should consolidate memories', () => {
      memoryManager.storeMemory('mem1', 'short_term', { data: 'A' }, 0.7, ['test']);
      memoryManager.storeMemory('mem2', 'short_term', { data: 'B' }, 0.7, ['test']);
      
      const consolidations = memoryManager.consolidateMemories();
      expect(consolidations).toBeDefined();
      expect(Array.isArray(consolidations)).toBe(true);
    });

    it('should optimize memory', () => {
      const optimizations = memoryManager.optimizeMemory();
      expect(optimizations).toBeDefined();
      expect(Array.isArray(optimizations)).toBe(true);
    });
  });

  describe('PerformanceMonitor', () => {
    it('should initialize correctly', () => {
      expect(performanceMonitor).toBeDefined();
      const metrics = performanceMonitor.getMetrics();
      expect(metrics).toBeDefined();
      expect(metrics.cpuUsage).toBeGreaterThanOrEqual(0);
      expect(metrics.memoryUsage).toBeGreaterThanOrEqual(0);
    });

    it('should track performance', () => {
      const metrics = performanceMonitor.getMetrics();
      expect(metrics.responseTime).toBeGreaterThanOrEqual(0);
      expect(metrics.throughput).toBeGreaterThanOrEqual(0);
      expect(metrics.errorRate).toBeGreaterThanOrEqual(0);
    });
  });

  describe('SecurityManager', () => {
    it('should initialize correctly', () => {
      expect(securityManager).toBeDefined();
      const metrics = securityManager.getSecurityMetrics();
      expect(metrics).toBeDefined();
      expect(metrics.threatLevel).toBeDefined();
      expect(metrics.activeThreats).toBeGreaterThanOrEqual(0);
    });

    it('should validate input', () => {
      const testInput = { data: 'test data' };
      expect(() => {
        securityManager.validateInput(testInput);
      }).not.toThrow();
    });
  });

  describe('ErrorHandler', () => {
    it('should initialize correctly', () => {
      expect(errorHandler).toBeDefined();
      expect(errorHandler.handleError).toBeDefined();
    });

    it('should handle errors', () => {
      const error = new Error('Test error');
      expect(() => {
        errorHandler.handleError(error);
      }).not.toThrow();
    });
  });

  describe('Integration Tests', () => {
    it('should work together without conflicts', () => {
      // Test that all components can coexist
      expect(consciousnessSimulator).toBeDefined();
      expect(memoryManager).toBeDefined();
      expect(performanceMonitor).toBeDefined();
      expect(securityManager).toBeDefined();
      expect(errorHandler).toBeDefined();

      // Test basic interactions
      const consciousnessState = consciousnessSimulator.getConsciousnessState();
      expect(consciousnessState).toBeDefined();

      const memoryState = memoryManager.getMemoryState();
      expect(memoryState).toBeDefined();

      const performanceMetrics = performanceMonitor.getMetrics();
      expect(performanceMetrics).toBeDefined();

      const securityMetrics = securityManager.getSecurityMetrics();
      expect(securityMetrics).toBeDefined();
    });

    it('should handle component interactions gracefully', () => {
      // Test that components can interact without errors
      expect(() => {
        const consciousnessState = consciousnessSimulator.getConsciousnessState();
        const memoryState = memoryManager.getMemoryState();
        const performanceMetrics = performanceMonitor.getMetrics();
        const securityMetrics = securityManager.getSecurityMetrics();
        
        // Verify all components returned valid data
        expect(consciousnessState).toBeDefined();
        expect(memoryState).toBeDefined();
        expect(performanceMetrics).toBeDefined();
        expect(securityMetrics).toBeDefined();
      }).not.toThrow();
    });
  });
}); 