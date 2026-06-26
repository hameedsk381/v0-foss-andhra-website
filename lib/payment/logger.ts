/**
 * Payment audit logger.
 * Writes to stdout (picked up by log aggregators in production) and
 * optionally persists to the DB PaymentLog table when it exists.
 */

export interface PaymentLogEntry {
  event: string
  paymentId?: string
  donationId?: string
  membershipId?: string
  email?: string
  metadata?: Record<string, unknown>
}

export async function logPaymentEvent(entry: PaymentLogEntry): Promise<void> {
  const record = {
    ts: new Date().toISOString(),
    ...entry,
  }

  // Always emit a structured log line (stdout → log aggregator in prod).
  console.log(`[payment-audit] ${JSON.stringify(record)}`)

  // Best-effort DB write — import lazily so callers don't break if DB is down.
  try {
    const { prisma } = await import("@/lib/prisma")
    // @ts-ignore — PaymentLog may not exist yet in all environments
    if (typeof (prisma as any).paymentLog?.create === "function") {
      await (prisma as any).paymentLog.create({
        data: {
          event: entry.event,
          paymentId: entry.paymentId ?? null,
          donationId: entry.donationId ?? null,
          membershipId: entry.membershipId ?? null,
          email: entry.email ?? null,
          metadata: entry.metadata ? JSON.stringify(entry.metadata) : null,
        },
      })
    }
  } catch {
    // DB persistence is non-critical; stdout log is the source of truth.
  }
}
