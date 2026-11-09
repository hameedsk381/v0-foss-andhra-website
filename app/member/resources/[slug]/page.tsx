import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { prisma } from "@/lib/prisma"
import { getCurrentMember } from "@/lib/member/session"
import { canMemberSeeResource, MEMBER_RESOURCE_TYPE } from "@/lib/member/tiers"

export const dynamic = "force-dynamic"

export default async function MemberResourcePage({ params }: { params: { slug: string } }) {
  const member = await getCurrentMember()
  if (!member) redirect("/login")
  if (!member.active) redirect("/member/resources")

  const resource = await prisma.content.findFirst({
    where: { slug: params.slug, type: MEMBER_RESOURCE_TYPE, status: "published" },
  })
  if (!resource || !canMemberSeeResource(resource.keywords, member.membershipType)) notFound()

  return (
    <article className="mx-auto max-w-3xl space-y-4">
      <Link href="/member/resources" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" /> All resources
      </Link>
      <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">{resource.title}</h1>
        <div className="prose max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{resource.content}</ReactMarkdown>
        </div>
      </div>
    </article>
  )
}
