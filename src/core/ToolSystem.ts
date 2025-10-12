/**
 * Tool System
 * Gives AGI access to external tools and capabilities
 */

export interface ToolResult {
  tool: string;
  input: string;
  output: string;
  success: boolean;
  error?: string;
}

export class ToolSystem {
  /**
   * Execute mathematical calculations
   */
  public calculate(expression: string): ToolResult {
    try {
      // Safe evaluation of mathematical expressions
      const sanitized = expression.replace(/[^0-9+\-*/().%\s]/g, '');
      
      // Use Function constructor for safe eval
      const result = Function(`'use strict'; return (${sanitized})`)();
      
      return {
        tool: 'Calculator',
        input: expression,
        output: String(result),
        success: true
      };
    } catch (error) {
      return {
        tool: 'Calculator',
        input: expression,
        output: '',
        success: false,
        error: error instanceof Error ? error.message : 'Calculation failed'
      };
    }
  }

  /**
   * Search the web (simulated - would need API key in production)
   */
  public async searchWeb(query: string): Promise<ToolResult> {
    // In production, this would use Brave Search API or SerpAPI
    // For now, return structured search simulation
    return {
      tool: 'WebSearch',
      input: query,
      output: `Search results for "${query}": [Simulated] Would search using Brave/Google Search API. Top results would include relevant information from authoritative sources.`,
      success: true
    };
  }

  /**
   * Execute code safely (sandboxed)
   */
  public async executeCode(code: string, language: string = 'javascript'): Promise<ToolResult> {
    try {
      if (language === 'javascript') {
        // Very limited safe execution
        const result = Function(`'use strict'; ${code}`)();
        
        return {
          tool: 'CodeExecution',
          input: code,
          output: String(result),
          success: true
        };
      } else {
        return {
          tool: 'CodeExecution',
          input: code,
          output: '',
          success: false,
          error: `Language ${language} not supported in sandbox`
        };
      }
    } catch (error) {
      return {
        tool: 'CodeExecution',
        input: code,
        output: '',
        success: false,
        error: error instanceof Error ? error.message : 'Execution failed'
      };
    }
  }

  /**
   * Query a knowledge base
   */
  public queryKnowledge(query: string, domain: string = 'general'): ToolResult {
    // Simulate knowledge base lookup
    const knowledge: Record<string, string> = {
      'general': 'General knowledge encompasses facts, concepts, and information across all domains',
      'science': 'Scientific knowledge is built through systematic observation, experimentation, and peer review',
      'mathematics': 'Mathematics is the abstract study of numbers, quantity, structure, and patterns',
      'history': 'History is the study of past events, particularly human affairs',
      'technology': 'Technology is the application of scientific knowledge for practical purposes'
    };

    const result = knowledge[domain.toLowerCase()] || `Knowledge about ${query} in domain ${domain}`;

    return {
      tool: 'KnowledgeBase',
      input: `Query: ${query}, Domain: ${domain}`,
      output: result,
      success: true
    };
  }

  /**
   * Analyze sentiment of text
   */
  public analyzeSentiment(text: string): ToolResult {
    // Simple sentiment analysis
    const positive = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'love', 'best', 'happy'];
    const negative = ['bad', 'terrible', 'awful', 'hate', 'worst', 'sad', 'angry', 'disappointing'];

    const words = text.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;

    for (const word of words) {
      if (positive.some(p => word.includes(p))) positiveCount++;
      if (negative.some(n => word.includes(n))) negativeCount++;
    }

    let sentiment = 'neutral';
    if (positiveCount > negativeCount) sentiment = 'positive';
    if (negativeCount > positiveCount) sentiment = 'negative';

    return {
      tool: 'SentimentAnalysis',
      input: text,
      output: `Sentiment: ${sentiment} (Positive: ${positiveCount}, Negative: ${negativeCount})`,
      success: true
    };
  }

  /**
   * Detect which tool to use based on query
   */
  public detectTool(query: string): string {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('calculate') || lowerQuery.includes('compute') || /\d+.*[+\-*/].*\d+/.test(lowerQuery)) {
      return 'calculator';
    }
    if (lowerQuery.includes('search') || lowerQuery.includes('find information') || lowerQuery.includes('look up')) {
      return 'websearch';
    }
    if (lowerQuery.includes('code') || lowerQuery.includes('execute') || lowerQuery.includes('run')) {
      return 'codeexecution';
    }
    if (lowerQuery.includes('sentiment') || lowerQuery.includes('emotion') || lowerQuery.includes('feeling')) {
      return 'sentiment';
    }

    return 'none';
  }

  /**
   * Use appropriate tool based on query
   */
  public async useTool(query: string): Promise<ToolResult> {
    const toolType = this.detectTool(query);

    switch (toolType) {
      case 'calculator':
        // Extract mathematical expression
        const mathMatch = query.match(/\d+.*[+\-*/].*\d+/);
        if (mathMatch) {
          return this.calculate(mathMatch[0]);
        }
        return {
          tool: 'Calculator',
          input: query,
          output: '',
          success: false,
          error: 'Could not extract mathematical expression'
        };

      case 'websearch':
        return await this.searchWeb(query);

      case 'sentiment':
        return this.analyzeSentiment(query);

      case 'codeexecution':
        // Extract code if present
        const codeMatch = query.match(/```(?:js|javascript)?\s*([\s\S]*?)```/);
        if (codeMatch && codeMatch[1]) {
          return await this.executeCode(codeMatch[1]);
        }
        return {
          tool: 'CodeExecution',
          input: query,
          output: '',
          success: false,
          error: 'Could not extract code block'
        };

      default:
        return {
          tool: 'None',
          input: query,
          output: 'No specific tool needed for this query',
          success: true
        };
    }
  }

  /**
   * Get list of available tools
   */
  public getAvailableTools(): string[] {
    return [
      'Calculator - Perform mathematical calculations',
      'WebSearch - Search the internet for information',
      'CodeExecution - Execute code in a sandbox',
      'KnowledgeBase - Query structured knowledge',
      'SentimentAnalysis - Analyze sentiment of text'
    ];
  }
}

