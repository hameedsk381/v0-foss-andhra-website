# 🚀 Production Deployment Guide

This guide explains how to deploy the FOSS Andhra website in a production environment using Docker Compose.

## 📁 Files Created

1. `docker-compose.prod.yml` - Production-specific Docker Compose configuration
2. `.env.production` - Production environment variables template

## 🔧 Production Setup Instructions

### 1. Configure Environment Variables

1. Copy the production environment template:
   ```bash
   cp .env.production .env
   ```

2. Update all variables in `.env` with your production values:
   - Generate a secure `NEXTAUTH_SECRET` (32 characters)
   - Set production database password in `POSTGRES_PASSWORD`
   - Add your production Razorpay API keys
   - Configure production SMTP settings
   - Update URLs to your production domain

### 2. Deploy with Docker Compose

Deploy the production environment:
```bash
docker-compose -f docker-compose.prod.yml --env-file .env up -d
```

### 3. Run Database Migrations

The database migrations should run automatically when the application starts. If you need to run them manually:
```bash
docker-compose -f docker-compose.prod.yml --env-file .env exec app bunx prisma migrate deploy
```

### 4. Access the Application

Once deployed, access your application at:
- Website: `https://yourdomain.com`
- Database: `postgresql://yourdomain.com:5432`

## 🔐 Security Best Practices

### Database Security
- Use strong, unique passwords for the database
- Don't expose the database port publicly (default is only accessible within the Docker network)
- Regular backups of the database volume

### Application Security
- Use HTTPS in production (configure your reverse proxy or load balancer)
- Keep all secrets in environment variables, not in code
- Regularly rotate API keys and passwords
- Keep Docker images updated

### Network Security
- The production configuration removes the pgAdmin service for security
- Only essential ports are exposed
- Services communicate internally through Docker network

## 🔄 Maintenance

### Update Application
```bash
# Pull latest code
git pull

# Rebuild and restart services
docker-compose -f docker-compose.prod.yml --env-file .env down
docker-compose -f docker-compose.prod.yml --env-file .env up -d --build
```

### Backup Database
```bash
# Create a backup
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U fossandhra fossandhra > backup.sql

# Restore from backup
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U fossandhra fossandhra < backup.sql
```

### View Logs
```bash
# View application logs
docker-compose -f docker-compose.prod.yml logs -f app

# View database logs
docker-compose -f docker-compose.prod.yml logs -f postgres
```

## 🆘 Troubleshooting

### Database Connection Issues
1. Verify `DATABASE_URL` in your `.env` file
2. Check that the PostgreSQL service is running:
   ```bash
   docker-compose -f docker-compose.prod.yml ps
   ```
3. Check database logs:
   ```bash
   docker-compose -f docker-compose.prod.yml logs postgres
   ```

### Application Not Starting
1. Check application logs:
   ```bash
   docker-compose -f docker-compose.prod.yml logs app
   ```
2. Verify all required environment variables are set
3. Ensure the database is healthy before the application starts

### Migration Issues
1. Run migrations manually:
   ```bash
   docker-compose -f docker-compose.prod.yml exec app bunx prisma migrate deploy
   ```
2. Check migration status:
   ```bash
   docker-compose -f docker-compose.prod.yml exec app bunx prisma migrate status
   ```

## 📞 Support

For issues with production deployment:
1. Check all environment variables are properly configured
2. Verify database connectivity
3. Ensure SSL certificates are properly configured (if using HTTPS)
4. Check Docker logs for error messages