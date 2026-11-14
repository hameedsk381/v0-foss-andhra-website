import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Award, BookOpen, Github, Globe, Linkedin } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { isMembershipActive } from "@/lib/member/tiers"
import { certificateTypeLabel } from "@/lib/certificates"

export const dynamic = "force-dynamic"

async function getMember(slug: string) {
  const member = await prisma.member.findUnique({
    where: { publicSlug: slug },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      publicSlug: true,
      profileVisible: true,
      publicBio: true,
      publicSkills: true,
      designation: true,
      organization: true,
      membershipType: true,
      joinDate: true,
      expiryDate: true,
      status: true,
      githubUrl: true,
      linkedinUrl: true,
      websiteUrl: true,
    },
  })
  if (!member || !member.profileVisible || member.status === "suspended" || !isMembershipActive(member)) notFound()
  return member
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const m = await getMember(params.slug).catch(() => null)
  if (!m) return { title: "Member not found | FOSS Andhra", robots: { index: false } }
  return {
    title: `${m.name}${m.designation ? ` — ${m.designation}` : ""} | FOSS Andhra Members`,
    description:
      m.publicBio ||
      `${m.name} is a FOSStar member of FOSS Andhra${m.organization ? ` at ${m.organization}` : ""}, building open source in Andhra Pradesh.`,
    alternates: { canonical: `/members/${m.publicSlug}` },
  }
}

export default async function MemberProfilePage({ params }: { params: { slug: string } }) {
  const m = await getMember(params.slug)

  // Profile activity is matched across the platform: certificates by email, learning by membership.
  const [certificates, progress] = await Promise.all([
    prisma.certificate.findMany({
      where: { email: { equals: m.email, mode: "insensitive" }, status: "active" },
      select: { code: true, title: true, type: true, program: true, issuedAt: true },
      orderBy: { issuedAt: "desc" },
      take: 12,
    }),
    prisma.learningProgress.findMany({
      where: { memberId: m.id },
      select: {
        completedAt: true,
        lesson: { select: { slug: true, track: { select: { slug: true, title: true } } } },
      },
      orderBy: { completedAt: "desc" },
      take: 200,
    }),
  ])

  const skills = (m.publicSkills || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)

  const links = [
    m.githubUrl && { icon: Github, href: m.githubUrl, label: "GitHub" },
    m.linkedinUrl && { icon: Linkedin, href: m.linkedinUrl, label: "LinkedIn" },
    m.websiteUrl && { icon: Globe, href: m.websiteUrl, label: "Website" },
  ].filter(Boolean) as { icon: typeof Github; href: string; label: string }[]

  const initials = m.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()

  // Group completed lessons by track for the learning section
  const tracks = new Map<string, { title: string; count: number }>()
  for (const p of progress) {
    const key = p.lesson.track.slug
    const existing = tracks.get(key)
    if (existing) existing.count += 1
    else tracks.set(key, { title: p.lesson.track.title, count: 1 })
  }
  const learningTracks = [...tracks.entries()].map(([slug, t]) => ({ slug, ...t }))

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/members" className="hover:text-primary hover:underline">
          ← Member directory
        </Link>
      </nav>

      <Card>
        <CardContent className="p-8">
          {/* Header: avatar + identity */}
          <div className="flex flex-wrap items-start gap-5">
            {m.avatar ? (
              <Image
                src={m.avatar}
                alt={m.name}
                width={80}
                height={80}
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                {initials || "F"}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold sm:text-3xl">{m.name}</h1>
                <Badge variant="secondary">{m.membershipType}</Badge>
              </div>
              <p className="mt-1 text-gray-600">
                {[m.designation, m.organization].filter(Boolean).join(" · ") || "FOSStar member"}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Member since {m.joinDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
              </p>
            </div>
          </div>

          {m.publicBio && <p className="mt-6 leading-relaxed text-gray-700">{m.publicBio}</p>}

          {skills.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill} className="rounded-full bg-muted px-3 py-1 text-sm text-gray-700">
                  {skill}
                </span>
              ))}
            </div>
          )}

          {links.length > 0 && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {links.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border p-3 text-sm hover:border-primary hover:bg-muted/50"
                >
                  <Icon className="h-4 w-4" /> {label}
                </a>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Certificates earned — verified, publicly verifiable records */}
      {certificates.length > 0 && (
        <Card className="mt-6">
          <CardContent className="p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Award className="h-5 w-5 text-yellow-600" /> Certificates ({certificates.length})
            </h2>
            <div className="mt-3 space-y-2">
              {certificates.map((c) => (
                <Link
                  key={c.code}
                  href={`/certificates/${c.code}`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3 text-sm transition-colors hover:border-primary hover:bg-muted/40"
                >
                  <span>
                    <span className="font-medium">{c.title}</span>
                    {c.program && <span className="text-gray-500"> — {c.program}</span>}
                  </span>
                  <Badge variant="secondary">{certificateTypeLabel(c.type)}</Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Learning activity */}
      {learningTracks.length > 0 && (
        <Card className="mt-6">
          <CardContent className="p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <BookOpen className="h-5 w-5 text-primary" /> Learning ({progress.length} lessons)
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {learningTracks.map((t) => (
                <Link
                  key={t.slug}
                  href={`/learn/${t.slug}`}
                  className="rounded-lg border px-3 py-2 text-sm transition-colors hover:border-primary hover:bg-muted/40"
                >
                  <span className="font-medium">{t.title}</span>
                  <span className="ml-2 text-gray-500">{t.count} lesson{t.count === 1 ? "" : "s"}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-8 rounded-lg border bg-muted/40 p-5 text-center text-sm text-gray-600">
        {m.name} is a member of{" "}
        <Link href="/membership" className="font-semibold text-primary hover:underline">
          FOSStar
        </Link>
        , FOSS Andhra&apos;s membership program supporting open source across Andhra Pradesh.
      </div>
    </div>
  )
}
