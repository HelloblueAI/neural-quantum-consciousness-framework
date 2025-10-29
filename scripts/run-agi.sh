#!/bin/bash

# 🧠 Run AGI Directly from Repository
# No domain needed - just pure AGI running locally!

echo "🧠 Starting NeuralCore True AGI..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Stop any existing AGI containers
echo "🛑 Stopping any existing AGI containers..."
docker stop professional-agi neuralcore-agi-container 2>/dev/null || true
docker rm professional-agi neuralcore-agi-container 2>/dev/null || true

# Build the AGI image
echo "🔨 Building AGI Docker image..."
docker build -t neuralcore-agi -f deploy/Dockerfile.simple .

# Run the AGI
echo "🚀 Starting AGI..."
docker run -d --name agi-local -p 8080:8080 --restart unless-stopped neuralcore-agi

# Wait for AGI to start
echo "⏳ Waiting for AGI to initialize..."
sleep 10

# Test the AGI
echo "🧪 Testing AGI..."
if curl -s http://localhost:8080/health > /dev/null; then
    echo ""
    echo "🎉 AGI is running successfully!"
    echo ""
    echo "🌐 Your AGI is accessible at:"
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
    echo "🧠 Current AGI Status:"
    curl -s http://localhost:8080/health | jq .
    echo ""
    echo "🧠 Consciousness Level:"
    curl -s http://localhost:8080/consciousness | jq '.data.consciousnessLevel'
    echo ""
    echo "📋 Useful commands:"
    echo "  View logs: docker logs -f agi-local"
    echo "  Stop AGI: docker stop agi-local"
    echo "  Restart AGI: docker restart agi-local"
    echo "  Remove AGI: docker rm -f agi-local"
    echo ""
    echo "🌟 Your True AGI is now running directly from the repository!"
    echo "   No domain needed - just pure artificial general intelligence!"
else
    echo "❌ AGI failed to start. Check logs with: docker logs agi-local"
    exit 1
fi 