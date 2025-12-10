# Deployment Scripts

This folder contains helpful scripts for deploying and managing the Riyan application on AWS Lightsail.

## Scripts Overview

### 1. setup-server.sh
**Purpose**: Initial server setup on a fresh Ubuntu instance

**What it does**:
- Updates system packages
- Installs Docker and Docker Compose
- Installs Git and other prerequisites
- Optionally installs Nginx and Certbot
- Configures the environment

**Usage**:
```bash
chmod +x scripts/setup-server.sh
./scripts/setup-server.sh
```

**When to use**: Run this once on a new Lightsail instance before deploying the application.

---

### 2. deploy.sh
**Purpose**: Deploy or update the application

**What it does**:
- Pulls latest code from Git (if repository exists)
- Stops existing containers
- Builds and starts new containers
- Performs health checks
- Shows container status and logs

**Usage**:
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

**When to use**:
- First deployment after server setup
- Updating the application with new changes
- Redeploying after configuration changes

---

### 3. backup-db.sh
**Purpose**: Create database backups

**What it does**:
- Creates a timestamped SQL dump of the database
- Compresses the backup with gzip
- Keeps only the last 7 backups (auto-cleanup)
- Shows backup size and restore instructions

**Usage**:
```bash
chmod +x scripts/backup-db.sh
./scripts/backup-db.sh
```

**When to use**:
- Before major updates or migrations
- Regular scheduled backups (set up with cron)
- Before making database schema changes

**Setting up automatic backups with cron**:
```bash
# Edit crontab
crontab -e

# Add this line for daily backups at 2 AM
0 2 * * * cd ~/riyan && ./scripts/backup-db.sh >> ~/backup.log 2>&1
```

---

### 4. monitor.sh
**Purpose**: Monitor system and application health

**What it does**:
- Shows system resource usage (CPU, memory, disk)
- Displays Docker container status
- Checks application and database health
- Shows recent logs
- Lists open ports

**Usage**:
```bash
chmod +x scripts/monitor.sh
./scripts/monitor.sh
```

**When to use**:
- Troubleshooting issues
- Regular health checks
- Performance monitoring
- Checking if services are running properly

---

## Quick Start Guide

### Initial Deployment

1. **On your local machine**, upload the setup script to your Lightsail instance:
   ```bash
   scp -i your-key.pem scripts/setup-server.sh ubuntu@YOUR_IP:~/
   ```

2. **SSH into your Lightsail instance**:
   ```bash
   ssh -i your-key.pem ubuntu@YOUR_IP
   ```

3. **Run the setup script**:
   ```bash
   chmod +x setup-server.sh
   ./setup-server.sh
   ```

4. **Log out and log back in** for Docker group changes to take effect:
   ```bash
   exit
   ssh -i your-key.pem ubuntu@YOUR_IP
   ```

5. **Clone your repository**:
   ```bash
   git clone https://github.com/sayya2/riyan.git
   cd riyan
   ```

6. **Create .env.production file**:
   ```bash
   nano .env.production
   # Add your environment variables (see .env.production.example)
   ```

7. **Deploy the application**:
   ```bash
   chmod +x scripts/*.sh
   ./scripts/deploy.sh
   ```

### Regular Maintenance

**Update application**:
```bash
cd ~/riyan
./scripts/deploy.sh
```

**Create backup**:
```bash
cd ~/riyan
./scripts/backup-db.sh
```

**Check system status**:
```bash
cd ~/riyan
./scripts/monitor.sh
```

## Troubleshooting

If scripts fail to execute:
```bash
# Make sure they're executable
chmod +x scripts/*.sh

# Check for Windows line endings (if edited on Windows)
dos2unix scripts/*.sh
```

If deployment fails:
```bash
# Check logs
docker compose logs -f

# Check container status
docker compose ps

# Restart services
docker compose restart
```

## Notes

- All scripts should be run from the project root directory (`~/riyan`)
- Scripts use relative paths, so make sure you're in the correct directory
- Some scripts require sudo permissions (you'll be prompted)
- Backup files are stored in `./backups/` directory
- Database passwords in scripts should match your .env.production and docker-compose.yml
