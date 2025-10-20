import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendWelcomeEmail } from '@/lib/email'

// POST - Public newsletter subscription endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

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
      console.error('Error sending welcome email:', emailError)
    }

    return NextResponse.json({ 
      success: true,
      message: 'Successfully subscribed to newsletter!',
      subscriber: {
        email: subscriber.email,
        name: subscriber.name,
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error subscribing:', error)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
