
import { NextResponse } from "next/server"
import { requireAdminAccess } from "@/lib/auth/admin"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
    const authError = await requireAdminAccess(["viewer", "editor", "admin"])
    if (authError) return authError

    try {
        const { searchParams } = new URL(req.url)
        const status = searchParams.get("status") || "all"

        const where: any = {}
        if (status !== "all") {
            where.status = status
        }

        const comments = await prisma.blogComment.findMany({
            where,
            include: {
                post: {
                    select: {
                        title: true,
                        slug: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        })

        return NextResponse.json({ success: true, data: comments })
    } catch (error) {
        console.error("Error fetching comments:", error)
        return NextResponse.json(
            { success: false, error: "Failed to fetch comments" },
            { status: 500 }
        )
    }
}
