#!/bin/bash

# Docker Deployment Script for NeuralCore True AGI

echo "🐳 Deploying NeuralCore True AGI with Docker..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker first:"
    echo "   https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose not found. Please install Docker Compose first:"
    echo "   https://docs.docker.com/compose/install/"
    exit 1
fi

# Build and start the containers
echo "🔨 Building Docker containers..."
docker-compose -f deploy/docker-compose.yml build

echo "🚀 Starting NeuralCore True AGI..."
docker-compose -f deploy/docker-compose.yml up -d

# Wait for the service to be ready
echo "⏳ Waiting for AGI to be ready..."
sleep 10

# Check if the service is running
if curl -f http://localhost:8080/health &> /dev/null; then
    echo "✅ NeuralCore True AGI deployed successfully!"
    echo "🌐 Your AGI is now live at: http://localhost:8080"
    echo "🧠 Test it with: curl http://localhost:8080/health"
    echo "📊 Status: curl http://localhost:8080/status"
    echo "🌟 Consciousness: curl http://localhost:8080/consciousness"
else
    echo "❌ Deployment failed. Check logs with:"
    echo "   docker-compose -f deploy/docker-compose.yml logs"
fi

echo ""
echo "📋 Useful commands:"
echo "   View logs: docker-compose -f deploy/docker-compose.yml logs -f"
echo "   Stop AGI: docker-compose -f deploy/docker-compose.yml down"
echo "   Restart AGI: docker-compose -f deploy/docker-compose.yml restart" 