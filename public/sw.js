// Service Worker for FOSS Andhra PWA
const CACHE_NAME = 'foss-andhra-v1'
const OFFLINE_URL = '/offline'

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...')
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/offline',
        '/events',
        '/blog',
        '/manifest.json',
      ])
    })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  return self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Return cached version if available
      if (cachedResponse) {
        return cachedResponse
      }

      // Otherwise fetch from network
      return fetch(request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }

          // Clone the response
          const responseToCache = response.clone()

          // Cache images and static assets
          if (
            request.destination === 'image' ||
            request.destination === 'script' ||
            request.destination === 'style' ||
            url.pathname.startsWith('/_next/static')
          ) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache)
            })
          }

          return response
        })
        .catch(() => {
          // If fetch fails and it's a navigation request, show offline page
          if (request.mode === 'navigate') {
            return caches.match(OFFLINE_URL)
          }
        })
    })
  )
})

// Background sync for form submissions (basic implementation)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-forms') {
    event.waitUntil(syncForms())
  }
})

async function syncForms() {
  // This would sync queued form submissions
  // Implementation depends on your form submission logic
  console.log('[SW] Syncing forms...')
}

// Push notification handler
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received')
  
  let notificationData = {
    title: 'FOSS Andhra',
    body: 'You have a new notification',
    icon: '/icon-192x192.png',
    badge: '/icon-96x96.png',
    url: '/',
    data: { url: '/' }
  }

  if (event.data) {
    try {
      const data = event.data.json()
      notificationData = {
        title: data.title || notificationData.title,
        body: data.body || notificationData.body,
        icon: data.icon || notificationData.icon,
        badge: data.badge || notificationData.badge,
        url: data.url || data.data?.url || notificationData.url,
        data: data.data || { url: data.url || '/' }
      }
    } catch (e) {
      console.error('[SW] Error parsing push data:', e)
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      data: notificationData.data,
      tag: notificationData.data?.type || 'general',
      requireInteraction: false,
      vibrate: [200, 100, 200],
      actions: [
        {
          action: 'open',
          title: 'Open',
        },
        {
          action: 'close',
          title: 'Close',
        }
      ]
    })
  )
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const action = event.action
  const url = event.notification.data?.url || '/'

  if (action === 'close') {
    return
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window open
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i]
        if (client.url === url && 'focus' in client) {
          return client.focus()
        }
      }
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})

// Background sync for form submissions
const SYNC_QUEUE = 'form-sync-queue'

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-forms') {
    event.waitUntil(syncForms())
  }
})

async function syncForms() {
  try {
    const cache = await caches.open(SYNC_QUEUE)
    const requests = await cache.keys()
    
    for (const request of requests) {
      try {
        const response = await fetch(request)
        if (response.ok) {
          await cache.delete(request)
          console.log('[SW] Synced form:', request.url)
        }
      } catch (error) {
        console.error('[SW] Failed to sync form:', error)
        // Keep in queue for next sync
      }
    }
  } catch (error) {
    console.error('[SW] Error syncing forms:', error)
  }
}

// Helper function to queue form submission
async function queueFormSubmission(url, options) {
  const cache = await caches.open(SYNC_QUEUE)
  await cache.put(url, new Response(JSON.stringify(options)))
  
  // Register sync event
  if ('sync' in self.registration) {
    await self.registration.sync.register('sync-forms')
  }
}

