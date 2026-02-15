import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { submitContactForm } from "@/app/actions/contact"

const contactApiSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = contactApiSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid request" },
        { status: 400 },
      )
    }

    const result = await submitContactForm(parsed.data)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to submit contact form" },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, message: result.message, id: result.id })
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 })
  }
}
