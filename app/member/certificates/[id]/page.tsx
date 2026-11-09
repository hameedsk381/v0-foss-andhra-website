import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { getCurrentMember } from "@/lib/member/session"
import { PrintButton } from "@/components/member/print-button"

export const dynamic = "force-dynamic"

export default async function CertificatePage({ params }: { params: { id: string } }) {
  const member = await getCurrentMember()
  if (!member) redirect("/login")

  const reg = await prisma.registration.findUnique({
    where: { id: params.id },
    include: { Event: { select: { title: true, date: true, location: true } } },
  })

  // Only the attendee themselves can view a certificate, and only if attended.
  if (
    !reg ||
    !reg.attended ||
    reg.createdAt < member.joinDate ||
    reg.email.trim().toLowerCase() !== member.email.trim().toLowerCase()
  ) {
    notFound()
  }

  const certificateNo = `FA-${reg.id.replace(/[^a-zA-Z0-9]/g, "").slice(-10).toUpperCase()}`
  const eventDate = reg.Event?.date
    ? reg.Event.date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : ""

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between print:hidden">
        <Link href="/member/certificates" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> All certificates
        </Link>
        <PrintButton />
      </div>

      <div className="mx-auto max-w-3xl border-4 border-double border-gray-800 bg-white p-6 text-center shadow-sm sm:p-12 print:shadow-none">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">FOSS Andhra</p>
        <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">Certificate of Participation</h1>
        <p className="mt-8 text-gray-600">This is to certify that</p>
        <p className="mt-3 break-words text-2xl font-semibold text-primary sm:text-3xl">{reg.name || member.name}</p>
        <p className="mt-6 text-gray-600">has successfully participated in</p>
        <p className="mt-3 break-words text-xl font-semibold text-gray-900">{reg.Event?.title ?? "a FOSS Andhra event"}</p>
        {(eventDate || reg.Event?.location) && (
          <p className="mt-2 text-sm text-gray-600">
            {[eventDate, reg.Event?.location].filter(Boolean).join(" · ")}
          </p>
        )}
        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t pt-4 text-xs text-gray-500 sm:flex-row">
          <span>Certificate No: {certificateNo}</span>
          <span>Membership ID: {member.membershipId}</span>
        </div>
      </div>
    </div>
  )
}
