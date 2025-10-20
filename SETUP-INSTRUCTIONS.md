# 🚀 FOSS Andhra CMS - Complete Setup Instructions

## ✅ What's Been Integrated

Your CMS now has **COMPLETE backend integration** including:

1. ✅ **SQLite Database** - All data stored and managed
2. ✅ **NextAuth Authentication** - Secure admin login
3. ✅ **Email System (SMTP)** - Automated notifications
4. ✅ **Payment Integration** - Razorpay with auto-member creation
5. ✅ **Full CRUD APIs** - Create, Read, Update, Delete operations

---

## 🎯 Quick Setup (3 Steps)

### Step 1: Add Your SMTP Details

Open `.env` file and add your email settings:

```env
# For Gmail (Recommended for testing):
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-gmail@gmail.com"
SMTP_PASS="your-16-char-app-password"  # Generate at: https://myaccount.google.com/apppasswords
SMTP_FROM_NAME="FOSS Andhra"
```

### Step 2: Generate NextAuth Secret

Run this command:
```bash
# Windows PowerShell:
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Mac/Linux:
openssl rand -base64 32
```

Copy the output and update `.env`:
```env
NEXTAUTH_SECRET="paste-your-generated-secret-here"
```

### Step 3: Start the Server

```bash
bun run dev
```

---

## 🧪 Test Your Setup

### Test 1: Test Email System

```bash
bun test-email.ts your-email@gmail.com
```

Expected output:
```
✅ SMTP connection successful!
✅ Test email sent successfully!
Check inbox of: your-email@gmail.com
```

### Test 2: Login to CMS

1. Go to: `http://localhost:3002/admin/login`
2. **Login:**
   - Email: `admin@fossandhra.org`
   - Password: `admin123`
3. ✅ Should redirect to dashboard

### Test 3: Complete Member Registration

1. Go to: `http://localhost:3002`
2. Click "Join Us"
3. Fill form and complete payment
4. ✅ Member saved to database
5. ✅ Welcome email sent automatically
6. Check CMS - new member appears
7. Check email - welcome email received

---

## 📧 Email Templates Included

Your system automatically sends emails for:

1. **Welcome Email** - When new member joins (with membership ID)
2. **Event Confirmation** - When someone registers for event
3. **Donation Receipt** - When donation is received
4. **Renewal Reminder** - 30 days before membership expires

All emails use professional HTML templates with FOSS Andhra branding!

---

## 🔐 Security Checklist

Before going live:

- [ ] Change admin password from `admin123`
- [ ] Generate secure NEXTAUTH_SECRET
- [ ] Add production Razorpay keys
- [ ] Test SMTP with real emails
- [ ] Never commit `.env` file
- [ ] Enable HTTPS in production

---

## 📊 System Overview

### When User Registers:
1. User fills membership form
2. User completes Razorpay payment
3. Payment verified → Member created in database
4. Welcome email sent automatically
5. Admin dashboard updated
6. User receives membership ID via email

**All happens automatically! No manual work!** 🎉

### When Admin Logs In:
1. Enter credentials
2. NextAuth verifies against database
3. Session created
4. Access to all CMS features

---

## 🗄️ Database (Already Set Up)

Your SQLite database has:
- ✅ 10 tables ready
- ✅ Sample data loaded
- ✅ Admin user created
- ✅ Relationships configured

**View database:**
```bash
bunx prisma studio
```
Opens at: `http://localhost:5555`

---

## 🛠️ Common Commands

```bash
# Start development server
bun run dev

# Test email system
bun test-email.ts your-email@gmail.com

# View database
bunx prisma studio

# Add sample data
bun prisma/seed.ts

# Reset database
bunx prisma migrate reset
```

---

## 📁 Files You Need to Know

### Configuration:
- `.env` - **ADD YOUR SMTP AND SECRETS HERE**
- `.env.example` - Template with all variables

### Email System:
- `lib/email.ts` - Email functions
- `test-email.ts` - Test email sending

### Authentication:
- `app/api/auth/[...nextauth]/route.ts` - NextAuth config
- `app/admin/login/page.tsx` - Login page

### Database:
- `prisma/schema.prisma` - Database schema
- `prisma/dev.db` - SQLite database file
- `lib/prisma.ts` - Prisma client

---

## 🎯 What Works Now

✅ **Dashboard** - Real statistics from database  
✅ **Members** - View, search, filter, create  
✅ **Events** - View, create, manage  
✅ **Donations** - Track all donations  
✅ **Login** - Secure authentication  
✅ **Logout** - Session management  
✅ **Emails** - Welcome, receipts, reminders  
✅ **Payment** - Auto-creates members  

---

## 📖 Documentation

**Start Here:** [COMPLETE-INTEGRATION-GUIDE.md](./COMPLETE-INTEGRATION-GUIDE.md)

**Other Guides:**
- `SETUP-INSTRUCTIONS.md` - This file (quick setup)
- `BACKEND-CONNECTED.md` - Backend connection details
- `SQLITE-SETUP-COMPLETE.md` - Database setup guide
- `CMS-README.md` - Full CMS documentation
- `QUICK-START-CMS.md` - Quick start guide

---

## 🆘 Troubleshooting

### Email not sending?
1. Check SMTP credentials in `.env`
2. Gmail: Use app password, not regular password
3. Run: `bun test-email.ts your-email@gmail.com`

### Login not working?
1. Check NEXTAUTH_SECRET is set in `.env`
2. Use correct credentials: `admin@fossandhra.org` / `admin123`
3. Restart server after changing `.env`

### Database errors?
1. Close Prisma Studio if open
2. Run: `bunx prisma generate`
3. Restart server

---

## 🎊 You're Ready!

Your complete system includes:

✅ Full backend with SQLite database  
✅ Secure authentication with NextAuth  
✅ Email notifications (4 templates)  
✅ Payment integration  
✅ Admin dashboard  
✅ Member management  
✅ Event management  
✅ Donation tracking  

**Just add your SMTP details and you're live!**

---

## 📞 Quick Reference

**Login URL:** `http://localhost:3002/admin/login`  
**Admin Email:** `admin@fossandhra.org`  
**Admin Password:** `admin123` (CHANGE THIS!)  
**Database Viewer:** `bunx prisma studio`  
**Test Email:** `bun test-email.ts your-email@gmail.com`  

---

**🚀 Start now:**
```bash
# 1. Add SMTP to .env
# 2. Generate NEXTAUTH_SECRET
# 3. Run:
bun run dev
```

**Happy managing!** 🎉
