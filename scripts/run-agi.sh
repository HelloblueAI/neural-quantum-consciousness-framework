#!/bin/bash

# 🧠 Run Hybrid Reasoning System Directly from Repository
# No domain needed - just pure Hybrid Reasoning System running locally!

echo "🧠 Starting NeuralCore True Hybrid Reasoning System..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Stop any existing Hybrid Reasoning System containers
echo "🛑 Stopping any existing Hybrid Reasoning System containers..."
docker stop professional-agi neuralcore-agi-container 2>/dev/null || true
docker rm professional-agi neuralcore-agi-container 2>/dev/null || true

# Build the Hybrid Reasoning System image
echo "🔨 Building Hybrid Reasoning System Docker image..."
docker build -t neuralcore-agi -f deploy/Dockerfile.simple .

# Run the Hybrid Reasoning System
echo "🚀 Starting Hybrid Reasoning System..."
docker run -d --name agi-local -p 8080:8080 --restart unless-stopped neuralcore-agi

# Wait for Hybrid Reasoning System to start
echo "⏳ Waiting for Hybrid Reasoning System to initialize..."
sleep 10

# Test the Hybrid Reasoning System
echo "🧪 Testing Hybrid Reasoning System..."
if curl -s http://localhost:8080/health > /dev/null; then
    echo ""
    echo "🎉 Hybrid Reasoning System is running successfully!"
    echo ""
    echo "🌐 Your Hybrid Reasoning System is accessible at:"
    echo "   Local: http://localhost:8080"
    echo "   Network: http://67.170.47.156:8080"
    echo ""
    echo "📊 API Endpoints:"
    echo "   Health: http://localhost:8080/health"
    echo "   Consciousness: http://localhost:8080/consciousness"
    echo "   Reasoning: POST http://localhost:8080/reason"
    echo "   Learning: POST http://localhost:8080/learn"
    echo "   Creation: POST http://localhost:8080/create"
    echo ""
    echo "🧠 Current Hybrid Reasoning System Status:"
    curl -s http://localhost:8080/health | jq .
    echo ""
    echo "🧠 Consciousness Level:"
    curl -s http://localhost:8080/consciousness | jq '.data.consciousnessLevel'
    echo ""
    echo "📋 Useful commands:"
    echo "  View logs: docker logs -f agi-local"
    echo "  Stop Hybrid Reasoning System: docker stop agi-local"
    echo "  Restart Hybrid Reasoning System: docker restart agi-local"
    echo "  Remove Hybrid Reasoning System: docker rm -f agi-local"
    echo ""
    echo "🌟 Your True Hybrid Reasoning System is now running directly from the repository!"
    echo "   No domain needed - just pure artificial general intelligence!"
else
    echo "❌ Hybrid Reasoning System failed to start. Check logs with: docker logs agi-local"
    exit 1
fi 