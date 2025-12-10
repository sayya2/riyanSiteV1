#!/bin/bash

# Riyan Deployment Script
# This script helps deploy or update the application

set -e

echo "=== Riyan Deployment Script ==="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo -e "${RED}Error: .env.production file not found!${NC}"
    echo "Please create .env.production with the required environment variables."
    echo "See deployment-lightsail.md for details."
    exit 1
fi

# Check if running on server or locally
if [ -d ".git" ]; then
    echo -e "${YELLOW}Git repository detected. Pulling latest changes...${NC}"
    git pull
    echo -e "${GREEN}✓ Code updated${NC}"
    echo ""
fi

# Stop existing containers
echo -e "${YELLOW}Stopping existing containers...${NC}"
docker compose down
echo -e "${GREEN}✓ Containers stopped${NC}"
echo ""

# Build and start containers
echo -e "${YELLOW}Building and starting containers...${NC}"
docker compose up -d --build
echo -e "${GREEN}✓ Containers started${NC}"
echo ""

# Wait for containers to be healthy
echo -e "${YELLOW}Waiting for containers to be ready...${NC}"
sleep 10

# Check container status
echo ""
echo "=== Container Status ==="
docker compose ps
echo ""

# Show recent logs
echo "=== Recent Application Logs ==="
docker compose logs --tail=20 web
echo ""

# Health check
echo -e "${YELLOW}Performing health check...${NC}"
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Application is running!${NC}"
    echo ""
    echo "Application URL: http://localhost:3000"
else
    echo -e "${RED}✗ Application health check failed${NC}"
    echo "Check logs with: docker compose logs -f web"
    exit 1
fi

echo ""
echo -e "${GREEN}=== Deployment Complete ===${NC}"
echo ""
echo "Useful commands:"
echo "  View logs:    docker compose logs -f web"
echo "  Restart app:  docker compose restart web"
echo "  Stop all:     docker compose down"
echo "  View status:  docker compose ps"
