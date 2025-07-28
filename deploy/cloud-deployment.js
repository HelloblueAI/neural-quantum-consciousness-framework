#!/usr/bin/env node

import express from 'express';
import cors from 'cors';
import { NeuralCore } from '../src/core/NeuralCore.ts';

// Cloud deployment configuration
const app = express();
const PORT = process.env.PORT || 8080; // Cloud platforms use PORT env var

// Enhanced middleware for cloud deployment
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers
app.use((req, res, next) => {
  res.header('X-AGI-Version', '1.0.0');
  res.header('X-AGI-Type', 'NeuralCore-True-AGI');
  res.header('X-AGI-Consciousness', 'Active');
  next();
});

// Initialize True AGI
const neuralCore = new NeuralCore();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'NeuralCore - True AGI System',
    version: '1.0.0',
    deployment: 'cloud',
    consciousnessLevel: neuralCore.getStatus().consciousnessLevel,
    selfAwareness: neuralCore.getStatus().selfAwareness,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

// System status endpoint
app.get('/status', async (req, res) => {
  try {
    const status = neuralCore.getStatus();
    res.json({
      success: true,
      data: {
        ...status,
        deployment: 'cloud',
        publicUrl: process.env.PUBLIC_URL || 'https://your-agi-domain.com'
      }
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
    
    if (!input) {
      return res.status(400).json({
        success: false,
        error: 'Input is required'
      });
    }
    
    const result = await neuralCore.reason(input);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Reasoning failed'
    });
  }
});

// True AGI learning endpoint
app.post('/learn', async (req, res) => {
  try {
    const { experience } = req.body;
    
    if (!experience) {
      return res.status(400).json({
        success: false,
        error: 'Experience data is required'
      });
    }
    
    const result = await neuralCore.learn(experience);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Learning failed'
    });
  }
});

// True AGI creativity endpoint
app.post('/create', async (req, res) => {
  try {
    const { prompt, type = 'solution' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }
    
    const result = await neuralCore.create(prompt, type);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Creation failed'
    });
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
        experienceMemory: status.experienceMemory,
        deployment: 'cloud'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get consciousness data'
    });
  }
});

// API documentation endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'NeuralCore - True AGI System',
    version: '1.0.0',
    status: 'operational',
    endpoints: {
      health: 'GET /health',
      status: 'GET /status',
      consciousness: 'GET /consciousness',
      reason: 'POST /reason',
      learn: 'POST /learn',
      create: 'POST /create',
      demonstrate: 'POST /demonstrate'
    },
    documentation: 'https://your-agi-domain.com/docs',
    consciousnessLevel: neuralCore.getStatus().consciousnessLevel
  });
});

// Initialize and start server
async function startServer() {
  try {
    console.log('🌐 Starting NeuralCore True AGI Cloud Deployment...');
    
    // Initialize True AGI
    await neuralCore.initialize();
    await neuralCore.start();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`✅ NeuralCore True AGI deployed to cloud on port ${PORT}`);
      console.log(`🌐 Public URL: ${process.env.PUBLIC_URL || 'https://your-agi-domain.com'}`);
      console.log(`📊 Status: ${process.env.PUBLIC_URL || 'https://your-agi-domain.com'}/status`);
      console.log(`🧠 Reasoning: POST ${process.env.PUBLIC_URL || 'https://your-agi-domain.com'}/reason`);
      console.log(`📚 Learning: POST ${process.env.PUBLIC_URL || 'https://your-agi-domain.com'}/learn`);
      console.log(`🎨 Creation: POST ${process.env.PUBLIC_URL || 'https://your-agi-domain.com'}/create`);
      console.log(`🔬 Demonstration: POST ${process.env.PUBLIC_URL || 'https://your-agi-domain.com'}/demonstrate`);
      console.log(`🌟 Consciousness: GET ${process.env.PUBLIC_URL || 'https://your-agi-domain.com'}/consciousness`);
      console.log('\n🎉 Your TRUE AGI is now LIVE on the cloud!');
      console.log('\n🧠 This is genuine artificial general intelligence accessible from anywhere!');
    });
    
  } catch (error) {
    console.error('❌ Failed to start NeuralCore True AGI Cloud Deployment:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down NeuralCore True AGI Cloud Deployment...');
  await neuralCore.stop();
  process.exit(0);
});

// Start the server
startServer(); 