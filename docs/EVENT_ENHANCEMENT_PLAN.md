# Event Management Enhancement Plan
## Inspired by Hi.Events Platform

### Current State
- Basic event creation and management
- Simple registration tracking
- Limited event details

### Proposed Enhancements (Hi.Events Inspired)

---

## 🎯 Phase 1: Ticketing System (HIGH PRIORITY)

### Features to Implement:

#### 1.1 Multiple Ticket Types
- **Free Tickets**: No payment required
- **Paid Tickets**: Fixed price with Razorpay integration
- **Donation Tickets**: Pay-what-you-want model
- **Tiered Tickets**: Early bird, Regular, VIP pricing

#### 1.2 Ticket Management
- Capacity limits per ticket type
- Shared capacity across multiple ticket types
- Ticket availability windows (start/end dates)
- Hidden tickets (accessible via promo codes only)

#### 1.3 Database Schema Changes
```prisma
model EventTicketType {
  id                String   @id @default(cuid())
  eventId           String
  name              String   // e.g., "Early Bird", "VIP", "General Admission"
  description       String?
  type              String   // "free", "paid", "donation", "tiered"
  price             Float    @default(0)
  minDonation       Float?   // For donation tickets
  maxDonation       Float?   // For donation tickets
  quantity          Int?     // null = unlimited
  quantitySold      Int      @default(0)
  salesStart        DateTime?
  salesEnd          DateTime?
  hidden            Boolean  @default(false) // Hidden until promo code
  order             Int      @default(0)
  active            Boolean  @default(true)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  event             Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  tickets           EventTicket[]
  promoCodes        PromoCodeTicket[]
}

model EventTicket {
  id                String   @id @default(cuid())
  eventId           String
  ticketTypeId      String
  attendeeName      String
  attendeeEmail     String
  attendeePhone     String?
  orderId           String
  qrCode            String   @unique
  checkInStatus     String   @default("pending") // pending, checked_in
  checkInTime       DateTime?
  checkInBy         String?  // Admin who checked in
  price             Float
  customFields      String?  // JSON for custom questions
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  event             Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  ticketType        EventTicketType @relation(fields: [ticketTypeId], references: [id])
  order             EventOrder @relation(fields: [orderId], references: [id], onDelete: Cascade)
}

model EventOrder {
  id                String   @id @default(cuid())
  eventId           String
  orderNumber       String   @unique
  customerName      String
  customerEmail     String
  customerPhone     String?
  totalAmount       Float
  subtotal          Float
  taxAmount         Float    @default(0)
  feeAmount         Float    @default(0)
  discountAmount    Float    @default(0)
  promoCode         String?
  status            String   @default("pending") // pending, completed, refunded, cancelled
  paymentMethod     String?  // razorpay, offline, free
  paymentId         String?
  razorpayOrderId   String?
  razorpaySignature String?
  refundAmount      Float    @default(0)
  refundReason      String?
  refundedAt        DateTime?
  customFields      String?  // JSON for custom checkout questions
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  event             Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  tickets           EventTicket[]
}

model EventPromoCode {
  id                String   @id @default(cuid())
  eventId           String
  code              String   @unique
  description       String?
  discountType      String   // "percentage", "fixed", "free"
  discountValue     Float
  maxUses           Int?     // null = unlimited
  usedCount         Int      @default(0)
  validFrom         DateTime?
  validUntil        DateTime?
  minOrderAmount    Float?
  active            Boolean  @default(true)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  event             Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  applicableTickets PromoCodeTicket[]
}

model PromoCodeTicket {
  id           String   @id @default(cuid())
  promoCodeId  String
  ticketTypeId String
  promoCode    EventPromoCode @relation(fields: [promoCodeId], references: [id], onDelete: Cascade)
  ticketType   EventTicketType @relation(fields: [ticketTypeId], references: [id], onDelete: Cascade)
  
  @@unique([promoCodeId, ticketTypeId])
}
```

---

## 📊 Phase 2: Analytics & Reporting (MEDIUM PRIORITY)

### Features:

#### 2.1 Event Dashboard
- Real-time sales tracking
- Revenue by ticket type
- Sales velocity chart
- Attendee demographics
- Registration timeline graph

#### 2.2 Advanced Reports
- Daily sales report
- Tax breakdown
- Product/ticket sales by type
- Promo code usage analytics
- Refund tracking
- Check-in statistics

#### 2.3 Export Capabilities
- CSV/XLSX export for attendees
- Financial reports export
- Check-in lists export

---

## 🎨 Phase 3: Event Page Customization (MEDIUM PRIORITY)

### Features:

#### 3.1 Event Homepage Builder
- Drag-and-drop sections
- Custom color schemes
- Custom header images
- Rich text description with media
- FAQ section
- Speaker/organizer profiles
- Agenda/schedule builder

#### 3.2 SEO Optimization
- Custom meta title/description
- Open Graph tags
- Twitter Card metadata
- Schema.org event markup
- Custom slug

#### 3.3 Embeddable Widget
- Iframe ticket widget for external websites
- Customizable styling
- Mobile-responsive

---

## 📧 Phase 4: Communication & Automation (HIGH PRIORITY)

### Features:

#### 4.1 Email Templates
- Ticket confirmation email
- Order receipt
- Event reminder (1 day before)
- Check-in confirmation
- Refund notification
- Custom announcements

#### 4.2 Bulk Messaging
- Email all attendees
- Email specific ticket holders
- SMS notifications (optional)

#### 4.3 Webhooks
- Order completed
- Ticket checked in
- Event published
- Refund processed

---

## 📱 Phase 5: Mobile Check-In System (HIGH PRIORITY)

### Features:

#### 5.1 QR Code System
- Unique QR code per ticket
- QR generation on ticket purchase
- QR display in confirmation email

#### 5.2 Check-In Interface
- Web-based scanner (no app needed)
- Mobile camera integration
- Manual check-in option
- Attendee search
- Real-time check-in status

#### 5.3 Check-In Lists
- Pre-generated check-in sheets
- Print-ready format
- Access control for staff
- Multiple check-in points support

---

## 🛍️ Phase 6: Product Sales & Add-ons (LOW PRIORITY)

### Features:

#### 6.1 Event Products
- Sell merchandise (t-shirts, etc.)
- Workshop materials
- Food/beverage packages
- Parking passes

#### 6.2 Product Management
```prisma
model EventProduct {
  id          String   @id @default(cuid())
  eventId     String
  name        String
  description String?
  type        String   // "merchandise", "addon", "service"
  price       Float
  quantity    Int?
  quantitySold Int     @default(0)
  taxable     Boolean  @default(false)
  image       String?
  options     String?  // JSON for sizes, colors, etc.
  order       Int      @default(0)
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  event       Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
}
```

---

## 💰 Phase 7: Advanced Payment Features (MEDIUM PRIORITY)

### Features:

#### 7.1 Payment Options
- Razorpay integration (existing)
- Offline payments (bank transfer)
- Cash payments
- Payment on arrival
- Installment plans (for expensive tickets)

#### 7.2 Tax & Fee Management
- Per-ticket tax rates
- Platform fees
- Processing fees
- Optional attendee fees

#### 7.3 Invoicing
- Auto-generate invoices
- Tax details
- Payment terms
- Due dates
- PDF download

---

## 👥 Phase 8: Multi-User & Roles (LOW PRIORITY)

### Features:

#### 8.1 Role-Based Access
- Event Organizer
- Box Office Staff
- Check-In Staff
- Viewer (read-only)

#### 8.2 Permissions
- Create/edit events
- Process refunds
- Check-in attendees
- View reports
- Manage team

---

## 📋 Implementation Priority

### Must-Have (MVP):
1. ✅ Multiple ticket types with pricing
2. ✅ QR code check-in system
3. ✅ Order management with Razorpay
4. ✅ Promo codes
5. ✅ Email confirmations
6. ✅ Basic analytics dashboard

### Should-Have (V2):
1. Event page builder
2. Advanced reporting
3. Bulk messaging
4. Product sales
5. Custom checkout forms

### Nice-to-Have (V3):
1. Multi-user roles
2. Webhooks
3. Embeddable widget
4. Invoicing system
5. SMS notifications

---

## 🚀 Quick Wins (Start Here)

### Week 1-2: Schema & Basic Ticketing
- Create new Prisma models
- Migration scripts
- Basic ticket CRUD API
- Simple ticket purchase flow

### Week 3: QR Check-In
- QR code generation
- Check-in API
- Mobile-friendly check-in page

### Week 4: Analytics
- Sales dashboard
- Revenue tracking
- Attendee reports

---

## 📊 Success Metrics

- ✅ Ticket sales conversion rate
- ✅ Average order value
- ✅ Check-in efficiency (time per attendee)
- ✅ Promo code redemption rate
- ✅ Event page engagement
- ✅ Refund rate
- ✅ Customer satisfaction (post-event survey)

---

## 🔧 Technical Considerations

### Database:
- Current: SQLite (dev)
- Consider: PostgreSQL for production (better JSON support, concurrent writes)

### File Storage:
- QR codes: Generate on-the-fly or store?
- Ticket PDFs: Server-side generation (puppeteer/pdf-lib)

### Email:
- Template engine: React Email or Handlebars
- Delivery: Existing Nodemailer setup

### Payment:
- Existing Razorpay integration
- Add webhook handling for payment confirmation

### Security:
- Rate limiting on check-in API
- Prevent QR code duplication
- CSRF protection on payment forms

---

## 📝 Next Steps

1. **Review & Approve** this plan
2. **Create Prisma schema** for Phase 1
3. **Build ticket management UI** 
4. **Integrate Razorpay** for ticket sales
5. **Implement QR system**
6. **Test end-to-end** ticket purchase flow

---

**Questions to Address:**
1. Should we support recurring events?
2. Multi-day/multi-session events?
3. Waitlist functionality when sold out?
4. Early bird auto-transition to regular pricing?
5. Group discounts?
6. Affiliate/referral tracking?
