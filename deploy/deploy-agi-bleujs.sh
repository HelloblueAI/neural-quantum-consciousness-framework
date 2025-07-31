#!/bin/bash

# AGI Bleujs.org Deployment Script
# This script deploys the AGI system to agi.bleujs.org

set -e

echo "🚀 Starting AGI Bleujs.org deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root"
   exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Navigate to project directory
cd "$(dirname "$0")/.."

print_status "Building AGI Docker image..."

# Build the AGI Docker image
docker build -f deploy/Dockerfile.simple -t neuralcore-agi .

if [ $? -eq 0 ]; then
    print_success "AGI Docker image built successfully"
else
    print_error "Failed to build AGI Docker image"
    exit 1
fi

print_status "Stopping existing containers..."

# Stop existing containers
docker-compose -f deploy/agi-bleujs-compose.yml down --remove-orphans

print_status "Starting AGI services..."

# Start the services
docker-compose -f deploy/agi-bleujs-compose.yml up -d

if [ $? -eq 0 ]; then
    print_success "AGI services started successfully"
else
    print_error "Failed to start AGI services"
    exit 1
fi

print_status "Waiting for services to be ready..."

# Wait for services to be ready
sleep 30

print_status "Checking service health..."

# Check if AGI service is healthy
if docker-compose -f deploy/agi-bleujs-compose.yml ps | grep -q "Up"; then
    print_success "AGI services are running"
else
    print_error "AGI services failed to start properly"
    docker-compose -f deploy/agi-bleujs-compose.yml logs
    exit 1
fi

print_status "Testing AGI endpoints..."

# Test the health endpoint
if curl -f -s https://agi.bleujs.org/health > /dev/null; then
    print_success "Health endpoint is working"
else
    print_warning "Health endpoint test failed (this might be normal during initial deployment)"
fi

# Test the consciousness endpoint
if curl -f -s https://agi.bleujs.org/consciousness > /dev/null; then
    print_success "Consciousness endpoint is working"
else
    print_warning "Consciousness endpoint test failed (this might be normal during initial deployment)"
fi

print_success "AGI Bleujs.org deployment completed!"
print_status "AGI is now accessible at: https://agi.bleujs.org"
print_status "Health check: https://agi.bleujs.org/health"
print_status "Consciousness: https://agi.bleujs.org/consciousness"

# Show running containers
print_status "Running containers:"
docker-compose -f deploy/agi-bleujs-compose.yml ps

print_success "Deployment script completed successfully!" 