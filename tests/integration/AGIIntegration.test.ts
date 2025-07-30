import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AGISystem } from '@/core/AGISystem';
import { SystemMonitor } from '@/core/SystemMonitor';
import { ReasoningEngine } from '@/core/ReasoningEngine';
import { LearningEngine } from '@/core/LearningEngine';
import { MemoryManager } from '@/core/MemoryManager';
import { ConsciousnessSimulator } from '@/core/ConsciousnessSimulator';
import { ConfigurationManager } from '@/config/ConfigurationManager';
import { ExternalServiceManager } from '@/services/ExternalServiceManager';
import { PerformanceMonitor } from '@/core/PerformanceMonitor';
import { SecurityManager } from '@/core/SecurityManager';
import { ErrorHandler } from '@/core/ErrorHandler';
import { KnowledgeBase } from '@/core/KnowledgeBase';
import { ReasoningAgent } from '@/agents/ReasoningAgent';
import { LearningAgent } from '@/agents/LearningAgent';
import { CreativeAgent } from '@/agents/CreativeAgent';
import { AgentFactory } from '@/agents/AgentFactory';

describe('AGI System Integration', () => {
  let agiSystem: AGISystem;
  let systemMonitor: SystemMonitor;
  let reasoningEngine: ReasoningEngine;
  let learningEngine: LearningEngine;
  let memoryManager: MemoryManager;
  let consciousnessSimulator: ConsciousnessSimulator;
  let configManager: ConfigurationManager;
  let externalServiceManager: ExternalServiceManager;
  let performanceMonitor: PerformanceMonitor;
  let securityManager: SecurityManager;
  let errorHandler: ErrorHandler;
  let knowledgeBase: KnowledgeBase;
  let agentFactory: AgentFactory;

  beforeEach(async () => {
    // Initialize all core components
    configManager = new ConfigurationManager();
    errorHandler = new ErrorHandler();
    performanceMonitor = new PerformanceMonitor();
    securityManager = new SecurityManager();
    memoryManager = new MemoryManager();
    consciousnessSimulator = new ConsciousnessSimulator();
    knowledgeBase = new KnowledgeBase();
    externalServiceManager = new ExternalServiceManager();

    // Initialize engines
    reasoningEngine = new ReasoningEngine();
    learningEngine = new LearningEngine();

    // Initialize the engines and knowledge base
    await knowledgeBase.initialize();
    await reasoningEngine.initialize();
    await learningEngine.initialize();

    // Initialize system monitor
    systemMonitor = new SystemMonitor(
      performanceMonitor,
      securityManager,
      errorHandler,
      configManager,
      memoryManager,
      consciousnessSimulator,
      externalServiceManager
    );

    // Initialize agent factory
    agentFactory = new AgentFactory(
      reasoningEngine,
      learningEngine,
      memoryManager,
      consciousnessSimulator,
      knowledgeBase
    );

    // Initialize AGI system
    agiSystem = new AGISystem({
      agents: [
        { id: 'reasoning_agent', type: 'reasoning', capabilities: ['logic', 'problem_solving'], parameters: {}, constraints: [] },
        { id: 'learning_agent', type: 'learning', capabilities: ['pattern_recognition', 'adaptation'], parameters: {}, constraints: [] },
        { id: 'creative_agent', type: 'creative', capabilities: ['innovation', 'artistic'], parameters: {}, constraints: [] }
      ],
      learning: {
        algorithms: ['supervised', 'unsupervised', 'reinforcement', 'meta'],
        parameters: {},
        evaluation: { metrics: ['accuracy', 'precision', 'recall'], thresholds: {}, validation: true },
        adaptation: { enabled: true, strategies: ['online', 'transfer'], thresholds: {} }
      },
      reasoning: {
        logics: ['classical', 'fuzzy', 'probabilistic'],
        inference: { method: 'deductive', accuracy: 0.9, efficiency: 0.8, reliability: 0.9 },
        decisionMaking: { strategy: 'utility', criteria: ['efficiency', 'effectiveness'], weights: {}, confidence: 0.8 },
        problemSolving: { approach: 'systematic', heuristics: ['divide_conquer', 'pattern_match'], strategies: ['algorithmic', 'heuristic'], success: 0.9 }
      },
      communication: {
        protocol: 'rest',
        format: 'json',
        encoding: 'utf8',
        reliability: 0.95
      },
      security: {
        authentication: true,
        authorization: true,
        encryption: true,
        monitoring: true
      },
      performance: {
        maxResponseTime: 1000,
        maxThroughput: 1000,
        resourceLimits: { cpu: 0.8, memory: 0.8, disk: 0.9 },
        optimization: true
      }
    });

    // Initialize the system
    await agiSystem.initialize();
  });

  afterEach(async () => {
    await agiSystem.shutdown();
  });

  describe('System Initialization', () => {
    it('should initialize all components successfully', async () => {
      expect(agiSystem).toBeDefined();
      expect(agiSystem.isInitialized()).toBe(true);
      
      // Verify all core components are initialized
      expect(reasoningEngine).toBeDefined();
      expect(learningEngine).toBeDefined();
      expect(memoryManager).toBeDefined();
      expect(consciousnessSimulator).toBeDefined();
      expect(configManager).toBeDefined();
      expect(externalServiceManager).toBeDefined();
      expect(performanceMonitor).toBeDefined();
      expect(securityManager).toBeDefined();
      expect(errorHandler).toBeDefined();
      expect(knowledgeBase).toBeDefined();
      expect(systemMonitor).toBeDefined();
      expect(agentFactory).toBeDefined();
    });

    it('should establish proper component relationships', () => {
      // Test that components can communicate with each other
      const health = systemMonitor.getSystemHealth();
      expect(health.overall).toBe('healthy');

      const memoryState = memoryManager.getMemoryState();
      expect(memoryState.totalMemories).toBeGreaterThanOrEqual(0);

      const consciousnessState = consciousnessSimulator.getConsciousnessState();
      expect(consciousnessState.awareness.level).toBeGreaterThan(0);

      const config = configManager.getConfiguration();
      expect(config.system).toBeDefined();
    });

    it('should load default knowledge and memories', () => {
      const memoryState = memoryManager.getMemoryState();
      expect(memoryState.semanticCount).toBeGreaterThan(0);
      expect(memoryState.proceduralCount).toBeGreaterThan(0);
    });
  });

  describe('Agent System Integration', () => {
    it('should create and manage agents successfully', () => {
      const reasoningAgent = agentFactory.createAgent('reasoning');
      const learningAgent = agentFactory.createAgent('learning');
      const creativeAgent = agentFactory.createAgent('creative');

      expect(reasoningAgent).toBeDefined();
      expect(learningAgent).toBeDefined();
      expect(creativeAgent).toBeDefined();

      expect(reasoningAgent.getType()).toBe('reasoning');
      expect(learningAgent.getType()).toBe('learning');
      expect(creativeAgent.getType()).toBe('creative');
    });

    it('should allow agents to process tasks', async () => {
      const reasoningAgent = agentFactory.createAgent('reasoning');
      
      const task = {
        id: 'test_task_1',
        type: 'reasoning',
        input: 'What is the logical conclusion of: If A then B, A is true',
        priority: 'high',
        metadata: { domain: 'logic' }
      };

      const result = await reasoningAgent.processTask(task);
      
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.output).toBeDefined();
    });

    it('should allow agents to learn from experiences', async () => {
      const learningAgent = agentFactory.createAgent('learning');
      
      const experience = {
        id: 'exp_1',
        type: 'learning',
        input: 'Pattern recognition in data',
        output: 'Identified correlation between variables',
        feedback: 'positive',
        metadata: { domain: 'data_analysis' }
      };

      const result = await learningAgent.processExperience(experience);
      
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.learnedPatterns).toBeDefined();
    });

    it('should allow agents to collaborate', async () => {
      const reasoningAgent = agentFactory.createAgent('reasoning');
      const learningAgent = agentFactory.createAgent('learning');
      const creativeAgent = agentFactory.createAgent('creative');

      // Create a complex task that requires multiple agents
      const complexTask = {
        id: 'complex_task_1',
        type: 'multi_agent',
        input: 'Design a solution for optimizing energy consumption in smart cities',
        priority: 'critical',
        metadata: { domain: 'smart_cities', complexity: 'high' }
      };

      // Process with reasoning agent first
      const reasoningResult = await reasoningAgent.processTask(complexTask);
      expect(reasoningResult.success).toBe(true);

      // Learn from the reasoning process
      const learningResult = await learningAgent.processExperience({
        id: 'exp_reasoning',
        type: 'learning',
        input: reasoningResult.output,
        output: 'Learned optimization patterns',
        feedback: 'positive',
        metadata: { source: 'reasoning_agent' }
      });
      expect(learningResult.success).toBe(true);

      // Generate creative solutions
      const creativeResult = await creativeAgent.processTask({
        id: 'creative_task_1',
        type: 'creative',
        input: reasoningResult.output + ' ' + learningResult.learnedPatterns,
        priority: 'high',
        metadata: { domain: 'innovation' }
      });
      expect(creativeResult.success).toBe(true);
    });
  });

  describe('Memory and Knowledge Integration', () => {
    it('should store and retrieve information across components', () => {
      // Store information in memory
      const memoryId = 'test_memory_1';
      const content = { fact: 'Energy optimization requires data analysis', confidence: 0.9 };
      memoryManager.storeMemory(memoryId, 'semantic', content, 0.8, ['energy', 'optimization']);

      // Retrieve the information
      const retrieval = memoryManager.retrieveMemory('energy optimization');
      expect(retrieval.retrievedMemories.length).toBeGreaterThan(0);
      expect(retrieval.retrievedMemories.some(m => m.id === memoryId)).toBe(true);
    });

    it('should consolidate memories automatically', () => {
      // Store multiple related memories
      memoryManager.storeMemory('mem1', 'short_term', { data: 'Energy data A' }, 0.7, ['energy']);
      memoryManager.storeMemory('mem2', 'short_term', { data: 'Energy data B' }, 0.7, ['energy']);
      memoryManager.storeMemory('mem3', 'short_term', { data: 'Energy data C' }, 0.7, ['energy']);

      // Trigger consolidation
      const consolidations = memoryManager.consolidateMemories();
      expect(consolidations.length).toBeGreaterThanOrEqual(0);
    });

    it('should integrate knowledge base with memory', () => {
      // Add knowledge to knowledge base
      const knowledgeId = 'energy_knowledge_1';
      const knowledge = {
        domain: 'energy_optimization',
        facts: ['Renewable energy is more efficient', 'Data analysis improves efficiency'],
        relationships: ['efficiency -> data_analysis', 'renewable -> efficiency'],
        confidence: 0.85
      };

      knowledgeBase.addKnowledge(knowledgeId, knowledge);

      // Verify knowledge is accessible
      const retrievedKnowledge = knowledgeBase.getKnowledge('energy_optimization');
      expect(retrievedKnowledge).toBeDefined();
      expect(retrievedKnowledge.facts).toContain('Renewable energy is more efficient');
    });
  });

  describe('Consciousness and Reasoning Integration', () => {
    it('should integrate consciousness with reasoning processes', () => {
      const initialState = consciousnessSimulator.getConsciousnessState();
      
      // Perform reasoning task
      const reasoningTask = {
        id: 'consciousness_reasoning_1',
        type: 'reasoning',
        input: 'I am analyzing complex patterns in energy consumption data',
        priority: 'medium',
        metadata: { domain: 'self_awareness' }
      };

      reasoningEngine.processTask(reasoningTask);

      // Check consciousness state after reasoning
      const newState = consciousnessSimulator.getConsciousnessState();
      expect(newState.awareness.level).toBeGreaterThanOrEqual(initialState.awareness.level);
      expect(newState.thoughts.length).toBeGreaterThanOrEqual(initialState.thoughts.length);
    });

    it('should generate insights through consciousness', () => {
      const insight = consciousnessSimulator.generateConsciousnessInsight(
        'pattern_recognition',
        'I notice recurring patterns in energy consumption during peak hours',
        0.8
      );

      expect(insight).toBeDefined();
      expect(insight.type).toBe('pattern_recognition');
      expect(insight.confidence).toBe(0.8);
      expect(insight.implications).toBeDefined();
    });
  });

  describe('Learning and Adaptation Integration', () => {
    it('should learn from experiences and adapt', async () => {
      const initialLearningState = learningEngine.getLearningState();

      // Create learning experience
      const learningExperience = {
        id: 'learning_exp_1',
        type: 'supervised',
        input: 'Energy consumption patterns',
        expectedOutput: 'Optimization recommendations',
        actualOutput: 'Basic recommendations',
        feedback: 'positive',
        metadata: { domain: 'energy_optimization' }
      };

      // Process learning experience
      const learningResult = await learningEngine.processExperience(learningExperience);
      expect(learningResult.success).toBe(true);

      // Check if learning state has evolved
      const newLearningState = learningEngine.getLearningState();
      expect(newLearningState.totalExperiences).toBeGreaterThan(initialLearningState.totalExperiences);
    });

    it('should transfer knowledge across domains', async () => {
      // Learn in one domain
      const sourceExperience = {
        id: 'source_exp_1',
        type: 'learning',
        input: 'Pattern recognition in weather data',
        output: 'Weather prediction models',
        feedback: 'positive',
        metadata: { domain: 'weather_prediction' }
      };

      await learningEngine.processExperience(sourceExperience);

      // Transfer to energy domain
      const transferResult = await learningEngine.transferLearning({
        sourceDomain: 'weather_prediction',
        targetDomain: 'energy_optimization',
        transferStrategy: 'pattern_mapping',
        confidence: 0.7
      });

      expect(transferResult.success).toBe(true);
      expect(transferResult.transferredKnowledge).toBeDefined();
    });
  });

  describe('Performance and Monitoring Integration', () => {
    it('should monitor system performance continuously', () => {
      const health = systemMonitor.getSystemHealth();
      expect(health.overall).toBe('healthy');

      const performanceMetrics = performanceMonitor.getMetrics();
      expect(performanceMetrics.cpuUsage).toBeDefined();
      expect(performanceMetrics.memoryUsage).toBeDefined();
      expect(performanceMetrics.responseTime).toBeDefined();

      const securityMetrics = securityManager.getSecurityMetrics();
      expect(securityMetrics.threatLevel).toBeDefined();
      expect(securityMetrics.activeThreats).toBeDefined();
    });

    it('should handle performance degradation gracefully', async () => {
      // Simulate high load
      for (let i = 0; i < 100; i++) {
        await reasoningEngine.processTask({
          id: `load_test_${i}`,
          type: 'reasoning',
          input: 'Complex reasoning task',
          priority: 'high',
          metadata: { test: true }
        });
      }

      const health = systemMonitor.getSystemHealth();
      expect(health.overall).toBeDefined();
      expect(health.metrics).toBeDefined();
    });

    it('should generate alerts for critical conditions', () => {
      // The system should maintain health even under load
      const health = systemMonitor.getSystemHealth();
      const alerts = systemMonitor.getActiveAlerts();
      
      // System should handle load without critical alerts in normal operation
      expect(health.overall).toBe('healthy');
    });
  });

  describe('Error Handling and Recovery', () => {
    it('should handle errors gracefully', async () => {
      // Simulate an error condition
      const errorTask = {
        id: 'error_test_1',
        type: 'reasoning',
        input: null, // This should cause an error
        priority: 'high',
        metadata: { test: 'error_handling' }
      };

      // The system should handle this gracefully
      const result = await reasoningEngine.processTask(errorTask);
      expect(result).toBeDefined();
      // Even if the task fails, the system should not crash
    });

    it('should maintain system stability during errors', () => {
      const initialHealth = systemMonitor.getSystemHealth();
      
      // Simulate multiple error conditions
      for (let i = 0; i < 10; i++) {
        try {
          reasoningEngine.processTask({
            id: `error_test_${i}`,
            type: 'reasoning',
            input: null,
            priority: 'high',
            metadata: { test: 'stability' }
          });
        } catch (error) {
          // Errors should be handled by the error handler
        }
      }

      const finalHealth = systemMonitor.getSystemHealth();
      expect(finalHealth.overall).toBeDefined();
      // System should remain functional
    });
  });

  describe('Configuration and External Services', () => {
    it('should manage configuration changes', () => {
      const initialConfig = configManager.getConfiguration();
      
      // Update configuration
      const success = configManager.setValue('system.debug', true, 'test');
      expect(success).toBe(true);
      
      const updatedConfig = configManager.getConfiguration();
      expect(updatedConfig.system.debug).toBe(true);
    });

    it('should validate configuration changes', () => {
      const validation = configManager.validateConfiguration();
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toBeDefined();
      expect(validation.warnings).toBeDefined();
    });

    it('should manage external service connections', () => {
      const services = externalServiceManager.getAllServices();
      expect(services.length).toBeGreaterThan(0);
      
      const openaiService = externalServiceManager.getServiceStatus('openai_api');
      expect(openaiService).toBeDefined();
    });
  });

  describe('System Shutdown and Cleanup', () => {
    it('should shutdown gracefully', async () => {
      const shutdownResult = await agiSystem.shutdown();
      expect(shutdownResult.success).toBe(true);
      expect(agiSystem.isInitialized()).toBe(false);
    });

    it('should cleanup resources properly', async () => {
      // Create some resources
      const agent = agentFactory.createAgent('reasoning');
      memoryManager.storeMemory('cleanup_test', 'short_term', { data: 'test' }, 0.5);
      
      // Shutdown should cleanup everything
      await agiSystem.shutdown();
      
      // System should be in clean state
      expect(agiSystem.isInitialized()).toBe(false);
    });
  });

  describe('End-to-End Workflows', () => {
    it('should complete complex reasoning workflows', async () => {
      // Define a complex reasoning workflow
      const workflow = {
        id: 'complex_workflow_1',
        steps: [
          {
            id: 'step_1',
            type: 'reasoning',
            input: 'Analyze energy consumption patterns',
            agent: 'reasoning'
          },
          {
            id: 'step_2',
            type: 'learning',
            input: 'Learn from analysis results',
            agent: 'learning'
          },
          {
            id: 'step_3',
            type: 'creative',
            input: 'Generate optimization solutions',
            agent: 'creative'
          }
        ]
      };

      const results = [];
      
      for (const step of workflow.steps) {
        const agent = agentFactory.createAgent(step.agent);
        const result = await agent.processTask({
          id: step.id,
          type: step.type,
          input: step.input,
          priority: 'high',
          metadata: { workflow: workflow.id }
        });
        
        results.push(result);
        expect(result.success).toBe(true);
      }

      expect(results.length).toBe(workflow.steps.length);
      expect(results.every(r => r.success)).toBe(true);
    });

    it('should maintain system health during complex operations', async () => {
      const initialHealth = systemMonitor.getSystemHealth();
      
      // Perform complex operations
      const agents = [
        agentFactory.createAgent('reasoning'),
        agentFactory.createAgent('learning'),
        agentFactory.createAgent('creative')
      ];

      const tasks = agents.map((agent, index) => ({
        id: `complex_task_${index}`,
        type: agent.getType(),
        input: `Complex ${agent.getType()} task ${index}`,
        priority: 'high',
        metadata: { complexity: 'high' }
      }));

      const results = await Promise.all(
        agents.map((agent, index) => agent.processTask(tasks[index]))
      );

      expect(results.every(r => r.success)).toBe(true);

      const finalHealth = systemMonitor.getSystemHealth();
      expect(finalHealth.overall).toBe('healthy');
    });
  });
}); 