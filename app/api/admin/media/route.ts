import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { uploadToMinio, deleteFromMinio } from "@/lib/minio"
import sharp from "sharp"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]

// GET all media/gallery items
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const program = searchParams.get("program")
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    const where: any = {}

    if (program && program !== "all") {
      where.program = program
    }

    if (category && category !== "all") {
      where.category = category
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { contains: search, mode: "insensitive" } },
      ]
    }

    const media = await prisma.media.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ success: true, data: media })
  } catch (error) {
    console.error("Error fetching media:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch media" }, { status: 500 })
  }
}

// POST upload new media
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const program = formData.get("program") as string
    const category = formData.get("category") as string
    const tags = formData.get("tags") as string
    const alt = formData.get("alt") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only images are allowed." },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split('.').pop()
    const filename = `gallery/${timestamp}-${randomString}.${extension}`

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Optimize image with sharp
    let optimizedBuffer = buffer
    try {
      optimizedBuffer = await sharp(buffer)
        .resize(1920, 1920, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({ quality: 90, progressive: true })
        .toBuffer()
    } catch (error) {
      console.error("Image optimization failed:", error)
    }

    // Upload to MinIO
    const uploadResult = await uploadToMinio(
      optimizedBuffer,
      filename,
      file.type,
      {
        originalName: file.name,
        uploadedBy: session.user?.email || "admin",
      }
    )

    if (!uploadResult.success) {
      return NextResponse.json(
        { error: "Failed to upload file to storage" },
        { status: 500 }
      )
    }

    // Save to database
    const media = await prisma.media.create({
      data: {
        filename,
        originalName: file.name,
        mimeType: file.type,
        size: optimizedBuffer.length,
        url: uploadResult.url || '',
        title: title || file.name,
        description,
        alt: alt || title,
        caption: description,
        program,
        category,
        tags,
        uploadedBy: session.user?.email || "admin",
      },
    })

    return NextResponse.json({
      success: true,
      data: media,
      message: "Image uploaded successfully",
    })
  } catch (error) {
    console.error("Error uploading media:", error)
    return NextResponse.json({ success: false, error: "Failed to upload media" }, { status: 500 })
  }
}
