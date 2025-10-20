# FOSS Andhra CMS Documentation

## 🎯 Overview

A comprehensive Content Management System (CMS) built for the FOSS Andhra website to manage members, events, donations, and content efficiently.

## 📁 CMS Structure

### Admin Dashboard (`/admin`)

```
/admin
├── / (Dashboard)
├── /events (Events Management)
├── /members (Members Management)
├── /donations (Donations Management)
├── /content (Content Management)
├── /settings (Settings)
└── /login (Admin Login)
```

## 🚀 Features

### 1. Dashboard (`/admin`)
- **Overview Statistics**
  - Total members, active members, new members
  - Total events, upcoming events
  - Total donations, monthly donations
  - Event attendance metrics

- **Recent Activity**
  - Latest member registrations
  - Upcoming events
  - Recent donations

### 2. Events Management (`/admin/events`)
- **Create/Edit Events**
  - Event details (title, description, date, location)
  - Event types (Conference, Workshop, Hackathon, Meetup)
  - Attendee management
  - Program association
  - Status tracking (upcoming, ongoing, past, cancelled)

- **Search & Filter**
  - Filter by event type
  - Filter by status
  - Filter by program
  - Filter by location
  - Search by title

- **Features**
  - Max attendees limit
  - Current attendee count
  - Registration link management
  - Event image upload
  - Bulk operations

### 3. Members Management (`/admin/members`)
- **Member Database**
  - View all members
  - Member details (name, email, phone, organization)
  - Membership status (active, expired, pending)
  - Membership type (FOSStar Annual, Lifetime)
  - Join and expiry dates

- **Search & Filter**
  - Search by name/email
  - Filter by status
  - Filter by membership type
  - Filter by organization

- **Features**
  - Export members to CSV
  - Send bulk emails
  - View member details
  - Edit member information
  - Track payment history

### 4. Donations Management (`/admin/donations`)
- **Donation Tracking**
  - View all donations
  - Donor information
  - Donation amount and type
  - Payment status
  - Razorpay integration details

- **Statistics**
  - Total donations
  - Monthly donations
  - Recurring donors
  - Donation trends

- **Features**
  - Export donation reports
  - Generate receipts
  - Filter by donation type
  - Filter by status
  - Anonymous donation handling

### 5. Content Management (`/admin/content`)
- **Pages**
  - Edit static pages (About, Privacy Policy, Terms, Refund Policy)
  - SEO meta tags
  - Rich text editor

- **Programs**
  - Edit program content (FOSStar, FOSServe, etc.)
  - Program descriptions
  - Benefits and features
  - Team information

- **Gallery**
  - Upload event photos
  - Manage photo collections
  - Delete images
  - Image optimization

- **Media Library**
  - Upload files
  - Manage logos
  - Document storage
  - Video links

### 6. Settings (`/admin/settings`)
- Site configuration
- Admin user management
- Email templates
- Payment gateway settings
- Backup & restore

## 🗄️ Database Schema

### Core Tables

#### Members
```typescript
{
  id: string
  name: string
  email: string
  phone: string
  organization?: string
  designation?: string
  membershipType: "FOSStar Annual" | "Lifetime"
  status: "active" | "expired" | "pending"
  joinDate: Date
  expiryDate: Date
  paymentId: string
  membershipId: string
}
```

#### Events
```typescript
{
  id: string
  title: string
  description: string
  date: Date
  location: string
  type: "Conference" | "Workshop" | "Hackathon" | "Meetup"
  status: "upcoming" | "ongoing" | "past" | "cancelled"
  maxAttendees: number
  currentAttendees: number
  program: string
}
```

#### Donations
```typescript
{
  id: string
  name: string
  email: string
  amount: number
  type: "oneTime" | "monthly" | "programSponsorship"
  status: "completed" | "pending" | "failed"
  anonymous: boolean
  paymentId: string
}
```

See [`/lib/db/schema.ts`](./lib/db/schema.ts) for complete schema definitions.

## 🔧 Setup Instructions

### 1. Access the CMS

Navigate to: `https://yourdomain.com/admin/login`

### 2. Default Credentials (CHANGE IMMEDIATELY)
```
Email: admin@fossandhra.org
Password: [Set during deployment]
```

### 3. Database Setup

The CMS requires a database. You can use:
- **PostgreSQL** (Recommended)
- **MySQL**
- **MongoDB**

#### Using Prisma (Recommended)

1. Install Prisma:
```bash
pnpm add prisma @prisma/client
pnpm add -D prisma
```

2. Initialize Prisma:
```bash
npx prisma init
```

3. Configure `prisma/schema.prisma` with the schema from `/lib/db/schema.ts`

4. Run migrations:
```bash
npx prisma migrate dev
```

5. Generate Prisma Client:
```bash
npx prisma generate
```

### 4. Environment Variables

Add to `.env.local`:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/fossandhra"

# Authentication (NextAuth)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Razorpay (Existing)
RAZORPAY_KEY_ID="your_key_id"
RAZORPAY_KEY_SECRET="your_key_secret"

# Email (Optional - for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-password"
```

### 5. Install Authentication

Using **NextAuth.js**:

```bash
pnpm add next-auth
```

Create `/app/api/auth/[...nextauth]/route.ts`:
```typescript
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" }
      },
      async authorize(credentials) {
        // Verify credentials against database
        // Return user object if valid
      }
    })
  ],
  pages: {
    signIn: "/admin/login"
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

## 🔐 Security Features

1. **Authentication**
   - Secure login with NextAuth
   - Password hashing with bcrypt
   - Session management

2. **Authorization**
   - Role-based access control (Admin, Editor, Viewer)
   - Protected API routes
   - Server-side session verification

3. **Data Protection**
   - SQL injection prevention
   - XSS protection
   - CSRF tokens
   - Input validation
   - Sanitized database queries

## 📊 API Routes

### Members API
```
GET    /api/admin/members?status=active&search=john
POST   /api/admin/members
PUT    /api/admin/members/[id]
DELETE /api/admin/members/[id]
```

### Events API
```
GET    /api/admin/events?type=workshop&status=upcoming
POST   /api/admin/events
PUT    /api/admin/events/[id]
DELETE /api/admin/events/[id]
```

### Donations API
```
GET    /api/admin/donations?type=monthly&status=completed
GET    /api/admin/donations/[id]
GET    /api/admin/donations/stats
```

### Content API
```
GET    /api/admin/content?type=page
PUT    /api/admin/content/[slug]
POST   /api/admin/media/upload
```

## 🎨 UI Components

The CMS uses the existing UI component library:
- `Card` - Content containers
- `Button` - Action buttons
- `Input`, `Select`, `Textarea` - Form elements
- `Badge` - Status indicators
- `Tabs` - Tabbed navigation
- Custom icons from `lucide-react`

## 📱 Responsive Design

The CMS is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1366px)
- Tablet (768px)
- Mobile (375px)

## 🚀 Deployment

### Production Checklist

- [ ] Change default admin credentials
- [ ] Set secure `NEXTAUTH_SECRET`
- [ ] Configure production database
- [ ] Enable SSL/HTTPS
- [ ] Set up database backups
- [ ] Configure email notifications
- [ ] Test payment integration
- [ ] Enable error logging
- [ ] Set up monitoring

### Vercel Deployment

The CMS will deploy automatically with your Next.js app on Vercel.

1. Add environment variables in Vercel dashboard
2. Configure database connection
3. Deploy

## 🔄 Workflow

### Adding a New Event
1. Login to `/admin`
2. Navigate to Events
3. Click "Add Event"
4. Fill in details
5. Set status to "upcoming"
6. Save

### Managing Members
1. View all members in Members section
2. Export CSV for email campaigns
3. Filter by status to find expiring memberships
4. Send renewal reminders

### Processing Donations
1. Donations are auto-recorded from Razorpay
2. View in Donations section
3. Generate receipts
4. Export reports for accounting

## 🛠️ Customization

### Adding New Features

1. Create new page in `/app/admin/[feature]/page.tsx`
2. Add to sidebar in `/app/admin/layout.tsx`
3. Create API routes in `/app/api/admin/[feature]/route.ts`
4. Update database schema in `/lib/db/schema.ts`

### Styling

The CMS uses Tailwind CSS classes. Modify:
- Primary color: `bg-primary` (currently #015ba7)
- Sidebar: `/app/admin/layout.tsx`
- Cards: Global Card component

## 📧 Email Notifications

Configure SMTP to send:
- Member registration confirmation
- Event registration confirmation
- Donation receipts
- Membership renewal reminders
- Admin notifications

## 📈 Analytics

Track:
- Member growth
- Event attendance
- Donation trends
- Popular programs
- Geographic distribution

## 🐛 Troubleshooting

### Common Issues

**Can't login:**
- Check database connection
- Verify credentials
- Check NextAuth configuration

**Data not saving:**
- Check database permissions
- Verify API routes
- Check browser console for errors

**Payment not recording:**
- Verify Razorpay webhook
- Check payment action logs
- Verify database schema

## 📝 TODO / Future Enhancements

- [ ] Email marketing integration
- [ ] Advanced analytics dashboard
- [ ] Bulk import members from CSV
- [ ] Calendar view for events
- [ ] Automated membership renewals
- [ ] WhatsApp notifications
- [ ] Multi-language support
- [ ] Custom report builder
- [ ] Volunteer management
- [ ] Attendance QR code scanner

## 🤝 Support

For issues or questions:
- Email: tech@fossandhra.org
- GitHub Issues: [Create Issue]
- Documentation: This file

## 📜 License

Part of the FOSS Andhra project - promoting free and open source software in Andhra Pradesh.

---

**Version:** 1.0.0  
**Last Updated:** February 2025  
**Maintainer:** FOSS Andhra Tech Team
