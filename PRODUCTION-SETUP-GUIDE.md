# 🚀 FOSS Andhra Website Production Setup Guide

This comprehensive guide explains how to properly set up the FOSS Andhra website for production deployment.

## 📋 Prerequisites

Before beginning the production setup, ensure you have:

1. **Server/VPS** with at least 2GB RAM and 2GB free disk space
2. **Ubuntu 20.04+** or similar Linux distribution
3. **Domain name** pointed to your server
4. **SSL certificate** (Let's Encrypt recommended)
5. **PostgreSQL 12+** database server
6. **Node.js 18+** or **Bun runtime**
7. **SMTP credentials** for email sending
8. **Razorpay merchant account** for payments
9. **MinIO/S3-compatible storage** for media files

## 🏗️ Server Setup

### 1. Update System Packages

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Required Software

```bash
# Install Node.js (if using Node.js instead of Bun)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Bun (recommended)
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install PM2 globally
npm install -g pm2

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

### 3. Configure PostgreSQL

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE fossandhra;
CREATE USER fossandhra WITH ENCRYPTED PASSWORD 'strong_password_here';
GRANT ALL PRIVILEGES ON DATABASE fossandhra TO fossandhra;
ALTER USER fossandhra CREATEDB;
\q
```

### 4. Set Up Firewall

```bash
# Enable UFW firewall
sudo ufw enable

# Allow SSH, HTTP, and HTTPS
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https

# Check status
sudo ufw status
```

## 📦 Application Setup

### 1. Clone Repository

```bash
# Create application directory
sudo mkdir -p /var/www/fossandhra
sudo chown $USER:$USER /var/www/fossandhra

# Clone repository
cd /var/www/fossandhra
git clone <repository-url> .
```

### 2. Install Dependencies

```bash
# Install application dependencies
bun install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Copy production template
cp .env.production .env

# Edit with your values
nano .env
```

Update the following critical values in `.env`:

```env
# Database - Update with your PostgreSQL connection
DATABASE_URL=postgresql://fossandhra:strong_password_here@localhost:5432/fossandhra?schema=public

# Auth - Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your_generated_secret_minimum_32_characters

# Domain
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXTAUTH_URL=https://yourdomain.com

# Razorpay Credentials
RAZORPAY_KEY_ID=your_actual_razorpay_key_id
RAZORPAY_KEY_SECRET=your_actual_razorpay_key_secret

# Email SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password
SMTP_FROM_EMAIL=noreply@yourdomain.com
SMTP_FROM_NAME=FOSS Andhra

# MinIO Configuration
MINIO_ENDPOINT=your-minio-domain.com
MINIO_PORT=443
MINIO_USE_SSL=true
MINIO_ACCESS_KEY=your_minio_access_key
MINIO_SECRET_KEY=your_minio_secret_key
MINIO_BUCKET=foss-andhra-gallery
MINIO_PUBLIC_URL=https://your-minio-domain.com
```

### 4. Database Setup

```bash
# Generate Prisma client
bunx prisma generate

# Run database migrations
bunx prisma migrate deploy

# Seed initial data
bunx tsx prisma/seed.ts

# Create admin user
bunx tsx scripts/create-admin.ts
```

### 5. Build Application

```bash
# Build for production
bun run build
```

## 🌐 Web Server Configuration

### 1. Configure Nginx

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/fossandhra
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;

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
        proxy_buffering off;
    }
}
```

Enable the site:

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/fossandhra /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 2. Obtain SSL Certificate

```bash
# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## ⚙️ Process Management with PM2

### 1. Configure PM2

Create `ecosystem.config.js` in the project root:

```javascript
module.exports = {
  apps: [{
    name: 'foss-andhra-website',
    script: 'node_modules/.bin/next',
    args: 'start',
    cwd: './',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    // Logging
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    // Restart configuration
    min_uptime: '60s',
    max_restarts: 10,
    autorestart: true,
    cron_restart: '0 2 * * *', // Restart daily at 2 AM
    // Memory limit
    max_memory_restart: '1G',
    // Watch for changes (disable in production)
    watch: false,
    // Merge logs
    combine_logs: true,
    // Node.js options
    node_args: '--max_old_space_size=4096'
  }]
};
```

### 2. Start Application

```bash
# Start application with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Set up PM2 startup script
pm2 startup
```

## 🔒 Security Hardening

### 1. Secure Environment Variables

```bash
# Set proper permissions
chmod 600 .env

# Ensure ownership
chown $USER:$USER .env
```

### 2. Configure Fail2Ban

```bash
# Install Fail2Ban
sudo apt install -y fail2ban

# Create jail configuration
sudo nano /etc/fail2ban/jail.local
```

Add the following:

```ini
[nginx-http-auth]
enabled = true

[nginx-botsearch]
enabled = true
```

Restart Fail2Ban:

```bash
sudo systemctl restart fail2ban
```

## 📊 Monitoring & Maintenance

### 1. Set Up Log Rotation

```bash
# Create logrotate configuration
sudo nano /etc/logrotate.d/fossandhra
```

Add the following:

```conf
/var/www/fossandhra/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

### 2. Set Up Automated Backups

Create a backup script:

```bash
# Create backup script
sudo nano /usr/local/bin/backup-fossandhra.sh
```

Add the following:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/fossandhra"
DB_NAME="fossandhra"
DB_USER="fossandhra"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
pg_dump -U $DB_USER -h localhost $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/db_backup_$DATE.sql

# Remove backups older than 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
```

Make it executable:

```bash
sudo chmod +x /usr/local/bin/backup-fossandhra.sh
```

Set up cron job:

```bash
# Edit crontab
crontab -e

# Add daily backup at 1 AM
0 1 * * * /usr/local/bin/backup-fossandhra.sh
```

## 🔄 Update Process

To update the application:

```bash
# Navigate to project directory
cd /var/www/fossandhra

# Pull latest code
git pull origin main

# Install/update dependencies
bun install

# Run new migrations
bunx prisma migrate deploy

# Rebuild application
bun run build

# Restart application
pm2 restart foss-andhra-website
```

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check `DATABASE_URL` in `.env`
   - Ensure PostgreSQL is running: `sudo systemctl status postgresql`
   - Verify database credentials

2. **Application Won't Start**
   - Check PM2 logs: `pm2 logs foss-andhra-website`
   - Verify environment variables
   - Check port availability

3. **Nginx Configuration Errors**
   - Test configuration: `sudo nginx -t`
   - Check error logs: `sudo tail -f /var/log/nginx/error.log`

4. **SSL Certificate Issues**
   - Renew certificates: `sudo certbot renew`
   - Check certificate status: `sudo certbot certificates`

### Useful Commands

```bash
# Check application status
pm2 list

# View logs
pm2 logs foss-andhra-website

# Monitor resource usage
pm2 monit

# Restart application
pm2 restart foss-andhra-website

# Stop application
pm2 stop foss-andhra-website

# Check system resources
htop

# Check disk usage
df -h

# Check network connections
ss -tuln
```

## 🎯 Post-Deployment Checklist

After deployment, verify:

- [ ] Application is accessible at your domain
- [ ] SSL certificate is valid
- [ ] Admin login works (`admin@fossandhra.org` / `admin123`)
- [ ] Database connections are working
- [ ] Email functionality is operational
- [ ] Payment gateway is configured
- [ ] Media uploads work with MinIO
- [ ] Monitoring is set up (PM2 logs)
- [ ] Automated backups are configured
- [ ] Security measures are in place

## 📞 Support

For deployment issues:

1. Check the logs: `pm2 logs foss-andhra-website`
2. Verify environment variables
3. Ensure all prerequisites are met
4. Contact support@fossandhra.org

---

**Built with ❤️ by FOSS Andhra Community**