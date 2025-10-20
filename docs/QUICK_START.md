# Quick Start Guide - Event Ticketing System

## 🚀 Getting Started (5 Minutes)

### 1. Configure Environment
Copy and fill `.env.example` → `.env`:

```env
# Razorpay (Get from https://razorpay.com)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# Email (Gmail App Password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=FOSS Andhra <noreply@fossandhra.org>
```

### 2. Database Ready
Already migrated and generated:
```bash
✅ Migration: 20251020102520_add_event_ticketing_system
✅ Prisma Client: Generated
✅ Dev Server: Running on http://localhost:3000
```

### 3. Create Your First Ticketed Event

#### Step 1: Create Event
1. Go to `/admin/events`
2. Click "Create Event"
3. Fill details
4. **Important**: Set `enableTicketing: true`
5. Set `slug` (e.g., "tech-workshop-2025")
6. Save event

#### Step 2: Add Ticket Types
1. Go to event details: `/admin/events/[id]`
2. Click **"Tickets"** tab
3. Click **"Add Ticket Type"**

**Example Ticket Types**:

**Free Ticket**:
- Name: "Community Pass"
- Type: Free
- Price: 0
- Quantity: 100

**Paid Ticket**:
- Name: "Workshop Ticket"
- Type: Paid
- Price: 500
- Quantity: 50
- Sales Start: (today)
- Sales End: (event date)

**VIP Ticket**:
- Name: "Premium Access"
- Type: Paid
- Price: 2000
- Quantity: 20

#### Step 3: Create Promo Code (Optional)
1. Click **"Promo Codes"** tab
2. Click **"Add Promo Code"**
3. Example:
   - Code: "EARLYBIRD"
   - Type: Percentage
   - Value: 20
   - Max Uses: 50
   - Valid Until: (week before event)

### 4. Test Ticket Purchase

1. Visit: `http://localhost:3000/events/tech-workshop-2025`
2. Add tickets to cart
3. Fill attendee details
4. Apply promo code (if any)
5. Click "Proceed to Checkout"
6. Enter customer info
7. Click "Complete Payment"
   - **Test Mode**: Use Razorpay test cards
   - **Free Tickets**: Auto-completes
8. Check email for confirmation with QR codes

### 5. Test Check-In

1. Copy QR code data from email (right-click on QR image)
2. Go to: `/admin/events/[id]/check-in`
3. Paste QR data in input field
4. Press Enter or click "Check In"
5. See success message ✅
6. Stats update automatically

**Or use Manual Search**:
1. Type attendee name/email in search box
2. Click "Search"
3. Click "Check In" button next to attendee

## 📋 Quick Reference

### Admin URLs
```
Events List:       /admin/events
Event Details:     /admin/events/[id]
Check-In:          /admin/events/[id]/check-in
```

### Public URLs
```
Ticket Purchase:   /events/[slug]
```

### Key Features

✅ **Ticket Types**: Free, Paid, Donation  
✅ **Payment**: Razorpay (test/production)  
✅ **Promo Codes**: Percentage, Fixed, Free  
✅ **QR Codes**: Unique per ticket  
✅ **Email**: Automatic confirmation  
✅ **Check-In**: QR scanner + manual search  
✅ **Stats**: Real-time dashboard  

## 🧪 Test Cards (Razorpay Test Mode)

**Success**:
- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

**Failure**:
- Card: 4000 0000 0000 0002
- CVV: Any 3 digits
- Expiry: Any future date

## 🔧 Common Tasks

### View All Orders
1. Go to event details
2. Click "Orders" tab
3. See list of all orders with status

### Create Manual Order
1. Go to "Orders" tab
2. Click "Create Manual Order"
3. Select ticket types and quantities
4. Fill customer details
5. Select payment method
6. Click "Create Order"

### Check Statistics
Check-in page shows:
- **Total Tickets**: All tickets sold
- **Checked In**: Attendees arrived
- **Pending**: Not yet checked in
- **Cancelled**: Refunded tickets

### Search Attendees
In check-in page:
- Search by name: "John Doe"
- Search by email: "john@example.com"
- Search by phone: "9876543210"
- Search by order: "ORD-20251020-001"

## 📱 Hardware Setup for Check-In

### Recommended Setup
1. **Device**: Tablet or laptop
2. **Scanner**: USB barcode scanner (keyboard wedge mode)
3. **Position**: Near entrance
4. **Network**: Stable internet connection

### Without Scanner
Use manual search feature - works perfectly!

## 🎯 Best Practices

### Before Event
- [ ] Create event 2-4 weeks in advance
- [ ] Set up ticket types with clear names
- [ ] Configure promo codes for early birds
- [ ] Test purchase flow end-to-end
- [ ] Train staff on check-in system
- [ ] Prepare backup devices

### During Event
- [ ] Keep check-in page open
- [ ] Monitor stats dashboard
- [ ] Use manual search for issues
- [ ] Keep devices charged
- [ ] Have customer support ready

### After Event
- [ ] Export attendee data
- [ ] Send post-event emails
- [ ] Analyze sales patterns
- [ ] Collect feedback

## 🐛 Quick Troubleshooting

**Payment not working?**
- Check Razorpay keys in `.env`
- Verify `NEXT_PUBLIC_` prefix on key ID
- Check browser console for errors

**Email not sending?**
- Verify SMTP credentials
- Use Gmail App Password (not regular password)
- Check spam folder

**QR not scanning?**
- Use manual search instead
- Verify QR code in email is visible
- Check internet connection

**TypeScript errors in IDE?**
- Run: `bunx prisma generate`
- Restart TypeScript server
- OR restart IDE

## 📚 Documentation

For detailed documentation, see:

1. **Complete System**: `docs/TICKETING_SYSTEM_COMPLETE.md`
2. **Public Purchase**: `docs/PUBLIC_TICKETING_IMPLEMENTATION.md`
3. **Check-In System**: `docs/QR_CHECKIN_SYSTEM.md`
4. **Implementation**: `docs/IMPLEMENTATION_SUMMARY.md`

## 🎉 You're Ready!

Your event ticketing system is **fully operational**. Start by:
1. ✅ Creating your first event
2. ✅ Adding ticket types
3. ✅ Testing the purchase flow
4. ✅ Trying the check-in system

**Need Help?** Check the detailed documentation in `docs/` folder.

---

**Happy Event Management! 🎫✨**
