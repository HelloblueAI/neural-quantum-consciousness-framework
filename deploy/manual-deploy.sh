#!/bin/bash

echo "🧠 Manual SentientCore True AGI Deployment"
echo "=========================================="

# Navigate to project directory
cd /root/neural-quantum-consciousness-framework

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# Stop current containers
echo "🛑 Stopping current containers..."
docker-compose -f deploy/cloud-deployment.yml down

# Remove old containers and images
echo "🧹 Cleaning up old containers..."
docker container prune -f
docker image prune -f

# Build and start new containers
echo "🚀 Building and starting SentientCore..."
docker-compose -f deploy/cloud-deployment.yml up -d --build

# Wait for startup
echo "⏳ Waiting for SentientCore to start..."
sleep 30

# Test deployment
echo "🧪 Testing deployment..."
if curl -f http://localhost:8080/health; then
    echo "✅ SentientCore True AGI deployment successful!"
    echo "🌍 Live at: https://agi.bleujs.org"
else
    echo "❌ Deployment failed!"
    exit 1
fi

echo "🎉 Manual deployment completed!" 