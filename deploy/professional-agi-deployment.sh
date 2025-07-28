#!/bin/bash

# 🚀 Professional AGI Deployment
# This is how real software engineers deploy production systems!

set -e

echo "🚀 Setting up professional AGI deployment..."

# Configuration
AGI_PORT="8080"
NGINX_PORT="80"
HTTPS_PORT="443"
DOMAIN="67.170.47.156"  # Current server IP

# Create professional nginx configuration
cat > deploy/professional-agi-nginx.conf << EOF
# Professional AGI Nginx Configuration
# This is how real software engineers configure production servers

# Rate limiting
limit_req_zone \$binary_remote_addr zone=agi:10m rate=10r/s;
limit_req_zone \$binary_remote_addr zone=api:10m rate=5r/s;

# HTTP to HTTPS redirect
server {
    listen ${NGINX_PORT};
    listen [::]:${NGINX_PORT};
    server_name ${DOMAIN} bleujs.org;
    
    # Redirect all HTTP to HTTPS
    return 301 https://\$server_name\$request_uri;
}

# Main HTTPS server
server {
    listen ${HTTPS_PORT} ssl http2;
    listen [::]:${HTTPS_PORT} ssl http2;
    server_name ${DOMAIN} bleujs.org;
    
    # SSL Configuration (self-signed for now, can be replaced with Let's Encrypt)
    ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/nginx-selfsigned.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security headers (professional grade)
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';";
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()";
    
    # AGI API routes with professional configuration
    location /agi {
        limit_req zone=agi burst=20 nodelay;
        
        proxy_pass http://localhost:${AGI_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
        proxy_send_timeout 300s;
        
        # CORS headers for professional API
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With" always;
        add_header Access-Control-Allow-Credentials "true" always;
        
        # Handle preflight requests
        if (\$request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin "*";
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
            add_header Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With";
            add_header Access-Control-Max-Age 1728000;
            add_header Content-Type "text/plain; charset=utf-8";
            add_header Content-Length 0;
            return 204;
        }
    }
    
    # Health check endpoint with caching
    location /agi/health {
        limit_req zone=agi burst=10 nodelay;
        
        proxy_pass http://localhost:${AGI_PORT}/health;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # Cache health checks for 30 seconds
        proxy_cache_valid 200 30s;
        add_header Cache-Control "public, max-age=30";
        add_header X-Cache-Status \$upstream_cache_status;
    }
    
    # Consciousness endpoint
    location /agi/consciousness {
        limit_req zone=agi burst=15 nodelay;
        
        proxy_pass http://localhost:${AGI_PORT}/consciousness;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # API endpoints with rate limiting
    location /agi/reason {
        limit_req zone=api burst=10 nodelay;
        
        proxy_pass http://localhost:${AGI_PORT}/reason;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 60s;
    }
    
    location /agi/learn {
        limit_req zone=api burst=10 nodelay;
        
        proxy_pass http://localhost:${AGI_PORT}/learn;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 60s;
    }
    
    location /agi/create {
        limit_req zone=api burst=10 nodelay;
        
        proxy_pass http://localhost:${AGI_PORT}/create;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 60s;
    }
    
    # Root redirect to AGI
    location = / {
        return 301 https://\$server_name/agi;
    }
    
    # Professional landing page
    location = /agi {
        return 200 '{"message": "NeuralCore True AGI API", "version": "1.0.0", "endpoints": ["/agi/health", "/agi/consciousness", "/agi/reason", "/agi/learn", "/agi/create"], "documentation": "https://github.com/HelloblueAI/neural-quantum-consciousness-framework"}';
        add_header Content-Type application/json;
        add_header Cache-Control "no-cache";
    }
    
    # Static files with caching
    location /static {
        alias /var/www/static;
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header X-Cache-Status "static";
    }
    
    # Professional error pages
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
    
    location = /50x.html {
        root /usr/share/nginx/html;
    }
    
    location = /404.html {
        root /usr/share/nginx/html;
    }
}
EOF

echo "✅ Created professional nginx configuration"

# Create Docker Compose for professional deployment
cat > deploy/professional-agi-compose.yml << EOF
version: '3.8'

services:
  agi:
    image: neuralcore-agi
    container_name: professional-agi
    restart: unless-stopped
    ports:
      - "127.0.0.1:${AGI_PORT}:${AGI_PORT}"
    environment:
      - NODE_ENV=production
      - PORT=${AGI_PORT}
      - DOMAIN=${DOMAIN}
    networks:
      - agi-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:${AGI_PORT}/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  nginx:
    image: nginx:alpine
    container_name: professional-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./professional-agi-nginx.conf:/etc/nginx/conf.d/default.conf
      - /var/www/static:/var/www/static:ro
    depends_on:
      - agi
    networks:
      - agi-network
    healthcheck:
      test: ["CMD", "nginx", "-t"]
      interval: 30s
      timeout: 10s
      retries: 3
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

networks:
  agi-network:
    driver: bridge
EOF

echo "✅ Created professional Docker Compose configuration"

# Create deployment script
cat > deploy/deploy-professional-agi.sh << 'EOF'
#!/bin/bash

# 🚀 Deploy Professional AGI
set -e

echo "🚀 Deploying Professional AGI..."

# Build the AGI image
echo "🔨 Building AGI Docker image..."
docker build -t neuralcore-agi -f deploy/Dockerfile.simple .

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f deploy/professional-agi-compose.yml down || true

# Start the services
echo "🚀 Starting AGI and nginx..."
docker-compose -f deploy/professional-agi-compose.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 15

# Check AGI health
echo "🏥 Checking AGI health..."
curl -f http://localhost:8080/health || {
    echo "❌ AGI health check failed"
    docker-compose -f deploy/professional-agi-compose.yml logs agi
    exit 1
}

# Test nginx configuration
echo "🔧 Testing nginx configuration..."
docker exec professional-nginx nginx -t

# Reload nginx
echo "🔄 Reloading nginx..."
docker exec professional-nginx nginx -s reload

echo "✅ Professional AGI successfully deployed!"
echo "🌐 Your AGI is now accessible at:"
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
echo "  Stop AGI: docker-compose -f deploy/professional-agi-compose.yml down"
echo "  Restart AGI: docker-compose -f deploy/professional-agi-compose.yml restart"
echo "  Monitor: docker stats professional-agi professional-nginx"
EOF

chmod +x deploy/deploy-professional-agi.sh

echo "✅ Created professional deployment script"

echo ""
echo "🎉 Professional AGI deployment setup complete!"
echo ""
echo "📋 Deploy your AGI:"
echo "  ./deploy/deploy-professional-agi.sh"
echo ""
echo "🌐 This is how professional software engineers deploy production systems!"
echo "   - HTTPS with SSL/TLS"
echo "   - Rate limiting and security headers"
echo "   - Professional nginx configuration"
echo "   - Docker containerization"
echo "   - Health monitoring and logging" 