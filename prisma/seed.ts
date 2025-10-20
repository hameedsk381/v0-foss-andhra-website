import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@fossandhra.org' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@fossandhra.org',
      password: hashedPassword,
      role: 'admin',
    },
  })

  console.log('✅ Admin user created:', admin.email)

  // Create sample members
  const member1 = await prisma.member.upsert({
    where: { email: 'rajesh@example.com' },
    update: {},
    create: {
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      phone: '+91 98765 43210',
      organization: 'Tech Solutions Inc',
      designation: 'Software Engineer',
      experience: 'intermediate',
      membershipType: 'FOSStar Annual',
      status: 'active',
      membershipId: `FOSS${Date.now()}001`,
      expiryDate: new Date('2025-12-31'),
    },
  })

  console.log('✅ Sample member created:', member1.name)

  // Create sample event
  const event1 = await prisma.event.create({
    data: {
      title: 'FOSS Andhra Annual Conference 2025',
      description: 'A celebration of open source innovation and community',
      date: new Date('2025-03-15'),
      endDate: new Date('2025-03-16'),
      time: '9:00 AM',
      location: 'Visakhapatnam Convention Center',
      type: 'Conference',
      status: 'upcoming',
      maxAttendees: 500,
      currentAttendees: 0,
      program: 'fosstar',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=600',
        'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600',
        'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600',
      ]),
      externalTicketUrl: 'https://tickets.example.com/foss-conference-2025',
      externalRegisterUrl: 'https://register.example.com/foss-conference',
    },
  })

  console.log('✅ Sample event created:', event1.title)

  // Create sample donation
  const donation1 = await prisma.donation.create({
    data: {
      name: 'Anonymous Donor',
      email: 'donor@example.com',
      phone: '+91 98765 00000',
      amount: 5000,
      type: 'oneTime',
      status: 'completed',
      anonymous: true,
      paymentId: 'pay_sample123',
    },
  })

  console.log('✅ Sample donation created: ₹', donation1.amount)

  console.log('🎉 Database seeded successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
