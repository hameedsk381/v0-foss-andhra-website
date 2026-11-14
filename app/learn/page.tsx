import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { levelBadgeClass, levelLabel } from "@/lib/learning"
import { getCurrentMember } from "@/lib/member/session"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Learning Hub — Free Open Source Courses | FOSS Andhra",
  description:
    "Free structured learning tracks from FOSS Andhra: Git and GitHub basics, Linux, and making your first open source contribution. Built for students across Andhra Pradesh.",
  alternates: { canonical: "/learn" },
}

export default async function LearnPage() {
  const [tracks, member] = await Promise.all([
    prisma.learningTrack.findMany({
      where: { status: "published" },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      include: {
        LearningLesson: { where: { status: "published" }, orderBy: { order: "asc" }, select: { id: true, durationMin: true } },
      },
    }),
    getCurrentMember(),
  ])

  let completedCount = 0
  if (member) {
    completedCount = await prisma.learningProgress.count({ where: { memberId: member.id } })
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">FOSS Andhra Learning Hub</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Learn open source, free, at your pace</h1>
        <p className="mx-auto mt-3 max-w-2xl text-gray-600">
          Short, practical tracks that take you from installing Linux to making your first real open source
          contribution. Written for students in Andhra Pradesh — no prior experience needed.
        </p>
        {member && (
          <p className="mt-4 text-sm text-gray-700">
            Signed in as <strong>{member.name}</strong> — {completedCount} lesson{completedCount === 1 ? "" : "s"} completed so far.
          </p>
        )}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {tracks.map((track) => {
          const totalMin = track.LearningLesson.reduce((s, l) => s + l.durationMin, 0)
          return (
            <Card key={track.id} className="flex flex-col transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">
                    <Link href={`/learn/${track.slug}`} className="hover:text-primary hover:underline">
                      {track.title}
                    </Link>
                  </CardTitle>
                  <Badge variant="secondary" className={levelBadgeClass(track.level)}>
                    {levelLabel(track.level)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between gap-4">
                <p className="text-sm text-gray-600">{track.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>
                    {track.LearningLesson.length} lessons · ~{totalMin >= 60 ? `${Math.round(totalMin / 60)} h` : `${totalMin} min`}
                  </span>
                  <Link href={`/learn/${track.slug}`} className="font-semibold text-primary hover:underline">
                    Start learning →
                  </Link>
                </div>
              </CardContent>
            </Card>
          )
        })}
        {tracks.length === 0 && (
          <Card className="sm:col-span-2">
            <CardContent className="py-12 text-center text-gray-500">
              Learning tracks are being published — check back soon.
            </CardContent>
          </Card>
        )}
      </div>

      {!member && tracks.length > 0 && (
        <div className="mt-10 rounded-lg border bg-muted/40 p-6 text-center">
          <h2 className="text-lg font-semibold">Track your progress with FOSStar membership</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-gray-600">
            Reading is free for everyone. FOSStar members can mark lessons complete, keep their progress, and earn
            certificates for finishing tracks.
          </p>
          <div className="mt-4 flex justify-center gap-3 text-sm">
            <Link href="/membership" className="font-semibold text-primary hover:underline">
              Join FOSStar
            </Link>
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
