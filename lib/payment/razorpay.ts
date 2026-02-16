import crypto from "crypto"
import { prisma } from "@/lib/prisma"

const RAZORPAY_SETTINGS_KEYS = {
  keyId: "razorpayKeyId",
  keySecret: "razorpayKeySecret",
  webhookSecret: "razorpayWebhookSecret",
} as const

const NOTE_VALUE_MAX_LENGTH = 250

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

function normalize(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed && trimmed.length > 0 ? trimmed : undefined
}

function sanitizeNotes(notes?: Record<string, string>): Record<string, string> | undefined {
  if (!notes) {
    return undefined
  }

  const sanitizedEntries = Object.entries(notes)
    .filter(([, value]) => typeof value === "string")
    .map(([key, value]) => [key, value.slice(0, NOTE_VALUE_MAX_LENGTH)] as const)

  if (sanitizedEntries.length === 0) {
    return undefined
  }

  return Object.fromEntries(sanitizedEntries)
}

async function loadRazorpaySettings() {
  const keys = Object.values(RAZORPAY_SETTINGS_KEYS)
  const settings = await prisma.settings.findMany({
    where: {
      key: {
        in: keys,
      },
    },
  })

  return settings.reduce<Record<string, string>>((acc, setting) => {
    acc[setting.key] = setting.value
    return acc
  }, {})
}

export async function getRazorpayRuntimeConfig(options: RuntimeConfigOptions = {}): Promise<RazorpayRuntimeConfig> {
  const { requireSecret = true, requireWebhookSecret = false } = options
  const settings = await loadRazorpaySettings()

  const keyId = normalize(settings[RAZORPAY_SETTINGS_KEYS.keyId]) ?? normalize(process.env.RAZORPAY_KEY_ID)
  const keySecret =
    normalize(settings[RAZORPAY_SETTINGS_KEYS.keySecret]) ?? normalize(process.env.RAZORPAY_KEY_SECRET)
  const webhookSecret =
    normalize(settings[RAZORPAY_SETTINGS_KEYS.webhookSecret]) ?? normalize(process.env.RAZORPAY_WEBHOOK_SECRET)

  if (!keyId) {
    throw new Error("Razorpay Key ID is not configured")
  }

  if (requireSecret && !keySecret) {
    throw new Error("Razorpay Key Secret is not configured")
  }

  if (requireWebhookSecret && !webhookSecret) {
    throw new Error("Razorpay webhook secret is not configured")
  }

  return {
    keyId,
    keySecret,
    webhookSecret,
  }
}

export async function createRazorpayOrder(input: CreateRazorpayOrderInput) {
  const { keyId, keySecret } = await getRazorpayRuntimeConfig({ requireSecret: true })

  const response = await fetch("https://api.razorpay.com/v1/orders", {
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
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Razorpay order creation failed (${response.status}): ${errorText}`)
  }

  return {
    keyId,
    order: await response.json(),
  }
}

export function verifyRazorpayPaymentSignature(params: {
  orderId: string
  paymentId: string
  signature: string
  keySecret: string
}): boolean {
  const computedSignature = crypto
    .createHmac("sha256", params.keySecret)
    .update(`${params.orderId}|${params.paymentId}`)
    .digest("hex")

  return computedSignature === params.signature
}

