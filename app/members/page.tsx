import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { isMembershipActive } from "@/lib/member/tiers"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Member Directory | FOSS Andhra",
  description:
    "Meet the students and professionals building open source in Andhra Pradesh. Browse public profiles of FOSS Andhra's FOSStar members — skills, GitHub, and contributions.",
  alternates: { canonical: "/members" },
}

export default async function MembersPage() {
  const members = await prisma.member.findMany({
    where: { profileVisible: true, status: { not: "suspended" }, publicSlug: { not: null } },
    select: {
      id: true,
      name: true,
      publicSlug: true,
      publicBio: true,
      publicSkills: true,
      designation: true,
      organization: true,
      membershipType: true,
      joinDate: true,
      expiryDate: true,
      avatar: true,
    },
    orderBy: { joinDate: "desc" },
    take: 200,
  })

  const visible = members.filter((m) => isMembershipActive(m))

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">FOSStar Member Directory</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">People building open source in Andhra Pradesh</h1>
        <p className="mx-auto mt-3 max-w-2xl text-gray-600">
          Public profiles of FOSS Andhra members — every FOSStar member gets one automatically. Hiring for an open
          source role or looking for collaborators? Start with these portfolios.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {visible.map((m) => (
          <Card key={m.id} className="transition-shadow hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    href={`/members/${m.publicSlug}`}
                    className="font-semibold text-lg hover:text-primary hover:underline"
                  >
                    {m.name}
                  </Link>
                  <p className="text-sm text-gray-500">
                    {[m.designation, m.organization].filter(Boolean).join(" · ") || "FOSStar member"}
                  </p>
                </div>
                <Badge variant="secondary" className="shrink-0">
                  {m.membershipType}
                </Badge>
              </div>
              {m.publicBio && <p className="mt-3 text-sm text-gray-600">{m.publicBio}</p>}
              {m.publicSkills && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {m.publicSkills
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .slice(0, 6)
                    .map((skill) => (
                      <span key={skill} className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-gray-700">
                        {skill}
                      </span>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {visible.length === 0 && (
          <Card className="sm:col-span-2">
            <CardContent className="py-12 text-center text-gray-500">
              No public profiles yet. New FOSStar members get one automatically on signup.
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mt-10 rounded-lg border bg-muted/40 p-6 text-center text-sm text-gray-600">
        Want your profile here?{" "}
        <Link href="/membership" className="font-semibold text-primary hover:underline">
          Join FOSStar
        </Link>{" "}
        — every member gets a public profile automatically.
      </div>
    </div>
  )
}
