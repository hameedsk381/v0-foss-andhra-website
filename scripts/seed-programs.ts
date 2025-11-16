import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const programs = [
  {
    name: 'fosstar',
    title: 'FOSStar',
    description: 'Empowering students and professionals through FOSS education and community engagement',
    color: '#015ba7',
    displayOrder: 1,
  },
  {
    name: 'fosserve',
    title: 'FOSServe',
    description: 'Providing FOSS-based services and solutions to organizations',
    color: '#10b981',
    displayOrder: 2,
  },
  {
    name: 'fossync',
    title: 'FOSSynC',
    description: 'Network of FOSS clubs and communities across Andhra Pradesh',
    color: '#f59e0b',
    displayOrder: 3,
  },
  {
    name: 'fosstorm',
    title: 'FOSStorm',
    description: 'Hackathons and project-based learning initiatives',
    color: '#8b5cf6',
    displayOrder: 4,
  },
  {
    name: 'fossart',
    title: 'FOSSart',
    description: 'Supporting FOSS-based startups and entrepreneurship',
    color: '#ec4899',
    displayOrder: 5,
  },
  {
    name: 'fossterage',
    title: 'FOSSterage',
    description: 'Repository of FOSS knowledge, resources, and research',
    color: '#06b6d4',
    displayOrder: 6,
  },
  {
    name: 'fosspeaks',
    title: 'FOSSpeaks',
    description: 'Speaker series and knowledge sharing events',
    color: '#f97316',
    displayOrder: 7,
  },
]

async function main() {
  console.log('🌱 Seeding programs...')

  for (const p of programs) {
    const program = await prisma.program.upsert({
      where: { name: p.name },
      update: p,
      create: {
        ...p,
        status: 'active',
      },
    })
    console.log('✅', program.title)
  }

  console.log('🎉 Programs seeded successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error seeding programs:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
