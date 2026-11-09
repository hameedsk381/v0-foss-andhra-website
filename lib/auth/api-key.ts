import crypto from "crypto"

/**
 * Content API key, set in .env as CONTENT_API_KEY (at least 32 characters).
 * Send it as `Authorization: Bearer <key>` (or `x-api-key: <key>`).
 * It grants FULL admin access to every admin API route (treat it like the admin password).
 */
export function getContentApiKey(): string | null {
  const key = process.env.CONTENT_API_KEY?.trim()
  if (!key) return null
  if (key.length < 32 || /^(replace-with|change-me)/i.test(key)) {
    console.warn("CONTENT_API_KEY is a placeholder or shorter than 32 characters; API key access is disabled.")
    return null
  }
  return key
}

function digest(value: string) {
  return crypto.createHash("sha256").update(value).digest()
}

/** Returns the presented key from the request headers, if any. */
export function readPresentedKey(headers: Headers): string | null {
  const auth = headers.get("authorization")
  if (auth && /^bearer\s+/i.test(auth)) return auth.replace(/^bearer\s+/i, "").trim() || null
  return headers.get("x-api-key")?.trim() || null
}

export function isValidContentApiKey(presented: string | null): boolean {
  const key = getContentApiKey()
  if (!key || !presented) return false
  return crypto.timingSafeEqual(digest(presented), digest(key))
}
