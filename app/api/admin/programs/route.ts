import { NextRequest, NextResponse } from "next/server"
import { requireAdminAccess } from "@/lib/auth/admin"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdminAccess(["viewer", "editor", "admin"])
    if (authError) return authError

    const programs = await prisma.program.findMany({
      include: {
        _count: {
          select: {
            ProgramInitiative: true,
            ProgramTeamMember: true,
            ProgramCaseStudy: true,
            ProgramClub: true,
            ProgramProject: true,
            ProgramStartup: true,
            ProgramRepository: true,
          },
        },
      },
      orderBy: {
        displayOrder: "asc",
      },
    })

    const normalized = programs.map((program) => ({
      ...program,
      _count: {
        initiatives: program._count.ProgramInitiative,
        team: program._count.ProgramTeamMember,
        casestudies: program._count.ProgramCaseStudy,
        clubs: program._count.ProgramClub,
        projects: program._count.ProgramProject,
        startups: program._count.ProgramStartup,
        repositories: program._count.ProgramRepository,
      },
    }))

    return NextResponse.json(normalized)
  } catch (error) {
    console.error("Error fetching programs:", error)
    return NextResponse.json({ error: "Failed to fetch programs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdminAccess(["editor", "admin"])
    if (authError) return authError

    const body = await request.json()

    const program = await prisma.program.create({
      data: {
        name: body.name,
        title: body.title,
        description: body.description,
        tagline: body.tagline,
        mission: body.mission,
        color: body.color,
        logo: body.logo,
        status: body.status || "active",
        displayOrder: body.displayOrder || 0,
      },
    })

    return NextResponse.json(program)
  } catch (error) {
    console.error("Error creating program:", error)
    return NextResponse.json({ error: "Failed to create program" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authError = await requireAdminAccess(["editor", "admin"])
    if (authError) return authError

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Program ID required" }, { status: 400 })
    }

    const body = await request.json()

    const program = await prisma.program.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        tagline: body.tagline,
        mission: body.mission,
        color: body.color,
        logo: body.logo,
        status: body.status,
        displayOrder: body.displayOrder,
      },
    })

    return NextResponse.json(program)
  } catch (error) {
    console.error("Error updating program:", error)
    return NextResponse.json({ error: "Failed to update program" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authError = await requireAdminAccess(["admin"])
    if (authError) return authError

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Program ID required" }, { status: 400 })
    }

    await prisma.program.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting program:", error)
    return NextResponse.json({ error: "Failed to delete program" }, { status: 500 })
  }
}
