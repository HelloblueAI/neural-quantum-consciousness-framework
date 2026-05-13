#!/bin/bash

# 🚀 Deploy Professional Hybrid Reasoning System
set -e

echo "🚀 Deploying Professional Hybrid Reasoning System..."

# Build the Hybrid Reasoning System image
echo "🔨 Building Hybrid Reasoning System Docker image..."
docker build -t neuralcore-agi -f deploy/Dockerfile.simple .

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f deploy/professional-agi-compose.yml down || true

# Start the services
echo "🚀 Starting Hybrid Reasoning System and nginx..."
docker-compose -f deploy/professional-agi-compose.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 15

# Check Hybrid Reasoning System health
echo "🏥 Checking Hybrid Reasoning System health..."
curl -f http://localhost:8080/health || {
    echo "❌ Hybrid Reasoning System health check failed"
    docker-compose -f deploy/professional-agi-compose.yml logs agi
    exit 1
}

# Test nginx configuration
echo "🔧 Testing nginx configuration..."
docker exec professional-nginx nginx -t

# Reload nginx
echo "🔄 Reloading nginx..."
docker exec professional-nginx nginx -s reload

echo "✅ Professional Hybrid Reasoning System successfully deployed!"
echo "🌐 Your Hybrid Reasoning System is now accessible at:"
echo "   HTTPS: https://67.170.47.156/agi"
echo "   HTTP:  http://67.170.47.156/agi (redirects to HTTPS)"
echo ""
echo "📊 API Endpoints:"
echo "   Health: https://67.170.47.156/agi/health"
echo "   Consciousness: https://67.170.47.156/agi/consciousness"
echo "   Reasoning: https://67.170.47.156/agi/reason"
echo "   Learning: https://67.170.47.156/agi/learn"
echo "   Creation: https://67.170.47.156/agi/create"
echo ""
echo "🔒 Security Features:"
echo "   ✅ HTTPS with SSL/TLS"
echo "   ✅ Rate limiting"
echo "   ✅ Security headers"
echo "   ✅ CORS configuration"
echo "   ✅ Professional error handling"

# Show status
echo ""
echo "📊 Container status:"
docker-compose -f deploy/professional-agi-compose.yml ps

echo ""
echo "📋 Useful commands:"
echo "  View logs: docker-compose -f deploy/professional-agi-compose.yml logs -f"
echo "  Stop Hybrid Reasoning System: docker-compose -f deploy/professional-agi-compose.yml down"
echo "  Restart Hybrid Reasoning System: docker-compose -f deploy/professional-agi-compose.yml restart"
echo "  Monitor: docker stats professional-agi professional-nginx"
