import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendVolunteerConfirmationEmail, sendVolunteerAdminNotification } from '@/lib/email'
import { strictRateLimit, getRateLimitIdentifier } from '@/lib/rate-limit'
import { createVolunteerSchema, validateRequestBody } from '@/lib/validation-schemas'
import { logError, logInfo } from '@/lib/logger'

export const dynamic = "force-dynamic"

// POST - Public volunteer registration endpoint
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const identifier = getRateLimitIdentifier(request)
    await strictRateLimit.check(request, 5, identifier) // 5 requests per minute

    const body = await request.json()

    // Validate request body
    const validation = await validateRequestBody(createVolunteerSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    const { firstName, lastName, email, phone, skills, interests, availability } = validation.data

    // Check if already registered
    const existing = await prisma.volunteer.findUnique({
      where: { email },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'You have already registered as a volunteer' },
        { status: 400 }
      )
    }

    // Create volunteer record
    const volunteer = await prisma.volunteer.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        skills,
        interests,
        availability,
        status: 'pending',
      },
    })

    logInfo('Volunteer registered', { volunteerId: volunteer.id, email })

    // Send confirmation email to volunteer
    try {
      await sendVolunteerConfirmationEmail(email, {
        firstName,
        lastName,
        skills,
        interests,
      })
    } catch (emailError) {
      logError(emailError as Error, { context: 'volunteer_confirmation_email' })
    }

    // Send notification to admin
    try {
      await sendVolunteerAdminNotification({
        firstName,
        lastName,
        email,
        phone,
        skills,
        interests,
        availability,
        id: volunteer.id,
      })
    } catch (emailError) {
      logError(emailError as Error, { context: 'volunteer_admin_notification' })
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Volunteer registration submitted successfully!',
        volunteer: {
          id: volunteer.id,
          name: `${volunteer.firstName} ${volunteer.lastName}`,
          email: volunteer.email,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    // Rate limit errors are already responses
    if (error instanceof Response) {
      return error
    }

    logError(error as Error, { context: 'volunteer_registration' })
    return NextResponse.json(
      { error: 'Failed to register volunteer' },
      { status: 500 }
    )
  }
}

// GET is intentionally disabled on the public volunteers endpoint.
// Admin list operations moved to /api/admin/volunteers.
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use /api/admin/volunteers." },
    { status: 405 }
  )
}
