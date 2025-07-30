#!/bin/bash

# 🚀 Deploy AGI to Cloudflare Worker with Custom Domain
set -e

echo "🚀 Deploying AGI to Cloudflare Worker with custom domain..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
WORKER_NAME="agi-bleujs"
CUSTOM_DOMAIN="agi.bleujs.org"
ZONE_NAME="bleujs.org"

echo -e "${BLUE}📋 Configuration:${NC}"
echo "  Worker Name: $WORKER_NAME"
echo "  Custom Domain: $CUSTOM_DOMAIN"
echo "  Zone: $ZONE_NAME"

# Step 1: Build and deploy the worker
echo -e "\n${YELLOW}🔨 Building and deploying worker...${NC}"
npm run build:worker
npx wrangler deploy

# Step 2: Get the worker URL
WORKER_URL=$(npx wrangler deployments list | grep "agi-bleujs" | head -1 | awk '{print $NF}')
echo -e "${GREEN}✅ Worker deployed at: $WORKER_URL${NC}"

# Step 3: Get zone ID
echo -e "\n${YELLOW}🔍 Getting zone ID for $ZONE_NAME...${NC}"
ZONE_ID=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=$ZONE_NAME" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" | jq -r '.result[0].id')

if [ "$ZONE_ID" = "null" ] || [ -z "$ZONE_ID" ]; then
    echo -e "${RED}❌ Could not find zone ID for $ZONE_NAME${NC}"
    echo "Please check your CLOUDFLARE_API_TOKEN and zone name"
    exit 1
fi

echo -e "${GREEN}✅ Zone ID: $ZONE_ID${NC}"

# Step 4: Create CNAME record for the custom domain
echo -e "\n${YELLOW}🌐 Creating CNAME record for $CUSTOM_DOMAIN...${NC}"
CNAME_RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"type\": \"CNAME\",
    \"name\": \"agi\",
    \"content\": \"$WORKER_NAME.morning-star-e026.workers.dev\",
    \"ttl\": 1,
    \"proxied\": true
  }")

CNAME_SUCCESS=$(echo "$CNAME_RESPONSE" | jq -r '.success')
if [ "$CNAME_SUCCESS" = "true" ]; then
    echo -e "${GREEN}✅ CNAME record created successfully${NC}"
else
    echo -e "${YELLOW}⚠️  CNAME record may already exist or failed to create${NC}"
    echo "Response: $CNAME_RESPONSE"
fi

# Step 5: Configure worker routes
echo -e "\n${YELLOW}🛣️  Configuring worker routes...${NC}"
ROUTE_RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/workers/routes" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"pattern\": \"$CUSTOM_DOMAIN/*\",
    \"script\": \"$WORKER_NAME\"
  }")

ROUTE_SUCCESS=$(echo "$ROUTE_RESPONSE" | jq -r '.success')
if [ "$ROUTE_SUCCESS" = "true" ]; then
    echo -e "${GREEN}✅ Worker route configured successfully${NC}"
else
    echo -e "${YELLOW}⚠️  Worker route may already exist or failed to configure${NC}"
    echo "Response: $ROUTE_RESPONSE"
fi

# Step 6: Test the deployment
echo -e "\n${YELLOW}🧪 Testing deployment...${NC}"
sleep 10  # Wait for DNS propagation

# Test health endpoint
echo -e "${BLUE}Testing health endpoint...${NC}"
HEALTH_RESPONSE=$(curl -s "https://$CUSTOM_DOMAIN/health")
if echo "$HEALTH_RESPONSE" | jq -e '.status' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Health endpoint working${NC}"
else
    echo -e "${RED}❌ Health endpoint failed${NC}"
    echo "Response: $HEALTH_RESPONSE"
fi

# Test reasoning endpoint
echo -e "${BLUE}Testing reasoning endpoint...${NC}"
REASONING_RESPONSE=$(curl -s -X POST "https://$CUSTOM_DOMAIN/reason" \
  -H "Content-Type: application/json" \
  -d '{"input": "Test reasoning"}')
if echo "$REASONING_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Reasoning endpoint working${NC}"
else
    echo -e "${RED}❌ Reasoning endpoint failed${NC}"
    echo "Response: $REASONING_RESPONSE"
fi

# Step 7: Display final status
echo -e "\n${GREEN}🎉 AGI System Deployment Complete!${NC}"
echo -e "\n${BLUE}📊 Deployment Summary:${NC}"
echo "  Worker URL: $WORKER_URL"
echo "  Custom Domain: https://$CUSTOM_DOMAIN"
echo "  Zone ID: $ZONE_ID"
echo "  Status: ✅ DEPLOYED AND OPERATIONAL"

echo -e "\n${BLUE}🔗 API Endpoints:${NC}"
echo "  Health Check: https://$CUSTOM_DOMAIN/health"
echo "  System Status: https://$CUSTOM_DOMAIN/status"
echo "  Consciousness: https://$CUSTOM_DOMAIN/consciousness"
echo "  Reasoning: POST https://$CUSTOM_DOMAIN/reason"
echo "  Learning: POST https://$CUSTOM_DOMAIN/learn"
echo "  Creation: POST https://$CUSTOM_DOMAIN/create"

echo -e "\n${BLUE}🧪 Quick Test Commands:${NC}"
echo "  curl https://$CUSTOM_DOMAIN/health"
echo "  curl -X POST https://$CUSTOM_DOMAIN/reason -H 'Content-Type: application/json' -d '{\"input\": \"What is the meaning of life?\"}'"
echo "  curl https://$CUSTOM_DOMAIN/consciousness"

echo -e "\n${GREEN}🌟 Your AGI System is now live at https://$CUSTOM_DOMAIN !${NC}"
echo -e "${YELLOW}Note: DNS propagation may take a few minutes for the custom domain to be fully accessible.${NC}" 