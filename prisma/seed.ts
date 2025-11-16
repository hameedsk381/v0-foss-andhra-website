import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedPrograms() {
  console.log('🌱 Seeding programs...')

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
      name: 'fossart',
      title: 'FOSSart',
      description: 'Nurturing FOSS-based startups and entrepreneurship',
      tagline: 'Entrepreneurship',
      mission: 'To support entrepreneurs in building sustainable businesses on FOSS technologies',
      color: '#e63946',
      logo: '/logos/fossart.png',
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

  for (const program of programs) {
    await prisma.program.upsert({
      where: { name: program.name },
      update: program,
      create: program,
    })
  }

  console.log(`✅ ${programs.length} programs seeded`)
}

async function seedGallery() {
  console.log('🌱 Seeding gallery...')

  const sampleGalleryData = [
    {
      filename: 'gallery/sample-1.jpg',
      originalName: 'fosstar-event-1.jpg',
      mimeType: 'image/jpeg',
      size: 245000,
      url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      title: 'FOSStar Community Meetup',
      description: 'Community meetup for FOSS enthusiasts in Vijayawada',
      alt: 'FOSStar community members at meetup',
      caption: 'Community meetup for FOSS enthusiasts in Vijayawada',
      program: 'fosstar',
      category: 'event',
      tags: 'event,community,meetup',
      uploadedBy: 'admin',
    },
    {
      filename: 'gallery/sample-2.jpg',
      originalName: 'fosstar-summit.jpg',
      mimeType: 'image/jpeg',
      size: 312000,
      url: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800',
      title: 'FOSS Leadership Summit',
      description: 'Annual leadership summit for FOSS community leaders',
      alt: 'FOSS leaders at summit',
      caption: 'Annual leadership summit for FOSS community leaders',
      program: 'fosstar',
      category: 'event',
      tags: 'event,leadership,summit',
      uploadedBy: 'admin',
    },
    {
      filename: 'gallery/sample-3.jpg',
      originalName: 'fosserve-launch.jpg',
      mimeType: 'image/jpeg',
      size: 198000,
      url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
      title: 'Government Portal Launch',
      description: 'Launch of new FOSS-based government service portal',
      alt: 'Government officials at portal launch',
      caption: 'Launch of new FOSS-based government service portal',
      program: 'fosserve',
      category: 'launch',
      tags: 'implementation,government,launch',
      uploadedBy: 'admin',
    },
    {
      filename: 'gallery/sample-4.jpg',
      originalName: 'fossync-club.jpg',
      mimeType: 'image/jpeg',
      size: 267000,
      url: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=800',
      title: 'University FOSS Club Inauguration',
      description: 'Opening ceremony of new FOSS club at Andhra University',
      alt: 'Students at FOSS club inauguration',
      caption: 'Opening ceremony of new FOSS club at Andhra University',
      program: 'fossync',
      category: 'inauguration',
      tags: 'education,university,inauguration',
      uploadedBy: 'admin',
    },
    {
      filename: 'gallery/sample-5.jpg',
      originalName: 'fosstorm-workshop.jpg',
      mimeType: 'image/jpeg',
      size: 289000,
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
      title: 'Project Collaboration Workshop',
      description: 'Developers collaborate on open source projects',
      alt: 'Developers working together at workshop',
      caption: 'Developers collaborate on open source projects',
      program: 'fosstorm',
      category: 'workshop',
      tags: 'development,workshop,collaboration',
      uploadedBy: 'admin',
    },
    {
      filename: 'gallery/sample-6.jpg',
      originalName: 'fossart-startup.jpg',
      mimeType: 'image/jpeg',
      size: 234000,
      url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800',
      title: 'FOSS Startup Incubation',
      description: 'New startups join the FOSS entrepreneurship program',
      alt: 'Startup founders at incubation program',
      caption: 'New startups join the FOSS entrepreneurship program',
      program: 'fossart',
      category: 'event',
      tags: 'startup,entrepreneurship,innovation',
      uploadedBy: 'admin',
    },
    {
      filename: 'gallery/sample-7.jpg',
      originalName: 'fossterage-database.jpg',
      mimeType: 'image/jpeg',
      size: 201000,
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      title: 'Open Data Repository Launch',
      description: 'Launch of new open research data repository',
      alt: 'Data visualization at repository launch',
      caption: 'Launch of new open research data repository',
      program: 'fossterage',
      category: 'launch',
      tags: 'data,research,repository',
      uploadedBy: 'admin',
    },
    {
      filename: 'gallery/sample-8.jpg',
      originalName: 'fosspeaks-advocacy.jpg',
      mimeType: 'image/jpeg',
      size: 276000,
      url: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?w=800',
      title: 'Policy Advocacy Forum',
      description: 'Forum on FOSS policy advocacy with government officials',
      alt: 'Policy makers at advocacy forum',
      caption: 'Forum on FOSS policy advocacy with government officials',
      program: 'fosspeaks',
      category: 'event',
      tags: 'policy,advocacy,government',
      uploadedBy: 'admin',
    },
  ]

  // Only seed if gallery is empty
  const count = await prisma.media.count()
  if (count === 0) {
    for (const item of sampleGalleryData) {
      await prisma.media.create({ data: item })
    }
    console.log(`✅ ${sampleGalleryData.length} gallery images seeded`)
  } else {
    console.log(`⏭️  Gallery already has ${count} images, skipping`)
  }
}

async function main() {
  console.log('🌱 Starting database seed...\n')

  await seedPrograms()
  await seedGallery()

  console.log('\n✨ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
