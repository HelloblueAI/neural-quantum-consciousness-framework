# Cloudflare Workers Deployment Guide

Complete guide for deploying AGI workers to Cloudflare Workers.

## Overview

This project uses multiple Cloudflare Workers for different purposes:

- **Primary Worker** (`primary-agi-worker.ts`) - Main production worker with full AGI capabilities
- **Enhanced Worker** (`enhanced-agi-worker.ts`) - Advanced consciousness and understanding
- **Advanced Worker** (`advanced-agi-worker.ts`) - Real AGI with ML integration
- **Real AGI Worker** (`advanced-agi-worker.ts`) - Alternative real AGI implementation
- **Test Worker** (`test-worker.ts`) - Testing and development

## Wrangler Configuration Files

### Primary Configuration: `wrangler.toml`
- **Worker**: `primary-agi-worker.ts`
- **Production Route**: `agi.bleujs.org/*`
- **Purpose**: Main production AGI worker with UltimateAGIOrchestrator

### Enhanced Configuration: `wrangler.enhanced-agi.toml`
- **Worker**: `enhanced-agi-worker.ts`
- **Production Route**: `api.agi.bleujs.org/*`
- **Purpose**: Enhanced AGI with advanced consciousness engines

### Advanced Configuration: `wrangler.advanced-agi.toml`
- **Worker**: `advanced-agi-worker.ts`
- **Production Route**: `advanced-agi.bleujs.org/*`
- **Purpose**: Advanced AGI with real ML integration

### Real AGI Configuration: `wrangler.real-agi.toml`
- **Worker**: `advanced-agi-worker.ts`
- **Production Route**: `real-agi.bleujs.org/*`
- **Purpose**: Real AGI implementation

### Test Configuration: `wrangler.test.toml`
- **Worker**: `test-worker.ts`
- **Routes**: None (dev mode only)
- **Purpose**: Testing and development

## Environment Setup

### Prerequisites

1. **Cloudflare Account**: Sign up at https://cloudflare.com
2. **Wrangler CLI**: Already installed via `pnpm install`
3. **API Token**: Get from Cloudflare Dashboard → My Profile → API Tokens

### Authentication

```bash
# Login to Cloudflare
npx wrangler login

# Or use API token
npx wrangler login --api-token YOUR_API_TOKEN
```

### Environment Variables

Set secrets for API keys:

```bash
# For primary worker (uses Anthropic and OpenAI)
npx wrangler secret put ANTHROPIC_API_KEY --config wrangler.toml
npx wrangler secret put OPENAI_API_KEY --config wrangler.toml

# For enhanced worker
npx wrangler secret put ANTHROPIC_API_KEY --config wrangler.enhanced-agi.toml
npx wrangler secret put OPENAI_API_KEY --config wrangler.enhanced-agi.toml
```

## Development

### Local Development

```bash
# Primary worker
pnpm run worker:dev

# Enhanced worker
pnpm run worker:dev:enhanced

# Advanced worker
pnpm run worker:dev:advanced

# Real AGI worker
pnpm run worker:dev:real

# Test worker
pnpm run worker:dev:test
```

### Testing Locally

Workers run on `http://localhost:8787` by default. Test endpoints:

```bash
# Health check
curl http://localhost:8787/status

# Consciousness check
curl http://localhost:8787/consciousness

# Reasoning test
curl -X POST http://localhost:8787/reason \
  -H "Content-Type: application/json" \
  -d '{"input": "What is artificial intelligence?"}'
```

## Deployment

### Deploy to Production

```bash
# Primary worker (production)
pnpm run deploy:worker:prod

# Enhanced worker (production)
pnpm run deploy:enhanced:prod

# Advanced worker (production)
pnpm run deploy:advanced:prod

# Real AGI worker (production)
pnpm run deploy:real:prod
```

### Deploy to Staging

```bash
# Primary worker (staging)
pnpm run deploy:worker:staging

# Other workers use same pattern with :staging suffix
```

### Deploy to Development

```bash
# Primary worker (development - no routes)
pnpm run deploy:worker

# Other workers
pnpm run deploy:enhanced
pnpm run deploy:advanced
pnpm run deploy:real
```

## Monitoring

### View Logs

```bash
# Primary worker logs
pnpm run worker:tail

# Enhanced worker logs
pnpm run worker:tail:enhanced

# Advanced worker logs
pnpm run worker:tail:advanced
```

### Check Deployment Status

```bash
# List all deployments
npx wrangler deployments list --config wrangler.toml

# View specific deployment
npx wrangler deployments view <deployment-id> --config wrangler.toml
```

## Worker Architecture

### Primary Worker (`primary-agi-worker.ts`)

**Features:**
- UltimateAGIOrchestrator integration
- RealLearningEngine with ML capabilities
- RealLLMIntegration (Claude + GPT)
- RealReasoningEngine
- Full web interface
- Multi-agent system support

**Endpoints:**
- `GET /` - Web interface
- `GET /status` - System status
- `GET /consciousness` - Consciousness metrics
- `POST /reason` - Reasoning endpoint
- `POST /learn` - Learning endpoint
- `POST /create` - Creativity endpoint

### Enhanced Worker (`enhanced-agi-worker.ts`)

**Features:**
- AdvancedConsciousnessEngine
- AdvancedUnderstandingEngine
- AdvancedCreativityEngine
- Neural architecture simulation
- Self-improvement capabilities

**Endpoints:**
- Same as primary worker
- Additional `/introspect` endpoint
- Enhanced `/neural` endpoint

### Advanced Worker (`advanced-agi-worker.ts`)

**Features:**
- SentientCore implementation
- Real logical reasoning
- Actual learning with persistence
- Genuine creativity
- Emergent consciousness

**Endpoints:**
- Same as primary worker
- Enhanced response format

## Troubleshooting

### Common Issues

#### 1. Build Errors

**Problem**: TypeScript compilation errors

**Solution**:
```bash
# Check TypeScript errors
pnpm run type-check

# Workers are excluded from main build, Wrangler compiles them
# Check worker-specific imports
```

#### 2. Missing Environment Variables

**Problem**: API keys not found

**Solution**:
```bash
# Set secrets
npx wrangler secret put ANTHROPIC_API_KEY --config wrangler.toml
npx wrangler secret put OPENAI_API_KEY --config wrangler.toml
```

#### 3. Route Conflicts

**Problem**: Multiple workers targeting same route

**Solution**: Each worker should have unique routes. Check `wrangler.*.toml` files for conflicts.

#### 4. Import Errors

**Problem**: Cannot find module errors

**Solution**: 
- Ensure imports use `.js` extension for ESM
- Check that core modules exist in `src/core/`
- Verify `compatibility_flags = ["nodejs_compat"]` in config

### Debugging

```bash
# Enable verbose logging
WRANGLER_LOG=debug pnpm run worker:dev

# Check worker bundle size
npx wrangler deploy --dry-run --config wrangler.toml

# Test locally with production config
pnpm run worker:dev --env production
```

## Best Practices

1. **Always test locally** before deploying
2. **Use staging environment** for testing production configs
3. **Monitor logs** after deployment
4. **Set up alerts** in Cloudflare dashboard
5. **Version control** all Wrangler configs
6. **Document** any route changes
7. **Test** all endpoints after deployment

## Production Checklist

Before deploying to production:

- [ ] All tests passing (`pnpm test`)
- [ ] Type checking passes (`pnpm run type-check`)
- [ ] Local testing successful
- [ ] Environment variables set
- [ ] Routes configured correctly
- [ ] CORS headers configured
- [ ] Error handling in place
- [ ] Logging configured
- [ ] Monitoring set up
- [ ] Documentation updated

## Additional Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [Workers TypeScript Guide](https://developers.cloudflare.com/workers/get-started/guide/)

## Support

For issues or questions:
1. Check worker logs: `pnpm run worker:tail`
2. Review Cloudflare dashboard
3. Check deployment status
4. Review this documentation

---

**Last Updated**: 2025-01-XX  
**Maintained by**: AGI Development Team

