
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return NextResponse.json(
            { success: false, error: "Unauthorized" },
            { status: 401 }
        )
    }

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
