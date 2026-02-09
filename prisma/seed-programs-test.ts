import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding test data for all programs...")

  // Create or update programs
  const programs = [
    { name: "fosstar", title: "FOSStar - Membership Program", description: "Become a part of FOSS Andhra", color: "#015ba7" },
    { name: "fosserve", title: "FOSServe - FOSS Deployment Services", description: "Deploy FOSS solutions", color: "#10b981" },
    { name: "fossync", title: "FOSSynC - College Clubs Network", description: "Connect FOSS clubs", color: "#f59e0b" },
    { name: "fosstorm", title: "FOSStorm - Open Source Projects", description: "Contribute to open source", color: "#8b5cf6" },
    { name: "fosstart", title: "FOSStart - FOSS Startup Incubator", description: "Incubate FOSS startups", color: "#ec4899" },
    { name: "fossterage", title: "FOSSterage - FOSS Knowledge Repository", description: "Knowledge hub", color: "#06b6d4" },
    { name: "fosspeaks", title: "FOSSpeaks - FOSS Talks & Events", description: "Learn and share", color: "#f97316" },
  ]

  for (const prog of programs) {
    await prisma.program.upsert({
      where: { name: prog.name },
      update: {},
      create: prog,
    })
  }

  console.log("✅ Programs created/verified")

  // Get program IDs
  const fosstar = await prisma.program.findUnique({ where: { name: "fosstar" } })
  const fosserve = await prisma.program.findUnique({ where: { name: "fosserve" } })
  const fossync = await prisma.program.findUnique({ where: { name: "fossync" } })
  const fosstorm = await prisma.program.findUnique({ where: { name: "fosstorm" } })
  const fosstart = await prisma.program.findUnique({ where: { name: "fosstart" } })
  const fossterage = await prisma.program.findUnique({ where: { name: "fossterage" } })
  const fosspeaks = await prisma.program.findUnique({ where: { name: "fosspeaks" } })

  // FOSStar - Initiatives & Team
  if (fosstar) {
    console.log("\n🌟 Seeding FOSStar...")
    
    // Initiatives
    const existingInitiatives = await prisma.programInitiative.count({ where: { programId: fosstar.id } })
    if (existingInitiatives === 0) {
      await prisma.programInitiative.createMany({
        data: [
          {
            programId: fosstar.id,
            title: "Annual Membership",
            description: "Join our vibrant community",
            category: "membership",
            order: 0,
          },
          {
            programId: fosstar.id,
            title: "Community Events",
            description: "Exclusive member events",
            category: "activities",
            order: 1,
          },
        ],
      })
    }

    // Team
    const existingTeam = await prisma.programTeamMember.count({ where: { programId: fosstar.id } })
    if (existingTeam === 0) {
      await prisma.programTeamMember.createMany({
        data: [
          {
            programId: fosstar.id,
            name: "John Doe",
            role: "Community Manager",
            bio: "Passionate about FOSS",
            order: 0,
          },
          {
            programId: fosstar.id,
            name: "Jane Smith",
            role: "Event Coordinator",
            bio: "Organizing amazing events",
            order: 1,
          },
        ],
      })
    }
    console.log("✅ FOSStar seeded")
  }

  // FOSServe - Services, Case Studies, Team
  if (fosserve) {
    console.log("\n🚀 Seeding FOSServe...")
    
    // Services (using initiatives table)
    await prisma.programInitiative.createMany({
      data: [
        {
          programId: fosserve.id,
          title: "Government FOSS Solutions",
          description: "Deploy FOSS in government",
          category: "government",
          order: 0,
        },
        {
          programId: fosserve.id,
          title: "Education Sector Deployment",
          description: "FOSS for schools and colleges",
          category: "education",
          order: 1,
        },
      ],
      skipDuplicates: true,
    })

    // Case Studies
    await prisma.programCaseStudy.createMany({
      data: [
        {
          programId: fosserve.id,
          title: "AP Government Migration to Linux",
          subtitle: "Success Story",
          description: "Complete migration to open source",
          category: "government",
          metrics: JSON.stringify({ savings: "60%", users: "50000+" }),
          order: 0,
        },
        {
          programId: fosserve.id,
          title: "University LibreOffice Adoption",
          subtitle: "Education Win",
          description: "Successful office suite deployment",
          category: "education",
          metrics: JSON.stringify({ savings: "75%", users: "10000" }),
          order: 1,
        },
      ],
      skipDuplicates: true,
    })

    // Team
    await prisma.programTeamMember.createMany({
      data: [
        {
          programId: fosserve.id,
          name: "Raj Kumar",
          role: "Deployment Lead",
          bio: "Expert in FOSS migrations",
          order: 0,
        },
      ],
      skipDuplicates: true,
    })
    console.log("✅ FOSServe seeded")
  }

  // FOSSynC - Clubs & Coordinators
  if (fossync) {
    console.log("\n🎓 Seeding FOSSynC...")
    
    // Clubs
    await prisma.programClub.createMany({
      data: [
        {
          programId: fossync.id,
          name: "JNTUH FOSS Club",
          institution: "JNTU Hyderabad",
          location: "Hyderabad",
          members: 150,
          established: "Jan 2020",
          description: "Leading FOSS club in Hyderabad",
          order: 0,
        },
        {
          programId: fossync.id,
          name: "VIT FOSS Chapter",
          institution: "VIT University",
          location: "Vellore",
          members: 200,
          established: "Mar 2019",
          description: "Active student community",
          order: 1,
        },
        {
          programId: fossync.id,
          name: "IIT-M Open Source Lab",
          institution: "IIT Madras",
          location: "Chennai",
          members: 100,
          established: "Aug 2018",
          description: "Research-focused FOSS group",
          order: 2,
        },
      ],
      skipDuplicates: true,
    })

    // Coordinators (using team table)
    await prisma.programTeamMember.createMany({
      data: [
        {
          programId: fossync.id,
          name: "Priya Sharma",
          role: "Network Coordinator",
          bio: "Connecting FOSS clubs nationwide",
          order: 0,
        },
      ],
      skipDuplicates: true,
    })
    console.log("✅ FOSSynC seeded")
  }

  // FOSStorm - Projects & Maintainers
  if (fosstorm) {
    console.log("\n⚡ Seeding FOSStorm...")
    
    // Projects
    await prisma.programProject.createMany({
      data: [
        {
          programId: fosstorm.id,
          name: "IndiaOS",
          description: "Linux distribution for India",
          status: "active",
          githubUrl: "https://github.com/fossandhra/indiaos",
          technologies: JSON.stringify(["Linux", "Debian", "Python"]),
          stars: 2500,
          contributors: 45,
          order: 0,
        },
        {
          programId: fosstorm.id,
          name: "TeluguNLP",
          description: "Natural Language Processing for Telugu",
          status: "beta",
          githubUrl: "https://github.com/fossandhra/telugu-nlp",
          technologies: JSON.stringify(["Python", "TensorFlow", "NLP"]),
          stars: 1200,
          contributors: 28,
          order: 1,
        },
        {
          programId: fosstorm.id,
          name: "FOSSPayments",
          description: "Open source payment gateway",
          status: "development",
          githubUrl: "https://github.com/fossandhra/foss-payments",
          technologies: JSON.stringify(["Node.js", "PostgreSQL", "React"]),
          stars: 800,
          contributors: 15,
          order: 2,
        },
      ],
      skipDuplicates: true,
    })

    // Maintainers (using team table)
    await prisma.programTeamMember.createMany({
      data: [
        {
          programId: fosstorm.id,
          name: "Vikram Reddy",
          role: "Core Maintainer",
          bio: "Building amazing open source tools",
          order: 0,
        },
      ],
      skipDuplicates: true,
    })
    console.log("✅ FOSStorm seeded")
  }

  // FOSStart - Startups & Mentors
  if (fosstart) {
    console.log("\n🚀 Seeding FOSStart...")
    
    // Startups
    await prisma.programStartup.createMany({
      data: [
        {
          programId: fosstart.id,
          name: "HealthStack",
          description: "Open source healthcare management",
          category: "healthcare",
          founded: "2023",
          location: "Hyderabad",
          teamSize: 8,
          fundingStage: "seed",
          fundingAmount: "₹50 Lakhs",
          technologies: JSON.stringify(["React", "Node.js", "PostgreSQL"]),
          order: 0,
        },
        {
          programId: fosstart.id,
          name: "AgriTech Solutions",
          description: "FOSS for farmers",
          category: "agritech",
          founded: "2023",
          location: "Vijayawada",
          teamSize: 6,
          fundingStage: "incubation",
          technologies: JSON.stringify(["Flutter", "Python", "MongoDB"]),
          order: 1,
        },
        {
          programId: fosstart.id,
          name: "EduOpen",
          description: "Open educational platform",
          category: "edtech",
          founded: "2024",
          location: "Visakhapatnam",
          teamSize: 10,
          fundingStage: "funded",
          fundingAmount: "₹1.2 Crores",
          technologies: JSON.stringify(["Next.js", "Prisma", "PostgreSQL"]),
          order: 2,
        },
      ],
      skipDuplicates: true,
    })

    // Mentors (using team table)
    await prisma.programTeamMember.createMany({
      data: [
        {
          programId: fosstart.id,
          name: "Dr. Anitha Kumar",
          role: "Business Mentor",
          bio: "Guiding FOSS startups to success",
          order: 0,
        },
      ],
      skipDuplicates: true,
    })
    console.log("✅ FOSStart seeded")
  }

  // FOSSterage - Repositories & Curators
  if (fossterage) {
    console.log("\n📚 Seeding FOSSterage...")
    
    // Repositories
    await prisma.programRepository.createMany({
      data: [
        {
          programId: fossterage.id,
          name: "FOSS Software Archive",
          description: "Comprehensive FOSS software collection",
          category: "archive",
          type: "archive",
          url: "https://archive.fossandhra.org",
          features: JSON.stringify(["10000+ packages", "Mirror service", "Version control"]),
          order: 0,
        },
        {
          programId: fossterage.id,
          name: "Telugu FOSS Documentation",
          description: "FOSS docs in Telugu",
          category: "documentation",
          type: "library",
          url: "https://docs.fossandhra.org/te",
          features: JSON.stringify(["500+ documents", "Community maintained", "Searchable"]),
          order: 1,
        },
        {
          programId: fossterage.id,
          name: "Research Paper Hub",
          description: "Open access FOSS research",
          category: "research",
          type: "hub",
          url: "https://research.fossandhra.org",
          features: JSON.stringify(["200+ papers", "Peer reviewed", "Free access"]),
          order: 2,
        },
      ],
      skipDuplicates: true,
    })

    // Curators (using team table)
    await prisma.programTeamMember.createMany({
      data: [
        {
          programId: fossterage.id,
          name: "Prof. Ramesh Babu",
          role: "Chief Curator",
          bio: "Preserving FOSS knowledge",
          order: 0,
        },
      ],
      skipDuplicates: true,
    })
    console.log("✅ FOSSterage seeded")
  }

  // FOSSpeaks - Events & Speakers
  if (fosspeaks) {
    console.log("\n🎤 Seeding FOSSpeaks...")
    
    // Events (using initiatives table)
    await prisma.programInitiative.createMany({
      data: [
        {
          programId: fosspeaks.id,
          title: "FOSS Fridays",
          description: "Weekly tech talks",
          category: "talk",
          order: 0,
        },
        {
          programId: fosspeaks.id,
          title: "Annual FOSS Summit",
          description: "Three-day mega event",
          category: "conference",
          order: 1,
        },
        {
          programId: fosspeaks.id,
          title: "Hands-on Workshops",
          description: "Learn by doing",
          category: "workshop",
          order: 2,
        },
      ],
      skipDuplicates: true,
    })

    // Speakers (using team table)
    await prisma.programTeamMember.createMany({
      data: [
        {
          programId: fosspeaks.id,
          name: "Srinivas Rao",
          role: "Keynote Speaker",
          bio: "Cloud & FOSS evangelist",
          order: 0,
        },
        {
          programId: fosspeaks.id,
          name: "Lakshmi Devi",
          role: "Workshop Facilitator",
          bio: "Teaching FOSS to thousands",
          order: 1,
        },
      ],
      skipDuplicates: true,
    })
    console.log("✅ FOSSpeaks seeded")
  }

  console.log("\n🎉 All programs seeded successfully!")
  console.log("\n📊 Test the following URLs:")
  console.log("   - http://localhost:3000/admin/programs/fosstar/initiatives")
  console.log("   - http://localhost:3000/admin/programs/fosstar/team")
  console.log("   - http://localhost:3000/admin/programs/fosserve/initiatives")
  console.log("   - http://localhost:3000/admin/programs/fosserve/casestudies")
  console.log("   - http://localhost:3000/admin/programs/fossync/clubs")
  console.log("   - http://localhost:3000/admin/programs/fosstorm/projects")
  console.log("   - http://localhost:3000/admin/programs/fosstart/startups")
  console.log("   - http://localhost:3000/admin/programs/fossterage/repositories")
  console.log("   - http://localhost:3000/admin/programs/fosspeaks/initiatives")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
