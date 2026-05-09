#!/bin/bash

# Deployment script for Dollar Growth Laravel Application
# Usage: ./deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
APP_NAME="dollorgrows"
APP_DIR="/var/www/${APP_NAME}"
BACKUP_DIR="/var/backups/${APP_NAME}"
DATE=$(date +%Y%m%d_%H%M%S)

echo "🚀 Starting deployment for ${APP_NAME} to ${ENVIRONMENT} environment"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
  echo "Please run as root or with sudo"
  exit 1
fi

# Load environment specific variables
if [ -f "${APP_DIR}/.env.${ENVIRONMENT}" ]; then
    source "${APP_DIR}/.env.${ENVIRONMENT}"
fi

echo "📦 Step 1: Backup current installation"
if [ -d "${APP_DIR}" ]; then
    mkdir -p "${BACKUP_DIR}"
    tar -czf "${BACKUP_DIR}/backup_${DATE}.tar.gz" -C "${APP_DIR}" .
    echo "✅ Backup created at ${BACKUP_DIR}/backup_${DATE}.tar.gz"
fi

echo "🔧 Step 2: Update code from repository"
cd "${APP_DIR}"
git pull origin main

echo "📦 Step 3: Install PHP dependencies"
composer install --no-dev --optimize-autoloader

echo "🔨 Step 4: Install JavaScript dependencies"
npm ci --only=production

echo "🏗️ Step 5: Build frontend assets"
npm run build

echo "🗄️ Step 6: Run database migrations"
php artisan migrate --force

echo "🔐 Step 7: Clear and cache configurations"
php artisan config:clear
php artisan config:cache
php artisan route:clear
php artisan route:cache
php artisan view:clear
php artisan view:cache

echo "📝 Step 8: Generate application key (if missing)"
if [ -z "$(grep '^APP_KEY=' ${APP_DIR}/.env)" ] || [ "$(grep '^APP_KEY=' ${APP_DIR}/.env | cut -d= -f2)" = "" ]; then
    php artisan key:generate --force
fi

echo "🔄 Step 9: Restart services"
systemctl restart php8.2-fpm
systemctl restart nginx

echo "🧹 Step 10: Clear application cache"
php artisan cache:clear
php artisan optimize:clear

echo "✅ Step 11: Set proper permissions"
chown -R www-data:www-data "${APP_DIR}/storage"
chown -R www-data:www-data "${APP_DIR}/bootstrap/cache"
chmod -R 775 "${APP_DIR}/storage"
chmod -R 775 "${APP_DIR}/bootstrap/cache"

echo "📊 Step 12: Health check"
curl -f http://localhost/health || echo "⚠️ Health check failed, but deployment completed"

echo "🎉 Deployment completed successfully!"
echo "📅 Deployment timestamp: ${DATE}"
echo "🌐 Application URL: ${APP_URL:-http://localhost}"
echo "🔍 Check logs: tail -f ${APP_DIR}/storage/logs/laravel.log"