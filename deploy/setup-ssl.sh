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
