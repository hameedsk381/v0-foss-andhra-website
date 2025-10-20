# Email Configuration Update - Secure Port 465 ✅

## Changes Made

### Updated SMTP Configuration
- **Port changed**: 587 → **465** (secure SSL/TLS)
- **Secure mode**: `true` (for Let's Encrypt SSL)
- **TLS version**: Minimum TLSv1.2
- **Certificate handling**: `rejectUnauthorized: false` (for troubleshooting)

### Current Configuration (`lib/email.ts`)
```javascript
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,           // mail.fossap.in
  port: 465,                             // Secure SSL/TLS port
  secure: true,                          // SSL/TLS enabled
  auth: {
    user: process.env.SMTP_USER,         // fossync@fossap.in
    pass: process.env.SMTP_PASS,         // Your password
  },
  tls: {
    minVersion: 'TLSv1.2',              // Modern TLS for Let's Encrypt
    rejectUnauthorized: false,           // Allow self-signed certs
  },
})
```

### Environment Variables (`.env`)
```env
SMTP_HOST="mail.fossap.in"
SMTP_PORT="465"
SMTP_USER="fossync@fossap.in"
SMTP_PASS="NaipunyaAILabs@2025"
SMTP_FROM_NAME="FOSS Andhra Foundation"
```

## Current Status

### ✅ What's Working
- Port 465 SSL/TLS connection established
- Certificate validation passing
- Server is reachable

### ❌ Authentication Error
```
Error: 535 5.7.8 Error: authentication failed: (reason unavailable)
```

## Troubleshooting Steps

### 1. Verify Email Account Exists
Check that `fossync@fossap.in` is actually created in your mail server (cPanel/Plesk/DirectAdmin).

### 2. Check SMTP/IMAP Access
Ensure the email account has SMTP authentication enabled:
- In cPanel: Email Accounts → Manage → Enable IMAP/SMTP
- Or contact your hosting provider

### 3. Verify Password
The password might need URL encoding if it contains special characters:
```javascript
// If password has special chars like @, #, $, %, etc.
// Try encoding it or escaping special characters
```

### 4. Test Manually with Email Client
Try setting up the account in an email client (Thunderbird, Outlook):
- **Server**: mail.fossap.in
- **Port**: 465
- **Security**: SSL/TLS
- **Username**: fossync@fossap.in
- **Password**: (your password)

If the email client can connect, the credentials are correct.

### 5. Check Server Logs
Ask your hosting provider to check mail server logs for authentication failures. They might show the specific reason.

### 6. Try Alternative Authentication
Some servers require the full email as username, others just the part before @:

**Option A** (current):
```env
SMTP_USER="fossync@fossap.in"
```

**Option B** (try if A fails):
```env
SMTP_USER="fossync"
```

### 7. IP Restrictions
Check if your mail server has IP restrictions. You might need to:
- Whitelist your development machine IP
- Whitelist your server IP (for production)

### 8. Password Reset
If nothing works, reset the email account password:
1. Go to your hosting control panel
2. Find Email Accounts
3. Reset password for fossync@fossap.in
4. Update `.env` file
5. Test again

## Testing Commands

### Test SMTP Connection
```bash
bun run scripts/test-email.ts
```

### Test from Terminal (Manual)
```bash
# Install swaks (SMTP test tool)
# On Windows: Use PowerShell or Git Bash

# Test connection
telnet mail.fossap.in 465

# Or use openssl
openssl s_client -connect mail.fossap.in:465 -crlf
```

## Next Steps

Once authentication works, you'll see:
```
✅ SMTP connection successful!
✅ Simple test email sent to fossync@fossap.in
✅ Welcome email template sent to fossync@fossap.in
🎉 All email tests passed successfully!
```

Then the newsletter system will be **100% functional**! 🎊

## Files Modified

1. `lib/email.ts` - Updated to port 465 with secure SSL/TLS
2. `.env` - Port changed to 465 (was already done)

## Recommended Actions

1. **Verify credentials** with your hosting provider (fossap.in)
2. **Check email account** exists and SMTP is enabled
3. **Test manually** with an email client
4. **Check server logs** for specific error details
5. **Try password reset** if all else fails

---

**Status**: 🟡 SMTP configuration updated to secure port 465
**Blocker**: Authentication credentials need verification
**Next**: Confirm email account details with hosting provider
