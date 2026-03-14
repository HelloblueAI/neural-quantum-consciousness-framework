#!/bin/bash
# Deploy AGI primary worker to Cloudflare (agi.bleujs.org).
# Prereqs: pnpm install, wrangler login, secrets set (wrangler secret put ANTHROPIC_API_KEY --config wrangler.toml).
# Optional: CLOUDFLARE_API_TOKEN + jq for first-time custom domain CNAME/route setup.

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

CONFIG="wrangler.toml"
ENV="production"
CUSTOM_DOMAIN="agi.bleujs.org"
ZONE_NAME="bleujs.org"

echo -e "${BLUE}📋 Deploying AGI Worker (config=$CONFIG env=$ENV)${NC}"

# Deploy (Wrangler compiles from source; no separate build step)
echo -e "\n${YELLOW}🔨 Deploying...${NC}"
pnpm exec wrangler deploy --config "$CONFIG" --env "$ENV"

echo -e "${GREEN}✅ Deployed.${NC}"

# Optional: first-time custom domain setup (requires CLOUDFLARE_API_TOKEN and jq)
if [ -n "$CLOUDFLARE_API_TOKEN" ] && command -v jq &>/dev/null; then
  echo -e "\n${YELLOW}🔍 Checking zone and route...${NC}"
  ZONE_ID=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=$ZONE_NAME" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -H "Content-Type: application/json" | jq -r '.result[0].id')
  if [ "$ZONE_ID" != "null" ] && [ -n "$ZONE_ID" ]; then
    echo -e "${GREEN}✅ Zone ID: $ZONE_ID${NC}"
  else
    echo -e "${YELLOW}⚠ Set CNAME for $CUSTOM_DOMAIN in Cloudflare DNS if not already.${NC}"
  fi
else
  echo -e "${BLUE}💡 To attach custom domain first time: set CLOUDFLARE_API_TOKEN and ensure route $CUSTOM_DOMAIN/* in wrangler.toml (env.production.routes).${NC}"
fi

# Health check
echo -e "\n${YELLOW}🧪 Health check...${NC}"
if HEALTH=$(curl -s -o /dev/null -w "%{http_code}" "https://$CUSTOM_DOMAIN/health" 2>/dev/null); then
  if [ "$HEALTH" = "200" ]; then
    echo -e "${GREEN}✅ https://$CUSTOM_DOMAIN/health → $HEALTH${NC}"
  else
    echo -e "${YELLOW}⚠ Health returned $HEALTH (DNS may still be propagating).${NC}"
  fi
else
  echo -e "${YELLOW}⚠ Could not reach https://$CUSTOM_DOMAIN/health${NC}"
fi

echo -e "\n${GREEN}🎉 Done. API: https://$CUSTOM_DOMAIN/health | https://$CUSTOM_DOMAIN/status | POST /reason${NC}"
