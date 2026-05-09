# Dollar Growth - Laravel Application Deployment Guide

This document provides instructions for deploying the Dollar Growth Laravel application to various environments.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Deployment Scripts](#deployment-scripts)
4. [Manual Deployment Steps](#manual-deployment-steps)
5. [Production Configuration](#production-configuration)
6. [Monitoring & Health Checks](#monitoring--health-checks)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### Server Requirements
- PHP 8.2 or higher
- MySQL 5.7+ or MariaDB 10.3+
- Composer 2.0+
- Node.js 18+ and npm
- Git
- Web server (Apache/Nginx)

### PHP Extensions Required
- BCMath
- Ctype
- cURL
- DOM
- Fileinfo
- GD
- JSON
- Mbstring
- OpenSSL
- PCRE
- PDO
- Tokenizer
- XML
- Zip

## Environment Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-organization/dollorgrows.git
cd dollorgrows/laravel
```

### 2. Configure Environment Variables
```bash
cp .env.example .env
# Edit .env with your production values
nano .env
```

### 3. Install Dependencies
```bash
composer install --no-dev --optimize-autoloader
npm ci --only=production
```

### 4. Generate Application Key
```bash
php artisan key:generate
```

### 5. Configure Database
Update `.env` with your database credentials:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=dollorgrows
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 6. Run Migrations
```bash
php artisan migrate --force
```

### 7. Build Frontend Assets
```bash
npm run build
```

### 8. Set Permissions
```bash
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache
```

## Deployment Scripts

### Linux/macOS Deployment
```bash
# Make script executable
chmod +x deploy.sh

# Run deployment
sudo ./deploy.sh production
```

### Windows Deployment
```batch
# Run as Administrator
deploy.bat production
```

### Script Features
- Automatic backups before deployment
- Dependency installation
- Database migrations
- Asset compilation
- Cache optimization
- Service restart
- Health checks

## Manual Deployment Steps

### 1. Pre-deployment Checklist
- [ ] Backup database
- [ ] Backup application files
- [ ] Check server resources
- [ ] Notify users of maintenance window

### 2. Update Code
```bash
git pull origin main
```

### 3. Install Dependencies
```bash
composer install --no-dev --optimize-autoloader
npm ci --only=production
```

### 4. Run Database Operations
```bash
php artisan migrate --force
# Optional: Seed data
php artisan db:seed --force
```

### 5. Optimize Application
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

### 6. Build Assets
```bash
npm run build
```

### 7. Restart Services
```bash
# For systemd
sudo systemctl restart php8.2-fpm
sudo systemctl restart nginx

# For XAMPP (Windows)
net stop Apache2.4
net stop MySQL
net start Apache2.4
net start MySQL
```

## Production Configuration

### Security Recommendations
1. **HTTPS**: Enable SSL/TLS certificates
2. **Firewall**: Configure proper firewall rules
3. **File Permissions**: Restrict access to sensitive directories
4. **Environment Variables**: Keep `.env` file secure
5. **Logging**: Enable proper logging and monitoring

### Performance Optimization
1. **OPCache**: Enable PHP OPcache
2. **Database Indexing**: Ensure proper database indexes
3. **Caching**: Use Redis or Memcached for caching
4. **CDN**: Use CDN for static assets
5. **Queue Workers**: Configure queue workers for background jobs

### .env Production Settings
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

SESSION_SECURE_COOKIE=true
SESSION_HTTP_ONLY=true

LOG_CHANNEL=stack
LOG_LEVEL=info

CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
```

## Monitoring & Health Checks

### Health Endpoints
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed system status (requires signature)

### Monitoring Tools
1. **Laravel Horizon**: For queue monitoring
2. **Laravel Telescope**: For debugging (development only)
3. **Sentry**: For error tracking
4. **New Relic/DataDog**: For APM

### Log Files
- `storage/logs/laravel.log` - Application logs
- Web server logs (Apache/Nginx)
- Database logs

## Troubleshooting

### Common Issues

#### 1. Permission Errors
```bash
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

#### 2. Database Connection Issues
- Verify database credentials in `.env`
- Check if database server is running
- Ensure user has proper permissions

#### 3. Asset Compilation Errors
```bash
rm -rf node_modules
npm cache clean --force
npm install
npm run build
```

#### 4. Cache Issues
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

#### 5. Migration Errors
```bash
php artisan migrate:fresh --force
# Or rollback and retry
php artisan migrate:rollback --step=1
php artisan migrate --force
```

### Emergency Rollback
```bash
# Restore from backup
tar -xzf /var/backups/dollorgrows/backup_*.tar.gz -C /var/www/dollorgrows

# Rollback database
php artisan migrate:rollback --step=5

# Restart services
sudo systemctl restart php8.2-fpm nginx
```

## Support

For deployment assistance, contact:
- **System Administrator**: admin@dollorgrows.com
- **Technical Support**: support@dollorgrows.com
- **Emergency Hotline**: +1-XXX-XXX-XXXX

---

**Last Updated**: 2026-05-09  
**Version**: 1.0.0  
**Application**: Dollar Growth Laravel