import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'

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
      name: 'fosstart',
      title: 'FOSStart',
      description: 'Nurturing FOSS-based startups and entrepreneurship',
      tagline: 'Startup Incubation',
      mission: 'To support entrepreneurs in building sustainable businesses on FOSS technologies, promoting economic growth through open innovation.',
      color: '#e63946',
      logo: '/logos/fosstart-logo.png',
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
      update: { ...programData, updatedAt: new Date() },
      create: {
        id: programData.name,
        ...programData,
        updatedAt: new Date(),
      },
    })

    // Upsert initiatives
    if (initiatives) {
      for (const init of initiatives) {
        await prisma.programInitiative.upsert({
          where: { id: `${program.id}-${init.title.replace(/\s+/g, '-').toLowerCase()}` },
          update: { ...init, programId: program.id, updatedAt: new Date() },
          create: { id: `${program.id}-${init.title.replace(/\s+/g, '-').toLowerCase()}`, ...init, programId: program.id, updatedAt: new Date() }
        })
      }
    }

    // Upsert team
    if (team) {
      for (const t of team) {
        await prisma.programTeamMember.upsert({
          where: { id: `${program.id}-${t.name.replace(/\s+/g, '-').toLowerCase()}` },
          update: { ...t, programId: program.id, updatedAt: new Date() },
          create: { id: `${program.id}-${t.name.replace(/\s+/g, '-').toLowerCase()}`, ...t, programId: program.id, updatedAt: new Date() }
        })
      }
    }

    // Upsert clubs
    if (clubs) {
      for (const c of clubs) {
        await prisma.programClub.upsert({
          where: { id: `${program.id}-${c.name.replace(/\s+/g, '-').toLowerCase()}` },
          update: { ...c, programId: program.id, updatedAt: new Date() },
          create: { id: `${program.id}-${c.name.replace(/\s+/g, '-').toLowerCase()}`, ...c, programId: program.id, updatedAt: new Date() }
        })
      }
    }

    // Upsert projects
    if (projects) {
      for (const proj of projects) {
        await prisma.programProject.upsert({
          where: { id: `${program.id}-${proj.name.replace(/\s+/g, '-').toLowerCase()}` },
          update: { ...proj, programId: program.id, updatedAt: new Date() },
          create: { id: `${program.id}-${proj.name.replace(/\s+/g, '-').toLowerCase()}`, ...proj, programId: program.id, updatedAt: new Date() }
        })
      }
    }

    // Upsert startups
    if (startups) {
      for (const s of startups) {
        await prisma.programStartup.upsert({
          where: { id: `${program.id}-${s.name.replace(/\s+/g, '-').toLowerCase()}` },
          update: { ...s, programId: program.id, updatedAt: new Date() },
          create: { id: `${program.id}-${s.name.replace(/\s+/g, '-').toLowerCase()}`, ...s, programId: program.id, updatedAt: new Date() }
        })
      }
    }

    // Upsert repositories
    if (repositories) {
      for (const repo of repositories) {
        await prisma.programRepository.upsert({
          where: { id: `${program.id}-${repo.name.replace(/\s+/g, '-').toLowerCase()}` },
          update: { ...repo, programId: program.id, updatedAt: new Date() },
          create: { id: `${program.id}-${repo.name.replace(/\s+/g, '-').toLowerCase()}`, ...repo, programId: program.id, updatedAt: new Date() }
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
      filename: 'gallery/fosstar-event-1.jpg',
      originalName: 'fosstar-event-1.jpg',
      mimeType: 'image/jpeg',
      size: 245000,
      url: '/gallery/fosstar-event-1.jpg',
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
      filename: 'gallery/fosstar-summit.jpg',
      originalName: 'fosstar-summit.jpg',
      mimeType: 'image/jpeg',
      size: 312000,
      url: '/gallery/fosstar-summit.jpg',
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
      filename: 'gallery/fosserve-launch.jpg',
      originalName: 'fosserve-launch.jpg',
      mimeType: 'image/jpeg',
      size: 198000,
      url: '/gallery/fosserve-launch.jpg',
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
      filename: 'gallery/fossync-club.jpg',
      originalName: 'fossync-club.jpg',
      mimeType: 'image/jpeg',
      size: 267000,
      url: '/gallery/fossync-club.jpg',
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
      filename: 'gallery/fosstorm-workshop.jpg',
      originalName: 'fosstorm-workshop.jpg',
      mimeType: 'image/jpeg',
      size: 289000,
      url: '/gallery/fosstorm-workshop.jpg',
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
      filename: 'gallery/fosstart-startup.jpg',
      originalName: 'fosstart-startup.jpg',
      mimeType: 'image/jpeg',
      size: 234000,
      url: '/gallery/fosstart-startup.jpg',
      title: 'FOSS Startup Incubation',
      description: 'New startups join the FOSS entrepreneurship program',
      alt: 'Startup founders at incubation program',
      caption: 'New startups join the FOSS entrepreneurship program',
      program: 'fosstart',
      category: 'event',
      tags: 'startup,entrepreneurship,innovation',
      uploadedBy: 'admin',
    },
    {
      filename: 'gallery/fossterage-database.jpg',
      originalName: 'fossterage-database.jpg',
      mimeType: 'image/jpeg',
      size: 201000,
      url: '/gallery/fossterage-database.jpg',
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
      filename: 'gallery/fosspeaks-advocacy.jpg',
      originalName: 'fosspeaks-advocacy.jpg',
      mimeType: 'image/jpeg',
      size: 276000,
      url: '/gallery/fosspeaks-advocacy.jpg',
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
      await prisma.media.create({
        data: {
          ...item,
          id: Math.random().toString(36).substring(2) + Date.now().toString(36),
          updatedAt: new Date(),
        }
      })
    }
    console.log(`✅ ${sampleGalleryData.length} gallery images seeded`)
  } else {
    console.log(`⏭️  Gallery already has ${count} images, skipping`)
  }
}

async function seedAdmin() {
  console.log('🌱 Seeding admin account...')

  const email = 'admin@fossandhra.org'
  const password = await bcrypt.hash('FossAndhra@2024', 10)

  // Check if admin exists
  let admin = await prisma.admin.findUnique({
    where: { email },
  })

  if (!admin) {
    admin = await prisma.admin.create({
      data: {
        id: randomUUID(),
        email,
        name: 'System Admin',
        password,
        role: 'superadmin',
        updatedAt: new Date(),
      }
    })
    console.log(`✅ Admin account created: ${admin.email}`)
  } else {
    console.log(`⏭️  Admin account already exists: ${admin.email}`)
  }

  return admin
}

async function seedBlogs(authorId: string) {
  console.log('🌱 Seeding blog content...')

  // Categories
  const categories = [
    { name: 'Technology', slug: 'technology', description: 'Tech news and updates' },
    { name: 'Community', slug: 'community', description: 'Community stories and events' },
    { name: 'Tutorials', slug: 'tutorials', description: 'Guides and how-tos' },
    { name: 'Announcements', slug: 'announcements', description: 'Official announcements' },
    { name: 'Events', slug: 'events', description: 'Upcoming and past events' },
  ]

  const createdCategories: Record<string, string> = {}

  for (const cat of categories) {
    const existing = await prisma.blogCategory.findUnique({ where: { slug: cat.slug } })
    if (existing) {
      createdCategories[cat.slug] = existing.id
    } else {
      const created = await prisma.blogCategory.create({
        data: {
          id: randomUUID(),
          ...cat,
        },
      })
      createdCategories[cat.slug] = created.id
    }
  }

  // Tags
  const tags = ['Open Source', 'Linux', 'Web Development', 'AI', 'Events', 'Career', 'Education']
  for (const tag of tags) {
    const slug = tag.toLowerCase().replace(/ /g, '-')
    const existing = await prisma.blogTag.findUnique({ where: { slug } })

    if (!existing) {
      await prisma.blogTag.create({
        data: {
          id: randomUUID(),
          name: tag,
          slug,
        },
      })
    }
  }

  // Posts
  const posts = [
    {
      title: "Welcome to FOSS Andhra Network",
      slug: "welcome-to-foss-andhra",
      excerpt: "We are excited to launch the new FOSS Andhra community platform.",
      content: "<h2>Welcome</h2><p>FOSS Andhra is a community-driven initiative...</p>",
      categorySlug: 'announcements',
      authorId: authorId,
      status: "published",
      featured: true,
      publishedAt: new Date(),
      coverImage: "/blog/welcome-banner.jpg",
      readingTime: 3
    },
    {
      title: "Getting Started with Open Source",
      slug: "getting-started-open-source",
      excerpt: "A comprehensive guide on how to contribute.",
      content: "<p>Contributing to open source can be intimidating...</p>",
      categorySlug: 'tutorials',
      authorId: authorId,
      status: "published",
      featured: false,
      publishedAt: new Date(),
      coverImage: "/blog/open-source-contribution.jpg",
      readingTime: 5
    },
    {
      title: "Highlights from FOSS Summit",
      slug: "foss-summit-highlights",
      excerpt: "Recap of the biggest open source event.",
      content: "<p>The Annual FOSS Summit was a huge success...</p>",
      categorySlug: 'events',
      authorId: authorId,
      status: "published",
      featured: true,
      publishedAt: new Date(),
      coverImage: "/blog/summit-highlights.jpg",
      readingTime: 4
    }
  ]

  for (const post of posts) {
    const categoryId = createdCategories[post.categorySlug]
    if (categoryId) {
      const existing = await prisma.blogPost.findUnique({ where: { slug: post.slug } })

      if (!existing) {
        // Prepare data without categorySlug
        const { categorySlug, ...postData } = post
        await prisma.blogPost.create({
          data: {
            id: randomUUID(),
            ...postData,
            categoryId,
            updatedAt: new Date(),
          }
        })
      }
    } else {
      console.warn(`Category not found for post: ${post.title} (${post.categorySlug})`)
    }
  }

  console.log('✅ Blog content seeded')
}

async function main() {
  console.log('🌱 Starting database seed...\n')

  const admin = await seedAdmin()
  await seedBlogs(admin.id)
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
