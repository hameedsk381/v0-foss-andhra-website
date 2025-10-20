import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting comprehensive seed for all programs...")

  // First, ensure all programs exist
  console.log("\n📌 Creating programs if they don't exist...")
  
  const programs = [
    { name: "fosstar", title: "FOSStar", description: "Student star program", tagline: "Empowering student developers", color: "#3b82f6", displayOrder: 0 },
    { name: "fosserve", title: "FOSServe", description: "Service program", tagline: "Open source consulting", color: "#8b5cf6", displayOrder: 1 },
    { name: "fossync", title: "FOSSynC", description: "Community sync program", tagline: "Connecting FOSS clubs", color: "#10b981", displayOrder: 2 },
    { name: "fosstorm", title: "FOSStorm", description: "Project storm program", tagline: "Building impactful projects", color: "#f59e0b", displayOrder: 3 },
    { name: "fossart", title: "FOSSart", description: "Startup program", tagline: "Nurturing open source startups", color: "#ef4444", displayOrder: 4 },
    { name: "fossterage", title: "FOSSterage", description: "Resource storage program", tagline: "Curating knowledge repositories", color: "#06b6d4", displayOrder: 5 },
    { name: "fosspeaks", title: "FOSSpeaks", description: "Speaker program", tagline: "Amplifying FOSS voices", color: "#ec4899", displayOrder: 6 },
  ]

  for (const program of programs) {
    const exists = await prisma.program.findUnique({ where: { name: program.name } })
    if (!exists) {
      await prisma.program.create({ data: program as any })
      console.log(`✅ Created program: ${program.title}`)
    } else {
      console.log(`✓ Program already exists: ${program.title}`)
    }
  }

  // 1. FOSStar - Initiatives & Team
  console.log("\n📌 Seeding FOSStar (initiatives, team)...")
  
  const fosstar = await prisma.program.findUnique({ where: { name: "fosstar" } })
  if (!fosstar) throw new Error("FOSStar program not found")
  
  const fosstarInitiatives = await prisma.programInitiative.count({ where: { programId: fosstar.id } })
  if (fosstarInitiatives === 0) {
    await prisma.programInitiative.createMany({
      data: [
        {
          programId: fosstar.id,
          title: "Campus Ambassador Program",
          description: "Student leaders promoting FOSS culture in their institutions",
          content: "Detailed info about ambassador program",
          category: "membership",
          order: 0,
        },
        {
          programId: fosstar.id,
          title: "Open Source Workshops",
          description: "Hands-on workshops introducing students to open source contribution",
          content: "Workshop series details",
          category: "activities",
          order: 1,
        },
        {
          programId: fosstar.id,
          title: "Hackathon Series",
          description: "Monthly hackathons focused on solving real-world problems with FOSS",
          content: "Hackathon information",
          category: "activities",
          order: 2,
        },
      ],
    })
    console.log("✅ Created 3 FOSStar initiatives")
  }

  const fosstarTeam = await prisma.programTeamMember.count({ where: { programId: fosstar.id } })
  if (fosstarTeam === 0) {
    await prisma.programTeamMember.createMany({
      data: [
        {
          programId: fosstar.id,
          name: "Priya Sharma",
          role: "Program Lead",
          bio: "Open source advocate with 5+ years of community building experience",
          email: "priya@foss.andhra.dev",
          linkedin: "https://linkedin.com/in/priyasharma",
          twitter: "https://twitter.com/priyasharma",
          order: 0,
        },
        {
          programId: fosstar.id,
          name: "Rajesh Kumar",
          role: "Technical Coordinator",
          bio: "Full-stack developer passionate about mentoring students",
          email: "rajesh@foss.andhra.dev",
          twitter: "https://twitter.com/rajeshkumar",
          order: 1,
        },
      ],
    })
    console.log("✅ Created 2 FOSStar team members")
  }

  // 2. FOSServe - Case Studies, Team (no Services model exists)
  console.log("\n📌 Seeding FOSServe (case studies, team)...")

  const fosserveCases = await prisma.programCaseStudy.count({ where: { programId: "fosserve" } })
  if (fosserveCases === 0) {
    await prisma.programCaseStudy.createMany({
      data: [
        {
          programId: "fosserve",
          title: "Government Department Migration to Open Source",
          subtitle: "AP State IT Department",
          description: "Legacy proprietary systems causing high costs and vendor lock-in. Phased migration to Linux-based infrastructure and open source office suite.",
          content: "Full case study content here",
          metrics: JSON.stringify({ costReduction: "60%", duration: "12 months" }),
          category: "government",
          order: 0,
        },
        {
          programId: "fosserve",
          title: "Educational Institution Digital Transformation",
          subtitle: "Andhra University",
          description: "Need for scalable learning management system on limited budget. Deployed Moodle LMS with custom plugins and faculty training.",
          content: "Full case study details",
          metrics: JSON.stringify({ students: "10000+", adoption: "95%", duration: "6 months" }),
          category: "education",
          order: 1,
        },
      ],
    })
    console.log("✅ Created 2 FOSServe case studies")
  }

  const fosserveTeam = await prisma.programTeamMember.count({ where: { programId: "fosserve" } })
  if (fosserveTeam === 0) {
    await prisma.programTeamMember.createMany({
      data: [
        {
          programId: "fosserve",
          name: "Anjali Reddy",
          role: "Service Director",
          bio: "Enterprise architect specializing in open source solutions",
          email: "anjali@foss.andhra.dev",
          linkedin: "https://linkedin.com/in/anjalireddy",
          order: 0,
        },
      ],
    })
    console.log("✅ Created 1 FOSServe team member")
  }

  // 3. FOSSynC - Clubs & Coordinators
  console.log("\n📌 Seeding FOSSynC (clubs, coordinators)...")
  
  const fossyncClubs = await prisma.programClub.count({ where: { programId: "fossync" } })
  if (fossyncClubs === 0) {
    const clubs = [
      {
        programId: "fossync",
        name: "GITAM FOSS Club",
        location: "Visakhapatnam",
        institution: "GITAM University",
        members: 85,
        established: "August 2022",
        description: "Active community promoting open source culture through workshops and hackathons",
        contact: JSON.stringify({ email: "foss@gitam.edu", phone: "+91-9876543210" }),
        logo: "/uploads/gitam-foss-logo.png",
        order: 0,
      },
      {
        programId: "fossync",
        name: "VIT-AP Open Source Society",
        location: "Amaravati",
        institution: "VIT-AP University",
        members: 120,
        established: "September 2021",
        description: "One of the largest FOSS communities in AP with focus on contributions",
        contact: JSON.stringify({ email: "oss@vitap.ac.in", website: "https://oss.vitap.ac.in" }),
        logo: "/uploads/vitap-oss-logo.png",
        order: 1,
      },
      {
        programId: "fossync",
        name: "Andhra University Linux Users Group",
        location: "Visakhapatnam",
        institution: "Andhra University",
        members: 60,
        established: "January 2020",
        description: "Veteran club focused on Linux advocacy and system administration",
        contact: JSON.stringify({ email: "lug@andhrauniversity.edu.in" }),
        order: 2,
      },
    ]
    
    for (const club of clubs) {
      await prisma.programClub.create({
        data: club as any,
      })
    }
    console.log("✅ Created 3 FOSSynC clubs")
  }

  // Note: No ProgramCoordinator model exists, using team members instead
  const fossyncTeam = await prisma.programTeamMember.count({ where: { programId: "fossync" } })
  if (fossyncTeam === 0) {
    await prisma.programTeamMember.createMany({
      data: [
        {
          programId: "fossync",
          name: "Sai Kiran",
          role: "Regional Coordinator - North AP",
          bio: "GITAM University coordinator",
          email: "saikiran@foss.andhra.dev",
          order: 0,
        },
        {
          programId: "fossync",
          name: "Lakshmi Prasanna",
          role: "Regional Coordinator - Central AP",
          bio: "VIT-AP University coordinator",
          email: "lakshmi@foss.andhra.dev",
          order: 1,
        },
      ],
    })
    console.log("✅ Created 2 FOSSynC coordinators")
  }

  // 4. FOSStorm - Projects (no ProgramMaintainer model exists, use team members)
  console.log("\n📌 Seeding FOSStorm (projects, maintainers)...")
  
  const fosstormProjects = await prisma.programProject.count({ where: { programId: "fosstorm" } })
  if (fosstormProjects === 0) {
    await prisma.programProject.createMany({
      data: [
        {
          programId: "fosstorm",
          name: "AP-Gov-Forms",
          description: "Open source form builder for government departments",
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
          programId: "fosstorm",
          name: "Telugu NLP Toolkit",
          description: "Natural language processing tools for Telugu language",
          content: "NLP toolkit information",
          githubUrl: "https://github.com/foss-andhra/telugu-nlp",
          status: "active",
          technologies: JSON.stringify(["Python", "TensorFlow", "FastAPI"]),
          stars: 89,
          contributors: 8,
          order: 1,
        },
        {
          programId: "fosstorm",
          name: "Community Dashboard",
          description: "Analytics dashboard for FOSS community metrics",
          content: "Dashboard details",
          githubUrl: "https://github.com/foss-andhra/community-dashboard",
          status: "development",
          technologies: JSON.stringify(["Next.js", "Prisma", "Chart.js"]),
          stars: 23,
          contributors: 5,
          order: 2,
        },
      ],
    })
    console.log("✅ Created 3 FOSStorm projects")
  }

  const fosstormTeam = await prisma.programTeamMember.count({ where: { programId: "fosstorm" } })
  if (fosstormTeam === 0) {
    await prisma.programTeamMember.createMany({
      data: [
        {
          programId: "fosstorm",
          name: "Venkat Rao",
          role: "Lead Maintainer",
          bio: "Full-stack developer and DevOps specialist",
          email: "venkat@foss.andhra.dev",
          twitter: "https://twitter.com/venkatrao",
          order: 0,
        },
        {
          programId: "fosstorm",
          name: "Divya Chowdary",
          role: "NLP Specialist",
          bio: "Machine Learning expert specializing in Telugu language processing",
          email: "divya@foss.andhra.dev",
          twitter: "https://twitter.com/divyachowdary",
          order: 1,
        },
      ],
    })
    console.log("✅ Created 2 FOSStorm maintainers")
  }

  // 5. FOSSart - Startups (no ProgramMentor model exists, use team members)
  console.log("\n📌 Seeding FOSSart (startups, mentors)...")
  
  const fossartStartups = await prisma.programStartup.count({ where: { programId: "fossart" } })
  if (fossartStartups === 0) {
    const startups = [
      {
        programId: "fossart",
        name: "OpenEdu Solutions",
        description: "Building affordable ed-tech solutions using open source",
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
        programId: "fossart",
        name: "AgriTech FOSS",
        description: "Open source IoT solutions for smart farming",
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
        programId: "fossart",
        name: "HealthStack",
        description: "Open source hospital management system",
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
      await prisma.programStartup.create({
        data: startup as any,
      })
    }
    console.log("✅ Created 3 FOSSart startups")
  }

  const fossartTeam = await prisma.programTeamMember.count({ where: { programId: "fossart" } })
  if (fossartTeam === 0) {
    await prisma.programTeamMember.createMany({
      data: [
        {
          programId: "fossart",
          name: "Ramesh Naidu",
          role: "Startup Mentor",
          bio: "Serial entrepreneur with 2 successful exits, passionate about open source business models. Expert in product development, go-to-market strategy, and fundraising.",
          email: "ramesh@foss.andhra.dev",
          linkedin: "https://linkedin.com/in/rameshnaidu",
          order: 0,
        },
        {
          programId: "fossart",
          name: "Kavitha Menon",
          role: "Legal & Compliance Mentor",
          bio: "Legal expert specializing in FOSS licenses, helping startups navigate compliance. Open source licensing and community building specialist.",
          email: "kavitha@foss.andhra.dev",
          linkedin: "https://linkedin.com/in/kavithamenon",
          order: 1,
        },
      ],
    })
    console.log("✅ Created 2 FOSSart mentors")
  }

  // 6. FOSSterage - Repositories (no ProgramCurator model exists, use team members)
  console.log("\n📌 Seeding FOSSterage (repositories, curators)...")
  
  const fossterageRepos = await prisma.programRepository.count({ where: { programId: "fossterage" } })
  if (fossterageRepos === 0) {
    await prisma.programRepository.createMany({
      data: [
        {
          programId: "fossterage",
          name: "awesome-telugu-tech",
          description: "Curated list of Telugu language tech resources",
          content: "Repository details",
          url: "https://github.com/foss-andhra/awesome-telugu-tech",
          category: "databases",
          type: "library",
          features: JSON.stringify(["Telugu resources", "Tech articles", "Learning materials"]),
          order: 0,
        },
        {
          programId: "fossterage",
          name: "ap-government-apis",
          description: "Collection of APIs for AP government services",
          content: "API collection details",
          url: "https://github.com/foss-andhra/ap-gov-apis",
          category: "research",
          type: "hub",
          features: JSON.stringify(["Government APIs", "Documentation", "Examples"]),
          order: 1,
        },
        {
          programId: "fossterage",
          name: "learning-resources",
          description: "Comprehensive learning paths for various tech stacks",
          content: "Learning resources information",
          url: "https://github.com/foss-andhra/learning-resources",
          category: "education",
          type: "archive",
          features: JSON.stringify(["Learning paths", "Tutorials", "Best practices"]),
          order: 2,
        },
      ],
    })
    console.log("✅ Created 3 FOSSterage repositories")
  }

  const fossterageTeam = await prisma.programTeamMember.count({ where: { programId: "fossterage" } })
  if (fossterageTeam === 0) {
    await prisma.programTeamMember.createMany({
      data: [
        {
          programId: "fossterage",
          name: "Anil Kumar",
          role: "Chief Curator",
          bio: "Documentation specialist focusing on API design and Telugu tech resources",
          email: "anil@foss.andhra.dev",
          twitter: "https://twitter.com/anilkumar",
          order: 0,
        },
        {
          programId: "fossterage",
          name: "Sneha Patel",
          role: "Community Curator",
          bio: "Passionate about creating beginner-friendly learning resources and documentation",
          email: "sneha@foss.andhra.dev",
          order: 1,
        },
      ],
    })
    console.log("✅ Created 2 FOSSterage curators")
  }

  // 7. FOSSpeaks - Events & Speakers (no specific models, likely using team for speakers)
  console.log("\n📌 Seeding FOSSpeaks (events, speakers)...")
  
  // FOSSpeaks might use the main Event model, not program-specific
  // Adding team members as speakers
  const fosspeaksTeam = await prisma.programTeamMember.count({ where: { programId: "fosspeaks" } })
  if (fosspeaksTeam === 0) {
    await prisma.programTeamMember.createMany({
      data: [
        {
          programId: "fosspeaks",
          name: "Vikram Singh",
          role: "Speaker - Linux Kernel Developer",
          bio: "Kernel developer and Linux Foundation member. Expert in systems programming and performance optimization. Past talks: 23+",
          email: "vikram@foss.andhra.dev",
          twitter: "https://twitter.com/vikramsingh",
          linkedin: "https://linkedin.com/in/vikramsingh",
          order: 0,
        },
        {
          programId: "fosspeaks",
          name: "Meera Krishnan",
          role: "Speaker - Open Source Advocate",
          bio: "Open source advocate and community builder at Mozilla. Expert in community management and developer relations. Past talks: 31+",
          email: "meera@foss.andhra.dev",
          linkedin: "https://linkedin.com/in/meerakrishnan",
          twitter: "https://twitter.com/meerakrishnan",
          order: 1,
        },
      ],
    })
    console.log("✅ Created 2 FOSSpeaks speakers")
  }

  console.log("\n✅ Comprehensive seed completed successfully!")
  console.log("\n📊 Summary:")
  console.log("   7 Programs initialized")
  console.log("   FOSStar: Initiatives & Team")
  console.log("   FOSServe: Case Studies & Team")
  console.log("   FOSSynC: Clubs & Team")
  console.log("   FOSStorm: Projects & Team")
  console.log("   FOSSart: Startups & Team")
  console.log("   FOSSterage: Repositories & Team")
  console.log("   FOSSpeaks: Speakers")
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
