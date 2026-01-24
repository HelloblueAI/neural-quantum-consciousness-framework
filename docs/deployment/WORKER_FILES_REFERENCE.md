# Worker Files Reference

Complete reference guide for all Cloudflare Worker files in this project.

## Active Workers (Production Ready)

### 1. `primary-agi-worker.ts` ⭐ **PRIMARY**
- **Status**: Production
- **Config**: `wrangler.toml`
- **Route**: `agi.bleujs.org/*`
- **Dependencies**: 
  - `RealLearningEngine`
  - `RealLLMIntegration`
  - `RealReasoningEngine`
  - `UltimateAGIOrchestrator`
- **Features**:
  - Full AGI orchestrator integration
  - Real ML capabilities
  - Multi-agent system
  - Chain-of-thought reasoning
  - Tool use and memory
  - Self-improvement
- **Use Case**: Main production worker with full capabilities

### 2. `enhanced-agi-worker.ts` ⭐ **ENHANCED**
- **Status**: Production
- **Config**: `wrangler.enhanced-agi.toml`
- **Route**: `api.agi.bleujs.org/*`
- **Dependencies**:
  - `AdvancedConsciousnessEngine`
  - `AdvancedUnderstandingEngine`
  - `AdvancedCreativityEngine`
- **Features**:
  - Advanced consciousness simulation
  - Qualia processing
  - Neural architecture
  - Self-improvement cycles
  - Cross-domain understanding
- **Use Case**: Enhanced AGI with advanced consciousness

### 3. `advanced-agi-worker.ts` ⭐ **ADVANCED**
- **Status**: Production
- **Config**: `wrangler.advanced-agi.toml`, `wrangler.real-agi.toml`
- **Route**: `advanced-agi.bleujs.org/*`, `real-agi.bleujs.org/*`
- **Dependencies**: `AdvancedAGI` class
- **Features**:
  - SentientCore implementation
  - Real logical reasoning
  - Actual learning
  - Genuine creativity
  - Emergent consciousness
- **Use Case**: Real AGI with genuine capabilities

### 4. `simple-worker.ts` ⭐ **SIMPLE**
- **Status**: Production Ready
- **Config**: None (standalone)
- **Dependencies**: None
- **Features**:
  - No external dependencies
  - Basic AGI endpoints
  - Lightweight implementation
  - Fast cold starts
- **Use Case**: Testing, fallback, or minimal deployment

### 5. `worker.ts` ⭐ **BASIC**
- **Status**: Production Ready
- **Config**: None (standalone)
- **Dependencies**: None
- **Features**:
  - Similar to simple-worker
  - Full web interface
  - Basic AGI capabilities
- **Use Case**: Alternative basic implementation

## Specialized Workers

### 6. `multi-language-agi-worker.ts`
- **Status**: Active
- **Config**: Can use `wrangler.toml` with different main
- **Dependencies**: `MultiLanguageRuntime`
- **Features**: Multi-language AGI support
- **Use Case**: Multi-language processing

### 7. `multi-language-agi-worker-simple.ts`
- **Status**: Active
- **Dependencies**: Simplified multi-language support
- **Use Case**: Lightweight multi-language worker

### 8. `agi-worker-hybrid.ts`
- **Status**: Active
- **Dependencies**: `HybridAGISystem`, `UltimateHybridAGISystem`
- **Features**: Hybrid C/Rust/TypeScript integration
- **Use Case**: Maximum performance with native libraries

### 9. `agi-worker-hybrid-simple.ts`
- **Status**: Active
- **Dependencies**: Simplified hybrid system
- **Use Case**: Simplified hybrid implementation

### 10. `agi-worker-mobile-enhanced.ts`
- **Status**: Active
- **Features**: Mobile-optimized interface
- **Use Case**: Mobile-first deployments

### 11. `enhanced-web-interface-worker.ts`
- **Status**: Active
- **Features**: Enhanced web interface
- **Use Case**: Web interface focused deployment

## Testing & Development Workers

### 12. `test-worker.ts` ⭐ **TEST**
- **Status**: Development
- **Config**: `wrangler.test.toml`
- **Dependencies**: None
- **Features**: Minimal test implementation
- **Use Case**: Testing and development

### 13. `real-agi-worker.ts`
- **Status**: Active
- **Features**: Real AGI implementation variant
- **Use Case**: Alternative real AGI approach

### 14. `real-agi-worker-fixed.ts`
- **Status**: Active
- **Features**: Fixed version of real AGI worker
- **Use Case**: Stable real AGI variant

### 15. `real-agi-worker-simple.ts`
- **Status**: Active
- **Features**: Simplified real AGI
- **Use Case**: Lightweight real AGI

### 16. `real-ml-integrated-worker.ts`
- **Status**: Active
- **Dependencies**: Real ML engines
- **Features**: ML-integrated AGI
- **Use Case**: ML-focused deployment

## Legacy/Archive Workers

### 17. `restored-worker.ts`
- **Status**: Archive
- **Use Case**: Historical reference

### 18. `agi-worker-simple.ts`
- **Status**: Archive
- **Use Case**: Historical reference

### 19. `agi-worker-deploy.ts`
- **Status**: Archive
- **Use Case**: Deployment utility

## Worker Selection Guide

### For Production (Main Site)
**Use**: `primary-agi-worker.ts`
- Full feature set
- Best performance
- Most capabilities

### For API Endpoint
**Use**: `enhanced-agi-worker.ts`
- Advanced consciousness
- API-focused
- Enhanced capabilities

### For Testing
**Use**: `simple-worker.ts` or `test-worker.ts`
- No dependencies
- Fast iteration
- Easy debugging

### For Mobile
**Use**: `agi-worker-mobile-enhanced.ts`
- Mobile optimized
- Responsive design
- Touch-friendly

### For Performance
**Use**: `agi-worker-hybrid.ts`
- Native libraries
- Maximum speed
- Resource intensive

## Configuration Mapping

| Worker File | Wrangler Config | Production Route |
|------------|----------------|------------------|
| `primary-agi-worker.ts` | `wrangler.toml` | `agi.bleujs.org/*` |
| `enhanced-agi-worker.ts` | `wrangler.enhanced-agi.toml` | `api.agi.bleujs.org/*` |
| `advanced-agi-worker.ts` | `wrangler.advanced-agi.toml` | `advanced-agi.bleujs.org/*` |
| `advanced-agi-worker.ts` | `wrangler.real-agi.toml` | `real-agi.bleujs.org/*` |
| `test-worker.ts` | `wrangler.test.toml` | None (dev only) |

## Dependency Graph

```
primary-agi-worker.ts
├── RealLearningEngine
├── RealLLMIntegration
├── RealReasoningEngine
└── UltimateAGIOrchestrator

enhanced-agi-worker.ts
├── AdvancedConsciousnessEngine
├── AdvancedUnderstandingEngine
└── AdvancedCreativityEngine

advanced-agi-worker.ts
└── AdvancedAGI

simple-worker.ts
└── (no dependencies)
```

## Recommendations

1. **Primary Production**: Use `primary-agi-worker.ts` for main deployment
2. **API Services**: Use `enhanced-agi-worker.ts` for API endpoints
3. **Testing**: Use `simple-worker.ts` or `test-worker.ts`
4. **Mobile**: Use `agi-worker-mobile-enhanced.ts`
5. **Performance**: Use `agi-worker-hybrid.ts` if native libs available

## Maintenance

- **Active Workers**: Keep updated and tested
- **Archive Workers**: Document but don't modify
- **Test Workers**: Update for new test cases
- **Dependencies**: Keep core modules updated

---

**Last Updated**: 2025-01-XX  
**Total Workers**: 19  
**Active Workers**: 12  
**Production Workers**: 5

