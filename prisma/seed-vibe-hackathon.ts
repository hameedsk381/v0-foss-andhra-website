import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Creating Vibe Coding Hackathon event...')

  // Check if event already exists by title
  let event = await prisma.event.findFirst({
    where: { title: 'Vibe Coding Hackathon' }
  })

  if (event) {
    console.log('Event already exists, updating...')
    event = await prisma.event.update({
      where: { id: event.id },
      data: {
        description: 'Join us for an exciting 24-hour coding hackathon where developers come together to build innovative solutions, collaborate, and compete for amazing prizes!',
        date: new Date('2025-11-15'),
        time: '9:00 AM - 9:00 AM (24 hours)',
        location: 'Tech Innovation Hub, Visakhapatnam',
        type: 'Hackathon',
        status: 'upcoming',
        maxAttendees: 150,
        program: 'FOSStorm',
        enableTicketing: true,
      }
    })
    console.log('Event updated successfully!')
    
    // Delete existing tickets and promo codes if updating
    await prisma.promoCodeTicket.deleteMany({
      where: {
        promoCode: {
          eventId: event.id
        }
      }
    })
    await prisma.eventPromoCode.deleteMany({ where: { eventId: event.id } })
    await prisma.eventTicketType.deleteMany({ where: { eventId: event.id } })
    console.log('Cleared existing tickets and promo codes')
  } else {
    // Create new event
    event = await prisma.event.create({
      data: {
        title: 'Vibe Coding Hackathon',
        description: 'Join us for an exciting 24-hour coding hackathon where developers come together to build innovative solutions, collaborate, and compete for amazing prizes!',
        date: new Date('2025-11-15'),
        time: '9:00 AM - 9:00 AM (24 hours)',
        location: 'Tech Innovation Hub, Visakhapatnam',
        type: 'Hackathon',
        status: 'upcoming',
        maxAttendees: 150,
        currentAttendees: 0,
        program: 'FOSStorm',
        enableTicketing: true,
        currency: 'INR',
        timezone: 'Asia/Kolkata',
      }
    })
    console.log('Event created:', event.title)
  }

  console.log('Event created:', event.title)

  // Create ticket types
  console.log('Creating ticket types...')

  const earlyBird = await prisma.eventTicketType.create({
    data: {
      eventId: event.id,
      name: 'Early Bird - Individual',
      description: 'Special early bird pricing for individual participants. Limited slots available!',
      type: 'paid',
      audienceType: 'earlybird',
      price: 299,
      quantity: 50,
      quantitySold: 0,
      salesStart: new Date('2025-10-01'),
      salesEnd: new Date('2025-10-31'),
      hidden: false,
      requiresApproval: false,
      order: 1,
      active: true,
    }
  })

  const regularIndividual = await prisma.eventTicketType.create({
    data: {
      eventId: event.id,
      name: 'Regular - Individual',
      description: 'Standard ticket for individual participants',
      type: 'paid',
      audienceType: 'general',
      price: 499,
      quantity: 80,
      quantitySold: 0,
      salesStart: new Date('2025-11-01'),
      salesEnd: new Date('2025-11-14'),
      hidden: false,
      requiresApproval: false,
      order: 2,
      active: true,
    }
  })

  const teamTicket = await prisma.eventTicketType.create({
    data: {
      eventId: event.id,
      name: 'Team Pass (4 members)',
      description: 'Special team pass for 4 members. Save 20% compared to individual tickets!',
      type: 'paid',
      audienceType: 'team',
      price: 1599,
      quantity: 20,
      quantitySold: 0,
      salesStart: new Date('2025-10-01'),
      salesEnd: new Date('2025-11-14'),
      hidden: false,
      requiresApproval: false,
      order: 3,
      active: true,
    }
  })

  const studentPass = await prisma.eventTicketType.create({
    data: {
      eventId: event.id,
      name: 'Student Pass',
      description: 'Discounted pass for students with valid ID',
      type: 'paid',
      audienceType: 'student',
      price: 199,
      quantity: 50,
      quantitySold: 0,
      salesStart: new Date('2025-10-01'),
      salesEnd: new Date('2025-11-14'),
      hidden: false,
      requiresApproval: true,
      order: 4,
      active: true,
    }
  })

  console.log('Created ticket types:', {
    earlyBird: earlyBird.name,
    regularIndividual: regularIndividual.name,
    teamTicket: teamTicket.name,
    studentPass: studentPass.name,
  })

  // Create promo codes
  console.log('Creating promo codes...')

  const earlyBirdPromo = await prisma.eventPromoCode.create({
    data: {
      eventId: event.id,
      code: 'VIBEEARLY',
      description: 'Early bird discount - 20% off',
      discountType: 'percentage',
      discountValue: 20,
      maxUses: 30,
      usedCount: 0,
      validFrom: new Date('2025-10-01'),
      validUntil: new Date('2025-10-15'),
      minOrderAmount: 0,
      active: true,
      applicableTickets: {
        create: [
          { ticketTypeId: regularIndividual.id },
          { ticketTypeId: teamTicket.id },
        ]
      }
    }
  })

  const studentPromo = await prisma.eventPromoCode.create({
    data: {
      eventId: event.id,
      code: 'STUDENT50',
      description: 'Student special - ₹50 off',
      discountType: 'fixed',
      discountValue: 50,
      maxUses: 50,
      usedCount: 0,
      validFrom: new Date('2025-10-01'),
      validUntil: new Date('2025-11-14'),
      minOrderAmount: 199,
      active: true,
      applicableTickets: {
        create: [
          { ticketTypeId: studentPass.id },
        ]
      }
    }
  })

  const groupPromo = await prisma.eventPromoCode.create({
    data: {
      eventId: event.id,
      code: 'TEAMVIBE',
      description: 'Team discount - Additional 10% off team passes',
      discountType: 'percentage',
      discountValue: 10,
      maxUses: 10,
      usedCount: 0,
      validFrom: new Date('2025-10-01'),
      validUntil: new Date('2025-11-10'),
      minOrderAmount: 1000,
      active: true,
      applicableTickets: {
        create: [
          { ticketTypeId: teamTicket.id },
        ]
      }
    }
  })

  console.log('Created promo codes:', {
    earlyBird: earlyBirdPromo.code,
    student: studentPromo.code,
    team: groupPromo.code,
  })

  console.log('\n✅ Vibe Coding Hackathon event created successfully!')
  console.log('\nEvent Details:')
  console.log(`- ID: ${event.id}`)
  console.log(`- Title: ${event.title}`)
  console.log(`- Date: ${event.date.toLocaleDateString()}`)
  console.log(`- Location: ${event.location}`)
  console.log(`- Max Attendees: ${event.maxAttendees}`)
  console.log(`- Ticketing: Enabled`)
  console.log(`- Ticket Types: 4`)
  console.log(`- Promo Codes: 3`)
  console.log('\nPromo Codes:')
  console.log(`- VIBEEARLY (20% off, valid till Oct 15)`)
  console.log(`- STUDENT50 (₹50 off for students)`)
  console.log(`- TEAMVIBE (10% off team passes)`)
  console.log(`\nView at: http://localhost:3000/events (Event ID: ${event.id})`)
}

main()
  .catch((e) => {
    console.error('Error creating event:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
