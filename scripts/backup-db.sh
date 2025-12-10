#!/bin/bash

# Database Backup Script
# Creates a backup of the MariaDB database

set -e

# Configuration
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/riyan_backup_$DATE.sql"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "=== Database Backup Script ==="
echo ""

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Check if database container is running
if ! docker compose ps mariadb | grep -q "Up"; then
    echo "Error: MariaDB container is not running!"
    echo "Start it with: docker compose up -d mariadb"
    exit 1
fi

echo -e "${YELLOW}Creating database backup...${NC}"

# Create backup
docker compose exec -T mariadb mysqldump \
    -u riyan_user \
    -p'riyan_password' \
    riyan_nextjs > $BACKUP_FILE

# Compress backup
echo -e "${YELLOW}Compressing backup...${NC}"
gzip $BACKUP_FILE

echo -e "${GREEN}✓ Backup created: ${BACKUP_FILE}.gz${NC}"
echo ""
echo "Backup size: $(du -h ${BACKUP_FILE}.gz | cut -f1)"
echo ""

# Keep only last 7 backups
echo "Cleaning old backups (keeping last 7)..."
cd $BACKUP_DIR
ls -t riyan_backup_*.sql.gz | tail -n +8 | xargs -r rm
cd ..

echo -e "${GREEN}✓ Backup complete!${NC}"
echo ""
echo "To restore this backup:"
echo "  gunzip ${BACKUP_FILE}.gz"
echo "  docker compose exec -T mariadb mysql -u riyan_user -p'riyan_password' riyan_nextjs < ${BACKUP_FILE}"
