import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CheckCircle2, Circle } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { levelBadgeClass, levelLabel } from "@/lib/learning"
import { getCurrentMember } from "@/lib/member/session"

export const dynamic = "force-dynamic"

async function getTrack(slug: string) {
  const track = await prisma.learningTrack.findUnique({
    where: { slug },
    include: { LearningLesson: { where: { status: "published" }, orderBy: { order: "asc" } } },
  })
  if (!track || track.status !== "published") notFound()
  return track
}

export async function generateMetadata({ params }: { params: { track: string } }): Promise<Metadata> {
  const track = await getTrack(params.track).catch(() => null)
  if (!track) return { title: "Track not found | FOSS Andhra" }
  return {
    title: `${track.title} — Learning Track | FOSS Andhra`,
    description: track.description,
    alternates: { canonical: `/learn/${track.slug}` },
  }
}

export default async function TrackPage({ params }: { params: { track: string } }) {
  const track = await getTrack(params.track)
  const member = await getCurrentMember()

  const completedLessonIds = member
    ? new Set(
        (
          await prisma.learningProgress.findMany({
            where: { memberId: member.id, lessonId: { in: track.LearningLesson.map((l) => l.id) } },
            select: { lessonId: true },
          })
        ).map((r) => r.lessonId),
      )
    : new Set<string>()

  const totalMin = track.LearningLesson.reduce((s, l) => s + l.durationMin, 0)
  const doneCount = track.LearningLesson.filter((l) => completedLessonIds.has(l.id)).length

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/learn" className="hover:text-primary hover:underline">
          ← Learning Hub
        </Link>
      </nav>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">{track.title}</h1>
          <p className="mt-2 max-w-2xl text-gray-600">{track.description}</p>
        </div>
        <Badge variant="secondary" className={levelBadgeClass(track.level)}>
          {levelLabel(track.level)}
        </Badge>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        {track.LearningLesson.length} lessons · ~{totalMin >= 60 ? `${Math.round(totalMin / 60)} h` : `${totalMin} min`}
        {member ? ` · ${doneCount}/${track.LearningLesson.length} completed` : " · sign in to track progress"}
      </p>
      {member && track.LearningLesson.length > 0 && (
        <div className="mt-3 h-2 w-full max-w-md overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary" style={{ width: `${(doneCount / track.LearningLesson.length) * 100}%` }} />
        </div>
      )}

      <div className="mt-8 space-y-3">
        {track.LearningLesson.map((lesson, index) => {
          const done = completedLessonIds.has(lesson.id)
          return (
            <Card key={lesson.id} className={done ? "border-green-300 bg-green-50/50" : ""}>
              <CardContent className="flex items-center justify-between gap-3 py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-gray-700">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <Link
                      href={`/learn/${track.slug}/${lesson.slug}`}
                      className="block truncate font-medium hover:text-primary hover:underline"
                    >
                      {lesson.title}
                    </Link>
                    {lesson.summary && <p className="mt-0.5 truncate text-sm text-gray-500">{lesson.summary}</p>}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-xs text-gray-500">{lesson.durationMin} min</span>
                  {member &&
                    (done ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" aria-label="Completed" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-300" aria-label="Not completed" />
                    ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {!member && (
        <p className="mt-6 text-sm text-gray-600">
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>{" "}
          with your FOSStar membership to mark lessons complete and keep your progress.
        </p>
      )}
    </div>
  )
}
