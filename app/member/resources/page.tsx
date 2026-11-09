import Link from "next/link"
import { redirect } from "next/navigation"
import { BookOpen, Lock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { getCurrentMember } from "@/lib/member/session"
import { canMemberSeeResource, MEMBER_RESOURCE_TYPE } from "@/lib/member/tiers"

export const dynamic = "force-dynamic"

export default async function MemberResourcesPage() {
  const member = await getCurrentMember()
  if (!member) redirect("/login")

  if (!member.active) {
    return (
      <Card className="mx-auto max-w-xl">
        <CardContent className="space-y-3 py-10 text-center">
          <Lock className="mx-auto h-8 w-8 text-gray-400" />
          <h1 className="text-lg font-semibold">Resources are for active members</h1>
          <p className="text-sm text-gray-600">Your membership has expired. Renew to regain access.</p>
          <Link href="/member/membership/renew">
            <Button>Renew Membership</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  const all = await prisma.content.findMany({
    where: { type: MEMBER_RESOURCE_TYPE, status: "published" },
    orderBy: { updatedAt: "desc" },
    select: { id: true, slug: true, title: true, metaDescription: true, keywords: true, updatedAt: true },
  })
  const resources = all.filter((r) => canMemberSeeResource(r.keywords, member.membershipType))

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Member Resources</h1>
        <p className="mt-1 text-sm text-gray-600">Guides and materials available only to FOSS Andhra members.</p>
      </div>

      {resources.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-gray-500">
            No resources have been published for your membership yet. Check back soon.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {resources.map((r) => (
            <Link key={r.id} href={`/member/resources/${r.slug}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BookOpen className="h-4 w-4 shrink-0 text-primary" />
                    {r.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {r.metaDescription && <p className="line-clamp-2 text-sm text-gray-600">{r.metaDescription}</p>}
                  <p className="mt-2 text-xs text-gray-400">Updated {r.updatedAt.toLocaleDateString()}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
