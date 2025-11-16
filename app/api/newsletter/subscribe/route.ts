import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendWelcomeEmail } from '@/lib/email'
import { strictRateLimit, getRateLimitIdentifier } from '@/lib/rate-limit'
import { subscribeNewsletterSchema, validateRequestBody } from '@/lib/validation-schemas'
import { logError, logInfo } from '@/lib/logger'

// POST - Public newsletter subscription endpoint
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const identifier = getRateLimitIdentifier(request)
    await strictRateLimit.check(request, 10, identifier)

    const body = await request.json()

    // Validate request body
    const validation = await validateRequestBody(subscribeNewsletterSchema, body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const { email, name } = validation.data

    // Check if already subscribed
    const existing = await prisma.subscriber.findUnique({
      where: { email },
    })

    if (existing && existing.status === 'active') {
      return NextResponse.json({ error: 'Already subscribed to newsletter' }, { status: 400 })
    }

    // Create or reactivate subscription
    const subscriber = await prisma.subscriber.upsert({
      where: { email },
      update: {
        status: 'active',
        name: name || existing?.name,
        unsubscribedAt: null,
      },
      create: {
        email,
        name,
        status: 'active',
      },
    })

    // Send welcome email (don't fail if this errors)
    try {
      await sendWelcomeEmail(email, name)
    } catch (emailError) {
      logError(emailError as Error, { context: 'newsletter_welcome_email' })
    }

    logInfo('Newsletter subscription', { email })

    return NextResponse.json({ 
      success: true,
      message: 'Successfully subscribed to newsletter!',
      subscriber: {
        email: subscriber.email,
        name: subscriber.name,
      }
    }, { status: 201 })
  } catch (error) {
    // Rate limit errors are already responses
    if (error instanceof Response) {
      return error
    }

    logError(error as Error, { context: 'newsletter_subscribe' })
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
