import Link from "next/link"
import { redirect } from "next/navigation"
import { Award } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { getCurrentMember } from "@/lib/member/session"

export const dynamic = "force-dynamic"

export default async function MemberCertificatesPage() {
  const member = await getCurrentMember()
  if (!member) redirect("/login")

  const attended = await prisma.registration.findMany({
    where: {
      email: { equals: member.email.trim(), mode: "insensitive" },
      attended: true,
      createdAt: { gte: member.joinDate },
    },
    orderBy: { createdAt: "desc" },
    include: { Event: { select: { title: true, date: true, location: true } } },
  })

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">My Certificates</h1>
        <p className="mt-1 text-sm text-gray-600">
          A certificate of participation is issued for every event you attended.
        </p>
      </div>

      {attended.length === 0 ? (
        <Card>
          <CardContent className="space-y-3 py-10 text-center">
            <Award className="mx-auto h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-600">
              No certificates yet. Certificates appear here once an organizer marks you as attended at an event.
            </p>
            <Link href="/events">
              <Button variant="outline">Browse Events</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {attended.map((reg) => (
            <Card key={reg.id}>
              <CardContent className="flex items-center justify-between gap-3 py-4">
                <div className="min-w-0">
                  <p className="truncate font-medium">{reg.Event?.title ?? "Community event"}</p>
                  {reg.Event?.date && (
                    <p className="text-xs text-gray-500">{reg.Event.date.toLocaleDateString()}</p>
                  )}
                </div>
                <Link href={`/member/certificates/${reg.id}`}>
                  <Button size="sm">
                    <Award className="mr-1 h-4 w-4" /> View
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
