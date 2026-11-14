import { prisma } from "@/lib/prisma"

export function memberSlugBase(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 40)
}

// Assign a member's public slug. Slugs are assigned once and kept stable —
// never regenerate for an existing profile, so public URLs do not break.
export async function uniqueMemberSlug(name: string, excludeId?: string) {
  const candidate = memberSlugBase(name) || "member"
  let slug = candidate
  let n = 2
  for (;;) {
    const existing = await prisma.member.findUnique({ where: { publicSlug: slug }, select: { id: true } })
    if (!existing || existing.id === excludeId) return slug
    slug = `${candidate}-${n++}`
  }
}
