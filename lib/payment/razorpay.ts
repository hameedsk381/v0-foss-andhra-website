import crypto from "crypto"
import { prisma } from "@/lib/prisma"

const RAZORPAY_SETTINGS_KEYS = {
  keyId: "razorpayKeyId",
  keySecret: "razorpayKeySecret",
  webhookSecret: "razorpayWebhookSecret",
} as const

const NOTE_VALUE_MAX_LENGTH = 250
const RAZORPAY_API_TIMEOUT_MS = 15_000

export interface RazorpayRuntimeConfig {
  keyId: string
  keySecret?: string
  webhookSecret?: string
}

interface RuntimeConfigOptions {
  requireSecret?: boolean
  requireWebhookSecret?: boolean
}

export interface CreateRazorpayOrderInput {
  amountInPaise: number
  currency: string
  receipt: string
  notes?: Record<string, string>
}

// Minimal shape we rely on from a Razorpay order response.
interface RazorpayOrderResponse {
  id: string
  amount: number
  currency: string
  receipt: string
  status: string
}

function normalize(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed && trimmed.length > 0 ? trimmed : undefined
}

function sanitizeNotes(notes?: Record<string, string>): Record<string, string> | undefined {
  if (!notes) return undefined

  const sanitizedEntries = Object.entries(notes)
    .filter(([, value]) => typeof value === "string")
    .map(([key, value]) => [key, value.slice(0, NOTE_VALUE_MAX_LENGTH)] as const)

  return sanitizedEntries.length === 0 ? undefined : Object.fromEntries(sanitizedEntries)
}

function validateRazorpayOrderResponse(data: unknown): RazorpayOrderResponse {
  if (!data || typeof data !== "object") {
    throw new Error("Razorpay returned an unexpected response format")
  }
  const obj = data as Record<string, unknown>
  if (typeof obj.id !== "string" || !obj.id) {
    throw new Error("Razorpay response missing order id")
  }
  if (typeof obj.amount !== "number") {
    throw new Error("Razorpay response missing amount")
  }
  if (typeof obj.currency !== "string") {
    throw new Error("Razorpay response missing currency")
  }
  return {
    id: obj.id,
    amount: obj.amount,
    currency: obj.currency,
    receipt: typeof obj.receipt === "string" ? obj.receipt : "",
    status: typeof obj.status === "string" ? obj.status : "",
  }
}

async function loadRazorpaySettings() {
  const keys = Object.values(RAZORPAY_SETTINGS_KEYS)
  const settings = await prisma.settings.findMany({ where: { key: { in: keys } } })
  return settings.reduce<Record<string, string>>((acc, s) => {
    acc[s.key] = s.value
    return acc
  }, {})
}

export async function getRazorpayRuntimeConfig(
  options: RuntimeConfigOptions = {},
): Promise<RazorpayRuntimeConfig> {
  const { requireSecret = true, requireWebhookSecret = false } = options
  const settings = await loadRazorpaySettings()

  const keyId =
    normalize(settings[RAZORPAY_SETTINGS_KEYS.keyId]) ?? normalize(process.env.RAZORPAY_KEY_ID)
  const keySecret =
    normalize(settings[RAZORPAY_SETTINGS_KEYS.keySecret]) ?? normalize(process.env.RAZORPAY_KEY_SECRET)
  const webhookSecret =
    normalize(settings[RAZORPAY_SETTINGS_KEYS.webhookSecret]) ??
    normalize(process.env.RAZORPAY_WEBHOOK_SECRET)

  if (!keyId) throw new Error("Razorpay Key ID is not configured")
  if (requireSecret && !keySecret) throw new Error("Razorpay Key Secret is not configured")
  if (requireWebhookSecret && !webhookSecret) {
    throw new Error("Razorpay Webhook Secret is not configured")
  }

  return { keyId, keySecret, webhookSecret }
}

export async function createRazorpayOrder(input: CreateRazorpayOrderInput) {
  if (input.amountInPaise < 100) {
    throw new Error("Order amount must be at least ₹1 (100 paise)")
  }

  const { keyId, keySecret } = await getRazorpayRuntimeConfig({ requireSecret: true })

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), RAZORPAY_API_TIMEOUT_MS)

  let response: Response
  try {
    response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
      },
      body: JSON.stringify({
        amount: input.amountInPaise,
        currency: input.currency,
        receipt: input.receipt,
        notes: sanitizeNotes(input.notes),
      }),
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timer)
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => "(no body)")
    throw new Error(`Razorpay order creation failed (${response.status}): ${errorText}`)
  }

  const order = validateRazorpayOrderResponse(await response.json())

  // Verify Razorpay echoed back the correct amount — defence against MITM / API bugs.
  if (order.amount !== input.amountInPaise) {
    throw new Error(
      `Razorpay order amount mismatch: sent ${input.amountInPaise} paise, got ${order.amount}`,
    )
  }

  return { keyId, order }
}

export function verifyRazorpayPaymentSignature(params: {
  orderId: string
  paymentId: string
  signature: string
  keySecret: string
}): boolean {
  const computed = crypto
    .createHmac("sha256", params.keySecret)
    .update(`${params.orderId}|${params.paymentId}`)
    .digest("hex")

  // Constant-time comparison prevents timing-based attacks.
  try {
    return crypto.timingSafeEqual(Buffer.from(computed, "hex"), Buffer.from(params.signature, "hex"))
  } catch {
    // Buffer lengths differ → signatures can't match.
    return false
  }
}

export function verifyRazorpayWebhookSignature(params: {
  body: string
  signature: string
  webhookSecret: string
}): boolean {
  const computed = crypto
    .createHmac("sha256", params.webhookSecret)
    .update(params.body)
    .digest("hex")

  try {
    return crypto.timingSafeEqual(
      Buffer.from(computed, "hex"),
      Buffer.from(params.signature, "hex"),
    )
  } catch {
    return false
  }
}
