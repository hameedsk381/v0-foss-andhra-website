import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendVolunteerConfirmationEmail, sendVolunteerAdminNotification } from '@/lib/email'

// POST - Public volunteer registration endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, skills, interests, availability } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !skills || !interests || !availability) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

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

    // Send confirmation email to volunteer
    try {
      await sendVolunteerConfirmationEmail(email, {
        firstName,
        lastName,
        skills,
        interests,
      })
    } catch (emailError) {
      console.error('Error sending volunteer confirmation email:', emailError)
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
      console.error('Error sending admin notification:', emailError)
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
    console.error('Error registering volunteer:', error)
    return NextResponse.json(
      { error: 'Failed to register volunteer' },
      { status: 500 }
    )
  }
}

// GET - Admin endpoint to fetch volunteers (optional, for future admin panel)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where = status ? { status } : {}

    const volunteers = await prisma.volunteer.findMany({
      where,
      orderBy: {
        appliedAt: 'desc',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        skills: true,
        interests: true,
        availability: true,
        status: true,
        appliedAt: true,
      },
    })

    return NextResponse.json({ volunteers }, { status: 200 })
  } catch (error) {
    console.error('Error fetching volunteers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch volunteers' },
      { status: 500 }
    )
  }
}
