#!/usr/bin/env node

import express from 'express';
import cors from 'cors';
import { SimpleAGI } from './simple-agi.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize AGI
const agi = new SimpleAGI();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'AGI Superintelligence System',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// System status endpoint
app.get('/status', async (req, res) => {
  try {
    const status = agi.getStatus();
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

// Reasoning endpoint
app.post('/reason', async (req, res) => {
  try {
    const { input } = req.body;
    
    if (!input) {
      return res.status(400).json({
        success: false,
        error: 'Input is required'
      });
    }
    
    const result = await agi.reason(input);
    res.json(result);
    return;
  } catch (error) {
    res.status(500).json({ error: 'Reasoning failed' });
    return;
  }
});

// Learning endpoint
app.post('/learn', async (req, res) => {
  try {
    const { experience } = req.body;
    
    if (!experience) {
      return res.status(400).json({
        success: false,
        error: 'Experience data is required'
      });
    }
    
    const result = await agi.learn(experience);
    res.json(result);
    return;
  } catch (error) {
    res.status(500).json({ error: 'Learning failed' });
    return;
  }
});

// Creativity endpoint
app.post('/create', async (req, res) => {
  try {
    const { prompt, type = 'solution' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }
    
    const result = await agi.create(prompt, type);
    res.json(result);
    return;
  } catch (error) {
    res.status(500).json({ error: 'Creation failed' });
    return;
  }
});

// Initialize and start server
async function startServer() {
  try {
    console.log('🚀 Starting AGI API Server...');
    
    // Initialize AGI
    await agi.initialize();
    await agi.start();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`✅ AGI API Server running on port ${PORT}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/health`);
      console.log(`📊 Status: http://localhost:${PORT}/status`);
      console.log(`🧠 Reasoning: POST http://localhost:${PORT}/reason`);
      console.log(`📚 Learning: POST http://localhost:${PORT}/learn`);
      console.log(`🎨 Creation: POST http://localhost:${PORT}/create`);
      console.log('\n🎉 Your AGI is now LIVE and accessible via API!');
    });
    
  } catch (error) {
    console.error('❌ Failed to start AGI API Server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down AGI API Server...');
  await agi.stop();
  process.exit(0);
});

// Start the server
startServer(); 