# 🌐 Environment Setup Guide

## 📋 Required Environment Variables

This guide explains how to properly configure your environment variables for the FOSS Andhra website.

## 📁 Files Created

1. `.env.example` - Template with all required variables and documentation
2. `.env` - Development configuration with default values

## 🔧 Setup Instructions

### 1. Generate NextAuth Secret

Run one of these commands to generate a secure 32-character secret:

**Windows PowerShell:**
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

**Mac/Linux:**
```bash
openssl rand -base64 32
```

### 2. Configure SMTP (Email)

For Gmail (recommended for testing):
1. Enable 2-factor authentication on your Google account
2. Generate an App Password at: https://myaccount.google.com/apppasswords
3. Use the 16-character app password (without spaces) in `SMTP_PASS`

### 3. Configure Razorpay (Payments)

1. Create a Razorpay account at https://razorpay.com/
2. Get your test API keys from the dashboard
3. Add them to `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`

### 4. Database Configuration

**Development (default):**
- Uses SQLite database (`prisma/dev.db`)
- No additional setup required

**Production:**
- Uses PostgreSQL
- Configure `DATABASE_URL` with your PostgreSQL connection string

## 🚀 Quick Start

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Update the values in `.env` with your actual credentials

3. Start the development server:
   ```bash
   bun run dev
   ```

## 🔐 Security Best Practices

- Never commit `.env` files to version control
- Use different keys for development and production
- Regularly rotate your secrets
- Use strong, randomly generated passwords
- Enable 2FA on all accounts used for production

## 🧪 Testing Your Configuration

### Test Email System
```bash
bun test-email.ts your-email@gmail.com
```

### Test Database Connection
```bash
bunx prisma studio
```

### Test Authentication
1. Go to: `http://localhost:3000/admin/login`
2. Use default credentials:
   - Email: `admin@fossandhra.org`
   - Password: `admin123`
3. Change the password after first login

## 📞 Support

If you encounter issues:
1. Check that all environment variables are properly set
2. Verify your SMTP credentials
3. Confirm your Razorpay test keys are correct
4. Ensure your NextAuth secret is 32 characters long