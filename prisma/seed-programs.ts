import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding programs...")

  // Define all 7 programs
  const programs = [
    {
      name: "fosstar",
      title: "FOSStar",
      description: "Our flagship membership program connecting and empowering the FOSS community across Andhra Pradesh",
      tagline: "Membership program connecting FOSS enthusiasts",
      mission: "To build a vibrant community of FOSS enthusiasts who collaborate, learn, and advocate for open source adoption across educational institutions, government bodies, and society at large.",
      color: "#015ba7",
      logo: "/logos/fosstar-logo.svg",
      status: "active",
      displayOrder: 1,
    },
    {
      name: "fosserve",
      title: "FOSServe",
      description: "Promoting open-source solutions in education and governance to enhance digital infrastructure and services",
      tagline: "Open source solutions for education and governance",
      mission: "To transform education and governance in Andhra Pradesh through the adoption of free and open source solutions, making technology more accessible, transparent, and affordable for all institutions.",
      color: "#9333ea",
      logo: "/logos/fosserve-logo.png",
      status: "active",
      displayOrder: 2,
    },
    {
      name: "fossync",
      title: "FOSSynC",
      description: "Student-led FOSS clubs in educational institutions across Andhra Pradesh",
      tagline: "Student-led FOSS clubs",
      mission: "To empower students as leaders in the open source movement by providing resources, mentorship, and opportunities to build a vibrant FOSS community on campuses across Andhra Pradesh.",
      color: "#16a34a",
      logo: "/logos/fossync-logo.svg",
      status: "active",
      displayOrder: 3,
    },
    {
      name: "fosstorm",
      title: "FOSStorm",
      description: "Community-led open source projects developed by FOSS Andhra addressing local challenges",
      tagline: "Community-led open source projects",
      mission: "To create a thriving ecosystem of open source projects that address local needs, showcase local talent, and contribute to the global open source community while promoting collaboration and knowledge sharing.",
      color: "#ea580c",
      logo: "/logos/fosstorm-logo.svg",
      status: "active",
      displayOrder: 4,
    },
    {
      name: "fosstart",
      title: "FOSStart",
      description: "Entrepreneurship space for funding open source innovations and startups",
      tagline: "Entrepreneurship and funding for open source",
      mission: "To foster a thriving ecosystem of open source startups in Andhra Pradesh by providing funding, mentorship, and support for entrepreneurs who build businesses around open source solutions and principles.",
      color: "#dc2626",
      logo: "/logos/fosstart-logo.svg",
      status: "active",
      displayOrder: 5,
    },
    {
      name: "fossterage",
      title: "FOSSterage",
      description: "Repository of knowledge bases for researchers and data scientists",
      tagline: "Knowledge repositories for research",
      mission: "To democratize access to data and information through open-source solutions, building sustainable, open, and accessible data infrastructures that enable knowledge sharing, foster innovation, and support evidence-based decision-making.",
      color: "#0891b2",
      logo: "/logos/fossterage-logo.svg",
      status: "active",
      displayOrder: 6,
    },
    {
      name: "fosspeaks",
      title: "FOSSpeaks",
      description: "Advocacy program for free and open-source technology for society",
      tagline: "Advocacy for FOSS adoption",
      mission: "To promote the adoption and benefits of free and open-source software across society through policy influence, public awareness, and educational programs, fostering understanding about the importance of digital freedom.",
      color: "#db2777",
      logo: "/logos/fosspeaks-logo.svg",
      status: "active",
      displayOrder: 7,
    },
  ]

  for (const program of programs) {
    const created = await prisma.program.upsert({
      where: { name: program.name },
      update: program,
      create: program,
    })
    console.log(`✅ Created/Updated: ${created.title}`)
  }

  console.log("🎉 Programs seeding completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
