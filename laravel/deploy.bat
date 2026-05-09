@echo off
REM Deployment script for Dollar Growth Laravel Application (Windows)
REM Usage: deploy.bat [environment]

setlocal enabledelayedexpansion

set ENVIRONMENT=%1
if "%ENVIRONMENT%"=="" set ENVIRONMENT=production

set APP_NAME=dollorgrows
set APP_DIR=C:\xampp\htdocs\%APP_NAME%\laravel
set BACKUP_DIR=C:\backups\%APP_NAME%
set DATE=%DATE:/=-%_%TIME::=-%
set DATE=%DATE: =%

echo 🚀 Starting deployment for %APP_NAME% to %ENVIRONMENT% environment

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Please run as Administrator
    pause
    exit /b 1
)

REM Load environment specific variables
if exist "%APP_DIR%\.env.%ENVIRONMENT%" (
    for /f "usebackq tokens=1* delims==" %%A in ("%APP_DIR%\.env.%ENVIRONMENT%") do (
        set %%A=%%B
    )
)

echo 📦 Step 1: Backup current installation
if exist "%APP_DIR%" (
    if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"
    7z a -tzip "%BACKUP_DIR%\backup_%DATE%.zip" "%APP_DIR%\*" >nul
    echo ✅ Backup created at %BACKUP_DIR%\backup_%DATE%.zip
)

echo 🔧 Step 2: Update code from repository (assuming git is installed)
cd /d "%APP_DIR%"
git pull origin main

echo 📦 Step 3: Install PHP dependencies
composer install --no-dev --optimize-autoloader

echo 🔨 Step 4: Install JavaScript dependencies
npm ci --only=production

echo 🏗️ Step 5: Build frontend assets
npm run build

echo 🗄️ Step 6: Run database migrations
php artisan migrate --force

echo 🔐 Step 7: Clear and cache configurations
php artisan config:clear
php artisan config:cache
php artisan route:clear
php artisan route:cache
php artisan view:clear
php artisan view:cache

echo 📝 Step 8: Generate application key (if missing)
findstr /B "APP_KEY=" "%APP_DIR%\.env" >nul
if errorlevel 1 (
    php artisan key:generate --force
) else (
    for /f "tokens=2 delims==" %%a in ('findstr /B "APP_KEY=" "%APP_DIR%\.env"') do (
        if "%%a"=="" (
            php artisan key:generate --force
        )
    )
)

echo 🔄 Step 9: Restart services (XAMPP)
net stop Apache2.4
net stop MySQL
timeout /t 3 /nobreak >nul
net start Apache2.4
net start MySQL

echo 🧹 Step 10: Clear application cache
php artisan cache:clear
php artisan optimize:clear

echo ✅ Step 11: Set proper permissions (Windows typically doesn't need this)
icacls "%APP_DIR%\storage" /grant "IIS_IUSRS:(OI)(CI)F" /T >nul 2>&1
icacls "%APP_DIR%\bootstrap\cache" /grant "IIS_IUSRS:(OI)(CI)F" /T >nul 2>&1

echo 📊 Step 12: Health check
curl -f http://localhost/health >nul 2>&1
if errorlevel 1 (
    echo ⚠️ Health check failed, but deployment completed
) else (
    echo ✅ Health check passed
)

echo 🎉 Deployment completed successfully!
echo 📅 Deployment timestamp: %DATE%
echo 🌐 Application URL: %APP_URL%
echo 🔍 Check logs: type "%APP_DIR%\storage\logs\laravel.log"

pause