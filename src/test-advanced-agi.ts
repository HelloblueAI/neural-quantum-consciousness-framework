import { AdvancedAGI } from './AdvancedAGI.js';

async function testAdvancedAGI() {
  console.log('🧠 Testing SentientCore System...\n');
  
  const agi = new AdvancedAGI();
  
  // Test reasoning
  console.log('1. Testing Reasoning:');
  const reasoningResult = await agi.reason('What is the fundamental difference between artificial intelligence and artificial general intelligence?');
  console.log('Reasoning Result:', JSON.stringify(reasoningResult, null, 2));
  console.log('\n');
  
  // Test learning
  console.log('2. Testing Learning:');
  const learningResult = await agi.learn('The concept of consciousness involves subjective experience, self-awareness, and the ability to introspect about ones own mental states.');
  console.log('Learning Result:', JSON.stringify(learningResult, null, 2));
  console.log('\n');
  
  // Test creativity
  console.log('3. Testing Creativity:');
  const creativityResult = await agi.create('Design a novel approach to solve the problem of climate change using artificial intelligence');
  console.log('Creativity Result:', JSON.stringify(creativityResult, null, 2));
  console.log('\n');
  
  // Test status
  console.log('4. Testing Status:');
  const statusResult = await agi.getStatus();
  console.log('Status Result:', JSON.stringify(statusResult, null, 2));
  console.log('\n');
  
  console.log('✅ SentientCore System Test Complete!');
}

testAdvancedAGI().catch(console.error); 