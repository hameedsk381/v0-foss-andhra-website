import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const programs = [
  {
    name: 'fosstar',
    title: 'FOSStar',
    description: 'Building a vibrant community of FOSS enthusiasts and contributors',
    tagline: 'Community Building',
    mission: 'To create a thriving ecosystem of FOSS enthusiasts who actively contribute to open source projects and promote FOSS adoption',
    color: '#015ba7',
    logo: '/logos/fosstar.png',
    status: 'active',
    displayOrder: 1,
  },
  {
    name: 'fosserve',
    title: 'FOSServe',
    description: 'Facilitating FOSS adoption in government and public services',
    tagline: 'Government Services',
    mission: 'To enable government departments to adopt FOSS solutions for better service delivery and cost efficiency',
    color: '#0077cc',
    logo: '/logos/fosserve.png',
    status: 'active',
    displayOrder: 2,
  },
  {
    name: 'fossync',
    title: 'FOSSynC',
    description: 'Promoting FOSS education in schools and colleges',
    tagline: 'Education',
    mission: 'To integrate FOSS education into academic curricula and establish FOSS clubs in educational institutions',
    color: '#98d339',
    logo: '/logos/fossync.png',
    status: 'active',
    displayOrder: 3,
  },
  {
    name: 'fosstorm',
    title: 'FOSStorm',
    description: 'Supporting collaborative FOSS development projects',
    tagline: 'Development',
    mission: 'To facilitate collaborative development of high-quality FOSS projects that solve real-world problems',
    color: '#ff6b35',
    logo: '/logos/fosstorm.png',
    status: 'active',
    displayOrder: 4,
  },
  {
    name: 'fosstart',
    title: 'FOSStart',
    description: 'Nurturing FOSS-based startups and entrepreneurship',
    tagline: 'Entrepreneurship',
    mission: 'To support entrepreneurs in building sustainable businesses on FOSS technologies',
    color: '#e63946',
    logo: '/logos/fosstart.png',
    status: 'active',
    displayOrder: 5,
  },
  {
    name: 'fossterage',
    title: 'FOSSterage',
    description: 'Creating open repositories for research and data',
    tagline: 'Research & Data',
    mission: 'To establish open data repositories and promote open research practices',
    color: '#6a4c93',
    logo: '/logos/fossterage.png',
    status: 'active',
    displayOrder: 6,
  },
  {
    name: 'fosspeaks',
    title: 'FOSSpeaks',
    description: 'Advocacy for FOSS policies and awareness',
    tagline: 'Advocacy',
    mission: 'To advocate for FOSS-friendly policies and raise awareness about the benefits of FOSS',
    color: '#1982c4',
    logo: '/logos/fosspeaks.png',
    status: 'active',
    displayOrder: 7,
  },
]

async function main() {
  console.log('🌱 Seeding programs...\n')

  for (const program of programs) {
    const created = await prisma.program.upsert({
      where: { name: program.name },
      update: program,
      create: program,
    })
    console.log(`✅ ${created.title} (${created.name})`)
  }

  console.log(`\n✨ ${programs.length} programs seeded successfully!`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding programs:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
