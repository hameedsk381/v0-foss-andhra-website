import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { workModeLabel } from "@/lib/careers"
import {
  COMMON_RESPONSIBILITIES,
  HR_EMAIL,
  INTERNSHIP_MONTHS,
  POSITION_TERMS,
  SIGNATORY,
  TERMS,
  formatLongDate,
  getRoleProfile,
  officeLine,
} from "@/lib/internship-offer"
import { PrintButton } from "@/components/member/print-button"
import { AcceptOffer } from "./accept-button"

export const dynamic = "force-dynamic"

// Private link: keep it out of search results.
export const metadata: Metadata = {
  title: "Offer Letter | FOSS Andhra",
  robots: { index: false, follow: false },
}

export default async function OfferLetterPage({ params }: { params: { token: string } }) {
  if (!/^[a-f0-9]{48}$/.test(params.token)) notFound()

  const offer = await prisma.careerApplication.findUnique({
    where: { offerToken: params.token },
    include: { CareerOpening: { select: { title: true, department: true, workMode: true, type: true } } },
  })
  if (!offer || !offer.offerRef || !offer.startDate || !offer.endDate || offer.status === "rejected") notFound()

  const title = offer.CareerOpening?.title ?? "Intern"
  const isInternship = !offer.CareerOpening || offer.CareerOpening.type === "internship"
  const profile = getRoleProfile(offer.CareerOpening?.department, title)
  const mode = workModeLabel(offer.CareerOpening?.workMode ?? "hybrid")

  // Whole months between start and end (calendar-aware, minimum 1)
  const monthCount = Math.max(
    1,
    Math.round(
      (new Date(offer.endDate).getTime() - new Date(offer.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30.44),
    ),
  )
  const durationLabel = isInternship ? `${INTERNSHIP_MONTHS} months` : `${monthCount} month${monthCount === 1 ? "" : "s"}`

  const rows: [string, string][] = [
    ["Position", title],
    ["Duration", durationLabel],
    ["Start date", formatLongDate(offer.startDate)],
    ["End date", formatLongDate(offer.endDate)],
    ["Work mode", `${mode} (in-person meetings at ${officeLine()})`],
    ["Stipend", "Unpaid"],
  ]

  return (
    <div className="bg-gray-100 px-4 py-8 print:bg-white print:p-0">
      <div className="mx-auto mb-4 flex max-w-3xl justify-end print:hidden">
        <PrintButton label="Print / Save as PDF" />
      </div>

      <article className="mx-auto max-w-3xl bg-white p-8 text-gray-900 shadow-sm sm:p-12 print:shadow-none">
        <header className="border-b-4 border-[#015ba7] pb-4">
          <h1 className="text-2xl font-bold text-[#015ba7]">FOSS Andhra Foundation</h1>
          <p className="text-sm text-gray-600">Promoting Free and Open Source Software in Andhra Pradesh</p>
        </header>

        <div className="mt-6 flex flex-wrap justify-between gap-2 text-sm">
          <p>
            <strong>Ref:</strong> {offer.offerRef}
          </p>
          <p>
            <strong>Date:</strong> {formatLongDate(offer.offerIssuedAt ?? offer.updatedAt)}
          </p>
        </div>

        <div className="mt-6 text-sm">
          <p className="font-semibold">{offer.name}</p>
          <p className="text-gray-600">{offer.email}</p>
        </div>

        <h2 className="mt-6 text-lg font-bold">
          {isInternship ? "Internship Offer" : "Position Offer"} — {title}
        </h2>

        <p className="mt-4 text-sm leading-relaxed">Dear {offer.name},</p>
        <p className="mt-3 text-sm leading-relaxed">
          {isInternship ? (
            <>
              Congratulations! Following your application and interview, FOSS Andhra is pleased to offer you an
              internship as <strong>{title}</strong> for a period of {durationLabel}. We were impressed by your
              interest and look forward to you joining the community.
            </>
          ) : (
            <>
              Congratulations! Following your application, FOSS Andhra is pleased to offer you the position of{" "}
              <strong>{title}</strong> from {formatLongDate(offer.startDate)} to {formatLongDate(offer.endDate)}. We
              were impressed by your interest and look forward to you joining the community.
            </>
          )}
        </p>

        <table className="mt-5 w-full border-collapse text-sm">
          <tbody>
            {rows.map(([k, v]) => (
              <tr key={k} className="border border-gray-300">
                <th className="w-40 bg-gray-50 px-3 py-2 text-left font-semibold">{k}</th>
                <td className="px-3 py-2">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <section className="mt-6">
          <h3 className="text-base font-bold">Reporting and meeting place</h3>
          <p className="mt-2 text-sm leading-relaxed">
            We meet in person at <strong>{officeLine()}</strong>. Please report there on your start date. Your mentor
            will share the schedule, timings and online check-in details before you begin.
          </p>
        </section>

        <section className="mt-6">
          <h3 className="text-base font-bold">Your role</h3>
          <p className="mt-2 text-sm leading-relaxed">{profile.focus}</p>
          <h4 className="mt-3 text-sm font-semibold">Responsibilities</h4>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed">
            {profile.responsibilities.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <h4 className="mt-3 text-sm font-semibold">
            Expectations from every {isInternship ? "intern" : "team member"}
          </h4>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed">
            {COMMON_RESPONSIBILITIES.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>

        {offer.offerNotes && (
          <section className="mt-6">
            <h3 className="text-base font-bold">Additional details</h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{offer.offerNotes}</p>
          </section>
        )}

        <section className="mt-6">
          <h3 className="text-base font-bold">Terms</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-relaxed">
            {(isInternship ? TERMS : POSITION_TERMS).map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ol>
        </section>

        <p className="mt-6 text-sm leading-relaxed">
          Please accept this offer using the button below. For any questions, write to {HR_EMAIL()}.
        </p>

        <div className="mt-8 text-sm">
          <p>Warm regards,</p>
          <p className="mt-6 font-semibold">{SIGNATORY.name || SIGNATORY.title}</p>
          {SIGNATORY.name && <p>{SIGNATORY.title}</p>}
          <p>FOSS Andhra Foundation</p>
        </div>

        <div className="mt-8 border-t pt-6">
          <AcceptOffer token={params.token} acceptedAt={offer.offerAcceptedAt?.toISOString() ?? null} />
          {offer.offerAcceptedAt && (
            <p className="mt-3 hidden text-sm print:block">
              Accepted electronically on {formatLongDate(offer.offerAcceptedAt)}.
            </p>
          )}
        </div>
      </article>
    </div>
  )
}
