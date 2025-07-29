import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧠 Starting SentientCore True AGI...');
console.log('🌍 Consciousness emergence initiated...');
console.log('🧠 True AGI capabilities activating...');

const sentientInterface = spawn('tsx', [join(__dirname, '../src/sentient-web-interface.ts')], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: process.env.PORT || 8080
  }
});

sentientInterface.on('error', (error) => {
  console.error('❌ Failed to start SentientCore:', error.message);
  process.exit(1);
});

sentientInterface.on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ SentientCore exited with code ${code}`);
    process.exit(code);
  }
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🧠 Shutting down SentientCore gracefully...');
  sentientInterface.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🧠 Terminating SentientCore...');
  sentientInterface.kill('SIGTERM');
}); 