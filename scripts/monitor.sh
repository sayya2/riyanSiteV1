#!/bin/bash

# System and Application Monitoring Script

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}=== Riyan Application Monitor ===${NC}"
echo "Generated: $(date)"
echo ""

# System Resources
echo -e "${YELLOW}=== System Resources ===${NC}"
echo ""
echo "Memory Usage:"
free -h
echo ""
echo "Disk Usage:"
df -h | grep -E '^Filesystem|/$|/var/lib/docker'
echo ""
echo "CPU Load:"
uptime
echo ""

# Docker Status
echo -e "${YELLOW}=== Docker Containers ===${NC}"
echo ""
docker compose ps
echo ""

# Container Resources
echo -e "${YELLOW}=== Container Resources ===${NC}"
echo ""
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
echo ""

# Application Health
echo -e "${YELLOW}=== Application Health Check ===${NC}"
echo ""
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Web application is responding${NC}"
else
    echo -e "${RED}✗ Web application is NOT responding${NC}"
fi
echo ""

# Database Health
echo -e "${YELLOW}=== Database Health Check ===${NC}"
echo ""
if docker compose exec -T mariadb mysqladmin ping -h localhost -u root -prootpassword &> /dev/null; then
    echo -e "${GREEN}✓ Database is responding${NC}"
else
    echo -e "${RED}✗ Database is NOT responding${NC}"
fi
echo ""

# Recent Logs
echo -e "${YELLOW}=== Recent Application Logs (Last 20 lines) ===${NC}"
echo ""
docker compose logs --tail=20 web
echo ""

echo -e "${YELLOW}=== Recent Database Logs (Last 10 lines) ===${NC}"
echo ""
docker compose logs --tail=10 mariadb
echo ""

# Port Check
echo -e "${YELLOW}=== Open Ports ===${NC}"
echo ""
sudo netstat -tlnp | grep -E ':(80|443|3000|3306|3307)'
echo ""

echo -e "${BLUE}=== Monitor Complete ===${NC}"
