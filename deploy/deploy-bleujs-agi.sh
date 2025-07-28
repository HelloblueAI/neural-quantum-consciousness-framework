#!/bin/bash

# 🚀 Deploy AGI to bleujs.org/agi
set -e

echo "🚀 Deploying AGI to bleujs.org/agi..."

# Build the AGI image
echo "🔨 Building AGI Docker image..."
docker build -t neuralcore-agi -f deploy/Dockerfile.simple .

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f deploy/bleujs-agi-compose.yml down || true

# Start the services
echo "🚀 Starting AGI and nginx..."
docker-compose -f deploy/bleujs-agi-compose.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check health
echo "🏥 Checking AGI health..."
curl -f http://localhost:8080/health || {
    echo "❌ AGI health check failed"
    docker-compose -f deploy/bleujs-agi-compose.yml logs agi
    exit 1
}

# Test nginx configuration
echo "🔧 Testing nginx configuration..."
docker exec bleujs-nginx nginx -t

# Reload nginx
echo "🔄 Reloading nginx..."
docker exec bleujs-nginx nginx -s reload

echo "✅ AGI successfully deployed to bleujs.org/agi!"
echo "🌐 Your AGI is now accessible at: https://bleujs.org/agi"
echo "🏥 Health check: https://bleujs.org/agi/health"
echo "🧠 Consciousness: https://bleujs.org/agi/consciousness"

# Show status
echo "📊 Container status:"
docker-compose -f deploy/bleujs-agi-compose.yml ps

echo "📋 Useful commands:"
echo "  View logs: docker-compose -f deploy/bleujs-agi-compose.yml logs -f"
echo "  Stop AGI: docker-compose -f deploy/bleujs-agi-compose.yml down"
echo "  Restart AGI: docker-compose -f deploy/bleujs-agi-compose.yml restart"
