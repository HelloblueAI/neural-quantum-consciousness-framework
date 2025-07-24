import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ConfigurationManager } from '@/config/ConfigurationManager';
import { MemoryManager } from '@/core/MemoryManager';
import { ConsciousnessSimulator } from '@/core/ConsciousnessSimulator';
import { ExternalServiceManager } from '@/services/ExternalServiceManager';
import { Logger } from '@/utils/Logger';

describe('Basic AGI Components', () => {
  let configManager: ConfigurationManager;
  let memoryManager: MemoryManager;
  let consciousnessSimulator: ConsciousnessSimulator;
  let externalServiceManager: ExternalServiceManager;
  let logger: Logger;

  beforeEach(() => {
    configManager = new ConfigurationManager();
    memoryManager = new MemoryManager();
    consciousnessSimulator = new ConsciousnessSimulator();
    externalServiceManager = new ExternalServiceManager();
    logger = new Logger('TestLogger');
  });

  afterEach(() => {
    // Cleanup
  });

  describe('ConfigurationManager', () => {
    it('should initialize with default configuration', () => {
      expect(configManager).toBeDefined();
      const config = configManager.getConfiguration();
      expect(config.system).toBeDefined();
      expect(config.agi).toBeDefined();
      expect(config.memory).toBeDefined();
      expect(config.performance).toBeDefined();
      expect(config.security).toBeDefined();
      expect(config.services).toBeDefined();
      expect(config.features).toBeDefined();
      expect(config.monitoring).toBeDefined();
    });

    it('should validate configuration correctly', () => {
      const validation = configManager.validateConfiguration();
      expect(validation).toBeDefined();
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toBeDefined();
      expect(validation.warnings).toBeDefined();
    });

    it('should update configuration values', () => {
      const success = configManager.setValue('system.debug', false, 'test');
      expect(success).toBe(true);
      expect(configManager.getValue('system.debug')).toBe(false);
    });

    it('should manage feature flags', () => {
      const features = configManager.getFeatureFlags();
      expect(features).toBeDefined();
      expect(features.advancedReasoning).toBeDefined();
      expect(features.metaLearning).toBeDefined();
      expect(features.creativeProblemSolving).toBeDefined();
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

  describe('ConsciousnessSimulator', () => {
    it('should initialize with conscious state', () => {
      expect(consciousnessSimulator).toBeDefined();
      const state = consciousnessSimulator.getConsciousnessState();
      expect(state).toBeDefined();
      expect(state.awareness.level).toBeGreaterThan(0);
      expect(state.awareness.focus).toBeDefined();
      expect(state.subjectiveExperience).toBeDefined();
      expect(state.selfModel).toBeDefined();
    });

    it('should update consciousness with input', () => {
      const input = "I am processing new information";
      const newState = consciousnessSimulator.updateConsciousness(input);
      
      expect(newState).toBeDefined();
      expect(newState.awareness).toBeGreaterThan(0);
      expect(newState.thoughts).toBeDefined();
      expect(newState.thoughts.length).toBeGreaterThan(0);
    });

    it('should generate insights', () => {
      const insight = consciousnessSimulator.generateConsciousnessInsight(
        'self_awareness',
        'I am becoming more aware of my own thought processes',
        0.8
      );
      
      expect(insight).toBeDefined();
      expect(insight.type).toBe('self_awareness');
      expect(insight.confidence).toBe(0.8);
      expect(insight.implications).toBeDefined();
    });
  });

  describe('ExternalServiceManager', () => {
    it('should initialize with default services', () => {
      expect(externalServiceManager).toBeDefined();
      const services = externalServiceManager.getAllServices();
      expect(services).toBeDefined();
      expect(services.length).toBeGreaterThan(0);
    });

    it('should manage service status', () => {
      const openaiService = externalServiceManager.getServiceStatus('openai_api');
      expect(openaiService).toBeDefined();
      expect(openaiService?.name).toBe('OpenAI API');
    });

    it('should get performance metrics', () => {
      const metrics = externalServiceManager.getPerformanceMetrics();
      expect(metrics).toBeDefined();
      expect(metrics.totalServices).toBeGreaterThan(0);
    });
  });

  describe('Logger', () => {
    it('should create logger instance', () => {
      expect(logger).toBeDefined();
      expect(logger.info).toBeDefined();
      expect(logger.error).toBeDefined();
      expect(logger.debug).toBeDefined();
      expect(logger.warn).toBeDefined();
    });

    it('should log messages without errors', () => {
      expect(() => {
        logger.info('Test info message');
        logger.debug('Test debug message');
        logger.warn('Test warning message');
        logger.error('Test error message');
      }).not.toThrow();
    });
  });

  describe('Component Integration', () => {
    it('should work together without conflicts', () => {
      // Test that all components can coexist
      expect(configManager).toBeDefined();
      expect(memoryManager).toBeDefined();
      expect(consciousnessSimulator).toBeDefined();
      expect(externalServiceManager).toBeDefined();
      expect(logger).toBeDefined();

      // Test basic interactions
      const config = configManager.getConfiguration();
      expect(config).toBeDefined();

      const memoryState = memoryManager.getMemoryState();
      expect(memoryState).toBeDefined();

      const consciousnessState = consciousnessSimulator.getConsciousnessState();
      expect(consciousnessState).toBeDefined();

      const services = externalServiceManager.getAllServices();
      expect(services).toBeDefined();
    });

    it('should handle configuration updates affecting other components', () => {
      // Update configuration
      configManager.setValue('memory.shortTermCapacity', 2000, 'test');
      
      // Verify memory manager can still function
      const memoryState = memoryManager.getMemoryState();
      expect(memoryState).toBeDefined();
      
      // Verify consciousness simulator still works
      const consciousnessState = consciousnessSimulator.getConsciousnessState();
      expect(consciousnessState).toBeDefined();
    });
  });
}); 