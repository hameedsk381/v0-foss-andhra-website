"use server"

import { prisma } from "@/lib/prisma"

interface ContactFormData {
    name: string
    email: string
    phone?: string
    subject: string
    message: string
}

export async function submitContactForm(data: ContactFormData) {
    try {
        // Validate required fields
        if (!data.name || !data.email || !data.message) {
            return { success: false, error: "Missing required fields" }
        }

        // Save to database
        const inquiry = await prisma.inquiry.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                subject: data.subject,
                message: data.message,
                status: "new",
            },
        })

        // TODO: Send notification email (if email service is configured)

        return { success: true, message: "Message sent successfully!", id: inquiry.id }
    } catch (error) {
        console.error("Error submitting contact form:", error)
        return { success: false, error: "Failed to send message" }
    }
}
