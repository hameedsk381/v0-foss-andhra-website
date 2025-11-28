#!/bin/bash

# FOSS Andhra Website Production Deployment Script
# This script automates the deployment process for production environments

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running on Windows (Git Bash) or Linux/Mac
IS_WINDOWS=false
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    IS_WINDOWS=true
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check Bun
    if command_exists bun; then
        BUN_VERSION=$(bun --version)
        success "Bun version $BUN_VERSION found"
    else
        error "Bun is not installed. Please install Bun first."
        exit 1
    fi
    
    # Check Git
    if command_exists git; then
        GIT_VERSION=$(git --version)
        success "Git $GIT_VERSION found"
    else
        warning "Git is not installed. Skipping Git operations."
    fi
    
    # Check if we're in the correct directory
    if [ ! -f "package.json" ]; then
        error "This script must be run from the project root directory"
        exit 1
    fi
    
    success "All prerequisites checked!"
}

# Function to update code from repository
update_code() {
    log "Updating code from repository..."
    
    if command_exists git; then
        git pull origin main || {
            error "Failed to pull latest code"
            exit 1
        }
        success "Code updated successfully"
    else
        warning "Git not found. Skipping code update."
    fi
}

# Function to install dependencies
install_dependencies() {
    log "Installing dependencies..."
    
    bun install || {
        error "Failed to install dependencies"
        exit 1
    }
    
    success "Dependencies installed successfully"
}

# Function to setup environment
setup_environment() {
    log "Setting up environment..."
    
    # Copy production environment template if .env doesn't exist
    if [ ! -f ".env" ] && [ -f ".env.production" ]; then
        cp .env.production .env
        warning "Copied .env.production to .env. Please update with your actual values!"
    elif [ ! -f ".env" ]; then
        warning "No .env file found. Creating minimal .env file..."
        cat > .env << EOF
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/fossandhra?schema=public

# Auth
NEXTAUTH_SECRET=$(openssl rand -base64 32 2>/dev/null || echo "please_generate_a_secure_secret_here")

# Domains
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXTAUTH_URL=https://yourdomain.com

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=465
SMTP_USER=your_email@domain.com
SMTP_PASS=your_app_password
SMTP_FROM_EMAIL=noreply@yourdomain.com
SMTP_FROM_NAME=FOSS Andhra

# MinIO
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=foss-andhra-gallery
MINIO_PUBLIC_URL=http://localhost:9000
EOF
        warning "Created minimal .env file. Please update with your actual values!"
    fi
    
    # Check for placeholder values
    if grep -q "your-" .env; then
        warning "Detected placeholder values in .env. Please update with actual values before proceeding."
    fi
    
    success "Environment setup completed"
}

# Function to setup database
setup_database() {
    log "Setting up database..."
    
    # Generate Prisma client
    log "Generating Prisma client..."
    bunx prisma generate || {
        error "Failed to generate Prisma client"
        exit 1
    }
    
    # Run migrations
    log "Running database migrations..."
    bunx prisma migrate deploy || {
        error "Failed to run database migrations"
        exit 1
    }
    
    # Seed database
    log "Seeding database..."
    bunx tsx prisma/seed.ts || {
        error "Failed to seed database"
        exit 1
    }
    
    # Create admin user
    log "Creating admin user..."
    if [ -f "scripts/create-admin.ts" ]; then
        bunx tsx scripts/create-admin.ts || {
            warning "Admin user creation failed. May already exist."
        }
    else
        warning "Admin creation script not found. Skipping."
    fi
    
    success "Database setup completed"
}

# Function to build application
build_application() {
    log "Building application for production..."
    
    bun run build || {
        error "Failed to build application"
        exit 1
    }
    
    success "Application built successfully"
}

# Function to start application with PM2
start_application() {
    log "Starting application with PM2..."
    
    # Check if PM2 is installed
    if ! command_exists pm2; then
        log "Installing PM2..."
        npm install -g pm2 || {
            error "Failed to install PM2"
            exit 1
        }
    fi
    
    # Start application
    pm2 startOrRestart ecosystem.config.js --env production || {
        error "Failed to start application with PM2"
        exit 1
    }
    
    # Save PM2 configuration
    pm2 save || {
        error "Failed to save PM2 configuration"
        exit 1
    }
    
    success "Application started successfully with PM2"
}

# Function to show status
show_status() {
    log "Showing application status..."
    
    if command_exists pm2; then
        pm2 list
    else
        warning "PM2 not installed. Cannot show status."
    fi
}

# Function to stop application
stop_application() {
    log "Stopping application..."
    
    if command_exists pm2; then
        pm2 stop foss-andhra-website || {
            warning "Failed to stop application"
        }
        success "Application stopped"
    else
        warning "PM2 not installed. Cannot stop application."
    fi
}

# Function to restart application
restart_application() {
    log "Restarting application..."
    
    if command_exists pm2; then
        pm2 restart foss-andhra-website || {
            error "Failed to restart application"
            exit 1
        }
        success "Application restarted"
    else
        error "PM2 not installed. Cannot restart application."
        exit 1
    fi
}

# Function to show logs
show_logs() {
    log "Showing application logs..."
    
    if command_exists pm2; then
        pm2 logs foss-andhra-website
    else
        warning "PM2 not installed. Cannot show logs."
    fi
}

# Main deployment function
deploy() {
    log "Starting FOSS Andhra Website Production Deployment..."
    
    check_prerequisites
    update_code
    install_dependencies
    setup_environment
    setup_database
    build_application
    start_application
    
    success "Deployment completed successfully!"
    log "Application should now be running. Check status with: ./deploy.sh status"
}

# Show help
show_help() {
    echo "FOSS Andhra Website Deployment Script"
    echo ""
    echo "Usage: ./deploy.sh [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  deploy    - Full deployment (default)"
    echo "  status    - Show application status"
    echo "  start     - Start application"
    echo "  stop      - Stop application"
    echo "  restart   - Restart application"
    echo "  logs      - Show application logs"
    echo "  help      - Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./deploy.sh           # Full deployment"
    echo "  ./deploy.sh status    # Show status"
    echo "  ./deploy.sh restart   # Restart application"
}

# Main script logic
case "${1:-deploy}" in
    deploy)
        deploy
        ;;
    status)
        show_status
        ;;
    start)
        start_application
        ;;
    stop)
        stop_application
        ;;
    restart)
        restart_application
        ;;
    logs)
        show_logs
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac