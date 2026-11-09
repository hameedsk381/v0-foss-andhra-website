import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowLeft, Briefcase, Clock, MapPin, Wallet } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { ApplyForm } from "../apply-form"
import { isOpeningAcceptingApplications, requiresMembership, typeLabel, workModeLabel } from "@/lib/careers"
import { getCurrentMember } from "@/lib/member/session"
import { InternshipPoster, internshipPosterMetadata } from "@/components/internship-poster"

export const dynamic = "force-dynamic"

async function getOpening(slug: string) {
  const opening = await prisma.careerOpening.findUnique({ where: { slug } })
  // Drafts are never public; closed openings stay viewable but not applicable.
  if (!opening || opening.status === "draft") return null
  return opening
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const opening = await getOpening(params.slug).catch(() => null)
  if (!opening) return { title: "Careers | FOSS Andhra" }
  const title = `${opening.title} | Careers | FOSS Andhra`
  const description = opening.summary ?? undefined
  if (opening.type !== "internship") return { title, description }
  // Internship links share the program poster as the preview image.
  return {
    title,
    description,
    openGraph: { title, description, ...internshipPosterMetadata.openGraph },
    twitter: internshipPosterMetadata.twitter,
  }
}

function Section({ title, body }: { title: string; body?: string | null }) {
  if (!body) return null
  return (
    <section className="mt-6">
      <h2 className="mb-2 text-lg font-semibold">{title}</h2>
      <div className="prose max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
      </div>
    </section>
  )
}

export default async function OpeningPage({ params }: { params: { slug: string } }) {
  const opening = await getOpening(params.slug)
  if (!opening) notFound()

  const accepting = isOpeningAcceptingApplications(opening)
  const membersOnly = requiresMembership(opening.type)
  const member = membersOnly ? await getCurrentMember() : null

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <Link href="/careers" className="mb-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" /> All openings
      </Link>

      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{typeLabel(opening.type)}</Badge>
        {membersOnly && <Badge>FOSStar members only</Badge>}
        {!accepting && <Badge variant="destructive">Closed</Badge>}
      </div>
      <h1 className="text-3xl font-bold">{opening.title}</h1>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-600">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-4 w-4" /> {opening.location} · {workModeLabel(opening.workMode)}
        </span>
        {opening.department && (
          <span className="inline-flex items-center gap-1">
            <Briefcase className="h-4 w-4" /> {opening.department}
          </span>
        )}
        {opening.compensation && (
          <span className="inline-flex items-center gap-1">
            <Wallet className="h-4 w-4" /> {opening.compensation}
          </span>
        )}
        {opening.applyDeadline && (
          <span className="inline-flex items-center gap-1">
            <Clock className="h-4 w-4" /> Apply by {opening.applyDeadline.toLocaleDateString("en-IN")}
          </span>
        )}
      </div>

      {opening.type === "internship" && (
        <div className="mt-6">
          <InternshipPoster href="/careers?type=internship" sizes="(min-width: 768px) 768px, 100vw" />
        </div>
      )}

      <Section title="About the role" body={opening.description} />
      <Section title="Requirements" body={opening.requirements} />
      <Section title="What you get" body={opening.benefits} />

      <section className="mt-10 rounded-lg border bg-white p-6">
        {!accepting ? (
          <p className="text-sm text-gray-600">This opening is no longer accepting applications.</p>
        ) : membersOnly && !member ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-700">
              This opportunity is open to FOSStar members only. Log in to apply, or become a member first.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/login">
                <Button>Log in</Button>
              </Link>
              <Link href="/membership">
                <Button variant="outline">Become a FOSStar member</Button>
              </Link>
            </div>
          </div>
        ) : membersOnly && member && !member.active ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-700">
              Your FOSStar membership has expired. Renew it to apply.
            </p>
            <Link href="/member/membership/renew">
              <Button>Renew membership</Button>
            </Link>
          </div>
        ) : opening.externalApplyUrl ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Applications for this role are handled on an external page.</p>
            <a href={opening.externalApplyUrl} target="_blank" rel="noopener noreferrer">
              <Button>Apply on external site</Button>
            </a>
          </div>
        ) : (
          <ApplyForm
            openingId={opening.id}
            heading="Apply for this role"
            prefill={member ? { name: member.name, email: member.email } : undefined}
          />
        )}
      </section>
    </div>
  )
}
