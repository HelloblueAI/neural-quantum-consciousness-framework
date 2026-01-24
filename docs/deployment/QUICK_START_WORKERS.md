# Quick Start: Cloudflare Workers

Get your AGI workers deployed in 5 minutes.

## Prerequisites

```bash
# Install dependencies (if not already done)
pnpm install

# Login to Cloudflare
npx wrangler login
```

## Deploy Primary Worker (Main Production)

```bash
# Set API keys (first time only)
npx wrangler secret put ANTHROPIC_API_KEY --config wrangler.toml
npx wrangler secret put OPENAI_API_KEY --config wrangler.toml

# Deploy to production
pnpm run deploy:worker:prod
```

## Deploy Enhanced Worker (API Endpoint)

```bash
# Set API keys
npx wrangler secret put ANTHROPIC_API_KEY --config wrangler.enhanced-agi.toml
npx wrangler secret put OPENAI_API_KEY --config wrangler.enhanced-agi.toml

# Deploy
pnpm run deploy:enhanced:prod
```

## Test Locally

```bash
# Start local dev server
pnpm run worker:dev

# Test in another terminal
curl http://localhost:8787/status
```

## Common Commands

```bash
# Development
pnpm run worker:dev                    # Primary worker
pnpm run worker:dev:enhanced           # Enhanced worker
pnpm run worker:dev:advanced           # Advanced worker

# Deployment
pnpm run deploy:worker:prod            # Primary (production)
pnpm run deploy:enhanced:prod          # Enhanced (production)
pnpm run deploy:worker:staging         # Primary (staging)

# Monitoring
pnpm run worker:tail                   # View logs
```

## Verify Deployment

```bash
# Check status
curl https://agi.bleujs.org/status

# Test reasoning
curl -X POST https://agi.bleujs.org/reason \
  -H "Content-Type: application/json" \
  -d '{"input": "Hello AGI!"}'
```

## Troubleshooting

**Problem**: "Cannot find module" errors  
**Solution**: Ensure imports use `.js` extension for ESM

**Problem**: API keys not working  
**Solution**: Set secrets with `wrangler secret put`

**Problem**: Route conflicts  
**Solution**: Check `wrangler.*.toml` files for unique routes

## Next Steps

- Read [WRANGLER_WORKERS_GUIDE.md](./WRANGLER_WORKERS_GUIDE.md) for detailed docs
- Check [WORKER_FILES_REFERENCE.md](./WORKER_FILES_REFERENCE.md) for worker details
- Review worker logs: `pnpm run worker:tail`

---

**Need Help?** Check the full documentation in `docs/deployment/`

