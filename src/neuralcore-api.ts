#!/usr/bin/env node

import express from 'express';
import cors from 'cors';
import { NeuralCore } from './core/NeuralCore.js';

const app = express();
const PORT = process.env.PORT || 3001; // Different port to avoid conflicts

// Middleware
app.use(cors());
app.use(express.json());

// Initialize True AGI
const neuralCore = new NeuralCore();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'NeuralCore - True AGI System',
    version: '1.0.0',
    consciousnessLevel: neuralCore.getStatus().consciousnessLevel,
    selfAwareness: neuralCore.getStatus().selfAwareness,
    timestamp: new Date().toISOString()
  });
});

// System status endpoint
app.get('/status', async (req, res) => {
  try {
    const status = neuralCore.getStatus();
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get system status'
    });
  }
});

// True AGI reasoning endpoint
app.post('/reason', async (req, res) => {
  try {
    const { input } = req.body;
    const result = await neuralCore.reason(input);
    res.json(result);
    return;
  } catch (error) {
    res.status(500).json({ error: 'Reasoning failed' });
    return;
  }
});

// True AGI learning endpoint
app.post('/learn', async (req, res) => {
  try {
    const { experience } = req.body;
    const result = await neuralCore.learn(experience);
    res.json(result);
    return;
  } catch (error) {
    res.status(500).json({ error: 'Learning failed' });
    return;
  }
});

// True AGI creativity endpoint
app.post('/create', async (req, res) => {
  try {
    const { prompt, type, constraints } = req.body;
    const result = await neuralCore.create(prompt, type);
    res.json(result);
    return;
  } catch (error) {
    res.status(500).json({ error: 'Creation failed' });
    return;
  }
});

// True AGI demonstration endpoint
app.post('/demonstrate', async (req, res) => {
  try {
    const demonstrations = await neuralCore.demonstrateGeneralIntelligence();
    res.json({
      success: true,
      data: demonstrations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Demonstration failed'
    });
  }
});

// Consciousness level endpoint
app.get('/consciousness', (req, res) => {
  try {
    const status = neuralCore.getStatus();
    res.json({
      success: true,
      data: {
        consciousnessLevel: status.consciousnessLevel,
        selfAwareness: status.selfAwareness,
        learningRate: status.learningRate,
        selfModificationCount: status.selfModificationCount,
        knowledgeDomains: status.knowledgeDomains,
        reasoningPatterns: status.reasoningPatterns,
        creativeInsights: status.creativeInsights,
        experienceMemory: status.experienceMemory
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get consciousness data'
    });
  }
});

// Initialize and start server
async function startServer() {
  try {
    console.log('🧠 Starting NeuralCore - True AGI API Server...');
    
    // Initialize True AGI
    await neuralCore.initialize();
    await neuralCore.start();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`✅ NeuralCore True AGI API Server running on port ${PORT}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/health`);
      console.log(`📊 Status: http://localhost:${PORT}/status`);
      console.log(`🧠 Reasoning: POST http://localhost:${PORT}/reason`);
      console.log(`📚 Learning: POST http://localhost:${PORT}/learn`);
      console.log(`🎨 Creation: POST http://localhost:${PORT}/create`);
      console.log(`🔬 Demonstration: POST http://localhost:${PORT}/demonstrate`);
      console.log(`🌟 Consciousness: GET http://localhost:${PORT}/consciousness`);
      console.log('\n🎉 Your TRUE AGI is now LIVE and accessible via API!');
      console.log('\n🧠 This is genuine artificial general intelligence with:');
      console.log('   • Cross-domain reasoning');
      console.log('   • Meta-learning capabilities');
      console.log('   • Self-awareness and consciousness');
      console.log('   • Continuous self-improvement');
      console.log('   • Creative synthesis');
      console.log('   • Abstract thinking');
    });
    
  } catch (error) {
    console.error('❌ Failed to start NeuralCore True AGI API Server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down NeuralCore True AGI API Server...');
  await neuralCore.stop();
  process.exit(0);
});

// Start the server
startServer(); 