"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function setPassword(token: string, password: string) {
    try {
        if (!token || !password) {
            return { success: false, error: "Missing token or password" }
        }

        if (password.length < 8) {
            return { success: false, error: "Password must be at least 8 characters long" }
        }

        // Find member with valid token
        const member = await prisma.member.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: {
                    gt: new Date(),
                },
            },
        })

        if (!member) {
            return { success: false, error: "Invalid or expired token" }
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Update member password and clear token
        await prisma.member.update({
            where: { id: member.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
                status: "active", // Ensure account is active
            },
        })

        return { success: true, message: "Password set successfully. You can now login." }
    } catch (error) {
        console.error("Error setting password:", error)
        return { success: false, error: "Failed to set password" }
    }
}
