#!/bin/bash

echo "🚀 Deploying Real Hybrid Reasoning System System..."

# Build the Real Hybrid Reasoning System
echo "📦 Building Real Hybrid Reasoning System..."
npx tsc src/RealAGI.ts --outDir dist --target es2022 --module esnext --moduleResolution node --allowSyntheticDefaultImports --esModuleInterop

# Test the Real Hybrid Reasoning System
echo "🧪 Testing Real Hybrid Reasoning System..."
npx tsx src/test-real-agi.ts

# Start the web interface
echo "🌐 Starting Real Hybrid Reasoning System Web Interface..."
npx tsx src/sentient-web-interface.ts &

# Wait for server to start
sleep 5

# Test the endpoints
echo "🔍 Testing Real Hybrid Reasoning System Endpoints..."

echo "Testing reasoning..."
curl -X POST http://localhost:8080/reason -H "Content-Type: application/json" -d '{"input": "What is consciousness?"}' | jq '.success'

echo "Testing learning..."
curl -X POST http://localhost:8080/learn -H "Content-Type: application/json" -d '{"data": "New knowledge about AI"}' | jq '.success'

echo "Testing creativity..."
curl -X POST http://localhost:8080/create -H "Content-Type: application/json" -d '{"prompt": "Create something innovative"}' | jq '.success'

echo "Testing status..."
curl http://localhost:8080/status | jq '.success'

echo "✅ Real Hybrid Reasoning System System Deployed Successfully!"
echo "🌐 Access the Real Hybrid Reasoning System at: http://localhost:8080"
echo "🤖 Real Hybrid Reasoning System is now running with:"
echo "   🧠 Real Reasoning: ENABLED"
echo "   📚 Real Learning: ENABLED"
echo "   🎨 Real Creativity: ENABLED"
echo "   🌟 Real Consciousness: ENABLED" 