import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { prisma } from "@/lib/prisma"
import { getCurrentMember } from "@/lib/member/session"
import { LessonCompleteButton } from "./complete-button"

export const dynamic = "force-dynamic"

async function getLesson(trackSlug: string, lessonSlug: string) {
  const track = await prisma.learningTrack.findUnique({
    where: { slug: trackSlug },
    include: {
      LearningLesson: { where: { status: "published" }, orderBy: { order: "asc" } },
    },
  })
  if (!track || track.status !== "published") notFound()
  const index = track.LearningLesson.findIndex((l) => l.slug === lessonSlug)
  if (index === -1) notFound()
  return { track, lesson: track.LearningLesson[index], index }
}

export async function generateMetadata({
  params,
}: {
  params: { track: string; lesson: string }
}): Promise<Metadata> {
  const data = await getLesson(params.track, params.lesson).catch(() => null)
  if (!data) return { title: "Lesson not found | FOSS Andhra" }
  return {
    title: `${data.lesson.title} — ${data.track.title} | FOSS Andhra`,
    description: data.lesson.summary || data.track.description,
    alternates: { canonical: `/learn/${data.track.slug}/${data.lesson.slug}` },
  }
}

export default async function LessonPage({ params }: { params: { track: string; lesson: string } }) {
  const { track, lesson, index } = await getLesson(params.track, params.lesson)
  const member = await getCurrentMember()

  const completedLessonIds = member
    ? new Set(
        (
          await prisma.learningProgress.findMany({
            where: { memberId: member.id },
            select: { lessonId: true },
          })
        ).map((r) => r.lessonId),
      )
    : new Set<string>()

  const prev = index > 0 ? track.LearningLesson[index - 1] : null
  const next = index < track.LearningLesson.length - 1 ? track.LearningLesson[index + 1] : null

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/learn" className="hover:text-primary hover:underline">
          Learning Hub
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/learn/${track.slug}`} className="hover:text-primary hover:underline">
          {track.title}
        </Link>
      </nav>

      <header>
        <p className="text-sm text-gray-500">
          Lesson {index + 1} of {track.LearningLesson.length} · {lesson.durationMin} min
        </p>
        <h1 className="mt-2 text-3xl font-bold">{lesson.title}</h1>
        {lesson.summary && <p className="mt-3 text-gray-600">{lesson.summary}</p>}
      </header>

      <div className="mt-8 prose prose-zinc dark:prose-invert max-w-none prose-headings:font-display prose-headings:tracking-tight prose-h2:text-2xl prose-h3:text-xl prose-p:leading-7 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-primary prose-blockquote:bg-primary/[0.04] prose-blockquote:py-1 prose-blockquote:pr-4 prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-pre:bg-foreground prose-img:rounded-lg prose-img:shadow-md">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {lesson.content}
        </ReactMarkdown>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
        <LessonCompleteButton
          lessonId={lesson.id}
          initiallyCompleted={completedLessonIds.has(lesson.id)}
          signedIn={Boolean(member)}
        />
        <div className="flex gap-3 text-sm">
          {prev && (
            <Link href={`/learn/${track.slug}/${prev.slug}`} className="text-gray-600 hover:text-primary hover:underline">
              ← {prev.title}
            </Link>
          )}
          {next && (
            <Link
              href={`/learn/${track.slug}/${next.slug}`}
              className="font-semibold text-primary hover:underline"
            >
              {next.title} →
            </Link>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-lg border bg-muted/40 p-5 text-sm text-gray-600">
        Finished this track?{" "}
        <Link href="/certificates" className="font-semibold text-primary hover:underline">
          FOSS Andhra certificates
        </Link>{" "}
        are issued for internships, workshops and events — check what you can earn next.
      </div>
    </div>
  )
}
