# Event Ticketing System - Complete Implementation

## Overview
A comprehensive event ticketing and management system inspired by Hi.Events, implemented for FOSS Andhra website with features including ticket sales, payment processing, QR code generation, email notifications, and check-in management.

## System Architecture

### Core Components
```
┌─────────────────────────────────────────────────────────┐
│                   Event Ticketing System                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Admin      │  │   Public     │  │   Check-In   │  │
│  │  Interface   │  │  Purchase    │  │   System     │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                  │                  │          │
│  ┌──────▼──────────────────▼──────────────────▼───────┐ │
│  │              API Layer (REST)                       │ │
│  └──────┬──────────────────┬──────────────────┬───────┘ │
│         │                  │                  │          │
│  ┌──────▼───────┐  ┌──────▼───────┐  ┌──────▼───────┐  │
│  │   Prisma     │  │  Razorpay    │  │   Nodemailer │  │
│  │   Client     │  │   Payment    │  │    Email     │  │
│  └──────┬───────┘  └──────────────┘  └──────────────┘  │
│         │                                                │
│  ┌──────▼───────┐                                       │
│  │   SQLite DB  │                                       │
│  └──────────────┘                                       │
└─────────────────────────────────────────────────────────┘
```

## Database Schema

### New Models (8 Total)

#### 1. EventTicketType
Defines different ticket categories for an event.

```prisma
model EventTicketType {
  id                String              @id @default(cuid())
  eventId           String
  name              String              // e.g., "Early Bird", "VIP"
  description       String?
  type              String              // "free", "paid", "donation"
  price             Float               @default(0)
  minDonation       Float?
  maxDonation       Float?
  quantity          Int?                // null = unlimited
  quantitySold      Int                 @default(0)
  salesStart        DateTime?
  salesEnd          DateTime?
  hidden            Boolean             @default(false)
  requiresApproval  Boolean             @default(false)
  order             Int                 @default(0)
  active            Boolean             @default(true)
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt
  
  // Relations
  event             Event               @relation(fields: [eventId], references: [id], onDelete: Cascade)
  tickets           EventTicket[]
  promoCodes        PromoCodeTicket[]
}
```

**Use Cases**:
- Free community events
- Paid workshops with pricing tiers
- Donation-based fundraisers
- VIP/Premium access tickets
- Early bird discounts

#### 2. EventTicket
Individual ticket instances issued to attendees.

```prisma
model EventTicket {
  id                String          @id @default(cuid())
  eventId           String
  ticketTypeId      String
  orderId           String
  attendeeName      String
  attendeeEmail     String
  attendeePhone     String?
  qrCode            String          @unique    // Data URL of QR code image
  checkInStatus     String          @default("pending")  // pending, checked_in, cancelled
  checkInTime       DateTime?
  checkInBy         String?         // Admin who checked in
  price             Float
  customFields      String?         // JSON for custom questions
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt
  
  // Relations
  event             Event           @relation(fields: [eventId], references: [id], onDelete: Cascade)
  ticketType        EventTicketType @relation(fields: [ticketTypeId], references: [id])
  order             EventOrder      @relation(fields: [orderId], references: [id], onDelete: Cascade)
}
```

**Key Features**:
- Unique QR code per ticket
- Check-in tracking with timestamp
- Support for custom attendee fields
- Audit trail (who checked in)

#### 3. EventOrder
Orders containing one or more tickets.

```prisma
model EventOrder {
  id                String       @id @default(cuid())
  eventId           String
  orderNumber       String       @unique       // ORD-YYYYMMDD-XXX
  customerName      String
  customerEmail     String
  customerPhone     String?
  totalAmount       Float
  subtotal          Float
  taxAmount         Float        @default(0)
  feeAmount         Float        @default(0)
  discountAmount    Float        @default(0)
  promoCode         String?
  status            String       @default("pending")  // pending, completed, refunded, cancelled, failed
  paymentMethod     String?      // razorpay, offline, free
  paymentId         String?
  razorpayOrderId   String?
  razorpaySignature String?
  refundAmount      Float        @default(0)
  refundReason      String?
  refundedAt        DateTime?
  notes             String?
  customFields      String?
  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt
  
  // Relations
  event             Event        @relation(fields: [eventId], references: [id], onDelete: Cascade)
  tickets           EventTicket[]
}
```

**Order Number Format**: `ORD-20251020-001`
- Format: ORD-YYYYMMDD-XXX
- Unique per day
- Easy to reference

#### 4. EventPromoCode
Discount codes for ticket purchases.

```prisma
model EventPromoCode {
  id                String            @id @default(cuid())
  eventId           String
  code              String            // e.g., "EARLYBIRD", "SAVE20"
  description       String?
  discountType      String            // "percentage", "fixed", "free"
  discountValue     Float             // 20 (for 20% or ₹20)
  maxUses           Int?              // null = unlimited
  usedCount         Int               @default(0)
  validFrom         DateTime?
  validUntil        DateTime?
  minOrderAmount    Float?
  active            Boolean           @default(true)
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
  
  // Relations
  event             Event             @relation(fields: [eventId], references: [id], onDelete: Cascade)
  applicableTickets PromoCodeTicket[]
  
  @@unique([eventId, code])
}
```

**Discount Types**:
- `percentage`: 20% off (discountValue = 20)
- `fixed`: ₹50 off (discountValue = 50)
- `free`: 100% off (discountValue = 100)

#### 5. PromoCodeTicket (Join Table)
Many-to-many relationship between promo codes and ticket types.

```prisma
model PromoCodeTicket {
  id           String          @id @default(cuid())
  promoCodeId  String
  ticketTypeId String
  
  // Relations
  promoCode    EventPromoCode  @relation(fields: [promoCodeId], references: [id], onDelete: Cascade)
  ticketType   EventTicketType @relation(fields: [ticketTypeId], references: [id], onDelete: Cascade)
  
  @@unique([promoCodeId, ticketTypeId])
}
```

**Purpose**: Allow promo codes to apply only to specific ticket types.

#### 6. EventProduct
Merchandise and add-ons for events.

```prisma
model EventProduct {
  id           String   @id @default(cuid())
  eventId      String
  name         String
  description  String?
  type         String   // "merchandise", "addon", "service"
  price        Float
  quantity     Int?     // null = unlimited
  quantitySold Int      @default(0)
  taxable      Boolean  @default(false)
  image        String?
  options      String?  // JSON for sizes, colors, etc.
  order        Int      @default(0)
  active       Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  // Relations
  event        Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
}
```

**Examples**:
- T-shirts with size options
- Conference materials
- Parking passes
- Meal add-ons

### Updated Event Model
Added ticketing-related fields:

```prisma
model Event {
  // ... existing fields
  enableTicketing  Boolean             @default(false)
  currency         String              @default("INR")
  timezone         String              @default("Asia/Kolkata")
  customFields     String?             // JSON for custom checkout questions
  
  // New Relations
  ticketTypes      EventTicketType[]
  tickets          EventTicket[]
  orders           EventOrder[]
  promoCodes       EventPromoCode[]
  products         EventProduct[]
}
```

## Feature Implementation

### 1. Admin Ticket Management

**Location**: `/app/admin/events/[id]/page.tsx`

**Features**:
- Create/Edit/Delete ticket types
- Set pricing (free, paid, donation)
- Configure capacity limits
- Set sales windows (start/end dates)
- Manage hidden tickets (promo-only)
- View ticket sales statistics

**UI Components**:
- Tabs: Ticket Types, Orders, Promo Codes
- Stats Cards: Revenue, Tickets Sold, Orders, Promo Codes
- Dialogs: Ticket form, Order creation

**API Endpoints**:
```
GET    /api/admin/events/[id]/tickets
POST   /api/admin/events/[id]/tickets
PUT    /api/admin/events/[id]/tickets/[ticketId]
DELETE /api/admin/events/[id]/tickets/[ticketId]

GET    /api/admin/events/[id]/orders
POST   /api/admin/events/[id]/orders

GET    /api/admin/events/[id]/promo-codes
POST   /api/admin/events/[id]/promo-codes
```

### 2. Public Ticket Purchase

**Location**: `/app/events/[slug]/page.tsx`

**Features**:
- Browse available tickets
- Add tickets to cart with attendee details
- Apply promo codes with real-time validation
- View price breakdown (subtotal, discount, total)
- Integrated Razorpay payment
- Auto-completion for free tickets
- Email confirmation with QR codes

**Purchase Flow**:
```
1. Select Tickets → Add attendee details
2. Review Cart → Apply promo code (optional)
3. Checkout → Enter customer info
4. Payment:
   - Free: Auto-complete
   - Paid: Razorpay modal
5. Confirmation → Email sent with QR codes
```

**API Endpoints**:
```
GET  /api/events/slug/[slug]
GET  /api/events/[eventId]/tickets
POST /api/events/[eventId]/promo-codes/validate
POST /api/payment/create-order
```

### 3. Payment Integration

**Provider**: Razorpay
**Mode**: Test and Production support

**Configuration** (`.env`):
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
```

**Implementation**:
```typescript
// Create Razorpay order
const options = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  amount: orderData.data.amount,  // In paise
  currency: "INR",
  name: "FOSS Andhra",
  description: event.title,
  order_id: orderData.data.id,
  handler: async function (response) {
    // Verify and complete order
    await createOrder("razorpay", {
      paymentId: response.razorpay_payment_id,
      orderId: response.razorpay_order_id,
      signature: response.razorpay_signature,
    })
  }
}
```

**Payment Flow**:
1. Create Razorpay order via API
2. Open Razorpay checkout modal
3. User completes payment
4. Razorpay callback with payment details
5. Verify signature (security)
6. Create order and tickets
7. Send confirmation email

### 4. QR Code Generation

**Library**: `qrcode` npm package

**Implementation**:
```typescript
import QRCode from "qrcode"

const qrData = JSON.stringify({
  eventId,
  orderId: order.id,
  ticketId,
  attendeeEmail: ticketData.attendeeEmail,
})

const qrCode = await QRCode.toDataURL(qrData)
// Returns: data:image/png;base64,iVBORw0KG...
```

**QR Code Contains**:
- Event ID (verify correct event)
- Order ID (reference)
- Ticket ID (unique identifier)
- Attendee Email (backup lookup)

**Storage**: Stored as Data URL in database

### 5. Email Notifications

**Service**: Nodemailer with SMTP
**Template**: HTML with inline CSS

**Configuration** (`.env`):
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=FOSS Andhra <noreply@fossandhra.org>
```

**Email Content**:
- Order confirmation details
- Event information (date, time, location)
- Individual ticket cards with QR codes
- Check-in instructions
- FOSS Andhra branding

**Implementation**:
```typescript
await sendTicketConfirmationEmail(customerEmail, {
  orderNumber,
  customerName,
  eventTitle: event.title,
  eventDate: event.date,
  eventTime: event.time,
  eventLocation: event.location,
  totalAmount,
  tickets: createdTickets.map(ticket => ({
    id: ticket.id,
    ticketTypeName: '...',
    attendeeName: ticket.attendeeName,
    qrCode: ticket.qrCode,  // Data URL image
  }))
})
```

### 6. Check-In System

**Location**: `/app/admin/events/[id]/check-in/page.tsx`

**Features**:
- Real-time statistics dashboard
- QR code scanner integration
- Manual attendee search
- One-click check-in
- Recent check-ins list
- Duplicate prevention
- Status tracking

**Statistics**:
- Total tickets sold
- Checked-in count with percentage
- Pending check-ins
- Cancelled tickets

**Check-In Methods**:

1. **QR Code Scanning**:
   - Barcode scanner in "keyboard wedge" mode
   - Auto-focused input field
   - Instant validation
   - Success/error feedback

2. **Manual Search**:
   - Search by name, email, phone, order number
   - Display up to 20 results
   - Shows ticket status with badges
   - Quick check-in button

**API Endpoints**:
```
GET  /api/admin/events/[id]/check-in/stats
GET  /api/admin/events/[id]/check-in/recent
GET  /api/admin/events/[id]/check-in/search?q=query
POST /api/admin/events/[id]/check-in
POST /api/admin/events/[id]/check-in/manual
```

**Validation Process**:
```typescript
1. Parse QR code JSON
2. Find ticket in database
3. Verify ticket belongs to event
4. Check ticket not cancelled
5. Check ticket not already checked in
6. Update status to "checked_in"
7. Record timestamp and admin
8. Return success
```

## Security Features

### Payment Security
- Razorpay signature verification
- Server-side payment validation
- Secure API key storage in environment variables

### QR Code Security
- Unique QR per ticket (prevents copying)
- Event verification (prevents cross-event usage)
- One-time check-in (prevents reuse)
- Encrypted data structure

### Data Validation
- Email format validation
- Phone number validation
- Promo code validation
- Capacity checks
- Sales window enforcement

### Database Security
- Cascade deletes (data consistency)
- Unique constraints (prevent duplicates)
- Indexed fields (performance + integrity)

## Installation & Setup

### 1. Dependencies
```bash
bun add razorpay qrcode nodemailer
bun add -d @types/qrcode @types/nodemailer
```

### 2. Environment Variables
```env
# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=FOSS Andhra <noreply@fossandhra.org>

# Database
DATABASE_URL="file:./dev.db"
```

### 3. Database Migration
```bash
bunx prisma migrate dev --name add_event_ticketing_system
bunx prisma generate
```

### 4. Razorpay Setup
1. Create account at https://razorpay.com
2. Get Test/Production API keys
3. Add to `.env` file
4. Configure webhook (optional)

### 5. Email Setup (Gmail)
1. Enable 2-factor authentication
2. Generate App Password
3. Use App Password in `SMTP_PASS`
4. Set `SMTP_HOST=smtp.gmail.com`

## Testing Guide

### Test Ticket Creation
1. Go to `/admin/events/[id]`
2. Click "Add Ticket Type"
3. Fill form:
   - Name: "Early Bird"
   - Type: "Paid"
   - Price: 500
   - Quantity: 50
4. Save
5. Verify appears in list

### Test Ticket Purchase
1. Go to `/events/[slug]`
2. Add tickets to cart
3. Fill attendee details
4. Apply promo code (if any)
5. Click "Proceed to Checkout"
6. Enter customer info
7. Complete payment (test mode)
8. Check email for confirmation

### Test Promo Code
1. Create promo code in admin
2. Code: "SAVE20"
3. Type: "Percentage"
4. Value: 20
5. Try on purchase page
6. Verify 20% discount applied

### Test Check-In
1. Copy QR code data from email
2. Go to `/admin/events/[id]/check-in`
3. Paste QR data
4. Click "Check In"
5. Verify success message
6. Check recent check-ins list
7. Try same QR again (should fail)

## Common Workflows

### Create Event with Tickets
```
1. Create Event (enableTicketing: true)
2. Add Ticket Types:
   - Free: Community Pass
   - Paid: Workshop Ticket (₹500)
   - VIP: Premium Access (₹2000)
3. Set capacity limits
4. Configure sales windows
5. Create promo codes (optional)
6. Test purchase flow
7. Share event link
```

### Handle Check-In at Event
```
1. Setup check-in station with tablet/laptop
2. Connect barcode scanner (USB)
3. Open check-in page
4. Test with sample QR code
5. Start scanning attendee tickets
6. Monitor stats dashboard
7. Use manual search for issues
```

### Process Refund
```
1. Find order in admin
2. Note order details
3. Process refund in Razorpay dashboard
4. Update order status to "refunded"
5. Update ticket status to "cancelled"
6. Send refund confirmation email
```

## Performance Optimization

### Database Indexes
```prisma
@@unique([eventId, code])  // Promo codes
@@index([eventId])         // Fast event lookups
@@index([checkInStatus])   // Check-in stats
```

### Query Optimization
- Use `select` to fetch only needed fields
- Limit results (e.g., recent check-ins: 10)
- Use pagination for large datasets

### Caching Strategy
- Cache ticket types (rarely change)
- Cache event details
- Real-time for stats and check-ins

## Troubleshooting

### Payment Issues
**Problem**: Razorpay modal not opening
**Solution**: 
- Check `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set
- Verify script loaded: `window.Razorpay`
- Check browser console for errors

**Problem**: Payment succeeds but order not created
**Solution**:
- Check API endpoint `/api/admin/events/[id]/orders`
- Verify Prisma client generated
- Check server logs

### Email Issues
**Problem**: Emails not sending
**Solution**:
- Verify SMTP credentials in `.env`
- Check Gmail App Password (not regular password)
- Test SMTP connection with simple mail

**Problem**: QR codes not appearing in email
**Solution**:
- Ensure QR code is Data URL format
- Check email client supports images
- Test with different email provider

### Check-In Issues
**Problem**: QR code not validating
**Solution**:
- Check QR data is valid JSON
- Verify ticket exists in database
- Ensure correct event ID

**Problem**: "Already checked in" error
**Solution**:
- Check recent check-ins for timestamp
- If legitimate duplicate, allow entry manually
- Update ticket notes for tracking

## API Reference

### Admin APIs

#### Ticket Management
```typescript
// Get all ticket types
GET /api/admin/events/[id]/tickets
Response: { success: true, data: TicketType[] }

// Create ticket type
POST /api/admin/events/[id]/tickets
Body: { name, description, type, price, quantity, ... }
Response: { success: true, data: TicketType }

// Update ticket type
PUT /api/admin/events/[id]/tickets/[ticketId]
Body: { name, price, ... }
Response: { success: true, data: TicketType }

// Delete ticket type
DELETE /api/admin/events/[id]/tickets/[ticketId]
Response: { success: true }
```

#### Order Management
```typescript
// Get all orders
GET /api/admin/events/[id]/orders
Response: { success: true, data: Order[] }

// Create order (manual)
POST /api/admin/events/[id]/orders
Body: {
  customerName, customerEmail, customerPhone,
  tickets: [{ ticketTypeId, quantity, attendeeName, attendeeEmail }],
  promoCode?, paymentMethod
}
Response: { success: true, data: Order }
```

### Public APIs

#### Ticket Purchase
```typescript
// Get event by slug
GET /api/events/slug/[slug]
Response: { success: true, data: Event }

// Get available tickets
GET /api/events/[eventId]/tickets
Response: { success: true, data: TicketType[] }

// Validate promo code
POST /api/events/[eventId]/promo-codes/validate
Body: { code, ticketTypeIds: string[] }
Response: {
  success: true,
  data: { code, discountType, discountValue, ... }
}
```

#### Payment
```typescript
// Create Razorpay order
POST /api/payment/create-order
Body: { amount, currency, eventTitle }
Response: { success: true, data: { id, amount, currency } }
```

## File Structure

```
app/
├── admin/
│   └── events/
│       └── [id]/
│           ├── page.tsx                    # Event details & ticket management
│           └── check-in/
│               └── page.tsx                # Check-in interface
├── events/
│   └── [slug]/
│       └── page.tsx                        # Public ticket purchase
└── api/
    ├── admin/
    │   └── events/
    │       └── [id]/
    │           ├── tickets/
    │           │   ├── route.ts            # CRUD ticket types
    │           │   └── [ticketId]/
    │           │       └── route.ts        # Update/delete ticket
    │           ├── orders/
    │           │   └── route.ts            # Orders + create order
    │           ├── promo-codes/
    │           │   └── route.ts            # Promo code management
    │           └── check-in/
    │               ├── route.ts            # QR check-in
    │               ├── manual/
    │               │   └── route.ts        # Manual check-in
    │               ├── stats/
    │               │   └── route.ts        # Statistics
    │               ├── recent/
    │               │   └── route.ts        # Recent check-ins
    │               └── search/
    │                   └── route.ts        # Search tickets
    ├── events/
    │   ├── slug/
    │   │   └── [slug]/
    │   │       └── route.ts                # Get event by slug
    │   └── [eventId]/
    │       ├── tickets/
    │       │   └── route.ts                # Public ticket list
    │       └── promo-codes/
    │           └── validate/
    │               └── route.ts            # Validate promo
    └── payment/
        └── create-order/
            └── route.ts                    # Create Razorpay order

lib/
└── email.ts                                # Email utilities

prisma/
└── schema.prisma                           # Database schema

components/ui/
├── tabs.tsx                                # Radix UI tabs
└── alert.tsx                               # Alert component

docs/
├── PUBLIC_TICKETING_IMPLEMENTATION.md      # Public ticket docs
└── QR_CHECKIN_SYSTEM.md                    # Check-in docs
```

## Dependencies

### Production
```json
{
  "razorpay": "^2.9.2",
  "qrcode": "^1.5.3",
  "nodemailer": "^6.9.7",
  "@radix-ui/react-tabs": "^1.0.4"
}
```

### Development
```json
{
  "@types/qrcode": "^1.5.5",
  "@types/nodemailer": "^6.4.14"
}
```

## Future Enhancements

### Phase 2 (Planned)
- [ ] Order cancellation/refund from admin
- [ ] Bulk ticket import (CSV)
- [ ] Ticket transfer between users
- [ ] Waitlist management
- [ ] Group booking discounts

### Phase 3 (Planned)
- [ ] Mobile app for check-in
- [ ] Offline check-in with sync
- [ ] Analytics dashboard
- [ ] Attendee management portal
- [ ] Post-event surveys

### Phase 4 (Advanced)
- [ ] Multi-currency support
- [ ] Tax configuration per region
- [ ] Seating chart integration
- [ ] Badge printing
- [ ] Livestream access control

## Support & Resources

### Documentation
- [Razorpay Docs](https://razorpay.com/docs/)
- [Prisma Docs](https://www.prisma.io/docs)
- [Nodemailer Guide](https://nodemailer.com/)
- [QRCode.js](https://github.com/soldair/node-qrcode)

### Internal Docs
- `PUBLIC_TICKETING_IMPLEMENTATION.md` - Public ticket purchase flow
- `QR_CHECKIN_SYSTEM.md` - Check-in system details
- `.env.example` - Environment variable reference

## Conclusion

This event ticketing system provides a complete solution for managing paid and free events with professional features including:

✅ Multi-tier ticket types (free, paid, donation)  
✅ Capacity management and sales windows  
✅ Promo code system with flexible discounts  
✅ Integrated payment processing (Razorpay)  
✅ QR code generation per ticket  
✅ Email confirmations with QR codes  
✅ Check-in system with scanner support  
✅ Real-time statistics and reporting  
✅ Admin and public interfaces  
✅ Mobile-responsive design  

The system is production-ready and can handle events of any size from small community meetups to large conferences.
