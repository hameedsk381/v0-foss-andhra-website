import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { deleteFromMinio } from "@/lib/minio"

// GET single media item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const media = await prisma.media.findUnique({
      where: { id: params.id },
    })

    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: media })
  } catch (error) {
    console.error("Error fetching media:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch media" }, { status: 500 })
  }
}

// PUT update media item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const media = await prisma.media.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        alt: body.alt,
        caption: body.caption,
        program: body.program,
        category: body.category,
        tags: body.tags,
      },
    })

    return NextResponse.json({
      success: true,
      data: media,
      message: "Media updated successfully",
    })
  } catch (error) {
    console.error("Error updating media:", error)
    return NextResponse.json({ success: false, error: "Failed to update media" }, { status: 500 })
  }
}

// DELETE media item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get media to delete file from MinIO
    const media = await prisma.media.findUnique({
      where: { id: params.id },
    })

    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 })
    }

    // Delete from MinIO
    await deleteFromMinio(media.filename)

    // Delete from database
    await prisma.media.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: "Media deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting media:", error)
    return NextResponse.json({ success: false, error: "Failed to delete media" }, { status: 500 })
  }
}
