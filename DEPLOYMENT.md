# 🚀 Production Deployment Guide - FOSS Andhra Website

Complete guide for deploying the FOSS Andhra website on a server without Docker.

## 📋 Prerequisites

- Node.js 18+ or Bun runtime
- PostgreSQL 12+ database
- 2GB+ RAM, 2GB+ free disk space
- Domain name (for production)
- SSL certificate (Let's Encrypt recommended)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd foss-andhra-website
```

### 2. Install Dependencies

```bash
# Using Bun (recommended)
bun install

# Or using npm/pnpm if preferred
npm install
```

### 3. Configure Environment

Copy the production environment template:

```bash
cp .env.production .env
```

Edit `.env` and update the following **critical** values:

```env
# Database - Update with your PostgreSQL connection
DATABASE_URL=postgresql://username:password@localhost:5432/fossandhra?schema=public

# Auth - Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your_generated_secret_minimum_32_characters

# Domain
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXTAUTH_URL=https://yourdomain.com

# Razorpay Credentials
RAZORPAY_KEY_ID=your_actual_key
RAZORPAY_KEY_SECRET=your_actual_secret

# Email SMTP
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
```

### 4. Database Setup

```bash
# Run database migrations
bunx prisma migrate deploy

# Seed initial data (admin, sample content)
bunx tsx prisma/seed.ts
```

### 5. Build and Run

```bash
# Build for production
bun run build

# Start production server
bun run start
```

The application will be available at http://localhost:3000

## 🗄️ Database Management

### Initial Setup & Migrations

```bash
# Run migrations
bunx prisma migrate deploy

# View migration status
bunx prisma migrate status

# Create new migration
bunx prisma migrate dev --name migration_name
```

### Seeding Data

```bash
# Seed initial data (admin, sample content)
bunx tsx prisma/seed.ts
```

**Default Admin Credentials:**
- Email: `admin@fossandhra.org`
- Password: `admin123`
- **⚠️ CHANGE IMMEDIATELY AFTER FIRST LOGIN!**

### Database Backup

```bash
# Backup database
pg_dump -U username -h localhost -d fossandhra > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore database
psql -U username -h localhost -d fossandhra < backup.sql
```

## 🔒 Security Checklist

Before deploying to production:

- [ ] Change default admin password
- [ ] Generate unique `NEXTAUTH_SECRET`
- [ ] Update domain in `NEXT_PUBLIC_APP_URL` and `NEXTAUTH_URL`
- [ ] Configure real SMTP credentials
- [ ] Add real Razorpay credentials
- [ ] Enable HTTPS/SSL with reverse proxy (Nginx/Caddy)
- [ ] Set up firewall rules
- [ ] Configure backup strategy

## 🌐 Production Deployment

### Using Reverse Proxy (Recommended)

#### Nginx Example

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;

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

#### Caddy Example

```caddyfile
yourdomain.com {
    reverse_proxy localhost:3000
}
```

### Using PM2 for Process Management

Install PM2:
```bash
npm install -g pm2
```

Create ecosystem.config.js:
```javascript
module.exports = {
  apps: [{
    name: 'foss-andhra-website',
    script: 'node_modules/.bin/next',
    args: 'start',
    cwd: './',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

Start with PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 📊 Monitoring & Logs

### Application Logs

```bash
# If using PM2
pm2 logs foss-andhra-website

# If running directly
tail -f /path/to/application/logs
```

### Health Checks

```bash
# Application health endpoint
curl http://localhost:3000/api/health
```

## 🔄 Updates & Maintenance

### Update Application

```bash
# Pull latest code
git pull origin main

# Install/update dependencies
bun install

# Run new migrations
bunx prisma migrate deploy

# Rebuild and restart
bun run build
# Then restart your process manager (PM2, systemd, etc.)
```

### Update Dependencies

```bash
# Update dependencies
bun update
```

### Rollback

```bash
# Checkout previous version
git checkout <previous-commit>

# Reinstall dependencies
bun install

# Run migrations if needed
bunx prisma migrate deploy

# Rebuild and restart
bun run build
# Then restart your process manager
```

## 🐛 Troubleshooting

### Application Won't Start

```bash
# Check logs
# If using PM2: pm2 logs foss-andhra-website
# If running directly: check terminal output

# Verify environment variables
cat .env

# Check database connection
psql -U username -h localhost -d fossandhra
```

### Database Connection Issues

```bash
# Check database service status
systemctl status postgresql

# Test connection
psql -U username -h localhost -d fossandhra

# Check database logs
tail -f /var/log/postgresql/postgresql-*.log
```

### Migration Errors

```bash
# Reset migrations (⚠️ DATA LOSS!)
bunx prisma migrate reset

# Or manually fix
psql -U username -h localhost -d fossandhra
# Run SQL commands to fix schema
```

## 📱 Common Commands

```bash
# Start development server
bun run dev

# Build for production
bun run build

# Start production server
bun run start

# Run database migrations
bunx prisma migrate deploy

# Seed database
bunx tsx prisma/seed.ts

# Open Prisma Studio
bunx prisma studio
```

## 🎯 Performance Optimization

### Database Performance

```sql
-- Create indexes (run in PostgreSQL)
CREATE INDEX idx_events_date ON "Event"(date);
CREATE INDEX idx_members_status ON "Member"(status);
CREATE INDEX idx_blog_published ON "BlogPost"("publishedAt");
```

### Application Caching

The Next.js app includes built-in caching. For additional caching, consider:

1. Using a CDN for static assets
2. Implementing Redis for session storage
3. Configuring proper HTTP caching headers

## 📞 Support

For issues or questions:
- GitHub Issues: [Repository Issues](your-repo-url/issues)
- Email: support@fossandhra.org
- Documentation: [FOSS Andhra Docs](https://fossandhra.org/docs)

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ by FOSS Andhra Community**