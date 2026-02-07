import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedPrograms() {
  console.log('🌱 Seeding programs with detailed content...')

  const programsData = [
    {
      name: 'fosstar',
      title: 'FOSStar',
      description: 'Building a vibrant community of FOSS enthusiasts and contributors',
      tagline: 'Community Building & Recognition',
      mission: 'To create a thriving ecosystem of FOSS enthusiasts who actively contribute to open source projects and promote FOSS adoption across Andhra Pradesh.',
      color: '#015ba7',
      logo: '/logos/fosstar-logo.png',
      status: 'active',
      displayOrder: 1,
      initiatives: [
        { title: 'Community Meetups', description: 'Monthly meetups for FOSS enthusiasts to network and share knowledge.', category: 'Engagement' },
        { title: 'Professional Network', description: 'Connecting FOSS professionals with organizations seeking open-source expertise.', category: 'Professional' },
        { title: 'Annual FOSS Summit', description: 'The flagship event celebrating open-source innovation in the region.', category: 'Events' }
      ],
      team: [
        { name: 'Dr. Satish Kumar', role: 'Community Lead', bio: 'FOSS advocate with 15+ years of experience in open source governance.' }
      ]
    },
    {
      name: 'fosserve',
      title: 'FOSServe',
      description: 'Facilitating FOSS adoption in government and public services',
      tagline: 'G2C & G2G Solutions',
      mission: 'To enable government departments to adopt FOSS solutions for better service delivery, cost efficiency, and digital sovereignty.',
      color: '#0077cc',
      logo: '/logos/fosserve-logo.png',
      status: 'active',
      displayOrder: 2,
      initiatives: [
        { title: 'E-Governance Portals', description: 'Building citizen-centric portals using open-source stacks.', category: 'Infrastructure' },
        { title: 'Public Service Digitization', description: 'Helping local bodies digitize their records and services using FOSS.', category: 'Service' }
      ]
    },
    {
      name: 'fossync',
      title: 'FOSSynC',
      description: 'Promoting FOSS education in schools and colleges',
      tagline: 'Campus Ecosystems',
      mission: 'To integrate FOSS education into academic curricula and establish student-led FOSS clubs in every educational institution in Andhra Pradesh.',
      color: '#98d339',
      logo: '/logos/fossync-logo.png',
      status: 'active',
      displayOrder: 3,
      initiatives: [
        { title: 'Campus Clubs', description: 'Supporting student-led clubs to foster a culture of open-source contribution.', category: 'Student' },
        { title: 'Skill Workshops', description: 'Hands-on training sessions on Linux, Git, and various FOSS technologies.', category: 'Education' }
      ],
      clubs: [
        { name: 'AU FOSS Club', institution: 'Andhra University', location: 'Visakhapatnam', members: 120, established: '2023' },
        { name: 'JNTUK Open Source Society', institution: 'JNTU Kakinada', location: 'Kakinada', members: 85, established: '2024' }
      ]
    },
    {
      name: 'fosstorm',
      title: 'FOSStorm',
      description: 'Supporting collaborative FOSS development projects',
      tagline: 'Open Innovation Lab',
      mission: 'To facilitate collaborative development of high-quality FOSS projects that solve real-world problems in local communities.',
      color: '#ff6b35',
      logo: '/logos/fosstorm-logo.png',
      status: 'active',
      displayOrder: 4,
      initiatives: [
        { title: 'Community Projects', description: 'Developing tools for local challenges like agriculture and health.', category: 'Development' },
        { title: 'Contribution Sprints', description: 'Intensive weekend sessions focused on merging PRs to global FOSS projects.', category: 'Global' }
      ],
      projects: [
        { name: 'Andhra Rural Maps', description: 'Open source mapping tool for rural infrastructure tracking.', technologies: 'React, Leaflet, PostGIS', status: 'Active', githubUrl: 'https://github.com/fossandhra/rural-maps' },
        { name: 'AgriConnect', description: 'Market information system for farmers using open data.', technologies: 'Next.js, Python, PostgreSQL', status: 'In Development' }
      ]
    },
    {
      name: 'fossart',
      title: 'FOSSart',
      description: 'Nurturing FOSS-based startups and entrepreneurship',
      tagline: 'Startup Incubation',
      mission: 'To support entrepreneurs in building sustainable businesses on FOSS technologies, promoting economic growth through open innovation.',
      color: '#e63946',
      logo: '/logos/fossart-logo.png',
      status: 'active',
      displayOrder: 5,
      initiatives: [
        { title: 'Incubation Program', description: 'Mentorship and resources for FOSS-based startups.', category: 'Advisory' },
        { title: 'Innovation Grants', description: 'Financial support for high-impact open-source solutions.', category: 'Funding' }
      ],
      startups: [
        { name: 'OpenStream Technologies', description: 'FOSS-based edtech solutions for rural schools.', founded: '2023', location: 'Vijayawada' }
      ]
    },
    {
      name: 'fossterage',
      title: 'FOSSterage',
      description: 'Creating open repositories for research and data',
      tagline: 'Data & Knowledge Commons',
      mission: 'To establish open data repositories and promote open research practices for scientists and researchers in the region.',
      color: '#6a4c93',
      logo: '/logos/fossterage-logo.png',
      status: 'active',
      displayOrder: 6,
      initiatives: [
        { title: 'Open Data Portal', description: 'Hosting public datasets for policy analysis and research.', category: 'Data' },
        { title: 'Research Archives', description: 'Preserving academic papers and open-access research materials.', category: 'Research' }
      ],
      repositories: [
        { name: 'Public Health Archive', description: 'Curated datasets of public health metrics across Andhra Pradesh.', category: 'Data', type: 'Database', url: '#', features: 'Searchable, API access' }
      ]
    },
    {
      name: 'fosspeaks',
      title: 'FOSSpeaks',
      description: 'Advocacy for FOSS policies and awareness',
      tagline: 'Advocacy & Outreach',
      mission: 'To advocate for FOSS-friendly policies and raise awareness about the benefits of digital freedom and open source software.',
      color: '#1982c4',
      logo: '/logos/fosspeaks-logo.png',
      status: 'active',
      displayOrder: 7,
      initiatives: [
        { title: 'Policy Advocacy', description: 'Engaging with policy makers to promote open-source adoption.', category: 'Advocacy' },
        { title: 'Awareness Campaigns', description: 'Public workshops and social media outreach about digital freedom.', category: 'Outreach' }
      ]
    }
  ]

  for (const p of programsData) {
    const { initiatives, team, clubs, projects, startups, repositories, ...programData } = p

    // Simple way to handle cleanup of existingRelations for re-seeding if needed
    // or just use upsert for the program and then handle relations separately

    const program = await prisma.program.upsert({
      where: { name: programData.name },
      update: programData,
      create: programData,
    })

    // Upsert initiatives
    if (initiatives) {
      for (const init of initiatives) {
        await prisma.programInitiative.upsert({
          where: { id: `${program.id}-${init.title.replace(/\s+/g, '-').toLowerCase()}` },
          update: { ...init, programId: program.id },
          create: { id: `${program.id}-${init.title.replace(/\s+/g, '-').toLowerCase()}`, ...init, programId: program.id }
        })
      }
    }

    // Upsert team
    if (team) {
      for (const t of team) {
        await prisma.programTeamMember.upsert({
          where: { id: `${program.id}-${t.name.replace(/\s+/g, '-').toLowerCase()}` },
          update: { ...t, programId: program.id },
          create: { id: `${program.id}-${t.name.replace(/\s+/g, '-').toLowerCase()}`, ...t, programId: program.id }
        })
      }
    }

    // Upsert clubs
    if (clubs) {
      for (const c of clubs) {
        await prisma.programClub.upsert({
          where: { id: `${program.id}-${c.name.replace(/\s+/g, '-').toLowerCase()}` },
          update: { ...c, programId: program.id },
          create: { id: `${program.id}-${c.name.replace(/\s+/g, '-').toLowerCase()}`, ...c, programId: program.id }
        })
      }
    }

    // Upsert projects
    if (projects) {
      for (const proj of projects) {
        await prisma.programProject.upsert({
          where: { id: `${program.id}-${proj.name.replace(/\s+/g, '-').toLowerCase()}` },
          update: { ...proj, programId: program.id },
          create: { id: `${program.id}-${proj.name.replace(/\s+/g, '-').toLowerCase()}`, ...proj, programId: program.id }
        })
      }
    }

    // Upsert startups
    if (startups) {
      for (const s of startups) {
        await prisma.programStartup.upsert({
          where: { id: `${program.id}-${s.name.replace(/\s+/g, '-').toLowerCase()}` },
          update: { ...s, programId: program.id },
          create: { id: `${program.id}-${s.name.replace(/\s+/g, '-').toLowerCase()}`, ...s, programId: program.id }
        })
      }
    }

    // Upsert repositories
    if (repositories) {
      for (const repo of repositories) {
        await prisma.programRepository.upsert({
          where: { id: `${program.id}-${repo.name.replace(/\s+/g, '-').toLowerCase()}` },
          update: { ...repo, programId: program.id },
          create: { id: `${program.id}-${repo.name.replace(/\s+/g, '-').toLowerCase()}`, ...repo, programId: program.id }
        })
      }
    }
  }

  console.log(`✅ ${programsData.length} programs and their content seeded`)
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
