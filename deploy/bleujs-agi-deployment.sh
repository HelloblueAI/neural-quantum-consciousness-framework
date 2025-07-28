#!/bin/bash

# 🚀 Professional AGI Deployment for bleujs.org/agi
# This is how real software engineers deploy production systems!

set -e

echo "🌐 Setting up professional AGI deployment at bleujs.org/agi..."

# Configuration
DOMAIN="bleujs.org"
AGI_PATH="/agi"
AGI_PORT="8080"
NGINX_PORT="80"
HTTPS_PORT="443"

# Create nginx configuration for bleujs.org/agi
cat > deploy/bleujs-agi-nginx.conf << EOF
server {
    listen ${NGINX_PORT};
    listen [::]:${NGINX_PORT};
    server_name ${DOMAIN};
    
    # Redirect HTTP to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen ${HTTPS_PORT} ssl http2;
    listen [::]:${HTTPS_PORT} ssl http2;
    server_name ${DOMAIN};
    
    # SSL Configuration (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';";
    
    # Rate limiting
    limit_req_zone \$binary_remote_addr zone=agi:10m rate=10r/s;
    limit_req zone=agi burst=20 nodelay;
    
    # AGI API routes
    location ${AGI_PATH} {
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
        
        # CORS headers
        add_header Access-Control-Allow-Origin "https://${DOMAIN}" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
        add_header Access-Control-Allow-Credentials "true" always;
        
        # Handle preflight requests
        if (\$request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin "https://${DOMAIN}";
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
            add_header Access-Control-Allow-Headers "Content-Type, Authorization";
            add_header Access-Control-Max-Age 1728000;
            add_header Content-Type "text/plain; charset=utf-8";
            add_header Content-Length 0;
            return 204;
        }
    }
    
    # Health check endpoint
    location ${AGI_PATH}/health {
        proxy_pass http://localhost:${AGI_PORT}/health;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # Cache health checks for 30 seconds
        proxy_cache_valid 200 30s;
        add_header Cache-Control "public, max-age=30";
    }
    
    # Consciousness endpoint
    location ${AGI_PATH}/consciousness {
        proxy_pass http://localhost:${AGI_PORT}/consciousness;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # API endpoints
    location ${AGI_PATH}/reason {
        proxy_pass http://localhost:${AGI_PORT}/reason;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 60s;
    }
    
    location ${AGI_PATH}/learn {
        proxy_pass http://localhost:${AGI_PORT}/learn;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 60s;
    }
    
    location ${AGI_PATH}/create {
        proxy_pass http://localhost:${AGI_PORT}/create;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 60s;
    }
    
    # Root redirect to AGI
    location = / {
        return 301 https://${DOMAIN}${AGI_PATH};
    }
    
    # Static files (if any)
    location /static {
        alias /var/www/static;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Error pages
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
    
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
EOF

echo "✅ Created professional nginx configuration for ${DOMAIN}${AGI_PATH}"

# Create Docker Compose for production
cat > deploy/bleujs-agi-compose.yml << EOF
version: '3.8'

services:
  agi:
    image: neuralcore-agi
    container_name: bleujs-agi
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

  nginx:
    image: nginx:alpine
    container_name: bleujs-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./bleujs-agi-nginx.conf:/etc/nginx/conf.d/default.conf
      - /etc/letsencrypt:/etc/letsencrypt:ro
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

  certbot:
    image: certbot/certbot
    container_name: bleujs-certbot
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt
      - /var/lib/letsencrypt:/var/lib/letsencrypt
    command: certonly --webroot --webroot-path=/var/www/html --email admin@${DOMAIN} --agree-tos --no-eff-email -d ${DOMAIN}
    networks:
      - agi-network

networks:
  agi-network:
    driver: bridge
EOF

echo "✅ Created Docker Compose configuration for production deployment"

# Create deployment script
cat > deploy/deploy-bleujs-agi.sh << 'EOF'
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
EOF

chmod +x deploy/deploy-bleujs-agi.sh

echo "✅ Created deployment script"

# Create SSL certificate setup script
cat > deploy/setup-ssl.sh << 'EOF'
#!/bin/bash

# 🔒 Setup SSL certificates for bleujs.org
set -e

echo "🔒 Setting up SSL certificates for bleujs.org..."

# Install certbot if not present
if ! command -v certbot &> /dev/null; then
    echo "📦 Installing certbot..."
    sudo apt-get update
    sudo apt-get install -y certbot
fi

# Create webroot directory
sudo mkdir -p /var/www/html

# Get SSL certificate
echo "🎫 Obtaining SSL certificate..."
sudo certbot certonly --webroot --webroot-path=/var/www/html \
    --email admin@bleujs.org --agree-tos --no-eff-email \
    -d bleujs.org

# Setup auto-renewal
echo "🔄 Setting up auto-renewal..."
sudo crontab -l 2>/dev/null | { cat; echo "0 12 * * * /usr/bin/certbot renew --quiet"; } | sudo crontab -

echo "✅ SSL certificates configured!"
echo "🔒 Your AGI will be accessible at: https://bleujs.org/agi"
EOF

chmod +x deploy/setup-ssl.sh

echo "✅ Created SSL setup script"

echo ""
echo "🎉 Professional AGI deployment setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Setup SSL certificates: ./deploy/setup-ssl.sh"
echo "2. Deploy AGI: ./deploy/deploy-bleujs-agi.sh"
echo "3. Your AGI will be live at: https://bleujs.org/agi"
echo ""
echo "🌐 This is how professional software engineers deploy production systems!" 