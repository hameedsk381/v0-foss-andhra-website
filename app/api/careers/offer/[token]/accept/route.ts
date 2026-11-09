import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { strictRateLimit, getRateLimitIdentifier } from "@/lib/rate-limit"
import { logError } from "@/lib/logger"
import { sendAcceptanceConfirmation } from "@/lib/careers-emails"

export const dynamic = "force-dynamic"

// POST - the intern accepts their offer using the private link from the offer email
export async function POST(request: NextRequest, { params }: { params: { token: string } }) {
  try {
    await strictRateLimit.check(request, 10, getRateLimitIdentifier(request))

    if (!/^[a-f0-9]{48}$/.test(params.token)) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 })
    }
    const offer = await prisma.careerApplication.findUnique({
      where: { offerToken: params.token },
      include: { CareerOpening: { select: { title: true } } },
    })
    if (!offer || !offer.startDate) return NextResponse.json({ error: "Offer not found" }, { status: 404 })

    if (offer.status === "rejected") {
      return NextResponse.json({ error: "This offer is no longer valid" }, { status: 400 })
    }
    if (offer.offerAcceptedAt) {
      return NextResponse.json({ success: true, alreadyAccepted: true })
    }
    if (offer.endDate && offer.endDate.getTime() < Date.now()) {
      return NextResponse.json({ error: "This offer has expired. Please contact us." }, { status: 400 })
    }

    await prisma.careerApplication.update({
      where: { id: offer.id },
      data: { offerAcceptedAt: new Date(), status: offer.status === "hired" ? "hired" : "accepted" },
    })
    await sendAcceptanceConfirmation(
      { name: offer.name, email: offer.email },
      offer.CareerOpening?.title ?? "Internship",
      offer.startDate,
    )
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Response) return error
    logError(error as Error, { context: "career_offer_accept" })
    return NextResponse.json({ error: "Could not accept the offer" }, { status: 500 })
  }
}
