import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding test data for all programs...")

  // Get all programs
  const programs = await prisma.program.findMany()
  const programMap = new Map(programs.map(p => [p.name, p.id]))

  // 1. FOSStar
  const fosstarId = programMap.get("fosstar")
  if (fosstarId) {
    const initCount = await prisma.programInitiative.count({ where: { programId: fosstarId } })
    if (initCount === 0) {
      await prisma.programInitiative.createMany({
        data: [
          {
            programId: fosstarId,
            title: "Campus Ambassador Program",
            description: "Student leaders promoting FOSS culture",
            order: 0,
          },
          {
            programId: fosstarId,
            title: "Open Source Workshops",
            description: "Hands-on workshops for students",
            order: 1,
          },
        ],
      })
      console.log("✅ FOSStar: 2 initiatives")
    }

    const teamCount = await prisma.programTeamMember.count({ where: { programId: fosstarId } })
    if (teamCount === 0) {
      await prisma.programTeamMember.createMany({
        data: [
          {
            programId: fosstarId,
            name: "Priya Sharma",
            role: "Program Lead",
            bio: "Open source advocate",
            order: 0,
          },
        ],
      })
      console.log("✅ FOSStar: 1 team member")
    }
  }

  // 2. FOSServe
  const fosserveId = programMap.get("fosserve")
  if (fosserveId) {
    const caseCount = await prisma.programCaseStudy.count({ where: { programId: fosserveId } })
    if (caseCount === 0) {
      await prisma.programCaseStudy.createMany({
        data: [
          {
            programId: fosserveId,
            title: "Government Migration to Open Source",
            description: "AP State IT Department migration",
            order: 0,
          },
        ],
      })
      console.log("✅ FOSServe: 1 case study")
    }
  }

  // 3. FOSSynC
  const fossyncId = programMap.get("fossync")
  if (fossyncId) {
    const clubCount = await prisma.programClub.count({ where: { programId: fossyncId } })
    if (clubCount === 0) {
      const clubs = [
        {
          programId: fossyncId,
          name: "GITAM FOSS Club",
          location: "Visakhapatnam",
          institution: "GITAM University",
          members: 85,
          established: "August 2022",
          order: 0,
        },
        {
          programId: fossyncId,
          name: "VIT-AP Open Source Society",
          location: "Amaravati",
          institution: "VIT-AP University",
          members: 120,
          established: "September 2021",
          order: 1,
        },
      ]
      
      for (const club of clubs) {
        await prisma.programClub.create({ data: club as any })
      }
      console.log("✅ FOSSynC: 2 clubs")
    }
  }

  // 4. FOSStorm
  const fosstormId = programMap.get("fosstorm")
  if (fosstormId) {
    const projectCount = await prisma.programProject.count({ where: { programId: fosstormId } })
    if (projectCount === 0) {
      await prisma.programProject.createMany({
        data: [
          {
            programId: fosstormId,
            name: "AP-Gov-Forms",
            description: "Open source form builder",
            githubUrl: "https://github.com/foss-andhra/ap-gov-forms",
            status: "active",
            order: 0,
          },
        ],
      })
      console.log("✅ FOSStorm: 1 project")
    }
  }

  // 5. FOSSart
  const fossartId = programMap.get("fossart")
  if (fossartId) {
    const startupCount = await prisma.programStartup.count({ where: { programId: fossartId } })
    if (startupCount === 0) {
      const startups = [
        {
          programId: fossartId,
          name: "OpenEdu Solutions",
          description: "Affordable ed-tech using open source",
          founded: "March 2023",
          location: "Visakhapatnam",
          order: 0,
        },
      ]
      
      for (const startup of startups) {
        await prisma.programStartup.create({ data: startup as any })
      }
      console.log("✅ FOSSart: 1 startup")
    }
  }

  // 6. FOSSterage
  const fossterageId = programMap.get("fossterage")
  if (fossterageId) {
    const repoCount = await prisma.programRepository.count({ where: { programId: fossterageId } })
    if (repoCount === 0) {
      await prisma.programRepository.createMany({
        data: [
          {
            programId: fossterageId,
            name: "awesome-telugu-tech",
            description: "Curated Telugu tech resources",
            order: 0,
          },
        ],
      })
      console.log("✅ FOSSterage: 1 repository")
    }
  }

  // 7. FOSSpeaks
  const fosspeaksId = programMap.get("fosspeaks")
  if (fosspeaksId) {
    const teamCount = await prisma.programTeamMember.count({ where: { programId: fosspeaksId } })
    if (teamCount === 0) {
      await prisma.programTeamMember.createMany({
        data: [
          {
            programId: fosspeaksId,
            name: "Vikram Singh",
            role: "Speaker - Linux Kernel Developer",
            bio: "Kernel developer and Linux Foundation member",
            order: 0,
          },
        ],
      })
      console.log("✅ FOSSpeaks: 1 speaker")
    }
  }

  console.log("\n✅ Seed completed!")
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
