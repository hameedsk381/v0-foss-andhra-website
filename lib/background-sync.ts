/**
 * Background Sync Utility
 * Queues requests to be synced when connection is restored
 */

const SYNC_QUEUE_KEY = "background-sync-queue"

export interface QueuedRequest {
  id: string
  url: string
  method: string
  headers: Record<string, string>
  body?: any
  timestamp: number
  retries: number
}

/**
 * Queue a request for background sync
 */
export async function queueRequest(
  url: string,
  options: RequestInit = {}
): Promise<void> {
  if (typeof window === "undefined") return

  const queue = getQueue()
  const request: QueuedRequest = {
    id: `${Date.now()}-${Math.random()}`,
    url,
    method: options.method || "GET",
    headers: (options.headers as Record<string, string>) || {},
    body: options.body ? JSON.parse(options.body as string) : undefined,
    timestamp: Date.now(),
    retries: 0,
  }

  queue.push(request)
  saveQueue(queue)

  // Register sync event if supported
  if ("serviceWorker" in navigator && "sync" in (navigator as any)) {
    const registration = await navigator.serviceWorker.ready
    if ("sync" in registration) {
      try {
        await (registration as any).sync.register("sync-forms")
      } catch (error) {
        console.error("Failed to register sync:", error)
      }
    }
  }
}

/**
 * Get queued requests
 */
export function getQueue(): QueuedRequest[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(SYNC_QUEUE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

/**
 * Save queue to localStorage
 */
function saveQueue(queue: QueuedRequest[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue))
  } catch (error) {
    console.error("Failed to save queue:", error)
  }
}

/**
 * Process queued requests
 */
export async function processQueue(): Promise<void> {
  const queue = getQueue()
  if (queue.length === 0) return

  const processed: string[] = []
  const failed: QueuedRequest[] = []

  for (const request of queue) {
    try {
      const response = await fetch(request.url, {
        method: request.method,
        headers: {
          "Content-Type": "application/json",
          ...request.headers,
        },
        body: request.body ? JSON.stringify(request.body) : undefined,
      })

      if (response.ok) {
        processed.push(request.id)
      } else {
        // Retry logic
        if (request.retries < 3) {
          request.retries++
          failed.push(request)
        } else {
          processed.push(request.id) // Remove after max retries
        }
      }
    } catch (error) {
      // Network error - keep in queue
      if (request.retries < 3) {
        request.retries++
        failed.push(request)
      } else {
        processed.push(request.id) // Remove after max retries
      }
    }
  }

  // Remove processed requests
  const remaining = queue.filter((r) => !processed.includes(r.id))
  const updated = [...remaining, ...failed]
  saveQueue(updated)
}

/**
 * Clear queue
 */
export function clearQueue(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(SYNC_QUEUE_KEY)
}

/**
 * Get queue size
 */
export function getQueueSize(): number {
  return getQueue().length
}

