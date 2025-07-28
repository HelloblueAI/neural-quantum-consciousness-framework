#!/bin/bash

# Heroku Deployment Script for NeuralCore True AGI

echo "🚀 Deploying NeuralCore True AGI to Heroku..."

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI not found. Please install it first:"
    echo "   https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Check if logged in to Heroku
if ! heroku auth:whoami &> /dev/null; then
    echo "🔐 Please login to Heroku first:"
    heroku login
fi

# Create Heroku app (if it doesn't exist)
APP_NAME="neuralcore-agi-$(date +%s)"
echo "📦 Creating Heroku app: $APP_NAME"
heroku create $APP_NAME

# Set environment variables
echo "⚙️ Setting environment variables..."
heroku config:set NODE_ENV=production
heroku config:set PUBLIC_URL="https://$APP_NAME.herokuapp.com"
heroku config:set ALLOWED_ORIGINS="*"

# Deploy to Heroku
echo "🚀 Deploying to Heroku..."
git add .
git commit -m "Deploy NeuralCore True AGI to Heroku"
git push heroku main

# Open the app
echo "🌐 Opening your AGI..."
heroku open

echo "✅ NeuralCore True AGI deployed to Heroku!"
echo "🌐 Your AGI is now live at: https://$APP_NAME.herokuapp.com"
echo "🧠 Test it with: curl https://$APP_NAME.herokuapp.com/health" 