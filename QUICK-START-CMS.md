# CMS Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies (if needed)

```bash
pnpm install
```

### Step 2: Set Up Authentication

Install NextAuth for admin authentication:

```bash
pnpm add next-auth bcryptjs
pnpm add -D @types/bcryptjs
```

### Step 3: Set Up Database

Option A - **Using Prisma (Recommended)**:

```bash
pnpm add prisma @prisma/client
npx prisma init
```

Option B - **Using Supabase (Easiest)**:
- Create free account at https://supabase.com
- Create new project
- Get connection string from dashboard

### Step 4: Create Environment Variables

Create `.env.local`:

```env
# Database (use your own connection string)
DATABASE_URL="postgresql://user:password@localhost:5432/fossandhra"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret-here"

# Razorpay (already configured)
RAZORPAY_KEY_ID="your_existing_key"
RAZORPAY_KEY_SECRET="your_existing_secret"
```

Generate secret:
```bash
openssl rand -base64 32
```

### Step 5: Run the CMS

```bash
pnpm dev
```

Access the CMS at: http://localhost:3000/admin/login

## 🎯 CMS Pages Created

✅ `/admin` - Dashboard with stats  
✅ `/admin/events` - Event management  
✅ `/admin/members` - Member management  
✅ `/admin/donations` - Donation tracking  
✅ `/admin/content` - Content editor  
✅ `/admin/login` - Admin login page  

## 📋 Next Steps

### 1. Set Up Database Schema

Using Prisma, create `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Member {
  id              String   @id @default(cuid())
  name            String
  email           String   @unique
  phone           String
  organization    String?
  designation     String?
  membershipType  String
  status          String
  joinDate        DateTime
  expiryDate      DateTime
  paymentId       String?
  membershipId    String   @unique
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Event {
  id              String   @id @default(cuid())
  title           String
  description     String
  date            DateTime
  location        String
  type            String
  status          String
  maxAttendees    Int?
  currentAttendees Int     @default(0)
  program         String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Donation {
  id              String   @id @default(cuid())
  name            String
  email           String
  phone           String
  amount          Float
  type            String
  status          String
  anonymous       Boolean  @default(false)
  paymentId       String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Admin {
  id          String    @id @default(cuid())
  name        String
  email       String    @unique
  password    String
  role        String    @default("admin")
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

Run migrations:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 2. Connect Database to API Routes

Install Prisma client helper:

Create `/lib/prisma.ts`:
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

Update API routes to use database (example):

`/app/api/admin/members/route.ts`:
```typescript
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const members = await prisma.member.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ success: true, data: members })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch members" }, { status: 500 })
  }
}
```

### 3. Implement Authentication

Create `/app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email }
        })

        if (!admin) {
          return null
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          admin.password
        )

        if (!isValidPassword) {
          return null
        }

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        }
      }
    })
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt"
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

### 4. Create First Admin User

Create a script `scripts/create-admin.ts`:

```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10)
  
  const admin = await prisma.admin.create({
    data: {
      name: "Admin",
      email: "admin@fossandhra.org",
      password: hashedPassword,
      role: "admin"
    }
  })
  
  console.log("Admin created:", admin)
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
  })
```

Run it:
```bash
npx ts-node scripts/create-admin.ts
```

### 5. Test the CMS

1. Start dev server: `pnpm dev`
2. Go to: http://localhost:3000/admin/login
3. Login with: `admin@fossandhra.org` / `admin123`
4. Change password immediately!

## 🎨 Customize the CMS

### Change Theme Colors

Edit `/app/admin/layout.tsx`:
- Sidebar background: `bg-primary` → `bg-purple-900`
- Accent color: Update Tailwind config

### Add New Section

1. Create page: `/app/admin/volunteers/page.tsx`
2. Add to sidebar in `/app/admin/layout.tsx`
3. Create API: `/app/api/admin/volunteers/route.ts`

### Modify Dashboard Stats

Edit `/app/admin/page.tsx` to change metrics.

## 📊 Connect Real Data

Currently showing mock data. To connect real data:

1. Import Prisma client in each page
2. Fetch data using `prisma.member.findMany()`, etc.
3. Replace mock arrays with database queries

Example for members page:

```typescript
// In /app/admin/members/page.tsx
import { prisma } from "@/lib/prisma"

export default async function MembersManagement() {
  const members = await prisma.member.findMany({
    orderBy: { createdAt: 'desc' }
  })
  
  // Use real data instead of mock
  return (
    // ... render members
  )
}
```

## 🔒 Security Checklist

- [ ] Change default admin password
- [ ] Set strong `NEXTAUTH_SECRET`
- [ ] Enable HTTPS in production
- [ ] Set up CORS properly
- [ ] Add rate limiting
- [ ] Enable database backups
- [ ] Add input validation
- [ ] Sanitize user inputs
- [ ] Set up error monitoring (Sentry)

## 🚢 Deploy to Production

### Vercel Deployment

1. Push code to GitHub
2. Import in Vercel
3. Add environment variables:
   - `DATABASE_URL`
   - `NEXTAUTH_URL` (your domain)
   - `NEXTAUTH_SECRET`
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
4. Deploy!

The CMS will be available at: `https://yourdomain.com/admin`

## 📚 Resources

- [Full CMS Documentation](./CMS-README.md)
- [Database Schema](./lib/db/schema.ts)
- [NextAuth Docs](https://next-auth.js.org/)
- [Prisma Docs](https://www.prisma.io/docs)

## 🆘 Need Help?

Common issues:

**"Database connection failed"**
- Check `DATABASE_URL` in `.env.local`
- Ensure database is running
- Run `npx prisma db push`

**"NextAuth error"**
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain

**"TypeScript errors"**
- Run `pnpm install`
- Run `npx prisma generate`
- Restart dev server

---

🎉 **You're ready to manage your FOSS Andhra website!**
