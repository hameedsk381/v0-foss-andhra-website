import { NextRequest } from 'next/server'
import crypto from 'crypto'

const CSRF_TOKEN_HEADER = 'x-csrf-token'
const CSRF_SECRET_COOKIE = '_csrf'

// Generate CSRF token
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Verify CSRF token
export function verifyCsrfToken(request: NextRequest): boolean {
  const token = request.headers.get(CSRF_TOKEN_HEADER)
  const cookie = request.cookies.get(CSRF_SECRET_COOKIE)

  if (!token || !cookie) {
    return false
  }

  // Simple comparison - in production, use a more secure method
  return token === cookie.value
}

// Check if request needs CSRF protection
export function needsCsrfProtection(request: NextRequest): boolean {
  const method = request.method
  const path = request.nextUrl.pathname

  // Only protect state-changing methods
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    return false
  }

  // Skip CSRF for API routes that use other auth methods
  if (path.startsWith('/api/auth')) {
    return false
  }

  // Skip for public endpoints that use rate limiting
  const publicEndpoints = [
    '/api/newsletter/subscribe',
    '/api/volunteers',
    '/api/payment/create-order',
  ]

  if (publicEndpoints.some((endpoint) => path.startsWith(endpoint))) {
    return false
  }

  return true
}
