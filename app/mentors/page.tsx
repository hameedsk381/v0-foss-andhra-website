import type { Metadata } from "next"
import Link from "next/link"
import { Github, Linkedin } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { expertiseTags } from "@/lib/mentors"
import { getCurrentMember } from "@/lib/member/session"
import { MentorApplyForm } from "./mentor-apply-form"
import { MentorshipRequestForm } from "./request-form"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Find a Mentor — Open Source Mentorship | FOSS Andhra",
  description:
    "Get matched with experienced open source contributors and mentors across Andhra Pradesh and beyond. FOSStar members can request mentorship for free.",
  alternates: { canonical: "/mentors" },
}

export default async function MentorsPage() {
  const [mentors, member] = await Promise.all([
    prisma.mentorProfile.findMany({
      where: { status: "approved" },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    }),
    getCurrentMember(),
  ])

  // Mentors who are also FOSStar members get a link to their public profile
  const mentorEmails = [...new Set(mentors.map((m) => m.email.toLowerCase()))]
  const memberProfiles = mentorEmails.length
    ? await prisma.member.findMany({
        where: {
          email: { in: mentorEmails, mode: "insensitive" },
          profileVisible: true,
          status: "active",
          expiryDate: { gt: new Date() },
          publicSlug: { not: null },
        },
        select: { email: true, publicSlug: true },
      })
    : []
  const profileByEmail = new Map(memberProfiles.map((p) => [p.email.toLowerCase(), p.publicSlug]))

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Mentorship</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Learn from people who ship open source</h1>
        <p className="mx-auto mt-3 max-w-2xl text-gray-600">
          Volunteer mentors — engineers, maintainers, educators — offer their time to guide FOSStar members through
          their first contributions, career choices and technical challenges.
        </p>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-bold">Our mentors</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {mentors.map((m) => (
            <Card key={m.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">
                      {profileByEmail.get(m.email.toLowerCase()) ? (
                        <Link
                          href={`/members/${profileByEmail.get(m.email.toLowerCase())}`}
                          className="hover:text-primary hover:underline"
                        >
                          {m.name}
                        </Link>
                      ) : (
                        m.name
                      )}
                    </h3>
                    <p className="text-sm text-gray-600">{m.headline}</p>
                  </div>
                  <Badge variant="secondary">{m.maxMentees} slots</Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {expertiseTags(m.expertise).slice(0, 6).map((tag) => (
                    <span key={tag} className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-gray-700">
                      {tag}
                    </span>
                  ))}
                </div>
                {m.bio && <p className="mt-3 text-sm text-gray-600">{m.bio}</p>}
                {m.availability && <p className="mt-2 text-xs text-gray-500">Availability: {m.availability}</p>}
                {(m.githubUrl || m.linkedinUrl) && (
                  <div className="mt-3 flex gap-2">
                    {m.githubUrl && (
                      <a href={m.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                        <Github className="h-4 w-4 text-gray-500 hover:text-primary" />
                      </a>
                    )}
                    {m.linkedinUrl && (
                      <a href={m.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <Linkedin className="h-4 w-4 text-gray-500 hover:text-primary" />
                      </a>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {mentors.length === 0 && (
            <Card className="sm:col-span-2">
              <CardContent className="py-10 text-center text-sm text-gray-500">
                The first mentors are being approved — check back soon.
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold">Request mentorship</h2>
          <p className="mt-2 text-sm text-gray-600">
            Mentorship is a FOSStar member benefit. Tell us your goals and our team will match you with the right
            mentor.
          </p>
          <div className="mt-4">
            {member ? (
              member.active ? (
                <MentorshipRequestForm
                  mentors={mentors.map((m) => ({ id: m.id, name: m.name, headline: m.headline }))}
                  prefill={{ name: member.name, email: member.email }}
                />
              ) : (
                <Card>
                  <CardContent className="space-y-3 py-8 text-center">
                    <p className="text-sm text-gray-600">Your membership has expired.</p>
                    <Link href="/member/membership/renew" className="font-semibold text-primary hover:underline">
                      Renew to request mentorship →
                    </Link>
                  </CardContent>
                </Card>
              )
            ) : (
              <Card>
                <CardContent className="space-y-3 py-8 text-center text-sm text-gray-600">
                  <p>Sign in with your FOSStar membership to request a mentor.</p>
                  <div className="flex justify-center gap-4 text-sm font-semibold">
                    <Link href="/login" className="text-primary hover:underline">
                      Sign in
                    </Link>
                    <Link href="/membership" className="text-primary hover:underline">
                      Join FOSStar
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold">Become a mentor</h2>
          <p className="mt-2 text-sm text-gray-600">
            Experienced in open source? Offer a couple of hours a month to guide the next generation. Applications are
            reviewed by the FOSS Andhra team.
          </p>
          <div className="mt-4">
            <MentorApplyForm />
          </div>
        </div>
      </section>
    </div>
  )
}
