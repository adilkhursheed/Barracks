#!/bin/bash

# Startup script for Azure App Service (Linux)

echo "======================================"
echo "Starting Barracks Application"
echo "======================================"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm ci --only=production
fi

# Start the Node.js server
echo "Starting server..."
node server.js