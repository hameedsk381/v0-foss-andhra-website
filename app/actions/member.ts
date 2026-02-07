"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

export async function changePasswordMember(data: any) {
    try {
        const session = await getServerSession(authOptions)

        // Check if session exists and is a member
        if (!session || (session.user as any).userType !== "member") {
            return { success: false, error: "Unauthorized. Please log in again." }
        }

        const validatedData = changePasswordSchema.parse(data)

        const member = await prisma.member.findUnique({
            where: { id: (session.user as any).id },
        })

        if (!member || !member.password) {
            return { success: false, error: "Member account not found or password not set." }
        }

        // Verify current password
        const isMatch = await bcrypt.compare(validatedData.currentPassword, member.password)
        if (!isMatch) {
            return { success: false, error: "The current password you entered is incorrect." }
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(validatedData.newPassword, 10)

        // Update database
        await prisma.member.update({
            where: { id: member.id },
            data: { password: hashedPassword },
        })

        return { success: true, message: "Your password has been updated successfully!" }
    } catch (error) {
        console.error("Change password error:", error)
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message }
        }
        return { success: false, error: "An unexpected error occurred. Please try again later." }
    }
}
