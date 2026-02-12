import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting comprehensive seed for all programs...")

  // Define programs
  const programsData = [
    { name: "fosstar", title: "FOSStar", description: "Student star program", tagline: "Empowering student developers", color: "#3b82f6", displayOrder: 0 },
    { name: "fosserve", title: "FOSServe", description: "Service program", tagline: "Open source consulting", color: "#8b5cf6", displayOrder: 1 },
    { name: "fossync", title: "FOSSynC", description: "Community sync program", tagline: "Connecting FOSS clubs", color: "#10b981", displayOrder: 2 },
    { name: "fosstorm", title: "FOSStorm", description: "Project storm program", tagline: "Building impactful projects", color: "#f59e0b", displayOrder: 3 },
    { name: "fosstart", title: "FOSStart", description: "Startup program", tagline: "Nurturing open source startups", color: "#ef4444", displayOrder: 4 },
    { name: "fossterage", title: "FOSSterage", description: "Resource storage program", tagline: "Curating knowledge repositories", color: "#06b6d4", displayOrder: 5 },
    { name: "fosspeaks", title: "FOSSpeaks", description: "Speaker program", tagline: "Amplifying FOSS voices", color: "#ec4899", displayOrder: 6 },
  ]

  // Map to store program IDs by name
  const programIds: Record<string, string> = {}

  // 1. Ensure all programs exist and get their IDs
  console.log("\n📌 Creating/Verifying programs...")
  for (const program of programsData) {
    const upserted = await prisma.program.upsert({
      where: { name: program.name },
      update: {}, // Don't overwrite existing data if present, or maybe we should? maintaining as is
      create: {
        ...program,
        id: program.name // Try to set ID to name for consistency, but if it already exists with CUID, upsert respects that
      },
    })
    programIds[program.name] = upserted.id
    console.log(`✅ Program ready: ${upserted.title} (ID: ${upserted.id})`)
  }

  // 2. FOSStar
  console.log("\n📌 Seeding FOSStar...")
  const fosstarId = programIds["fosstar"]
  if (fosstarId) {
    const initiatives = [
      {
        programId: fosstarId,
        title: "Campus Ambassador Program",
        description: "Student leaders promoting FOSS culture",
        content: "Detailed info about ambassador program",
        category: "membership",
        order: 0,
      },
      {
        programId: fosstarId,
        title: "Open Source Workshops",
        description: "Hands-on workshops",
        content: "Workshop series details",
        category: "activities",
        order: 1,
      },
      {
        programId: fosstarId,
        title: "Hackathon Series",
        description: "Monthly hackathons",
        content: "Hackathon information",
        category: "activities",
        order: 2,
      },
    ]

    for (const item of initiatives) {
      await prisma.programInitiative.upsert({
        where: { id: `${fosstarId}-${item.title.replace(/\s+/g, '-').toLowerCase()}` },
        update: item,
        create: { id: `${fosstarId}-${item.title.replace(/\s+/g, '-').toLowerCase()}`, ...item }
      })
    }
    console.log("✅ FOSStar initiatives seeded")

    const team = [
      {
        programId: fosstarId,
        name: "Priya Sharma",
        role: "Program Lead",
        bio: "Open source advocate",
        email: "priya@foss.andhra.dev",
        linkedin: "https://linkedin.com/in/priyasharma",
        twitter: "https://twitter.com/priyasharma",
        order: 0,
      },
      {
        programId: fosstarId,
        name: "Rajesh Kumar",
        role: "Technical Coordinator",
        bio: "Full-stack developer",
        email: "rajesh@foss.andhra.dev",
        twitter: "https://twitter.com/rajeshkumar",
        order: 1,
      },
    ]

    for (const member of team) {
      await prisma.programTeamMember.upsert({
        where: { id: `${fosstarId}-${member.name.replace(/\s+/g, '-').toLowerCase()}` },
        update: member,
        create: { id: `${fosstarId}-${member.name.replace(/\s+/g, '-').toLowerCase()}`, ...member }
      })
    }
    console.log("✅ FOSStar team seeded")
  }

  // 3. FOSServe
  console.log("\n📌 Seeding FOSServe...")
  const fosserveId = programIds["fosserve"]
  if (fosserveId) {
    const cases = [
      {
        programId: fosserveId,
        title: "Government Department Migration",
        subtitle: "AP State IT Department",
        description: "Legacy proprietary systems migration",
        content: "Full case study content here",
        metrics: JSON.stringify({ costReduction: "60%", duration: "12 months" }),
        category: "government",
        order: 0,
      },
      {
        programId: fosserveId,
        title: "Educational Institution Digital Transformation",
        subtitle: "Andhra University",
        description: "Moodle LMS deployment",
        content: "Full case study details",
        metrics: JSON.stringify({ students: "10000+", adoption: "95%", duration: "6 months" }),
        category: "education",
        order: 1,
      },
    ]

    for (const c of cases) {
      // Assuming title + programId is unique enough for ID generation since we don't have a natural key besides ID
      const id = `${fosserveId}-${c.title.replace(/\s+/g, '-').toLowerCase()}`
      await prisma.programCaseStudy.upsert({
        where: { id },
        update: { ...c, programId: fosserveId },
        create: { id, ...c, programId: fosserveId }
      })
    }
    console.log("✅ FOSServe case studies seeded")

    const team = [
      {
        programId: fosserveId,
        name: "Anjali Reddy",
        role: "Service Director",
        bio: "Enterprise architect",
        email: "anjali@foss.andhra.dev",
        linkedin: "https://linkedin.com/in/anjalireddy",
        order: 0,
      },
    ]

    for (const member of team) {
      const id = `${fosserveId}-${member.name.replace(/\s+/g, '-').toLowerCase()}`
      await prisma.programTeamMember.upsert({
        where: { id },
        update: { ...member, programId: fosserveId },
        create: { id, ...member, programId: fosserveId }
      })
    }
    console.log("✅ FOSServe team seeded")
  }

  // 4. FOSSynC
  console.log("\n📌 Seeding FOSSynC...")
  const fossyncId = programIds["fossync"]
  if (fossyncId) {
    const clubs = [
      {
        programId: fossyncId,
        name: "GITAM FOSS Club",
        location: "Visakhapatnam",
        institution: "GITAM University",
        members: 85,
        established: "August 2022",
        description: "Active community",
        contact: JSON.stringify({ email: "foss@gitam.edu", phone: "+91-9876543210" }),
        logo: "/uploads/gitam-foss-logo.png",
        order: 0,
      },
      {
        programId: fossyncId,
        name: "VIT-AP Open Source Society",
        location: "Amaravati",
        institution: "VIT-AP University",
        members: 120,
        established: "September 2021",
        description: "Largest FOSS community",
        contact: JSON.stringify({ email: "oss@vitap.ac.in", website: "https://oss.vitap.ac.in" }),
        logo: "/uploads/vitap-oss-logo.png",
        order: 1,
      },
      {
        programId: fossyncId,
        name: "Andhra University Linux Users Group",
        location: "Visakhapatnam",
        institution: "Andhra University",
        members: 60,
        established: "January 2020",
        description: "Veteran club",
        contact: JSON.stringify({ email: "lug@andhrauniversity.edu.in" }),
        order: 2,
      },
    ]

    for (const club of clubs) {
      const id = `${fossyncId}-${club.name.replace(/\s+/g, '-').toLowerCase()}`
      await prisma.programClub.upsert({
        where: { id },
        update: { ...club, programId: fossyncId },
        create: { id, ...club, programId: fossyncId }
      })
    }
    console.log("✅ FOSSynC clubs seeded")

    const team = [
      {
        programId: fossyncId,
        name: "Sai Kiran",
        role: "Regional Coordinator - North AP",
        bio: "GITAM University coordinator",
        email: "saikiran@foss.andhra.dev",
        order: 0,
      },
      {
        programId: fossyncId,
        name: "Lakshmi Prasanna",
        role: "Regional Coordinator - Central AP",
        bio: "VIT-AP University coordinator",
        email: "lakshmi@foss.andhra.dev",
        order: 1,
      },
    ]

    for (const member of team) {
      const id = `${fossyncId}-${member.name.replace(/\s+/g, '-').toLowerCase()}`
      await prisma.programTeamMember.upsert({
        where: { id },
        update: { ...member, programId: fossyncId },
        create: { id, ...member, programId: fossyncId }
      })
    }
    console.log("✅ FOSSynC coordinators seeded")
  }

  // 5. FOSStorm
  console.log("\n📌 Seeding FOSStorm...")
  const fosstormId = programIds["fosstorm"]
  if (fosstormId) {
    const projects = [
      {
        programId: fosstormId,
        name: "AP-Gov-Forms",
        description: "Open source form builder",
        content: "Full project details",
        githubUrl: "https://github.com/foss-andhra/ap-gov-forms",
        websiteUrl: "https://forms.foss.andhra.dev",
        status: "active",
        technologies: JSON.stringify(["React", "Node.js", "PostgreSQL", "Docker"]),
        stars: 45,
        contributors: 12,
        order: 0,
      },
      {
        programId: fosstormId,
        name: "Telugu NLP Toolkit",
        description: "NLP tools for Telugu",
        content: "NLP toolkit information",
        githubUrl: "https://github.com/foss-andhra/telugu-nlp",
        status: "active",
        technologies: JSON.stringify(["Python", "TensorFlow", "FastAPI"]),
        stars: 89,
        contributors: 8,
        order: 1,
      },
      {
        programId: fosstormId,
        name: "Community Dashboard",
        description: "Analytics dashboard",
        content: "Dashboard details",
        githubUrl: "https://github.com/foss-andhra/community-dashboard",
        status: "development",
        technologies: JSON.stringify(["Next.js", "Prisma", "Chart.js"]),
        stars: 23,
        contributors: 5,
        order: 2,
      },
    ]

    for (const proj of projects) {
      const id = `${fosstormId}-${proj.name.replace(/\s+/g, '-').toLowerCase()}`
      await prisma.programProject.upsert({
        where: { id },
        update: { ...proj, programId: fosstormId },
        create: { id, ...proj, programId: fosstormId }
      })
    }
    console.log("✅ FOSStorm projects seeded")

    const team = [
      {
        programId: fosstormId,
        name: "Venkat Rao",
        role: "Lead Maintainer",
        bio: "Full-stack developer",
        email: "venkat@foss.andhra.dev",
        twitter: "https://twitter.com/venkatrao",
        order: 0,
      },
      {
        programId: fosstormId,
        name: "Divya Chowdary",
        role: "NLP Specialist",
        bio: "ML expert",
        email: "divya@foss.andhra.dev",
        twitter: "https://twitter.com/divyachowdary",
        order: 1,
      },
    ]

    for (const member of team) {
      const id = `${fosstormId}-${member.name.replace(/\s+/g, '-').toLowerCase()}`
      await prisma.programTeamMember.upsert({
        where: { id },
        update: { ...member, programId: fosstormId },
        create: { id, ...member, programId: fosstormId }
      })
    }
    console.log("✅ FOSStorm maintainers seeded")
  }

  // 6. FOSStart
  console.log("\n📌 Seeding FOSStart...")
  const fosstartId = programIds["fosstart"]
  if (fosstartId) {
    const startups = [
      {
        programId: fosstartId,
        name: "OpenEdu Solutions",
        description: "Affordable ed-tech",
        content: "Startup details",
        category: "Education Technology",
        founded: "March 2023",
        location: "Visakhapatnam",
        teamSize: 8,
        fundingStage: "Seed",
        fundingAmount: "₹50 Lakhs",
        websiteUrl: "https://openedu.solutions",
        technologies: JSON.stringify(["React", "Python", "PostgreSQL"]),
        order: 0,
      },
      {
        programId: fosstartId,
        name: "AgriTech FOSS",
        description: "Smart farming IoT",
        content: "AgriTech startup information",
        category: "Agriculture Technology",
        founded: "November 2023",
        location: "Vijayawada",
        teamSize: 5,
        fundingStage: "pre-funding",
        fundingAmount: "Bootstrapped",
        websiteUrl: "https://agritechfoss.in",
        technologies: JSON.stringify(["IoT", "Python", "MongoDB"]),
        order: 1,
      },
      {
        programId: fosstartId,
        name: "HealthStack",
        description: "Hospital management system",
        content: "Healthcare technology details",
        category: "Healthcare Technology",
        founded: "June 2022",
        location: "Amaravati",
        teamSize: 15,
        fundingStage: "funded",
        fundingAmount: "₹2 Crores",
        websiteUrl: "https://healthstack.dev",
        technologies: JSON.stringify(["Java", "Spring Boot", "MySQL"]),
        order: 2,
      },
    ]

    for (const startup of startups) {
      const id = `${fosstartId}-${startup.name.replace(/\s+/g, '-').toLowerCase()}`
      await prisma.programStartup.upsert({
        where: { id },
        update: { ...startup, programId: fosstartId },
        create: { id, ...startup, programId: fosstartId }
      })
    }
    console.log("✅ FOSStart startups seeded")

    const team = [
      {
        programId: fosstartId,
        name: "Ramesh Naidu",
        role: "Startup Mentor",
        bio: "Serial entrepreneur",
        email: "ramesh@foss.andhra.dev",
        linkedin: "https://linkedin.com/in/rameshnaidu",
        order: 0,
      },
      {
        programId: fosstartId,
        name: "Kavitha Menon",
        role: "Legal & Compliance Mentor",
        bio: "Legal expert",
        email: "kavitha@foss.andhra.dev",
        linkedin: "https://linkedin.com/in/kavithamenon",
        order: 1,
      },
    ]

    for (const member of team) {
      const id = `${fosstartId}-${member.name.replace(/\s+/g, '-').toLowerCase()}`
      await prisma.programTeamMember.upsert({
        where: { id },
        update: { ...member, programId: fosstartId },
        create: { id, ...member, programId: fosstartId }
      })
    }
    console.log("✅ FOSStart mentors seeded")
  }

  // 7. FOSSterage
  console.log("\n📌 Seeding FOSSterage...")
  const fossterageId = programIds["fossterage"]
  if (fossterageId) {
    const repos = [
      {
        programId: fossterageId,
        name: "awesome-telugu-tech",
        description: "Telugu tech resources",
        content: "Repository details",
        url: "https://github.com/foss-andhra/awesome-telugu-tech",
        category: "databases",
        type: "library",
        features: JSON.stringify(["Telugu resources", "Tech articles", "Learning materials"]),
        order: 0,
      },
      {
        programId: fossterageId,
        name: "ap-government-apis",
        description: "AP government APIs",
        content: "API collection details",
        url: "https://github.com/foss-andhra/ap-gov-apis",
        category: "research",
        type: "hub",
        features: JSON.stringify(["Government APIs", "Documentation", "Examples"]),
        order: 1,
      },
      {
        programId: fossterageId,
        name: "learning-resources",
        description: "Learning paths",
        content: "Learning resources information",
        url: "https://github.com/foss-andhra/learning-resources",
        category: "education",
        type: "archive",
        features: JSON.stringify(["Learning paths", "Tutorials", "Best practices"]),
        order: 2,
      },
    ]

    for (const repo of repos) {
      const id = `${fossterageId}-${repo.name.replace(/\s+/g, '-').toLowerCase()}`
      await prisma.programRepository.upsert({
        where: { id },
        update: { ...repo, programId: fossterageId },
        create: { id, ...repo, programId: fossterageId }
      })
    }
    console.log("✅ FOSSterage repositories seeded")

    const team = [
      {
        programId: fossterageId,
        name: "Anil Kumar",
        role: "Chief Curator",
        bio: "Documentation specialist",
        email: "anil@foss.andhra.dev",
        twitter: "https://twitter.com/anilkumar",
        order: 0,
      },
      {
        programId: fossterageId,
        name: "Sneha Patel",
        role: "Community Curator",
        bio: "Resource creator",
        email: "sneha@foss.andhra.dev",
        order: 1,
      },
    ]

    for (const member of team) {
      const id = `${fossterageId}-${member.name.replace(/\s+/g, '-').toLowerCase()}`
      await prisma.programTeamMember.upsert({
        where: { id },
        update: { ...member, programId: fossterageId },
        create: { id, ...member, programId: fossterageId }
      })
    }
    console.log("✅ FOSSterage curators seeded")
  }

  // 8. FOSSpeaks
  console.log("\n📌 Seeding FOSSpeaks...")
  const fosspeaksId = programIds["fosspeaks"]
  if (fosspeaksId) {
    const team = [
      {
        programId: fosspeaksId,
        name: "Vikram Singh",
        role: "Speaker - Linux Kernel Developer",
        bio: "Kernel developer",
        email: "vikram@foss.andhra.dev",
        twitter: "https://twitter.com/vikramsingh",
        linkedin: "https://linkedin.com/in/vikramsingh",
        order: 0,
      },
      {
        programId: fosspeaksId,
        name: "Meera Krishnan",
        role: "Speaker - Open Source Advocate",
        bio: "OS advocate",
        email: "meera@foss.andhra.dev",
        linkedin: "https://linkedin.com/in/meerakrishnan",
        twitter: "https://twitter.com/meerakrishnan",
        order: 1,
      },
    ]

    for (const member of team) {
      const id = `${fosspeaksId}-${member.name.replace(/\s+/g, '-').toLowerCase()}`
      await prisma.programTeamMember.upsert({
        where: { id },
        update: { ...member, programId: fosspeaksId },
        create: { id, ...member, programId: fosspeaksId }
      })
    }
    console.log("✅ FOSSpeaks speakers seeded")
  }

  console.log("\n✅ Comprehensive seed completed successfully!")
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
