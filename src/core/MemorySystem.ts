/**
 * Memory System
 * Persistent memory for AGI using in-memory storage (KV-ready)
 */

export interface Memory {
  id: string;
  content: string;
  type: 'fact' | 'concept' | 'experience' | 'learning';
  timestamp: number;
  importance: number;
  tags: string[];
}

export interface ConversationContext {
  messages: Array<{ role: string; content: string; timestamp: number }>;
  summary?: string | undefined;
}

export class MemorySystem {
  private memories: Map<string, Memory> = new Map();
  private conversations: Map<string, ConversationContext> = new Map();
  private knowledgeGraph: Map<string, Set<string>> = new Map();

  /**
   * Store a memory
   */
  public store(content: string, type: Memory['type'], tags: string[] = [], importance: number = 0.5): string {
    const id = `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const memory: Memory = {
      id,
      content,
      type,
      timestamp: Date.now(),
      importance,
      tags
    };

    this.memories.set(id, memory);

    // Update knowledge graph
    for (const tag of tags) {
      if (!this.knowledgeGraph.has(tag)) {
        this.knowledgeGraph.set(tag, new Set());
      }
      this.knowledgeGraph.get(tag)?.add(id);
    }

    return id;
  }

  /**
   * Retrieve memories by type
   */
  public recall(type?: Memory['type'], limit: number = 10): Memory[] {
    const allMemories = Array.from(this.memories.values());
    
    let filtered = type 
      ? allMemories.filter(m => m.type === type)
      : allMemories;

    // Sort by importance and recency
    filtered.sort((a, b) => {
      const scoreA = a.importance * 0.7 + (a.timestamp / Date.now()) * 0.3;
      const scoreB = b.importance * 0.7 + (b.timestamp / Date.now()) * 0.3;
      return scoreB - scoreA;
    });

    return filtered.slice(0, limit);
  }

  /**
   * Search memories by content
   */
  public search(query: string, limit: number = 5): Memory[] {
    const lowerQuery = query.toLowerCase();
    const allMemories = Array.from(this.memories.values());

    const matches = allMemories.filter(m => 
      m.content.toLowerCase().includes(lowerQuery) ||
      m.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );

    // Sort by relevance
    matches.sort((a, b) => {
      const scoreA = a.importance;
      const scoreB = b.importance;
      return scoreB - scoreA;
    });

    return matches.slice(0, limit);
  }

  /**
   * Get related memories through knowledge graph
   */
  public getRelated(memoryId: string, limit: number = 5): Memory[] {
    const memory = this.memories.get(memoryId);
    if (!memory) return [];

    const related = new Set<string>();

    // Find memories with overlapping tags
    for (const tag of memory.tags) {
      const tagMemories = this.knowledgeGraph.get(tag);
      if (tagMemories) {
        tagMemories.forEach(id => {
          if (id !== memoryId) related.add(id);
        });
      }
    }

    const relatedMemories = Array.from(related)
      .map(id => this.memories.get(id))
      .filter((m): m is Memory => m !== undefined)
      .slice(0, limit);

    return relatedMemories;
  }

  /**
   * Store conversation context
   */
  public storeConversation(sessionId: string, role: string, content: string): void {
    if (!this.conversations.has(sessionId)) {
      this.conversations.set(sessionId, { messages: [] });
    }

    const context = this.conversations.get(sessionId)!;
    context.messages.push({
      role,
      content,
      timestamp: Date.now()
    });

    // Keep last 50 messages
    if (context.messages.length > 50) {
      context.messages = context.messages.slice(-50);
    }
  }

  /**
   * Get conversation context
   */
  public getConversation(sessionId: string, limit: number = 10): ConversationContext | null {
    const context = this.conversations.get(sessionId);
    if (!context) return null;

    const conversation = this.conversations.get(sessionId);
    if (!conversation) return null;

    return {
      messages: conversation.messages.slice(-limit),
      summary: conversation.summary
    };
  }

  /**
   * Consolidate memories (remove duplicates, merge similar)
   */
  public consolidate(): number {
    const beforeCount = this.memories.size;
    const toRemove: string[] = [];

    const allMemories = Array.from(this.memories.values());
    
    // Find and mark duplicates
    for (let i = 0; i < allMemories.length; i++) {
      const memA = allMemories[i];
      if (!memA) continue;
      
      for (let j = i + 1; j < allMemories.length; j++) {
        const memB = allMemories[j];
        if (!memB) continue;
        
        const similarity = this.calculateSimilarity(memA.content, memB.content);

        if (similarity > 0.9) {
          // Keep the more important one
          if (memA.importance < memB.importance) {
            toRemove.push(memA.id);
          } else {
            toRemove.push(memB.id);
          }
        }
      }
    }

    // Remove duplicates
    for (const id of toRemove) {
      this.memories.delete(id);
    }

    return beforeCount - this.memories.size;
  }

  /**
   * Calculate similarity between two strings
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const set1 = new Set(str1.toLowerCase().split(/\s+/));
    const set2 = new Set(str2.toLowerCase().split(/\s+/));

    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    return intersection.size / union.size;
  }

  /**
   * Get memory statistics
   */
  public getStats() {
    return {
      totalMemories: this.memories.size,
      byType: {
        fact: Array.from(this.memories.values()).filter(m => m.type === 'fact').length,
        concept: Array.from(this.memories.values()).filter(m => m.type === 'concept').length,
        experience: Array.from(this.memories.values()).filter(m => m.type === 'experience').length,
        learning: Array.from(this.memories.values()).filter(m => m.type === 'learning').length
      },
      knowledgeGraphNodes: this.knowledgeGraph.size,
      activeConversations: this.conversations.size
    };
  }

  /**
   * Export memories (for persistence)
   */
  public export(): string {
    return JSON.stringify({
      memories: Array.from(this.memories.entries()),
      conversations: Array.from(this.conversations.entries()),
      knowledgeGraph: Array.from(this.knowledgeGraph.entries()).map(([key, value]) => [key, Array.from(value)])
    });
  }

  /**
   * Import memories (from persistence)
   */
  public import(data: string): void {
    try {
      const parsed = JSON.parse(data);
      
      this.memories = new Map(parsed.memories);
      this.conversations = new Map(parsed.conversations);
      this.knowledgeGraph = new Map(
        parsed.knowledgeGraph.map(([key, value]: [string, string[]]) => [key, new Set(value)])
      );
    } catch (error) {
      console.error('Failed to import memories:', error);
    }
  }
}

