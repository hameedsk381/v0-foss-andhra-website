# QR Code Check-In System

## Overview
The QR Code Check-In System provides a comprehensive solution for managing event attendee check-ins through QR code scanning and manual search.

## Features

### 1. **Real-Time Statistics**
- Total tickets sold
- Checked-in attendees with percentage
- Pending check-ins
- Cancelled tickets
- Auto-refreshing stats dashboard

### 2. **QR Code Scanning**
- Scan QR codes using barcode scanner hardware
- Paste QR code data manually
- Real-time validation and feedback
- Duplicate check-in prevention
- Event verification (ensures ticket belongs to correct event)

### 3. **Manual Search**
- Search by attendee name
- Search by email address
- Search by phone number
- Search by order number
- Display up to 20 matching results
- One-click manual check-in

### 4. **Recent Check-Ins**
- View last 10 checked-in attendees
- Shows check-in timestamp
- Displays ticket type and order number
- Real-time updates

## Implementation Details

### Frontend Component
**Location**: `/app/admin/events/[id]/check-in/page.tsx`

**Key Features**:
- Barcode scanner input field (auto-focus for hardware scanners)
- Manual search interface with real-time results
- Color-coded status badges (pending, checked-in, cancelled)
- Success/error message alerts with auto-dismiss
- Responsive grid layout for stats cards

**State Management**:
```typescript
- qrInput: QR code data input
- searchQuery: Manual search query
- stats: Check-in statistics
- recentCheckIns: Last 10 check-ins
- searchResults: Manual search results
- message: Success/error feedback
```

### API Endpoints

#### 1. **QR Code Check-In**
**Endpoint**: `POST /api/admin/events/[id]/check-in`

**Request Body**:
```json
{
  "qrData": "{\"eventId\":\"...\",\"orderId\":\"...\",\"ticketId\":\"...\",\"attendeeEmail\":\"...\"}"
}
```

**Response** (Success):
```json
{
  "success": true,
  "ticket": {
    "id": "ticket_id",
    "attendeeName": "John Doe",
    "checkInStatus": "checked_in",
    "checkInTime": "2025-10-20T10:30:00Z",
    "ticketType": { "name": "General Admission" },
    "order": { "orderNumber": "ORD-20251020-001" }
  }
}
```

**Validation Checks**:
- QR code data is valid JSON
- Ticket exists in database
- Ticket belongs to specified event
- Ticket is not cancelled
- Ticket is not already checked in

**Error Responses**:
- `400`: Invalid QR format, already checked in, cancelled ticket
- `403`: Ticket doesn't belong to this event
- `404`: Ticket not found
- `500`: Server error

#### 2. **Manual Check-In**
**Endpoint**: `POST /api/admin/events/[id]/check-in/manual`

**Request Body**:
```json
{
  "ticketId": "ticket_id"
}
```

**Same validation as QR check-in**

#### 3. **Statistics**
**Endpoint**: `GET /api/admin/events/[id]/check-in/stats`

**Response**:
```json
{
  "totalTickets": 150,
  "checkedIn": 87,
  "pending": 60,
  "cancelled": 3
}
```

#### 4. **Recent Check-Ins**
**Endpoint**: `GET /api/admin/events/[id]/check-in/recent`

**Response**: Array of last 10 checked-in tickets with details

#### 5. **Search Tickets**
**Endpoint**: `GET /api/admin/events/[id]/check-in/search?q=search_query`

**Search Fields**:
- attendeeName (case-insensitive)
- attendeeEmail (case-insensitive)
- attendeePhone (case-insensitive)
- order.orderNumber (case-insensitive)

**Returns**: Up to 20 matching tickets

### Database Schema

**EventTicket Fields Used**:
```prisma
model EventTicket {
  checkInStatus  String    @default("pending")  // "pending" | "checked_in" | "cancelled"
  checkInTime    DateTime?                       // Timestamp of check-in
  checkInBy      String?                         // Admin who performed check-in
}
```

**Status Flow**:
1. `pending` → Ticket purchased, awaiting check-in
2. `checked_in` → Attendee has arrived and been checked in
3. `cancelled` → Ticket has been cancelled/refunded

## Usage Guide

### For Event Organizers

#### Setting Up Check-In
1. Navigate to event details page
2. Click the "Check-In" button (with QR code icon)
3. Check-in interface opens with live statistics

#### Using Barcode Scanner
1. Focus the QR input field (auto-focused on load)
2. Scan attendee's QR code with barcode scanner
3. System automatically processes check-in
4. Success message displays with attendee name
5. Stats update in real-time
6. Ready for next scan

#### Manual Check-In
1. Use search box to find attendee
2. Type name, email, phone, or order number
3. Click "Search" or press Enter
4. Select attendee from results
5. Click "Check In" button
6. Confirmation displayed

#### Monitoring Check-Ins
- **Stats Cards**: View total tickets, checked-in count, pending, and cancelled
- **Recent Check-Ins**: Monitor last 10 check-ins with timestamps
- **Percentage**: See check-in completion percentage

### For Attendees

#### QR Code Location
- QR code is included in ticket confirmation email
- Each individual ticket has unique QR code
- QR code contains encrypted ticket data

#### At Event Entrance
1. Present QR code (email or printed)
2. Staff scans code
3. Instant validation
4. Entry granted if valid

## Security Features

### Validation Layers
1. **QR Code Integrity**: Must be valid JSON format
2. **Ticket Existence**: Ticket must exist in database
3. **Event Verification**: Ticket must belong to current event
4. **Status Check**: Cannot check in cancelled tickets
5. **Duplicate Prevention**: Cannot check in same ticket twice

### Error Handling
- **Already Checked In**: Shows when ticket was checked in previously
- **Wrong Event**: Prevents cross-event ticket usage
- **Cancelled Tickets**: Clear error message for cancelled tickets
- **Invalid QR**: Helpful error for corrupted QR codes

## Technical Considerations

### Performance
- Stats fetched on page load and after each check-in
- Recent check-ins limited to 10 for performance
- Search results capped at 20 tickets
- Auto-dismiss success messages (3 seconds)

### Real-Time Updates
```typescript
// After successful check-in:
fetchStats()         // Update statistics
fetchRecentCheckIns() // Refresh recent list
handleSearch()       // Update search results if applicable
```

### Mobile Optimization
- Responsive grid layout (4 columns → 1 column on mobile)
- Touch-friendly buttons and inputs
- Readable text sizes
- Optimized for tablet check-in stations

### Barcode Scanner Integration
```typescript
// Input field characteristics:
- autoFocus: true           // Auto-focus on load
- onKeyPress: Enter key     // Trigger on scanner input
- Type: text                // Accept any barcode format
```

## Best Practices

### Hardware Setup
1. **Recommended**: Use USB barcode scanner in "keyboard wedge" mode
2. **Position**: Place scanner near check-in desk
3. **Testing**: Test scanner with sample QR codes before event
4. **Backup**: Have manual search as fallback

### Staff Training
1. **Primary Method**: Train staff on barcode scanning
2. **Fallback**: Ensure staff know manual search process
3. **Troubleshooting**: Train on common error messages
4. **Speed**: Emphasize keeping input field focused

### Event Day Setup
1. Open check-in page before event starts
2. Test with sample ticket QR code
3. Verify stats display correctly
4. Keep device charged/plugged in
5. Ensure stable internet connection

## Future Enhancements

### Planned Features
- [ ] Offline mode with sync
- [ ] Mobile app for check-in
- [ ] Export check-in reports (CSV/PDF)
- [ ] Real-time analytics dashboard
- [ ] Multiple check-in stations sync
- [ ] Check-out functionality
- [ ] Session tracking
- [ ] Capacity warnings

### Integration Possibilities
- Badge printing integration
- SMS notifications on check-in
- Attendance certificates
- Post-event survey triggers

## Troubleshooting

### Common Issues

**QR Code Not Scanning**
- Solution: Use manual search by email/name
- Check if QR code is corrupted
- Verify barcode scanner is working

**"Already Checked In" Error**
- Check recent check-ins list for timestamp
- If duplicate scan, allow entry
- If different person, investigate potential fraud

**"Ticket Not Found" Error**
- Verify order was completed
- Check if searching correct event
- Contact support if order exists

**Stats Not Updating**
- Refresh page
- Check internet connection
- Verify API endpoints are responding

## API Error Codes Reference

| Code | Meaning | Action |
|------|---------|--------|
| 400 | Bad request (invalid data) | Check QR code format |
| 403 | Forbidden (wrong event) | Verify event ID |
| 404 | Ticket not found | Check order status |
| 500 | Server error | Contact technical support |

## Development Notes

### Testing Check-In Flow
```bash
# 1. Create test order with tickets
# 2. Copy QR code data from ticket
# 3. Paste into check-in interface
# 4. Verify successful check-in
# 5. Try scanning same QR again (should fail)
```

### QR Code Data Structure
```json
{
  "eventId": "event_id",
  "orderId": "order_id",
  "ticketId": "ticket_id",
  "attendeeEmail": "attendee@example.com"
}
```

### Database Queries Optimization
```typescript
// Stats query - optimized with select
prisma.eventTicket.findMany({
  where: { eventId },
  select: { checkInStatus: true }
})

// Search query - uses indexes
prisma.eventTicket.findMany({
  where: {
    OR: [
      { attendeeName: { contains: query, mode: "insensitive" } },
      // ... other fields
    ]
  },
  take: 20  // Limit results
})
```

## Conclusion

The QR Code Check-In System provides a robust, user-friendly solution for managing event attendee check-ins. With both automated QR scanning and manual search capabilities, it ensures smooth event operations while maintaining security and data integrity.
