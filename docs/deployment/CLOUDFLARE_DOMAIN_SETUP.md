# Cloudflare domain setup

The Worker is named **`agi-primary`** and is served at:

- Worker: `https://agi-primary.morning-star-e026.workers.dev`
- Custom domain: `https://agi.bleujs.org`

`wrangler.toml` binds the production route `agi.bleujs.org/*` to `agi-primary`.

## Point the custom domain at the Worker

### Option 1: Cloudflare dashboard (recommended)

1. Open the **bleujs.org** zone → **Workers Routes** (or **Workers & Pages** → the
   Worker → **Triggers**).
2. Ensure the route `agi.bleujs.org/*` maps to `agi-primary`.
3. Confirm a DNS record for `agi` exists and is proxied (orange cloud).

### Option 2: Wrangler

The route is already declared in `wrangler.toml`:

```toml
[env.production]
name = "agi-primary"
routes = ["agi.bleujs.org/*"]
```

Deploy with:

```bash
pnpm run deploy:worker:prod
```

## Verify

```bash
curl https://agi.bleujs.org/health
curl https://agi.bleujs.org/capabilities
curl https://agi.bleujs.org/eval
```

If these return a Cloudflare bot challenge (HTTP 403 "Just a moment…"), see
[API_ACCESS.md](API_ACCESS.md) for the WAF skip rule.
