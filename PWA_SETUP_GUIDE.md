# 🚀 PWA Setup Guide

Quick setup guide for PWA features (Phase 1 & 2).

---

## Prerequisites

- ✅ Node.js/Bun installed
- ✅ Database configured
- ✅ HTTPS enabled (for production)

---

## Step 1: Generate VAPID Keys (Required for Push Notifications)

```bash
bun run generate:vapid
```

Copy the output and add to your `.env` file:

```env
VAPID_PUBLIC_KEY=your_public_key_here
VAPID_PRIVATE_KEY=your_private_key_here
VAPID_EMAIL=mailto:info@fossandhra.org
```

⚠️ **Important:** Never commit the private key to version control!

---

## Step 2: Run Database Migration

```bash
bunx prisma migrate dev --name add_push_subscriptions
```

This adds the `PushSubscription` model to your database.

---

## Step 3: Generate App Icons

You need multiple icon sizes for the PWA manifest. Use one of these tools:

- [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)

Required sizes:
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

Place all icons in `/public` directory.

---

## Step 4: Test the Implementation

### Development

```bash
# Start dev server
bun run dev

# Open Chrome DevTools
# Go to Application tab
# Check:
#   - Service Workers (should be registered)
#   - Manifest (should validate)
#   - Storage (caches should exist)
```

### Test Offline Mode

1. Open Chrome DevTools
2. Go to Network tab
3. Select "Offline"
4. Navigate to different pages
5. Should see cached pages or offline page

### Test Push Notifications

1. Go to `/member/settings`
2. Click "Enable Notifications"
3. Allow browser permission
4. Go to `/admin/notifications/push`
5. Send a test notification
6. Should receive notification on device

---

## Step 5: Production Deployment

### Environment Variables

Ensure these are set in production:

```env
# PWA
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
VAPID_EMAIL=mailto:info@fossandhra.org

# Database (existing)
DATABASE_URL=...

# Auth (existing)
NEXTAUTH_URL=https://fossandhra.org
NEXTAUTH_SECRET=...
```

### Build & Deploy

```bash
# Build
bun run build

# Start
bun run start
```

### Verify PWA

1. Visit site on mobile device
2. Should see "Add to Home Screen" prompt
3. Install the app
4. Test offline functionality
5. Test push notifications

---

## Troubleshooting

### Service Worker Not Registering

- ✅ Check HTTPS (required for production)
- ✅ Check browser console for errors
- ✅ Verify `/sw.js` is accessible
- ✅ Check `next.config.js` headers

### Push Notifications Not Working

- ✅ Verify VAPID keys are set in `.env`
- ✅ Check database migration completed
- ✅ Verify user has subscribed
- ✅ Check browser supports push (Chrome, Firefox, Edge)
- ✅ Check browser permissions

### Offline Mode Not Working

- ✅ Verify service worker is active
- ✅ Check cache is populated
- ✅ Test in Network tab (set to Offline)
- ✅ Clear cache and retry

### Install Prompt Not Showing

- ✅ Must be served over HTTPS
- ✅ User must visit site 2+ times
- ✅ Check `beforeinstallprompt` event in console
- ✅ Verify manifest.json is valid

---

## Features Overview

### Phase 1 ✅
- ✅ Service Worker
- ✅ Offline Support
- ✅ Install Prompt
- ✅ Enhanced Manifest
- ✅ Offline Page

### Phase 2 ✅
- ✅ Push Notifications
- ✅ Background Sync
- ✅ Admin Notification Panel
- ✅ Performance Optimizations
- ✅ Lazy Image Loading

---

## Next Steps

1. **Generate VAPID keys** (if not done)
2. **Run database migration**
3. **Generate app icons**
4. **Test all features**
5. **Deploy to production**

---

## Support

For issues or questions:
- Check `PWA_PHASE1_COMPLETE.md`
- Check `PWA_PHASE2_COMPLETE.md`
- Review browser console for errors
- Test in Chrome DevTools

---

**Status:** Ready for Production  
**Last Updated:** January 2025

