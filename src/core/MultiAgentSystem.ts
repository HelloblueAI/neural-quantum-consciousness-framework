/**
 * Multi-Agent System
 * Coordinates multiple specialized AI agents
 */

import { RealLearningEngine } from './RealLearningEngine';
import { RealLLMIntegration } from './RealLLMIntegration';
import { RealReasoningEngine } from './RealReasoningEngine';
import { ChainOfThoughtReasoning } from './ChainOfThoughtReasoning';

export interface AgentResponse {
  agent: string;
  response: string;
  confidence: number;
  reasoning?: string;
}

export interface MultiAgentResult {
  problem: string;
  agentResponses: AgentResponse[];
  consensus: string;
  finalAnswer: string;
  confidence: number;
  votingResults: Record<string, number>;
}

export class MultiAgentSystem {
  private learningAgent: RealLearningEngine;
  private reasoningAgent: RealReasoningEngine;
  private creativeAgent?: RealLLMIntegration;
  private chainOfThought: ChainOfThoughtReasoning;

  constructor(anthropicKey?: string, openaiKey?: string) {
    this.learningAgent = new RealLearningEngine();
    this.reasoningAgent = new RealReasoningEngine(anthropicKey, openaiKey);
    
    if (anthropicKey || openaiKey) {
      this.creativeAgent = new RealLLMIntegration(anthropicKey, openaiKey);
    }
    
    this.chainOfThought = new ChainOfThoughtReasoning(anthropicKey, openaiKey);
  }

  /**
   * Solve a problem using multiple agents
   */
  public async solveProblem(problem: string): Promise<MultiAgentResult> {
    const agentResponses: AgentResponse[] = [];

    // Agent 1: Reasoning Agent (Logic-based)
    try {
      const reasoningResult = this.reasoningAgent.deductiveReason([problem]);
      agentResponses.push({
        agent: 'ReasoningAgent',
        response: reasoningResult.conclusion,
        confidence: reasoningResult.confidence,
        reasoning: 'Deductive logic applied'
      });
    } catch (error) {
      console.log('Reasoning agent failed:', error);
    }

    // Agent 2: Chain-of-Thought Agent (Step-by-step)
    try {
      const cotResult = await this.chainOfThought.reason(problem);
      agentResponses.push({
        agent: 'ChainOfThoughtAgent',
        response: cotResult.finalAnswer,
        confidence: cotResult.confidence,
        reasoning: `${cotResult.steps.length} reasoning steps`
      });
    } catch (error) {
      console.log('CoT agent failed:', error);
    }

    // Agent 3: Creative Agent (LLM-based) - if available
    if (this.creativeAgent && this.creativeAgent.isAvailable()) {
      try {
        const creativeResult = await this.creativeAgent.solveProblem(problem);
        agentResponses.push({
          agent: 'CreativeAgent',
          response: creativeResult.answer,
          confidence: creativeResult.confidence,
          reasoning: 'Advanced AI generation'
        });
      } catch (error) {
        console.log('Creative agent failed:', error);
      }
    }

    // Agent 4: Critic Agent - Evaluate all responses
    const criticEvaluation = this.evaluateResponses(agentResponses);
    agentResponses.push({
      agent: 'CriticAgent',
      response: criticEvaluation.bestResponse,
      confidence: criticEvaluation.confidence,
      reasoning: 'Meta-evaluation of all agent responses'
    });

    // Meta-Agent: Synthesize all responses
    const consensus = this.buildConsensus(agentResponses);
    const votingResults = this.calculateVotes(agentResponses);

    return {
      problem,
      agentResponses,
      consensus,
      finalAnswer: consensus,
      confidence: this.calculateOverallConfidence(agentResponses),
      votingResults
    };
  }

  /**
   * Generate creative content using multiple agents
   */
  public async create(prompt: string, type: string = 'text'): Promise<MultiAgentResult> {
    const agentResponses: AgentResponse[] = [];

    // Creative Agent 1: Direct LLM
    if (this.creativeAgent && this.creativeAgent.isAvailable()) {
      try {
        const result = await this.creativeAgent.generateCreative(prompt, type);
        agentResponses.push({
          agent: 'CreativeAgentPrimary',
          response: result.answer,
          confidence: result.confidence,
          reasoning: 'Advanced AI creative generation'
        });
      } catch (error) {
        console.log('Primary creative agent failed:', error);
      }
    }

    // Creative Agent 2: Chain-of-thought creative
    try {
      const cotResult = await this.chainOfThought.reason(`Create ${type} about: ${prompt}`);
      agentResponses.push({
        agent: 'CreativeAgentCoT',
        response: cotResult.finalAnswer,
        confidence: cotResult.confidence,
        reasoning: 'Step-by-step creative reasoning'
      });
    } catch (error) {
      console.log('CoT creative agent failed:', error);
    }

    // Synthesize creative outputs
    const consensus = this.buildConsensus(agentResponses);

    return {
      problem: prompt,
      agentResponses,
      consensus,
      finalAnswer: consensus,
      confidence: this.calculateOverallConfidence(agentResponses),
      votingResults: this.calculateVotes(agentResponses)
    };
  }

  /**
   * Evaluate responses from all agents
   */
  private evaluateResponses(responses: AgentResponse[]): { bestResponse: string; confidence: number } {
    if (responses.length === 0) {
      return { bestResponse: 'No responses available', confidence: 0 };
    }

    // Find highest confidence response
    let best = responses[0];
    if (!best) {
      return { bestResponse: 'No responses available', confidence: 0 };
    }

    for (const response of responses) {
      if (response.confidence > best.confidence) {
        best = response;
      }
    }

    return {
      bestResponse: best.response,
      confidence: best.confidence
    };
  }

  /**
   * Build consensus from multiple agent responses
   */
  private buildConsensus(responses: AgentResponse[]): string {
    if (responses.length === 0) {
      return 'No consensus - no responses';
    }

    if (responses.length === 1) {
      const first = responses[0];
      return first ? first.response : 'No consensus reached';
    }

    // Weight by confidence and combine
    const weighted = responses
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3); // Top 3 responses

    if (weighted.length === 0) {
      return 'No consensus reached';
    }

    // If we have LLM responses, prefer those
    const llmResponse = weighted.find(r => r.reasoning?.includes('LLM'));
    if (llmResponse) {
      return llmResponse.response;
    }

    // Otherwise return highest confidence
    const first = weighted[0];
    return first ? first.response : 'No consensus reached';
  }

  /**
   * Calculate voting results
   */
  private calculateVotes(responses: AgentResponse[]): Record<string, number> {
    const votes: Record<string, number> = {};
    
    for (const response of responses) {
      votes[response.agent] = response.confidence;
    }
    
    return votes;
  }

  /**
   * Calculate overall confidence from all agents
   */
  private calculateOverallConfidence(responses: AgentResponse[]): number {
    if (responses.length === 0) return 0;
    
    const sum = responses.reduce((acc, r) => acc + r.confidence, 0);
    return sum / responses.length;
  }

  /**
   * Get learning agent statistics
   */
  public getLearningStats() {
    return this.learningAgent.getStatistics();
  }

  /**
   * Check if system has LLM capabilities
   */
  public hasLLM(): boolean {
    return !!(this.creativeAgent && this.creativeAgent.isAvailable());
  }
}

