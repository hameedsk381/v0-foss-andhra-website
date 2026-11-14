import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdminSessionOrKey } from "@/lib/auth/admin"
import { randomBytes } from "node:crypto"
import { CERTIFICATE_TYPES, CODE_PREFIX, defaultTitleFor } from "@/lib/certificates"

export const dynamic = "force-dynamic"

const createSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200).optional().or(z.literal("")),
  type: z.string().refine((v) => CERTIFICATE_TYPES.some((t) => t.value === v), "Unknown certificate type"),
  title: z.string().trim().min(3).max(150).optional(),
  program: z.string().trim().max(200).optional(),
  description: z.string().trim().max(1000).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})

// GET - list certificates (q searches name, email, code, program)
export async function GET(request: NextRequest) {
  try {
    const { authError } = await requireAdminSessionOrKey(["viewer", "editor", "admin"])
    if (authError) return authError

    const q = request.nextUrl.searchParams.get("q")?.trim()
    const status = request.nextUrl.searchParams.get("status")?.trim()

    const certificates = await prisma.certificate.findMany({
      where: {
        ...(status && status !== "all" ? { status } : {}),
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { email: { contains: q, mode: "insensitive" } },
                { code: { contains: q, mode: "insensitive" } },
                { program: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 500,
    })
    return NextResponse.json({ success: true, data: certificates })
  } catch (error) {
    logError(error as Error, { context: "admin_certificates_list" })
    return NextResponse.json({ success: false, error: "Failed to fetch certificates" }, { status: 500 })
  }
}

// POST - issue a certificate
export async function POST(request: NextRequest) {
  try {
    const { session, authError } = await requireAdminSessionOrKey(["editor", "admin"])
    if (authError) return authError

    const parsed = createSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      )
    }
    const d = parsed.data

    if (d.startDate && d.endDate && d.endDate < d.startDate) {
      return NextResponse.json({ success: false, error: "End date must be after the start date" }, { status: 400 })
    }

    const certificate = await prisma.certificate.create({
      data: {
        code: CODE_PREFIX + randomBytes(4).toString("hex").toUpperCase(),
        name: d.name,
        email: d.email ? d.email.toLowerCase() : null,
        type: d.type,
        title: d.title || defaultTitleFor(d.type),
        program: d.program || null,
        description: d.description || null,
        startDate: d.startDate ? new Date(`${d.startDate}T00:00:00.000Z`) : null,
        endDate: d.endDate ? new Date(`${d.endDate}T00:00:00.000Z`) : null,
        status: "active",
        issuedById: session?.user?.id ?? null,
      },
    })
    return NextResponse.json({ success: true, data: certificate }, { status: 201 })
  } catch (error) {
    logError(error as Error, { context: "admin_certificates_create" })
    return NextResponse.json({ success: false, error: "Failed to create certificate" }, { status: 500 })
  }
}
