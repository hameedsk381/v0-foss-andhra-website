# 🐳 Docker Deployment Guide - FOSS Andhra Website

Complete guide for deploying the FOSS Andhra website using Docker and PostgreSQL.

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- 2GB+ free disk space
- Domain name (for production)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd foss-andhra-website
```

### 2. Configure Environment

Copy the production environment template:

```bash
cp .env.production .env
```

Edit `.env` and update the following **critical** values:

```env
# Database - Use strong password!
POSTGRES_PASSWORD=your_super_secure_password_here

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

### 3. Build and Run

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f app

# Check status
docker-compose ps
```

The application will be available at:
- **App**: http://localhost:3000
- **pgAdmin** (dev only): http://localhost:5050

## 📦 Docker Services

### Services Overview

| Service | Port | Description |
|---------|------|-------------|
| `postgres` | 5432 | PostgreSQL 16 database |
| `app` | 3000 | Next.js application |
| `pgadmin` | 5050 | Database management (dev profile) |

### Database (PostgreSQL)

- **Image**: postgres:16-alpine
- **Persistent Storage**: Docker volume `postgres_data`
- **Health Check**: Automatic readiness check
- **Backup**: See [Database Management](#database-management)

### Application (Next.js)

- **Multi-stage Build**: Optimized for production
- **Auto-migration**: Runs `prisma migrate deploy` on startup
- **Health Check**: Built-in endpoint monitoring
- **User**: Runs as non-root user `nextjs`

## 🔧 Configuration

### Environment Variables

#### Required Variables

```env
# Database
DATABASE_URL                 # Auto-configured in docker-compose
POSTGRES_PASSWORD           # MUST be changed!

# Authentication
NEXTAUTH_URL                # Your domain URL
NEXTAUTH_SECRET            # Generate with: openssl rand -base64 32

# Payment
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET

# Email
SMTP_HOST
SMTP_USER
SMTP_PASSWORD
SMTP_FROM_EMAIL
```

#### Optional Variables

```env
APP_PORT=3000              # Application port
POSTGRES_PORT=5432         # Database port
PGADMIN_PORT=5050         # pgAdmin port (dev only)
```

### Generate Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate strong password
openssl rand -base64 24
```

## 🗄️ Database Management

### Initial Setup & Migrations

Migrations run automatically on container startup. Manual migration:

```bash
# Run migrations manually
docker-compose exec app bunx prisma migrate deploy

# View migration status
docker-compose exec app bunx prisma migrate status
```

### Seeding Data

```bash
# Seed initial data (admin, sample content)
docker-compose exec app bunx tsx prisma/seed.ts
```

**Default Admin Credentials:**
- Email: `admin@fossandhra.org`
- Password: `admin123`
- **⚠️ CHANGE IMMEDIATELY AFTER FIRST LOGIN!**

### Database Backup

```bash
# Backup database
docker-compose exec postgres pg_dump -U fossandhra fossandhra > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore database
cat backup.sql | docker-compose exec -T postgres psql -U fossandhra fossandhra
```

### Using pgAdmin (Development Only)

```bash
# Start with dev profile
docker-compose --profile dev up -d

# Access pgAdmin at http://localhost:5050
# Login: admin@fossandhra.org / admin (from .env)
```

**Add Server in pgAdmin:**
- Host: `postgres`
- Port: `5432`
- Database: `fossandhra`
- Username: `fossandhra`
- Password: (from your .env)

## 🔒 Security Checklist

Before deploying to production:

- [ ] Change `POSTGRES_PASSWORD` to strong password
- [ ] Generate unique `NEXTAUTH_SECRET`
- [ ] Change default admin password
- [ ] Update domain in `NEXT_PUBLIC_APP_URL` and `NEXTAUTH_URL`
- [ ] Configure real SMTP credentials
- [ ] Add real Razorpay credentials
- [ ] Enable HTTPS/SSL with reverse proxy (Nginx/Caddy)
- [ ] Set up firewall rules
- [ ] Configure backup strategy
- [ ] Remove pgAdmin from production (dev profile only)

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

### Using Docker with Let's Encrypt

Add to `docker-compose.yml`:

```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    depends_on:
      - app

  certbot:
    image: certbot/certbot
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"
```

## 📊 Monitoring & Logs

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f postgres

# Last 100 lines
docker-compose logs --tail=100 app
```

### Health Checks

```bash
# Check container health
docker-compose ps

# Application health endpoint
curl http://localhost:3000/api/health
```

### Resource Usage

```bash
# View resource usage
docker stats

# Service-specific stats
docker stats foss-app foss-postgres
```

## 🔄 Updates & Maintenance

### Update Application

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Run new migrations
docker-compose exec app bunx prisma migrate deploy
```

### Update Dependencies

```bash
# Enter container
docker-compose exec app sh

# Update dependencies
bun update
```

### Rollback

```bash
# Stop current version
docker-compose down

# Checkout previous version
git checkout <previous-commit>

# Rebuild and start
docker-compose up -d --build
```

## 🐛 Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs app

# Verify environment variables
docker-compose config

# Remove and recreate
docker-compose down -v
docker-compose up -d
```

### Database Connection Issues

```bash
# Check database status
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Test connection
docker-compose exec postgres psql -U fossandhra -d fossandhra
```

### Migration Errors

```bash
# Reset migrations (⚠️ DATA LOSS!)
docker-compose exec app bunx prisma migrate reset

# Or manually fix
docker-compose exec postgres psql -U fossandhra -d fossandhra
# Run SQL commands to fix schema
```

### Out of Disk Space

```bash
# Clean up unused Docker resources
docker system prune -a

# Remove old images
docker image prune -a

# Check volume sizes
docker system df -v
```

## 📱 Common Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart service
docker-compose restart app

# View running containers
docker-compose ps

# Enter app container
docker-compose exec app sh

# Enter database
docker-compose exec postgres psql -U fossandhra -d fossandhra

# Rebuild after code changes
docker-compose up -d --build

# View real-time logs
docker-compose logs -f app
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

The Next.js app includes built-in caching. Additional improvements:

```yaml
# docker-compose.yml - Add Redis for session storage
redis:
  image: redis:7-alpine
  ports:
    - "6379:6379"
  volumes:
    - redis_data:/data
```

## 📞 Support

For issues or questions:
- GitHub Issues: [Repository Issues](your-repo-url/issues)
- Email: support@fossandhra.org
- Documentation: [FOSS Andhra Docs](https://fossandhra.org/docs)

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ by FOSS Andhra Community**
