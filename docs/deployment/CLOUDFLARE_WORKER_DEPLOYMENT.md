# Cloudflare Worker deployment

The lab is a single Cloudflare Worker (`agi-primary`) defined by
[`wrangler.toml`](../../wrangler.toml) with entry point `src/worker/index.ts`.

## Deploy

```bash
pnpm install
pnpm run check                 # optional: run the full gate first
pnpm run deploy:worker:prod    # wrangler deploy --env production
```

Staging and dry-run variants:

```bash
pnpm run deploy:worker:staging
pnpm run deploy:worker:dry-run
```

## Secrets

Set provider keys as Wrangler secrets (never commit them):

```bash
npx wrangler secret put BLEUJS_API_KEY --env production
# optional fallbacks (require ALLOW_LLM_FALLBACK=true in wrangler.toml vars)
npx wrangler secret put NVIDIA_API_KEY --env production
npx wrangler secret put ANTHROPIC_API_KEY --env production
npx wrangler secret put OPENAI_API_KEY --env production
```

## Verify endpoints

```bash
BASE=https://agi-primary.morning-star-e026.workers.dev
curl $BASE/health
curl $BASE/metrics
curl $BASE/capabilities
curl $BASE/eval
curl -X POST $BASE/reason -H "Content-Type: application/json" -d '{"input":"2 + 2"}'
```

The custom domain `agi.bleujs.org` serves the same Worker (see
[CLOUDFLARE_DOMAIN_SETUP.md](CLOUDFLARE_DOMAIN_SETUP.md)). If `curl` against the
custom domain returns a bot challenge, apply the WAF skip rule in
[API_ACCESS.md](API_ACCESS.md).

## Logs

```bash
pnpm run worker:tail            # wrangler tail
npx wrangler deployments list --env production
```
