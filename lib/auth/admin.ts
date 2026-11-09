import type { Session } from "next-auth"
import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"
import { isValidContentApiKey, readPresentedKey } from "@/lib/auth/api-key"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export type AdminRole = "admin" | "editor" | "viewer"

const ADMIN_ROLES = new Set<AdminRole>(["admin", "editor", "viewer"])

function getSessionRole(session: Session): AdminRole | null {
  const role = String((session.user as any)?.role || "").toLowerCase()
  return ADMIN_ROLES.has(role as AdminRole) ? (role as AdminRole) : null
}

function isAdminUser(session: Session): boolean {
  return (session.user as any)?.userType === "admin"
}

export function ensureAdminAccess(session: Session | null, allowedRoles: AdminRole[]) {
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!isAdminUser(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const role = getSessionRole(session)
  if (!role || !allowedRoles.includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return null
}

export async function requireAdminAccess(allowedRoles: AdminRole[]) {
  const session = await getServerSession(authOptions)
  return ensureAdminAccess(session, allowedRoles)
}

export async function requireAdminSession(allowedRoles: AdminRole[]) {
  const session = await getServerSession(authOptions)
  const authError = ensureAdminAccess(session, allowedRoles)
  return { session, authError }
}

/**
 * Like requireAdminSession, but a valid content API key is also accepted. The key acts
 * as an "editor": it cannot reach routes that require the "admin" role (e.g. deletes).
 * Use only on content routes (content, blog posts, career openings).
 */
export async function requireAdminSessionOrKey(allowedRoles: AdminRole[]) {
  const presented = readPresentedKey(headers())
  if (presented) {
    if (!isValidContentApiKey(presented)) {
      return { session: null as unknown as Session, authError: NextResponse.json({ error: "Invalid API key" }, { status: 401 }) }
    }
    if (!allowedRoles.includes("editor")) {
      return { session: null as unknown as Session, authError: NextResponse.json({ error: "Forbidden" }, { status: 403 }) }
    }

    // Attribute API-key changes to the env admin (or the oldest admin) so author relations stay valid.
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
    const admin =
      (email ? await prisma.admin.findUnique({ where: { email } }) : null) ??
      (await prisma.admin.findFirst({ orderBy: { createdAt: "asc" } }))
    if (!admin) {
      return {
        session: null as unknown as Session,
        authError: NextResponse.json({ error: "No admin account exists to attribute this change to" }, { status: 503 }),
      }
    }

    const session = {
      user: { id: admin.id, email: admin.email, name: `${admin.name} (API key)`, role: "editor", userType: "admin" },
      expires: new Date(Date.now() + 60_000).toISOString(),
    } as unknown as Session
    return { session, authError: null }
  }

  return requireAdminSession(allowedRoles)
}

export async function requireAdminAccessOrKey(allowedRoles: AdminRole[]) {
  const { authError } = await requireAdminSessionOrKey(allowedRoles)
  return authError
}
