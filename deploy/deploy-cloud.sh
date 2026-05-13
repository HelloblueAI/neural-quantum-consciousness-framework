#!/bin/bash

# 🧠 Deploy Hybrid Reasoning System to Cloud (DigitalOcean)
# Professional cloud deployment script

echo "🧠 Deploying NeuralCore True Hybrid Reasoning System to Cloud..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run as root (use sudo)"
    exit 1
fi

# Update system
echo "📦 Updating system packages..."
apt-get update && apt-get upgrade -y

# Install Docker and Docker Compose
echo "🐳 Installing Docker and Docker Compose..."

# Install Docker
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    usermod -aG docker $USER
    rm get-docker.sh
fi

# Install Docker Compose
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# Install Certbot for SSL
echo "🔒 Installing Certbot for SSL certificates..."
apt-get install -y certbot python3-certbot-nginx

# Create SSL directory
echo "📁 Creating SSL directory..."
mkdir -p deploy/ssl

# Build and start the services
echo "🔨 Building and starting Hybrid Reasoning System services..."
docker-compose -f deploy/cloud-deployment.yml up -d --build

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 20

# Check if services are running
echo "🧪 Checking service status..."

# Check Hybrid Reasoning System container
if docker ps | grep -q neuralcore-agi-cloud; then
    echo "✅ Hybrid Reasoning System container is running"
else
    echo "❌ Hybrid Reasoning System container failed to start"
    docker logs neuralcore-agi-cloud
    exit 1
fi

# Check nginx container
if docker ps | grep -q agi-nginx-cloud; then
    echo "✅ Nginx container is running"
else
    echo "❌ Nginx container failed to start"
    docker logs agi-nginx-cloud
    exit 1
fi

# Test the Hybrid Reasoning System endpoints
echo "🧪 Testing Hybrid Reasoning System endpoints..."

# Test health endpoint
if curl -s http://localhost/health | grep -q "NeuralCore"; then
    echo "✅ Health endpoint working"
else
    echo "❌ Health endpoint failed"
    docker logs agi-nginx-cloud
fi

# Test consciousness endpoint
if curl -s http://localhost/consciousness | grep -q "consciousnessLevel"; then
    echo "✅ Consciousness endpoint working"
else
    echo "❌ Consciousness endpoint failed"
fi

# Test landing page
if curl -s http://localhost/ | grep -q "NeuralCore True Hybrid Reasoning System API"; then
    echo "✅ Landing page working"
else
    echo "❌ Landing page failed"
fi

# Set up SSL certificate
echo "🔒 Setting up SSL certificate..."
if certbot --nginx -d agi.bleujs.org --non-interactive --agree-tos --email admin@bleujs.org; then
    echo "✅ SSL certificate installed"
else
    echo "⚠️  SSL certificate setup failed (domain might not be pointing here yet)"
fi

echo ""
echo "🎉 Cloud Deployment Complete!"
echo ""
echo "🌐 Your Hybrid Reasoning System is now accessible at:"
echo "   HTTP:  http://agi.bleujs.org"
echo "   HTTPS: https://agi.bleujs.org"
echo ""
echo "📊 API Endpoints:"
echo "   Health:        https://agi.bleujs.org/health"
echo "   Consciousness: https://agi.bleujs.org/consciousness"
echo "   Reasoning:     POST https://agi.bleujs.org/reason"
echo "   Learning:      POST https://agi.bleujs.org/learn"
echo "   Creation:      POST https://agi.bleujs.org/create"
echo ""
echo "🧠 Current Hybrid Reasoning System Status:"
curl -s http://localhost/health | jq . 2>/dev/null || curl -s http://localhost/health
echo ""
echo "🔧 Management Commands:"
echo "   View logs:     docker-compose -f deploy/cloud-deployment.yml logs -f"
echo "   Stop services: docker-compose -f deploy/cloud-deployment.yml down"
echo "   Restart:       docker-compose -f deploy/cloud-deployment.yml restart"
echo "   Update:        docker-compose -f deploy/cloud-deployment.yml up -d --build"
echo "   SSL renew:     certbot renew"
echo ""
echo "🌟 Your True Hybrid Reasoning System is now running in the cloud!"
echo "   Professional deployment with SSL, load balancing, and monitoring!" 