/**
 * Cross-Domain Reasoning Engine
 * Provides genuine analogical reasoning and cross-domain knowledge transfer
 */

import { RealUnderstandingEngine, Concept, Understanding } from './RealUnderstandingEngine';

export interface AnalogicalMapping {
  sourceDomain: string;
  targetDomain: string;
  sourceConcept: string;
  targetConcept: string;
  similarity: number;
  mappingType: 'structural' | 'functional' | 'causal' | 'relational';
  confidence: number;
}

export interface CrossDomainInsight {
  insight: string;
  sourceDomain: string;
  targetDomain: string;
  concepts: string[];
  confidence: number;
  novelty: number;
}

export class CrossDomainReasoningEngine {
  private understandingEngine: RealUnderstandingEngine;
  private analogicalMappings: AnalogicalMapping[] = [];
  private domainKnowledge: Map<string, Set<string>> = new Map();
  private crossDomainInsights: CrossDomainInsight[] = [];

  constructor(understandingEngine: RealUnderstandingEngine) {
    this.understandingEngine = understandingEngine;
    this.initializeDomainKnowledge();
  }

  /**
   * Initialize base domain knowledge
   */
  private initializeDomainKnowledge(): void {
    // Mathematics domain
    this.domainKnowledge.set('mathematics', new Set([
      'number', 'operation', 'equation', 'function', 'derivative', 'integral',
      'vector', 'matrix', 'probability', 'statistics'
    ]));

    // Physics domain
    this.domainKnowledge.set('physics', new Set([
      'force', 'energy', 'momentum', 'wave', 'particle', 'field',
      'quantum', 'relativity', 'thermodynamics', 'electromagnetism'
    ]));

    // Computer Science domain
    this.domainKnowledge.set('computer_science', new Set([
      'algorithm', 'data', 'structure', 'computation', 'complexity',
      'network', 'protocol', 'system', 'architecture', 'optimization'
    ]));

    // Biology domain
    this.domainKnowledge.set('biology', new Set([
      'cell', 'organism', 'evolution', 'genetics', 'ecosystem',
      'metabolism', 'reproduction', 'adaptation', 'survival'
    ]));

    // Psychology domain
    this.domainKnowledge.set('psychology', new Set([
      'cognition', 'memory', 'learning', 'perception', 'emotion',
      'behavior', 'consciousness', 'intelligence', 'reasoning'
    ]));
  }

  /**
   * Perform analogical reasoning between domains
   */
  public performAnalogicalReasoning(
    sourceUnderstanding: Understanding,
    targetDomain: string
  ): AnalogicalMapping[] {
    const mappings: AnalogicalMapping[] = [];

    sourceUnderstanding.concepts.forEach(sourceConcept => {
      const targetConcepts = this.domainKnowledge.get(targetDomain);
      if (!targetConcepts) return;

      targetConcepts.forEach(targetConcept => {
        if (!sourceConcept || !targetConcept) return;
        
        const similarity = this.calculateConceptSimilarity(
          sourceConcept,
          targetConcept,
          sourceConcept.domain,
          targetDomain
        );

        if (similarity > 0.5) {
          const mappingType = this.determineMappingType(
            sourceConcept,
            targetConcept,
            sourceConcept.domain,
            targetDomain
          );

          mappings.push({
            sourceDomain: sourceConcept.domain,
            targetDomain,
            sourceConcept: sourceConcept.name,
            targetConcept,
            similarity,
            mappingType,
            confidence: similarity * sourceConcept.confidence
          });
        }
      });
    });

    // Sort by confidence
    mappings.sort((a, b) => b.confidence - a.confidence);
    
    // Store for future use
    this.analogicalMappings.push(...mappings.slice(0, 10)); // Keep top 10

    return mappings.slice(0, 5); // Return top 5
  }

  /**
   * Calculate similarity between concepts from different domains
   */
  private calculateConceptSimilarity(
    concept1: Concept,
    concept2: string,
    domain1: string,
    domain2: string
  ): number {
    let similarity = 0;

    // Structural similarity (same position in knowledge hierarchy)
    if (this.hasStructuralSimilarity(concept1.name, concept2, domain1, domain2)) {
      similarity += 0.3;
    }

    // Functional similarity (similar roles)
    if (this.hasFunctionalSimilarity(concept1.name, concept2, domain1, domain2)) {
      similarity += 0.3;
    }

    // Relational similarity (similar relationships)
    const relationalSim = this.calculateRelationalSimilarity(concept1, concept2);
    similarity += relationalSim * 0.2;

    // Semantic similarity (word-based)
    const semanticSim = this.calculateSemanticSimilarity(concept1.name, concept2);
    similarity += semanticSim * 0.2;

    return Math.min(1.0, similarity);
  }

  /**
   * Check structural similarity
   */
  private hasStructuralSimilarity(
    concept1: string,
    concept2: string,
    domain1: string,
    domain2: string
  ): boolean {
    // Known structural mappings
    const structuralMappings: Record<string, Record<string, string[]>> = {
      mathematics: {
        physics: ['number', 'force', 'equation', 'law', 'function', 'wave'],
        computer_science: ['operation', 'algorithm', 'function', 'computation', 'structure', 'data']
      },
      physics: {
        biology: ['force', 'interaction', 'energy', 'metabolism', 'field', 'system'],
        psychology: ['wave', 'frequency', 'energy', 'consciousness', 'field', 'state']
      },
      computer_science: {
        biology: ['network', 'system', 'information', 'genetics', 'algorithm', 'evolution'],
        psychology: ['memory', 'processing', 'learning', 'cognition', 'network', 'pattern']
      }
    };

    const mappings = structuralMappings[domain1]?.[domain2];
    if (!mappings) return false;

    return mappings.includes(concept1) && mappings.includes(concept2);
  }

  /**
   * Check functional similarity
   */
  private hasFunctionalSimilarity(
    concept1: string,
    concept2: string,
    domain1: string,
    domain2: string
  ): boolean {
    // Functional role mappings
    const functionalRoles: Record<string, string[]> = {
      'operation': ['algorithm', 'process', 'function', 'mechanism'],
      'structure': ['system', 'organization', 'architecture', 'framework'],
      'energy': ['power', 'capacity', 'resource', 'potential'],
      'information': ['data', 'knowledge', 'signal', 'message'],
      'network': ['system', 'web', 'connection', 'relationship']
    };

    const roles1 = functionalRoles[concept1] || [];
    const roles2 = functionalRoles[concept2] || [];

    return roles1.some(role => roles2.includes(role)) || 
           roles2.some(role => roles1.includes(role));
  }

  /**
   * Calculate relational similarity
   */
  private calculateRelationalSimilarity(concept1: Concept, concept2: string): number {
    // Check if concepts have similar relationship patterns
    const rels1 = concept1.relationships.length;
    const rels2 = this.countRelationships(concept2);

    if (rels1 === 0 && rels2 === 0) return 0.5;
    if (rels1 === 0 || rels2 === 0) return 0.2;

    const ratio = Math.min(rels1, rels2) / Math.max(rels1, rels2);
    return ratio;
  }

  /**
   * Count relationships for a concept
   */
  private countRelationships(concept: string): number {
    // Simple heuristic based on domain knowledge
    let count = 0;
    this.domainKnowledge.forEach((concepts, domain) => {
      if (concepts.has(concept)) {
        count = concepts.size; // More concepts in domain = more potential relationships
      }
    });
    return Math.min(count, 10); // Cap at 10
  }

  /**
   * Calculate semantic similarity
   */
  private calculateSemanticSimilarity(concept1: string, concept2: string): number {
    // Simple word-based similarity
    const words1 = concept1.toLowerCase().split(/[_\s]+/);
    const words2 = concept2.toLowerCase().split(/[_\s]+/);

    let matches = 0;
    words1.forEach(w1 => {
      if (words2.some(w2 => w1 === w2 || w1.includes(w2) || w2.includes(w1))) {
        matches++;
      }
    });

    return matches / Math.max(words1.length, words2.length);
  }

  /**
   * Determine mapping type
   */
  private determineMappingType(
    sourceConcept: Concept,
    targetConcept: string,
    sourceDomain: string,
    targetDomain: string
  ): 'structural' | 'functional' | 'causal' | 'relational' {
    if (this.hasStructuralSimilarity(sourceConcept.name, targetConcept, sourceDomain, targetDomain)) {
      return 'structural';
    }
    if (this.hasFunctionalSimilarity(sourceConcept.name, targetConcept, sourceDomain, targetDomain)) {
      return 'functional';
    }
    // Default to relational
    return 'relational';
  }

  /**
   * Generate cross-domain insights
   */
  public generateCrossDomainInsights(understanding: Understanding): CrossDomainInsight[] {
    const insights: CrossDomainInsight[] = [];
    const domains = understanding.domains;

    if (domains.length < 2) return insights;

    // Find analogical mappings between all domain pairs
    for (let i = 0; i < domains.length; i++) {
      for (let j = i + 1; j < domains.length; j++) {
        const domain1 = domains[i];
        const domain2 = domains[j];
        if (!domain1 || !domain2) continue;
        
        const mappings = this.performAnalogicalReasoning(understanding, domain2);
        
        if (mappings.length > 0) {
          const topMapping = mappings[0];
          if (topMapping && topMapping.confidence > 0.6) {
            insights.push({
              insight: `Analogous relationship: ${topMapping.sourceConcept} (${topMapping.sourceDomain}) maps to ${topMapping.targetConcept} (${topMapping.targetDomain}) with ${(topMapping.similarity * 100).toFixed(0)}% similarity`,
              sourceDomain: topMapping.sourceDomain,
              targetDomain: topMapping.targetDomain,
              concepts: [topMapping.sourceConcept, topMapping.targetConcept],
              confidence: topMapping.confidence,
              novelty: this.calculateNovelty(topMapping)
            });
          }
        }
      }
    }

    // Store insights
    this.crossDomainInsights.push(...insights);
    
    return insights;
  }

  /**
   * Calculate novelty of a mapping
   */
  private calculateNovelty(mapping: AnalogicalMapping): number {
    // Check if we've seen this mapping before
    const seen = this.analogicalMappings.some(m => 
      m.sourceConcept === mapping.sourceConcept &&
      m.targetConcept === mapping.targetConcept &&
      m.sourceDomain === mapping.sourceDomain &&
      m.targetDomain === mapping.targetDomain
    );

    return seen ? 0.3 : 0.9; // Novel if not seen before
  }

  /**
   * Transfer knowledge from one domain to another
   */
  public transferKnowledge(
    sourceDomain: string,
    targetDomain: string,
    sourceKnowledge: any
  ): { success: boolean; transferred: string[]; insights: string[] } {
    const transferred: string[] = [];
    const insights: string[] = [];

    const sourceConcepts = this.domainKnowledge.get(sourceDomain);
    const targetConcepts = this.domainKnowledge.get(targetDomain);

    if (!sourceConcepts || !targetConcepts) {
      return { success: false, transferred, insights };
    }

    // Find transferable concepts
    sourceConcepts.forEach(sourceConcept => {
      targetConcepts.forEach(targetConcept => {
        const similarity = this.calculateSemanticSimilarity(sourceConcept, targetConcept);
        if (similarity > 0.6) {
          transferred.push(`${sourceConcept} → ${targetConcept}`);
          insights.push(`Knowledge from ${sourceDomain} can inform ${targetDomain} through ${sourceConcept}/${targetConcept} analogy`);
        }
      });
    });

    return {
      success: transferred.length > 0,
      transferred,
      insights
    };
  }

  /**
   * Get all cross-domain connections
   */
  public getCrossDomainConnections(): AnalogicalMapping[] {
    return this.analogicalMappings.slice(-20); // Last 20 mappings
  }

  /**
   * Get insights by domain
   */
  public getInsightsByDomain(domain: string): CrossDomainInsight[] {
    return this.crossDomainInsights.filter(
      insight => insight.sourceDomain === domain || insight.targetDomain === domain
    );
  }
}

