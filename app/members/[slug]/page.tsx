import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Github, Globe, Linkedin, MapPin } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { isMembershipActive } from "@/lib/member/tiers"

export const dynamic = "force-dynamic"

async function getMember(slug: string) {
  const member = await prisma.member.findUnique({
    where: { publicSlug: slug },
    select: {
      id: true,
      name: true,
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
  const skills = (m.publicSkills || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)

  const links = [
    m.githubUrl && { icon: Github, href: m.githubUrl, label: "GitHub" },
    m.linkedinUrl && { icon: Linkedin, href: m.linkedinUrl, label: "LinkedIn" },
    m.websiteUrl && { icon: Globe, href: m.websiteUrl, label: "Website" },
  ].filter(Boolean) as { icon: typeof Github; href: string; label: string }[]

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/members" className="hover:text-primary hover:underline">
          ← Member directory
        </Link>
      </nav>

      <Card>
        <CardContent className="p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">{m.name}</h1>
              <p className="mt-1 text-gray-600">
                {[m.designation, m.organization].filter(Boolean).join(" · ") || "FOSStar member"}
              </p>
            </div>
            <Badge variant="secondary">{m.membershipType}</Badge>
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

          <div className="mt-6 text-sm text-gray-600">
            FOSStar member since {m.joinDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
          </div>

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
