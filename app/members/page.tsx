import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { isMembershipActive } from "@/lib/member/tiers"
import { cn } from "@/lib/utils"

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
    <div className="flex flex-col min-h-screen">
      <section className="w-full border-b border-border bg-primary/[0.04] py-10 sm:py-14">
        <div className="app-container">
          <p className="eyebrow mb-4">FOSStar member directory</p>
          <h1 className="max-w-3xl font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-foreground text-balance">
            People building <span className="text-primary">open source in Andhra Pradesh.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Public profiles of FOSS Andhra members — every FOSStar member gets one automatically. Hiring for an open
            source role or looking for collaborators? Start with these portfolios.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/membership" className="cta-primary w-full sm:w-auto">
              Join FOSStar <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="w-full section-shell bg-background">
        <div className="app-container">
          {visible.length > 0 ? (
            /* Law of common region: the directory reads as one bounded grid, not loose cards.
               Law of similarity: every row shares one recipe; the hairline is the only divider. */
            <div className="overflow-hidden rounded-lg border border-border bg-border">
              <div className="grid gap-px sm:grid-cols-2">
                {visible.map((m, index) => {
                  const initials = m.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                  const featured = index === 0 && visible.length > 2
                  const skills = (m.publicSkills ?? "")
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .slice(0, 6)

                  return (
                    <Link
                      key={m.id}
                      href={`/members/${m.publicSlug}`}
                      /* Fitts's law: the whole tile is the target, not just the name */
                      className={cn(
                        "group flex flex-col bg-card p-5 transition-colors hover:bg-muted/40",
                        featured && "sm:col-span-2",
                      )}
                    >
                      <div className="flex items-start gap-4">
                        {m.avatar ? (
                          <Image
                            src={m.avatar}
                            alt={m.name}
                            width={56}
                            height={56}
                            className="h-14 w-14 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary">
                            {initials || "F"}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              {featured && (
                                /* Von Restorff: exactly one member is called out */
                                <span className="mb-1.5 inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                                  Newest member
                                </span>
                              )}
                              <h2
                                className={cn(
                                  "font-display font-bold text-foreground",
                                  featured ? "text-xl sm:text-2xl" : "text-lg",
                                )}
                              >
                                {m.name}
                              </h2>
                              <p className="text-sm text-muted-foreground">
                                {[m.designation, m.organization].filter(Boolean).join(" · ") || "FOSStar member"}
                              </p>
                            </div>
                            <Badge variant="secondary" className="shrink-0">
                              {m.membershipType}
                            </Badge>
                          </div>

                          {m.publicBio && (
                            <p
                              className={cn(
                                "mt-3 text-sm leading-relaxed text-muted-foreground",
                                featured ? "line-clamp-3" : "line-clamp-2",
                              )}
                            >
                              {m.publicBio}
                            </p>
                          )}

                          {skills.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-foreground/80"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}

                          <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all group-hover:gap-2">
                            View profile <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No public profiles yet. New FOSStar members get one automatically on signup.
              </CardContent>
            </Card>
          )}

          <div className="mt-10 flex flex-col items-start gap-3 rounded-lg border border-border bg-muted/40 p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Want your profile here? Every member gets a public profile automatically.
            </p>
            <Link href="/membership" className="cta-primary w-full sm:w-auto">
              Join FOSStar <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
