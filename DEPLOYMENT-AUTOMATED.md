# 🚀 Automated Production Deployment - FOSS Andhra Website

This document describes the automated deployment process for the FOSS Andhra website in production environments.

## 📋 Prerequisites

Before deploying, ensure you have:

1. **Bun Runtime** (v1.0+ recommended)
2. **Node.js** (v18+ as fallback)
3. **PostgreSQL** database (v12+)
4. **Domain name** for production
5. **SSL certificate** (Let's Encrypt recommended)
6. **SMTP credentials** for email sending
7. **Razorpay credentials** for payments

## 🛠️ Automated Deployment Options

### Option 1: TypeScript Deployment Script (Cross-platform)

Run the automated deployment script:

```bash
# Make script executable
chmod +x scripts/deploy-production.ts

# Run deployment
bun scripts/deploy-production.ts
```

### Option 2: Shell Script (Linux/macOS)

```bash
# Make script executable
chmod +x deploy.sh

# Deploy application
./deploy.sh

# Other commands
./deploy.sh status    # Show application status
./deploy.sh restart   # Restart application
./deploy.sh logs      # Show application logs
./deploy.sh help      # Show help
```

### Option 3: Batch Script (Windows)

```cmd
# Run deployment
deploy.bat
```

## 🏗️ What the Automated Deployment Does

1. **Environment Setup**
   - Checks for required tools (Bun, Git, etc.)
   - Creates `.env` file from template if missing
   - Validates environment variables

2. **Dependency Management**
   - Installs/updates all npm dependencies
   - Generates Prisma client

3. **Database Operations**
   - Runs database migrations
   - Seeds initial data (programs, gallery)
   - Creates admin user if not exists

4. **Application Build**
   - Builds Next.js application for production
   - Optimizes assets and code

5. **Process Management**
   - Starts application with PM2
   - Configures clustering for performance
   - Sets up automatic restarts and monitoring

## ⚙️ Environment Configuration

The deployment script will automatically create a `.env` file if one doesn't exist. However, you must update it with your actual values:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/fossandhra?schema=public

# Auth - Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your_generated_secret_minimum_32_characters
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXTAUTH_URL=https://yourdomain.com

# Razorpay
RAZORPAY_KEY_ID=your_actual_key
RAZORPAY_KEY_SECRET=your_actual_secret

# Email SMTP
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=465
SMTP_USER=your_email@domain.com
SMTP_PASS=your_app_password
SMTP_FROM_EMAIL=noreply@yourdomain.com
SMTP_FROM_NAME=FOSS Andhra

# MinIO (for media storage)
MINIO_ENDPOINT=your-minio-endpoint.com
MINIO_PORT=9000
MINIO_USE_SSL=true
MINIO_ACCESS_KEY=your_access_key
MINIO_SECRET_KEY=your_secret_key
MINIO_BUCKET=foss-andhra-gallery
MINIO_PUBLIC_URL=https://your-minio-endpoint.com
```

## 🔄 Update Process

To update the application in production:

```bash
# Using shell script (Linux/macOS)
./deploy.sh deploy

# Using batch script (Windows)
deploy.bat

# Manual process
git pull origin main
bun install
bunx prisma migrate deploy
bun run build
pm2 restart foss-andhra-website
```

## 📊 Monitoring

The deployment uses PM2 for process management with built-in monitoring:

```bash
# View application status
pm2 list

# View logs
pm2 logs foss-andhra-website

# Monitor resource usage
pm2 monit

# View specific log file
pm2 logs foss-andhra-website --lines 100
```

## 🛑 Stopping the Application

```bash
# Using deployment script
./deploy.sh stop

# Using PM2 directly
pm2 stop foss-andhra-website

# Stop all PM2 processes
pm2 stop all
```

## 🔄 Restarting the Application

```bash
# Using deployment script
./deploy.sh restart

# Using PM2 directly
pm2 restart foss-andhra-website
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check `DATABASE_URL` in `.env`
   - Ensure PostgreSQL is running
   - Verify database credentials

2. **Environment Variables Missing**
   - Ensure all required variables are set in `.env`
   - Check for placeholder values like `your-`

3. **Port Already in Use**
   - Change `PORT` in ecosystem.config.js
   - Kill existing process on port 3000

4. **Build Failures**
   - Check Node.js/Bun versions
   - Clear node_modules and reinstall

### Checking Logs

```bash
# Application logs
pm2 logs foss-andhra-website

# Error logs specifically
pm2 logs foss-andhra-website --err

# Combined logs
pm2 logs foss-andhra-website --out
```

## 📈 Performance Optimization

### PM2 Cluster Mode

The deployment automatically uses PM2 cluster mode to utilize all CPU cores:

```javascript
// In ecosystem.config.js
instances: 'max',  // Uses all available CPU cores
exec_mode: 'cluster'
```

### Memory Management

PM2 automatically restarts the application if memory usage exceeds 1GB:

```javascript
// In ecosystem.config.js
max_memory_restart: '1G'
```

### Automatic Restarts

The application automatically restarts daily at 2 AM for maintenance:

```javascript
// In ecosystem.config.js
cron_restart: '0 2 * * *'
```

## 🔒 Security Considerations

1. **Environment Variables**
   - Never commit `.env` files to version control
   - Use strong, randomly generated secrets
   - Restrict file permissions: `chmod 600 .env`

2. **Process Management**
   - PM2 runs as non-root user in production
   - Log files are rotated automatically

3. **Network Security**
   - Use reverse proxy (Nginx/Caddy) for SSL termination
   - Configure firewall rules to restrict access

## 🎯 Post-Deployment Checklist

After deployment, verify:

- [ ] Application is accessible at your domain
- [ ] Admin login works (`admin@fossandhra.org` / `admin123`)
- [ ] Database connections are working
- [ ] Email functionality is operational
- [ ] Payment gateway is configured
- [ ] Media uploads work with MinIO
- [ ] SSL certificate is properly configured
- [ ] Monitoring is set up (PM2 logs)

## 🆘 Support

For deployment issues:

1. Check the logs: `pm2 logs foss-andhra-website`
2. Verify environment variables
3. Ensure all prerequisites are met
4. Contact support@fossandhra.org

---

**Built with ❤️ by FOSS Andhra Community**