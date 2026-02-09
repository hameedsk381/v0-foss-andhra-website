
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return NextResponse.json(
            { success: false, error: "Unauthorized" },
            { status: 401 }
        )
    }

    try {
        const { status } = await req.json()
        const { id } = params

        if (!status) {
            return NextResponse.json(
                { success: false, error: "Status is required" },
                { status: 400 }
            )
        }

        const comment = await prisma.blogComment.update({
            where: { id },
            data: { status },
        })

        return NextResponse.json({ success: true, data: comment })
    } catch (error) {
        console.error("Error updating comment:", error)
        return NextResponse.json(
            { success: false, error: "Failed to update comment" },
            { status: 500 }
        )
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return NextResponse.json(
            { success: false, error: "Unauthorized" },
            { status: 401 }
        )
    }

    try {
        const { id } = params

        await prisma.blogComment.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting comment:", error)
        return NextResponse.json(
            { success: false, error: "Failed to delete comment" },
            { status: 500 }
        )
    }
}
