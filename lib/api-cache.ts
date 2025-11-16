import { NextResponse } from 'next/server'

interface CacheEntry {
  data: any
  timestamp: number
  etag: string
}

const cache = new Map<string, CacheEntry>()

export interface CacheOptions {
  ttl?: number // Time to live in seconds
  revalidate?: number // Revalidate after seconds (for stale-while-revalidate)
}

// Generate ETag from data
function generateETag(data: any): string {
  const str = JSON.stringify(data)
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return `"${hash.toString(36)}"`
}

// Cache middleware for API routes
export function withCache(
  key: string,
  handler: () => Promise<any>,
  options: CacheOptions = {}
): Promise<NextResponse> {
  const { ttl = 60, revalidate = ttl } = options

  return new Promise(async (resolve) => {
    const now = Date.now()
    const cached = cache.get(key)

    // Check if cache is still fresh
    if (cached && now - cached.timestamp < ttl * 1000) {
      const response = NextResponse.json(cached.data)
      response.headers.set('X-Cache', 'HIT')
      response.headers.set('ETag', cached.etag)
      response.headers.set('Cache-Control', `public, max-age=${ttl}, stale-while-revalidate=${revalidate}`)
      resolve(response)
      return
    }

    // Cache miss or stale - fetch new data
    try {
      const data = await handler()
      const etag = generateETag(data)

      cache.set(key, {
        data,
        timestamp: now,
        etag,
      })

      const response = NextResponse.json(data)
      response.headers.set('X-Cache', cached ? 'STALE' : 'MISS')
      response.headers.set('ETag', etag)
      response.headers.set('Cache-Control', `public, max-age=${ttl}, stale-while-revalidate=${revalidate}`)
      resolve(response)
    } catch (error) {
      // If fetch fails and we have stale cache, serve it
      if (cached) {
        const response = NextResponse.json(cached.data)
        response.headers.set('X-Cache', 'STALE-ERROR')
        response.headers.set('ETag', cached.etag)
        resolve(response)
      } else {
        throw error
      }
    }
  })
}

// Clear cache for a specific key
export function clearCache(key: string): void {
  cache.delete(key)
}

// Clear all cache
export function clearAllCache(): void {
  cache.clear()
}

// Get cache stats
export function getCacheStats() {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
  }
}

// Cleanup old cache entries (call periodically)
export function cleanupCache(maxAge: number = 3600000): void {
  const now = Date.now()
  for (const [key, entry] of cache.entries()) {
    if (now - entry.timestamp > maxAge) {
      cache.delete(key)
    }
  }
}
