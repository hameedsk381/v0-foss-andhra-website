@echo off
setlocal enabledelayedexpansion

:: FOSS Andhra Website Production Deployment Script for Windows
:: This script automates the deployment process for production environments on Windows

:: Colors for output (using PowerShell)
set "BLUE=[INFO]"
set "GREEN=[SUCCESS]"
set "YELLOW=[WARNING]"
set "RED=[ERROR]"

:: Logging functions
:log
echo %BLUE% %~1
exit /b

:success
echo %GREEN% %~1
exit /b

:warning
echo %YELLOW% %~1
exit /b

:error
echo %RED% %~1
exit /b

:: Check if running in the correct directory
if not exist "package.json" (
    call :error "This script must be run from the project root directory"
    pause
    exit /b 1
)

:: Main deployment function
:deploy
call :log "Starting FOSS Andhra Website Production Deployment..."

:: Check prerequisites
call :check_prerequisites
if errorlevel 1 (
    call :error "Prerequisites check failed"
    pause
    exit /b 1
)

:: Update code (if Git is available)
call :update_code

:: Install dependencies
call :install_dependencies
if errorlevel 1 (
    call :error "Failed to install dependencies"
    pause
    exit /b 1
)

:: Setup environment
call :setup_environment

:: Setup database
call :setup_database
if errorlevel 1 (
    call :error "Failed to setup database"
    pause
    exit /b 1
)

:: Build application
call :build_application
if errorlevel 1 (
    call :error "Failed to build application"
    pause
    exit /b 1
)

:: Start application with PM2
call :start_application
if errorlevel 1 (
    call :error "Failed to start application"
    pause
    exit /b 1
)

call :success "Deployment completed successfully!"
call :log "Application should now be running."
pause
exit /b 0

:: Check prerequisites
:check_prerequisites
call :log "Checking prerequisites..."

:: Check Bun
where bun >nul 2>&1
if errorlevel 1 (
    call :error "Bun is not installed. Please install Bun first."
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('bun --version') do set BUN_VERSION=%%i
    call :success "Bun version !BUN_VERSION! found"
)

:: Check Git
where git >nul 2>&1
if errorlevel 1 (
    call :warning "Git is not installed. Skipping Git operations."
) else (
    for /f "tokens=*" %%i in ('git --version') do set GIT_VERSION=%%i
    call :success "Git !GIT_VERSION! found"
)

call :success "All prerequisites checked!"
exit /b 0

:: Update code from repository
:update_code
call :log "Updating code from repository..."

where git >nul 2>&1
if errorlevel 1 (
    call :warning "Git not found. Skipping code update."
    exit /b 0
)

git pull origin main
if errorlevel 1 (
    call :warning "Failed to pull latest code"
    exit /b 0
)

call :success "Code updated successfully"
exit /b 0

:: Install dependencies
:install_dependencies
call :log "Installing dependencies..."

bun install
if errorlevel 1 (
    exit /b 1
)

call :success "Dependencies installed successfully"
exit /b 0

:: Setup environment
:setup_environment
call :log "Setting up environment..."

:: Copy production environment template if .env doesn't exist
if not exist ".env" (
    if exist ".env.production" (
        copy ".env.production" ".env" >nul
        call :warning "Copied .env.production to .env. Please update with your actual values!"
    ) else (
        call :warning "No .env file found. Creating minimal .env file..."
        (
            echo # Database
            echo DATABASE_URL=postgresql://username:password@localhost:5432/fossandhra?schema=public
            echo.
            echo # Auth
            echo NEXTAUTH_SECRET=please_generate_a_secure_secret_here
            echo.
            echo # Domains
            echo NEXT_PUBLIC_APP_URL=https://yourdomain.com
            echo NEXTAUTH_URL=https://yourdomain.com
            echo.
            echo # Razorpay
            echo RAZORPAY_KEY_ID=your_razorpay_key_id
            echo RAZORPAY_KEY_SECRET=your_razorpay_key_secret
            echo.
            echo # Email
            echo SMTP_HOST=smtp.yourprovider.com
            echo SMTP_PORT=465
            echo SMTP_USER=your_email@domain.com
            echo SMTP_PASS=your_app_password
            echo SMTP_FROM_EMAIL=noreply@yourdomain.com
            echo SMTP_FROM_NAME=FOSS Andhra
            echo.
            echo # MinIO
            echo MINIO_ENDPOINT=localhost
            echo MINIO_PORT=9000
            echo MINIO_USE_SSL=false
            echo MINIO_ACCESS_KEY=minioadmin
            echo MINIO_SECRET_KEY=minioadmin
            echo MINIO_BUCKET=foss-andhra-gallery
            echo MINIO_PUBLIC_URL=http://localhost:9000
        ) > .env
        call :warning "Created minimal .env file. Please update with your actual values!"
    )
)

:: Check for placeholder values
findstr /C:"your-" ".env" >nul
if not errorlevel 1 (
    call :warning "Detected placeholder values in .env. Please update with actual values before proceeding."
)

call :success "Environment setup completed"
exit /b 0

:: Setup database
:setup_database
call :log "Setting up database..."

:: Generate Prisma client
call :log "Generating Prisma client..."
bunx prisma generate
if errorlevel 1 (
    call :error "Failed to generate Prisma client"
    exit /b 1
)

:: Run migrations
call :log "Running database migrations..."
bunx prisma migrate deploy
if errorlevel 1 (
    call :warning "Database migrations failed, attempting db push..."
    bunx prisma db push
    if errorlevel 1 (
        call :error "Failed to push database schema"
        exit /b 1
    )
)

:: Seed database
call :log "Seeding database..."
bunx tsx prisma/seed.ts
if errorlevel 1 (
    call :error "Failed to seed database"
    exit /b 1
)

:: Create admin user
call :log "Creating admin user..."
if exist "scripts/create-admin.ts" (
    bunx tsx scripts/create-admin.ts
    if errorlevel 1 (
        call :warning "Admin user creation failed. May already exist."
    )
) else (
    call :warning "Admin creation script not found. Skipping."
)

call :success "Database setup completed"
exit /b 0

:: Build application
:build_application
call :log "Building application for production..."

bun run build
if errorlevel 1 (
    exit /b 1
)

call :success "Application built successfully"
exit /b 0

:: Start application with PM2
:start_application
call :log "Starting application with PM2..."

:: Check if PM2 is installed
npm list -g pm2 >nul 2>&1
if errorlevel 1 (
    call :log "Installing PM2..."
    npm install -g pm2
    if errorlevel 1 (
        call :error "Failed to install PM2"
        exit /b 1
    )
)

:: Start application
pm2 startOrRestart ecosystem.config.js --env production
if errorlevel 1 (
    call :error "Failed to start application with PM2"
    exit /b 1
)

:: Save PM2 configuration
pm2 save
if errorlevel 1 (
    call :error "Failed to save PM2 configuration"
    exit /b 1
)

call :success "Application started successfully with PM2"
exit /b 0

:: Show help
:show_help
echo FOSS Andhra Website Deployment Script for Windows
echo.
echo Usage: deploy.bat
echo.
echo This script will:
echo   1. Check prerequisites
echo   2. Update code from repository
echo   3. Install dependencies
echo   4. Setup environment
echo   5. Setup database
echo   6. Build application
echo   7. Start application with PM2
echo.
echo Please make sure you have:
echo   - Bun runtime installed
echo   - PostgreSQL database configured
echo   - Updated .env file with your values
echo.
pause
exit /b 0

:: Handle command line arguments
if /i "%~1"=="" goto deploy
if /i "%~1"=="help" goto show_help
if /i "%~1"=="-h" goto show_help
if /i "%~1"=="--help" goto show_help

call :error "Unknown command: %~1"
call :show_help
exit /b 1