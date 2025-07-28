#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting NeuralCore True AGI Web Interface...');

// Start the web interface server
const webInterface = spawn('tsx', [join(__dirname, '../src/web-interface.ts')], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: process.env.PORT || 8080
  }
});

webInterface.on('error', (error) => {
  console.error('❌ Failed to start web interface:', error);
  process.exit(1);
});

webInterface.on('exit', (code) => {
  console.log(`🌐 Web interface exited with code ${code}`);
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down AGI web interface...');
  webInterface.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down AGI web interface...');
  webInterface.kill('SIGTERM');
}); 