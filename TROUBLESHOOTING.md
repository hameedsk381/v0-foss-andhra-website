# Troubleshooting Guide

## Common Issues and Solutions

### 1. "Cannot read properties of undefined (reading 'findMany')" - Prisma Error

**Cause:** Prisma client is out of sync with the schema or not generated.

**Solution:**
```bash
# Stop the dev server (Ctrl+C)

# Regenerate Prisma client
bunx prisma generate

# Restart dev server
bun run dev
```

**Alternative (if file is locked):**
```bash
# Kill all node processes and regenerate
taskkill /F /IM node.exe
bunx prisma generate
bun run dev
```

---

### 2. "EPERM: operation not permitted" - Prisma Generate Error

**Cause:** Dev server is locking the Prisma client files.

**Solution:**
```bash
# Stop the dev server first
# Then run prisma generate
bunx prisma generate
```

---

### 3. Database Schema Changes Not Reflecting

**Cause:** Need to run migration after schema changes.

**Solution:**
```bash
# Run migration
bunx prisma migrate dev --name your_migration_name

# Generate client
bunx prisma generate

# Restart server
bun run dev
```

---

### 4. Port Already in Use

**Cause:** Previous server instance still running.

**Solution:**
```bash
# Find and kill process on port 3000
netstat -ano | findstr :3000
taskkill /F /PID <PID>

# Or kill all node processes
taskkill /F /IM node.exe

# Restart
bun run dev
```

---

### 5. TypeScript Errors After Adding New Features

**Cause:** Type definitions not updated or Next.js cache.

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next

# Restart dev server
bun run dev
```

---

### 6. NextAuth Session Issues

**Cause:** Missing or invalid NEXTAUTH_SECRET.

**Solution:**
```bash
# Generate a new secret
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Add to .env
NEXTAUTH_SECRET="your-generated-secret"

# Restart server
bun run dev
```

---

### 7. Email Notifications Not Sending

**Cause:** Invalid SMTP credentials or missing configuration.

**Solution:**
1. Check `.env` file has correct SMTP settings:
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

2. For Gmail, use App Password (not regular password)
3. Test with: `bun test-email.ts`

---

### 8. Login Not Working (307 Redirect Loop)

**Cause:** Middleware configuration or session issues.

**Solution:**
1. Check `middleware.ts` configuration
2. Verify NEXTAUTH_SECRET in `.env`
3. Clear browser cookies
4. Restart server

---

### 9. Database File Locked

**Cause:** SQLite database is locked by another process.

**Solution:**
```bash
# Stop all processes using the database
taskkill /F /IM node.exe

# Delete lock file if exists
rm prisma/dev.db-journal

# Restart
bun run dev
```

---

### 10. Module Not Found Errors

**Cause:** Dependencies not installed or out of sync.

**Solution:**
```bash
# Reinstall dependencies
bun install

# If issues persist, clear and reinstall
rm -rf node_modules
rm bun.lockb
bun install
```

---

## Quick Reset Commands

### Full Database Reset:
```bash
bunx prisma migrate reset
bunx prisma generate
bun prisma/seed.ts
bun run dev
```

### Full Project Reset:
```bash
# Stop server
taskkill /F /IM node.exe

# Clean
rm -rf .next
rm -rf node_modules
rm bun.lockb

# Reinstall
bun install
bunx prisma generate

# Restart
bun run dev
```

---

## Useful Commands

### Database:
```bash
# View database in browser
bunx prisma studio

# Check migration status
bunx prisma migrate status

# Create migration
bunx prisma migrate dev --name migration_name

# Generate client
bunx prisma generate
```

### Development:
```bash
# Start dev server
bun run dev

# Build for production
bun run build

# Start production server
bun run start

# Run linting
bun run lint
```

---

## Getting Help

If issues persist:
1. Check the error logs in terminal
2. Review `TIER1-COMPLETE.md` for setup instructions
3. Verify all environment variables in `.env`
4. Check database schema in `prisma/schema.prisma`

---

**Last Updated:** After TIER 1 Implementation
