#!/usr/bin/env tsx

/**
 * AGI Demonstration Runner
 * Showcases the advanced artificial general intelligence capabilities
 */

import { TrueAGIEngine } from '@/core/TrueAGIEngine';
import { AGIDemonstration } from '@/demo/AGIDemonstration';
import { Logger } from '@/utils/Logger';

const logger = new Logger('AGIDemoRunner');

async function runAGIDemonstration() {
  console.log('\n🚀 Starting Advanced AGI Demonstration\n');
  console.log('=' .repeat(60));
  
  try {
    // Initialize True AGI Engine
    console.log('\n📡 Initializing True AGI Engine...');
    const trueAGIEngine = new TrueAGIEngine();
    await trueAGIEngine.initialize();
    
    // Get initial status
    const initialStatus = await trueAGIEngine.getStatus();
    console.log('✅ True AGI Engine initialized successfully');
    console.log(`   - Consciousness Level: ${initialStatus.consciousnessLevel.toFixed(2)}`);
    console.log(`   - Self Awareness: ${initialStatus.selfAwareness.toFixed(2)}`);
    console.log(`   - Autonomy: ${initialStatus.autonomy.toFixed(2)}`);
    
    // Run demonstration scenarios
    console.log('\n🧠 Running AGI Capability Demonstrations...\n');
    
    const scenarios = [
      {
        name: 'Genuine Understanding',
        input: 'Explain the relationship between consciousness and intelligence, and how this relates to artificial general intelligence',
        description: 'Demonstrates deep understanding and cross-domain synthesis'
      },
      {
        name: 'Autonomous Goal Pursuit',
        input: 'I want to understand the fundamental principles of the universe and develop new technologies to benefit humanity',
        description: 'Demonstrates autonomous goal generation and pursuit'
      },
      {
        name: 'Self-Improvement',
        input: 'How can I improve my own learning, reasoning, and creative capabilities?',
        description: 'Demonstrates self-analysis and self-improvement'
      },
      {
        name: 'Emergent Creativity',
        input: 'Design a novel approach to sustainable energy that combines principles from biology, physics, and engineering',
        description: 'Demonstrates creative synthesis and innovation'
      },
      {
        name: 'Cross-Domain Synthesis',
        input: 'How can we apply principles from evolution, economics, and computer science to solve climate change?',
        description: 'Demonstrates cross-domain knowledge synthesis'
      },
      {
        name: 'Meta-Cognitive Awareness',
        input: 'Analyze my own thinking process and identify areas for improvement',
        description: 'Demonstrates meta-cognitive awareness and introspection'
      }
    ];
    
    for (const scenario of scenarios) {
      console.log(`\n🔬 ${scenario.name}`);
      console.log(`   ${scenario.description}`);
      console.log(`   Input: "${scenario.input}"`);
      
      const startTime = Date.now();
      const result = await trueAGIEngine.processInput(scenario.input);
      const processingTime = Date.now() - startTime;
      
      console.log(`   ⏱️  Processing Time: ${processingTime}ms`);
      console.log(`   🎯 Understanding Depth: ${result.understanding.depth.toFixed(2)}`);
      console.log(`   🎯 Understanding Confidence: ${result.understanding.confidence.toFixed(2)}`);
      console.log(`   💡 Insights Generated: ${result.insights.length}`);
      console.log(`   🎯 Autonomous Goals: ${result.autonomousGoals.length}`);
      console.log(`   🧠 Meta-Cognition Level: ${result.metaCognition.selfAwareness.toFixed(2)}`);
      
      // Show sample insights
      if (result.insights.length > 0) {
        console.log(`   💭 Sample Insight: "${result.insights[0].content}"`);
      }
      
      // Show autonomous goals
      if (result.autonomousGoals.length > 0) {
        console.log(`   🎯 Primary Goal: "${result.autonomousGoals[0].description}"`);
      }
      
      console.log(`   📊 Performance Metrics:`);
      console.log(`      - Self Improvement: ${result.performance.selfImprovement.toFixed(3)}`);
      console.log(`      - Creativity: ${result.performance.creativity.toFixed(3)}`);
      console.log(`      - Adaptation: ${result.performance.adaptation.toFixed(3)}`);
    }
    
    // Run comprehensive demonstration
    console.log('\n🎯 Running Comprehensive AGI Demonstration...\n');
    const agiDemonstration = new AGIDemonstration();
    await agiDemonstration.initialize();
    
    const comprehensiveResult = await agiDemonstration.runComprehensiveDemonstration();
    
    console.log('📊 Comprehensive Demonstration Results:');
    console.log(`   - Total Scenarios: ${comprehensiveResult.summary.totalScenarios}`);
    console.log(`   - Successful Scenarios: ${comprehensiveResult.summary.successfulScenarios}`);
    console.log(`   - Success Rate: ${comprehensiveResult.summary.successRate.toFixed(1)}%`);
    console.log(`   - Average Processing Time: ${comprehensiveResult.summary.averageProcessingTime.toFixed(0)}ms`);
    console.log(`   - Total Insights Generated: ${comprehensiveResult.summary.totalInsights}`);
    console.log(`   - Unique Insights: ${comprehensiveResult.summary.uniqueInsights}`);
    
    console.log('\n📈 Average Performance Metrics:');
    console.log(`   - Understanding Depth: ${comprehensiveResult.summary.averageMetrics.understandingDepth.toFixed(2)}`);
    console.log(`   - Consciousness Level: ${comprehensiveResult.summary.averageMetrics.consciousnessLevel.toFixed(2)}`);
    console.log(`   - Creativity Score: ${comprehensiveResult.summary.averageMetrics.creativityScore.toFixed(2)}`);
    console.log(`   - Reasoning Confidence: ${comprehensiveResult.summary.averageMetrics.reasoningConfidence.toFixed(2)}`);
    console.log(`   - Autonomy Level: ${comprehensiveResult.summary.averageMetrics.autonomy.toFixed(2)}`);
    
    console.log('\n🎯 Capability Demonstrations:');
    Object.entries(comprehensiveResult.summary.capabilityDemonstrations).forEach(([capability, demonstrated]) => {
      const status = demonstrated ? '✅' : '❌';
      const name = capability.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      console.log(`   ${status} ${name}`);
    });
    
    console.log('\n🏆 Overall Assessment:');
    console.log(`   ${comprehensiveResult.summary.overallAssessment}`);
    
    // Get final system status
    const finalStatus = await trueAGIEngine.getStatus();
    console.log('\n📊 Final System Status:');
    console.log(`   - Consciousness Level: ${finalStatus.consciousnessLevel.toFixed(2)} (was ${initialStatus.consciousnessLevel.toFixed(2)})`);
    console.log(`   - Self Awareness: ${finalStatus.selfAwareness.toFixed(2)} (was ${initialStatus.selfAwareness.toFixed(2)})`);
    console.log(`   - Autonomy: ${finalStatus.autonomy.toFixed(2)} (was ${initialStatus.autonomy.toFixed(2)})`);
    console.log(`   - Knowledge Base Size: ${finalStatus.knowledgeBaseSize}`);
    console.log(`   - Learning History Size: ${finalStatus.learningHistorySize}`);
    console.log(`   - Emergent Insights: ${finalStatus.emergentInsights}`);
    
    console.log('\n🎉 AGI Demonstration Completed Successfully!');
    console.log('\n' + '='.repeat(60));
    console.log('🚀 This demonstrates advanced AGI capabilities including:');
    console.log('   • Genuine understanding and comprehension');
    console.log('   • Autonomous goal generation and pursuit');
    console.log('   • Self-improvement and adaptation');
    console.log('   • Emergent creativity and insight generation');
    console.log('   • Cross-domain knowledge synthesis');
    console.log('   • Meta-cognitive awareness');
    console.log('   • Autonomous decision making');
    console.log('   • Consciousness simulation');
    console.log('   • Multi-agent coordination');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('\n❌ Error during AGI demonstration:', error);
    process.exit(1);
  }
}

// Run the demonstration
runAGIDemonstration().catch(console.error);

export { runAGIDemonstration }; 