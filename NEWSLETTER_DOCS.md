# Newsletter System Documentation

## Overview

The newsletter system allows FOSS Andhra to manage email subscriptions and send newsletters to subscribers using your own SMTP email server (fossync@fossap.in).

## Features

✅ Public subscription form (can be embedded anywhere)
✅ Admin dashboard for managing subscribers
✅ Rich text email composer with HTML support
✅ Test email functionality
✅ Batch sending to avoid rate limiting
✅ Subscriber management (view, delete)
✅ Unsubscribe functionality with public page
✅ Welcome email automation
✅ Beautiful email templates
✅ Active/Inactive subscriber tracking

## Configuration

### Email Server (Already Configured)

Your `.env` file contains:
```env
SMTP_HOST="mail.fossap.in"
SMTP_PORT="587"
SMTP_USER="fossync@fossap.in"
SMTP_PASS="NaipunyaAILabs@2025"
SMTP_FROM_NAME="FOSS Andhra Foundation"
```

## Usage

### For Administrators

#### Access Newsletter Dashboard
1. Login to admin panel: `/admin`
2. Click "Newsletter" in sidebar
3. View subscriber stats and compose newsletters

#### Send Newsletter
1. Go to "Compose Newsletter" tab
2. Enter subject line
3. Compose content using rich text editor
4. (Optional) Send test email first
5. Click "Send to X Subscribers"
6. Emails are sent in batches of 50 to avoid rate limiting

#### Manage Subscribers
1. Go to "Subscribers" tab
2. View all active and unsubscribed users
3. Delete subscribers if needed
4. Export subscriber list (future feature)

### For Website Visitors

#### Subscribe to Newsletter
Use the `NewsletterSubscription` component anywhere on the site:

```tsx
import NewsletterSubscription from '@/components/newsletter-subscription'

export default function MyPage() {
  return (
    <div>
      <NewsletterSubscription />
    </div>
  )
}
```

#### Unsubscribe
Users can click the unsubscribe link in any newsletter email, which takes them to `/newsletter/unsubscribe?email=...`

## API Endpoints

### Public Endpoints

**POST /api/newsletter/subscribe**
- Subscribe to newsletter
- Body: `{ email: string, name?: string }`
- Sends welcome email automatically

**GET /api/newsletter/unsubscribe**
- Unsubscribe from newsletter
- Query params: `email` or `token`

### Admin Endpoints (Require Authentication)

**GET /api/admin/newsletter/subscribers**
- List all subscribers
- Query params: `status` (active|unsubscribed|all)

**POST /api/admin/newsletter/subscribers**
- Add new subscriber (admin)

**DELETE /api/admin/newsletter/subscribers**
- Delete subscriber
- Query params: `id`

**POST /api/admin/newsletter/send**
- Send newsletter
- Body: `{ subject: string, content: string, testEmail?: string }`

## Email Templates

### Welcome Email
Automatically sent when someone subscribes:
- Branded header with gradient
- Welcome message
- Links to blog and programs
- Social media links
- Unsubscribe link

### Newsletter Email
- Custom subject line
- Rich HTML content (from admin editor)
- Branded header and footer
- Social media links
- Unsubscribe link
- Responsive design

## Database Schema

```prisma
model Subscriber {
  id             String    @id @default(cuid())
  email          String    @unique
  name           String?
  status         String    @default("active")
  subscribedAt   DateTime  @default(now())
  unsubscribedAt DateTime?
}
```

## Best Practices

### For Sending Newsletters

1. **Always send a test email first** to verify formatting
2. **Write compelling subject lines** (50-60 characters)
3. **Keep content concise** and scannable
4. **Include clear CTAs** (Call-to-Actions)
5. **Test on mobile** (emails are responsive)
6. **Send at optimal times** (Tuesday-Thursday, 10 AM - 2 PM IST)
7. **Monitor unsubscribe rates** (>2% may indicate issues)

### For Content

- Use headings (H2, H3) to structure content
- Include images with alt text
- Keep paragraphs short (2-3 sentences)
- Use bullet points for lists
- Always include a clear next step/CTA
- Personalize when possible

### For Deliverability

- Don't send too frequently (max 1-2 per week)
- Avoid spam trigger words
- Include physical address in footer (future enhancement)
- Monitor bounce rates
- Clean subscriber list regularly

## Technical Details

### Batch Sending

Newsletters are sent in batches of 50 to avoid:
- SMTP rate limiting
- Email server blacklisting
- Network timeouts

Batches have 1-second delay between them.

### Error Handling

- Failed emails are logged but don't stop the process
- Success/failure counts are returned
- Individual subscriber failures don't affect others

### Security

- Admin endpoints require authentication (NextAuth)
- Public subscription validates email format
- Prevents duplicate active subscriptions
- No sensitive data in URLs (use tokens for unsubscribe)

## Future Enhancements

- [ ] Newsletter templates library
- [ ] Subscriber segments/tags
- [ ] A/B testing
- [ ] Open/click tracking
- [ ] Scheduled sending
- [ ] Draft newsletters
- [ ] Import/Export subscribers
- [ ] Email analytics dashboard
- [ ] RSS-to-Email automation
- [ ] Personalization tokens

## Troubleshooting

### Emails Not Sending

1. Check SMTP credentials in `.env`
2. Verify SMTP server is accessible
3. Check server logs for errors
4. Test SMTP connection:
   ```bash
   bun run scripts/test-email.ts
   ```

### Welcome Emails Not Received

1. Check spam/junk folder
2. Verify SMTP_FROM email is valid
3. Check email server reputation
4. Look for errors in server logs

### Unsubscribe Not Working

1. Verify email parameter is passed correctly
2. Check subscriber exists in database
3. Ensure unsubscribe route is accessible

## Support

For issues or questions:
- Contact: admin@fossandhra.org
- Repository: https://github.com/fossandhra/website
- Documentation: /docs/newsletter

---

**Last Updated:** 2025-01-19
**Version:** 1.0.0
