#!/bin/bash

# Jugofilm.online Docker Deployment Script
set -e

echo "🚀 Starting Docker deployment for jugofilm.online..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Navigate to project directory
cd /home/lazar/jugofilm.online

echo -e "${YELLOW}📦 Pulling latest changes...${NC}"
git pull origin main

echo -e "${YELLOW}🛑 Stopping PM2 process if running...${NC}"
pm2 delete jugofilm 2>/dev/null || true

echo -e "${YELLOW}🐳 Building Docker image...${NC}"
docker compose build

echo -e "${YELLOW}🔄 Stopping old container...${NC}"
docker compose down

echo -e "${YELLOW}🚀 Starting new container...${NC}"
docker compose up -d

echo -e "${YELLOW}📊 Checking container status...${NC}"
docker compose ps

echo -e "${YELLOW}📝 Showing logs (last 20 lines)...${NC}"
docker compose logs --tail=20

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${GREEN}🌐 Site should be live at https://jugofilm.online${NC}"
