# AWS Lightsail Deployment Guide

This guide will walk you through deploying the Riyan Next.js application to AWS Lightsail using Docker.

## Prerequisites

- AWS Account
- AWS CLI installed and configured (optional but recommended)
- SSH key pair for accessing the instance
- Domain name (optional, for custom domain setup)

## Step 1: Create a Lightsail Instance

### Option A: Using AWS Console

1. Go to [AWS Lightsail Console](https://lightsail.aws.amazon.com/)
2. Click "Create instance"
3. Select instance location (choose closest to your users)
4. Pick your instance image:
   - Platform: **Linux/Unix**
   - Blueprint: **OS Only** → **Ubuntu 22.04 LTS** or **Ubuntu 24.04 LTS**
5. Choose instance plan:
   - **Recommended**: $20/month (4 GB RAM, 2 vCPUs, 80 GB SSD)
   - **Minimum**: $12/month (2 GB RAM, 1 vCPU, 60 GB SSD)
   - Higher plans if you expect heavy traffic
6. Name your instance (e.g., `riyan-production`)
7. Click "Create instance"

### Option B: Using AWS CLI

```bash
aws lightsail create-instances \
  --instance-names riyan-production \
  --availability-zone us-east-1a \
  --blueprint-id ubuntu_22_04 \
  --bundle-id medium_2_0 \
  --key-pair-name MyKeyPair
```

## Step 2: Configure Networking

### Open Required Ports

1. In Lightsail console, go to your instance
2. Click on the **Networking** tab
3. Under **IPv4 Firewall**, add these rules:
   - **HTTP**: TCP, Port 80
   - **HTTPS**: TCP, Port 443
   - **Custom**: TCP, Port 3000 (for testing, can remove later)
   - **SSH**: TCP, Port 22 (should already be there)

### Attach a Static IP (Recommended)

1. Go to **Networking** tab in Lightsail console
2. Click **Create static IP**
3. Select your instance
4. Name it (e.g., `riyan-static-ip`)
5. Click **Create**

## Step 3: Connect to Your Instance

### Using Lightsail Browser SSH
1. Click "Connect using SSH" button in the console

### Using Your Own SSH Client
```bash
ssh -i /path/to/your-key.pem ubuntu@YOUR_STATIC_IP
```

## Step 4: Install Docker and Docker Compose

Once connected to your instance, run:

```bash
# Update package index
sudo apt update

# Install prerequisites
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update package index again
sudo apt update

# Install Docker
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Install Docker Compose
sudo apt install -y docker-compose-plugin

# Add ubuntu user to docker group
sudo usermod -aG docker ubuntu

# Log out and back in for group changes to take effect
exit
```

Reconnect to your instance for the docker group changes to take effect.

## Step 5: Deploy Your Application

### Clone Your Repository

```bash
# Install Git if not already installed
sudo apt install -y git

# Clone your repository
git clone https://github.com/sayya2/riyan.git
cd riyan
```

### Set Up Environment Variables

Create a production environment file:

```bash
nano .env.production
```

Add your environment variables:

```env
# Database Configuration
DB_HOST=mariadb
DB_USER=riyan_user
DB_PASSWORD=your_secure_password_here
DB_NAME=riyan_nextjs
DB_PORT=3306

# Next.js Configuration
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Add any other environment variables your app needs
```

Update the database password in `docker-compose.yml`:

```bash
nano docker-compose.yml
```

Change the `MYSQL_PASSWORD` and `MYSQL_ROOT_PASSWORD` to secure values.

### Import Your Database

If you have an existing database dump, place it in the `db_init` folder:

```bash
# Create db_init folder if it doesn't exist
mkdir -p db_init

# Upload your SQL file
# You can use scp from your local machine:
# scp -i /path/to/key.pem your-database.sql ubuntu@YOUR_STATIC_IP:~/riyan/db_init/
```

### Build and Start the Application

```bash
# Build and start containers
docker compose up -d --build

# Check if containers are running
docker compose ps

# View logs
docker compose logs -f web
```

## Step 6: Set Up Nginx Reverse Proxy (Recommended)

Install and configure Nginx as a reverse proxy:

```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/riyan
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN.com www.YOUR_DOMAIN.com;

    # Client upload size limit
    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/riyan /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## Step 7: Set Up SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d YOUR_DOMAIN.com -d www.YOUR_DOMAIN.com

# Certificate will auto-renew. Test renewal:
sudo certbot renew --dry-run
```

## Step 8: Configure Domain DNS

Point your domain to the Lightsail static IP:

1. Go to your domain registrar
2. Add/Update A records:
   - `@` → Your Lightsail Static IP
   - `www` → Your Lightsail Static IP

## Maintenance Commands

### Update Application

```bash
cd ~/riyan
git pull
docker compose down
docker compose up -d --build
```

### View Logs

```bash
# All containers
docker compose logs -f

# Specific service
docker compose logs -f web
docker compose logs -f mariadb
```

### Restart Services

```bash
# Restart all
docker compose restart

# Restart specific service
docker compose restart web
```

### Database Backup

```bash
# Create backup
docker compose exec mariadb mysqldump -u riyan_user -p riyan_nextjs > backup_$(date +%Y%m%d).sql

# Restore backup
docker compose exec -T mariadb mysql -u riyan_user -p riyan_nextjs < backup_20250101.sql
```

### Clean Up Docker Resources

```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove unused containers
docker container prune
```

## Monitoring

### Set Up CloudWatch (Optional)

```bash
# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i amazon-cloudwatch-agent.deb
```

### Simple Monitoring Script

Create a monitoring script:

```bash
nano ~/monitor.sh
```

```bash
#!/bin/bash
echo "=== System Resources ==="
free -h
echo ""
df -h
echo ""
echo "=== Docker Containers ==="
docker compose ps
echo ""
echo "=== Recent Logs ==="
docker compose logs --tail=50 web
```

```bash
chmod +x ~/monitor.sh
./monitor.sh
```

## Troubleshooting

### Container won't start
```bash
docker compose logs web
docker compose down
docker compose up -d
```

### Database connection issues
```bash
# Check if database is running
docker compose ps mariadb

# Check database logs
docker compose logs mariadb

# Verify environment variables
docker compose exec web env | grep DB_
```

### Out of disk space
```bash
# Check disk usage
df -h

# Clean Docker
docker system prune -a --volumes
```

## Security Best Practices

1. **Change default passwords** in docker-compose.yml
2. **Use strong passwords** for database
3. **Enable automatic security updates**:
   ```bash
   sudo apt install unattended-upgrades
   sudo dpkg-reconfigure -plow unattended-upgrades
   ```
4. **Set up firewall** using UFW:
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```
5. **Regular backups** of database and uploaded files
6. **Monitor logs** regularly for suspicious activity

## Cost Optimization

- Start with a smaller instance and scale up as needed
- Use Lightsail snapshots for backups (first snapshot free each month)
- Monitor data transfer (first 1-3 TB free depending on plan)
- Clean up unused Docker images and volumes regularly

## Support

For issues or questions:
- Check logs: `docker compose logs -f`
- Restart services: `docker compose restart`
- Rebuild: `docker compose up -d --build --force-recreate`

## Quick Reference

### What's in this repo
- Next.js 16 app with TypeScript
- MariaDB/MySQL database integration
- Docker configuration for containerized deployment
- Environment-based configuration

### Files Created
- `Dockerfile` - Multi-stage build for Next.js app
- `docker-compose.yml` - Orchestrates web app and database
- `.dockerignore` - Excludes unnecessary files from build
- `next.config.ts` - Configured with `output: 'standalone'`

### Environment Variables Required
- `DB_HOST` - Database hostname (use 'mariadb' for Docker)
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `DB_PORT` - Database port (3306)
- `NODE_ENV` - Environment (production)
