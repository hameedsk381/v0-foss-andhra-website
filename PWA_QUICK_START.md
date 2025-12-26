# 🚀 PWA Quick Start Implementation Guide

This guide helps you implement the most critical PWA features quickly.

---

## Step 1: Enhanced Manifest.json

Update `public/manifest.json`:

```json
{
  "name": "FOSS Andhra - Free & Open Source Software Community",
  "short_name": "FOSS Andhra",
  "description": "Promoting free and open source software in education, governance, and society across Andhra Pradesh",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#015ba7",
  "theme_color": "#015ba7",
  "orientation": "any",
  "scope": "/",
  "categories": ["education", "community", "technology"],
  "icons": [
    {
      "src": "/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "shortcuts": [
    {
      "name": "Events",
      "short_name": "Events",
      "description": "Browse upcoming events",
      "url": "/events",
      "icons": [{ "src": "/icon-96x96.png", "sizes": "96x96" }]
    },
    {
      "name": "Blog",
      "short_name": "Blog",
      "description": "Read latest posts",
      "url": "/blog",
      "icons": [{ "src": "/icon-96x96.png", "sizes": "96x96" }]
    },
    {
      "name": "Member Portal",
      "short_name": "Portal",
      "description": "Access member dashboard",
      "url": "/member",
      "icons": [{ "src": "/icon-96x96.png", "sizes": "96x96" }]
    }
  ]
}
```

---

## Step 2: Service Worker Setup

### Install Workbox

```bash
bun add workbox-window workbox-precaching workbox-routing workbox-strategies workbox-background-sync
```

### Create Service Worker

Create `public/sw.js`:

```javascript
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { BackgroundSyncPlugin } from 'workbox-background-sync'

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST)

// Cache images with Cache First strategy
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      {
        cacheableResponse: {
          statuses: [0, 200],
        },
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      },
    ],
  })
)

// Cache API responses with Network First
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      {
        cacheableResponse: {
          statuses: [0, 200],
        },
        maxAgeSeconds: 5 * 60, // 5 minutes
      },
    ],
  })
)

// Cache pages with Stale While Revalidate
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new StaleWhileRevalidate({
    cacheName: 'pages-cache',
  })
)

// Background sync for form submissions
const bgSyncPlugin = new BackgroundSyncPlugin('form-queue', {
  maxRetentionTime: 24 * 60, // 24 hours
})

registerRoute(
  ({ url }) => url.pathname.includes('/api/') && ['POST', 'PUT', 'PATCH'].includes(event.request.method),
  new NetworkFirst({
    cacheName: 'forms-cache',
    plugins: [bgSyncPlugin],
  })
)

// Handle offline page
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/offline')
      })
    )
  }
})
```

### Register Service Worker

Create `app/register-sw.tsx`:

```typescript
"use client"

import { useEffect } from "react"

export function RegisterSW() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered:", registration)
          
          // Check for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  // New version available
                  if (confirm("New version available! Reload?")) {
                    window.location.reload()
                  }
                }
              })
            }
          })
        })
        .catch((error) => {
          console.error("SW registration failed:", error)
        })
    }
  }, [])

  return null
}
```

Add to `app/layout.tsx`:

```typescript
import { RegisterSW } from "./register-sw"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <RegisterSW />
      </body>
    </html>
  )
}
```

---

## Step 3: Install Prompt Component

Create `components/install-prompt.tsx`:

```typescript
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return
    }

    // Check if dismissed before
    const dismissed = localStorage.getItem("install-prompt-dismissed")
    if (dismissed) {
      const dismissedTime = parseInt(dismissed)
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24)
      if (daysSinceDismissed < 7) {
        return // Don't show if dismissed within 7 days
      }
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // iOS fallback
      toast({
        title: "Install Instructions",
        description: "Tap the share button and select 'Add to Home Screen'",
      })
      setShowPrompt(false)
      return
    }

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      toast({
        title: "Installing...",
        description: "The app is being installed",
      })
      // Track install event
      if (typeof window !== "undefined" && (window as any).gtag) {
        ;(window as any).gtag("event", "pwa_install")
      }
    }

    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    localStorage.setItem("install-prompt-dismissed", Date.now().toString())
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-4 z-50 animate-in slide-in-from-bottom">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">Install FOSS Andhra</h3>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Add to your home screen for quick access and offline support
      </p>
      <div className="flex gap-2">
        <Button onClick={handleInstall} className="flex-1">
          Install App
        </Button>
        <Button
          onClick={handleDismiss}
          variant="outline"
          className="flex-1"
        >
          Maybe Later
        </Button>
      </div>
    </div>
  )
}
```

Add to `app/layout.tsx`:

```typescript
import { InstallPrompt } from "@/components/install-prompt"

// In RootLayout:
<InstallPrompt />
```

---

## Step 4: Offline Page

Create `app/offline/page.tsx`:

```typescript
import { WifiOff, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <WifiOff className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold mb-2">You're Offline</h1>
        <p className="text-gray-600 mb-6">
          It looks like you're not connected to the internet. Check your
          connection and try again.
        </p>
        <div className="flex gap-2 justify-center">
          <Button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-6">
          Some pages may be available offline if you've visited them before.
        </p>
      </div>
    </div>
  )
}
```

---

## Step 5: Offline Indicator

Create `components/offline-indicator.tsx`:

```typescript
"use client"

import { useState, useEffect } from "react"
import { WifiOff } from "lucide-react"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-2 px-4 z-50 flex items-center justify-center gap-2">
      <WifiOff className="h-4 w-4" />
      <span className="text-sm font-medium">You're offline. Some features may be limited.</span>
    </div>
  )
}
```

Add to `app/layout.tsx`:

```typescript
import { OfflineIndicator } from "@/components/offline-indicator"

// In RootLayout:
<OfflineIndicator />
```

---

## Step 6: Update next.config.js

Add PWA configuration:

```javascript
const nextConfig = {
  // ... existing config
  
  // PWA support
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
      // ... existing headers
    ]
  },
}
```

---

## Step 7: Generate App Icons

You'll need to generate multiple icon sizes. Use a tool like:
- [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)

Required sizes:
- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192
- 384x384
- 512x512 (with maskable version)

---

## Step 8: Test PWA

1. **Build the app:**
   ```bash
   bun run build
   bun run start
   ```

2. **Test on Chrome DevTools:**
   - Open DevTools → Application tab
   - Check Service Workers
   - Check Manifest
   - Test offline mode

3. **Test on mobile:**
   - Android: Chrome → Menu → "Add to Home screen"
   - iOS: Safari → Share → "Add to Home Screen"

---

## Next Steps

After implementing these basics:

1. Add push notifications (see APP_ENHANCEMENT_PLAN.md)
2. Implement background sync
3. Add pull-to-refresh
4. Add native sharing
5. Optimize images and performance

---

## Troubleshooting

### Service Worker not registering
- Ensure HTTPS (or localhost)
- Check browser console for errors
- Verify sw.js is accessible at `/sw.js`

### Install prompt not showing
- Must be served over HTTPS
- User must have engagement (visited site 2+ times)
- Check `beforeinstallprompt` event is firing

### Offline page not showing
- Verify service worker is active
- Check fetch event handler
- Test in Network tab (set to Offline)

---

**Status:** Ready for implementation  
**Estimated Time:** 2-4 hours  
**Priority:** 🔴 HIGH

