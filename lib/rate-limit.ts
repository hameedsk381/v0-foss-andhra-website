import { NextRequest, NextResponse } from 'next/server'
import { logWarning } from './logger'

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

export interface RateLimitConfig {
  uniqueTokenPerInterval?: number
  interval?: number
}

export function rateLimit(options: RateLimitConfig = {}) {
  const tokenCount = options.uniqueTokenPerInterval || 500
  const interval = options.interval || 60000 // 1 minute default

  return {
    check: (req: NextRequest, limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const now = Date.now()
        const tokenKey = `${token}_${Math.floor(now / interval)}`

        if (!store[tokenKey]) {
          store[tokenKey] = {
            count: 0,
            resetTime: now + interval,
          }
        }

        const current = store[tokenKey]

        if (current.count >= limit) {
          logWarning('Rate limit exceeded', {
            token,
            count: current.count,
            limit,
            ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
          })
          
          reject(
            NextResponse.json(
              { error: 'Too many requests. Please try again later.' },
              { 
                status: 429,
                headers: {
                  'Retry-After': String(Math.ceil((current.resetTime - now) / 1000)),
                  'X-RateLimit-Limit': String(limit),
                  'X-RateLimit-Remaining': '0',
                  'X-RateLimit-Reset': String(current.resetTime),
                }
              }
            )
          )
        } else {
          current.count++
          resolve()
        }

        // Cleanup old entries
        Object.keys(store).forEach((key) => {
          if (store[key].resetTime < now) {
            delete store[key]
          }
        })
      }),
  }
}

// Get rate limit identifier from request
export function getRateLimitIdentifier(req: NextRequest): string {
  // Try to get IP from various headers
  const forwarded = req.headers.get('x-forwarded-for')
  const realIp = req.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0] || realIp || 'unknown'
  
  return ip
}

// Pre-configured rate limiters
export const strictRateLimit = rateLimit({ uniqueTokenPerInterval: 100, interval: 60000 }) // 100 requests per minute
export const moderateRateLimit = rateLimit({ uniqueTokenPerInterval: 500, interval: 60000 }) // 500 requests per minute
export const lenientRateLimit = rateLimit({ uniqueTokenPerInterval: 1000, interval: 60000 }) // 1000 requests per minute
