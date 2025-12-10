#!/bin/bash

# Server Setup Script for AWS Lightsail
# Run this script on a fresh Ubuntu instance

set -e

echo "=== Riyan Server Setup Script ==="
echo "This script will install Docker and required dependencies"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Update system
echo -e "${YELLOW}Updating system packages...${NC}"
sudo apt update
sudo apt upgrade -y
echo -e "${GREEN}✓ System updated${NC}"
echo ""

# Install prerequisites
echo -e "${YELLOW}Installing prerequisites...${NC}"
sudo apt install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common \
    git \
    wget
echo -e "${GREEN}✓ Prerequisites installed${NC}"
echo ""

# Install Docker
echo -e "${YELLOW}Installing Docker...${NC}"
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io
echo -e "${GREEN}✓ Docker installed${NC}"
echo ""

# Install Docker Compose
echo -e "${YELLOW}Installing Docker Compose...${NC}"
sudo apt install -y docker-compose-plugin
echo -e "${GREEN}✓ Docker Compose installed${NC}"
echo ""

# Add user to docker group
echo -e "${YELLOW}Adding user to docker group...${NC}"
sudo usermod -aG docker $USER
echo -e "${GREEN}✓ User added to docker group${NC}"
echo ""

# Enable Docker service
echo -e "${YELLOW}Enabling Docker service...${NC}"
sudo systemctl enable docker
sudo systemctl start docker
echo -e "${GREEN}✓ Docker service enabled${NC}"
echo ""

# Install Nginx (optional)
read -p "Do you want to install Nginx? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Installing Nginx...${NC}"
    sudo apt install -y nginx
    sudo systemctl enable nginx
    sudo systemctl start nginx
    echo -e "${GREEN}✓ Nginx installed${NC}"
    echo ""
fi

# Install Certbot (optional)
read -p "Do you want to install Certbot for SSL? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Installing Certbot...${NC}"
    sudo apt install -y certbot python3-certbot-nginx
    echo -e "${GREEN}✓ Certbot installed${NC}"
    echo ""
fi

# Create project directory
echo -e "${YELLOW}Creating project directory...${NC}"
mkdir -p ~/riyan
echo -e "${GREEN}✓ Project directory created${NC}"
echo ""

echo -e "${GREEN}=== Setup Complete! ===${NC}"
echo ""
echo "Next steps:"
echo "1. Log out and log back in for docker group changes to take effect"
echo "2. Clone your repository: git clone https://github.com/sayya2/riyan.git"
echo "3. Create .env.production file with your environment variables"
echo "4. Run: cd riyan && docker compose up -d --build"
echo ""
echo "IMPORTANT: Please log out and log back in now!"
