import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { isMembershipActive } from "@/lib/member/tiers"

/** Returns the logged-in member from the DB (authoritative status/expiry), or null. */
export async function getCurrentMember() {
  const session = await getServerSession(authOptions)
  const user = session?.user as { id?: string; userType?: string } | undefined
  if (!user?.id || user.userType !== "member") return null

  const member = await prisma.member.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      email: true,
      membershipId: true,
      membershipType: true,
      status: true,
      expiryDate: true,
      joinDate: true,
    },
  })
  if (!member || member.status === "suspended") return null

  return { ...member, active: isMembershipActive(member) }
}
