import { RealAGI } from './RealAGI';

async function testRealAGI() {
  console.log('🤖 Testing Real AGI System...\n');
  
  const agi = new RealAGI();
  
  // Test 1: Reasoning
  console.log('🧠 Testing Reasoning Capabilities...');
  const reasoningResult = await agi.reason(
    "What is the relationship between consciousness and artificial intelligence, and how can we create true AGI?"
  );
  console.log('Reasoning Result:', JSON.stringify(reasoningResult, null, 2));
  console.log('\n');
  
  // Test 2: Learning
  console.log('📚 Testing Learning Capabilities...');
  const learningResult = await agi.learn(
    "New information about quantum computing and its applications in AI. Quantum computers can solve complex problems that classical computers cannot."
  );
  console.log('Learning Result:', JSON.stringify(learningResult, null, 2));
  console.log('\n');
  
  // Test 3: Creativity
  console.log('🎨 Testing Creativity Capabilities...');
  const creativityResult = await agi.create(
    "Create a novel solution for sustainable energy that combines AI and renewable resources"
  );
  console.log('Creativity Result:', JSON.stringify(creativityResult, null, 2));
  console.log('\n');
  
  // Test 4: Status
  console.log('📊 Testing Status and Consciousness...');
  const statusResult = await agi.getStatus();
  console.log('Status Result:', JSON.stringify(statusResult, null, 2));
  console.log('\n');
  
  console.log('✅ Real AGI Testing Complete!');
}

testRealAGI().catch(console.error); 