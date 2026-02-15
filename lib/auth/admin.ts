import type { Session } from "next-auth"
import { NextResponse } from "next/server"
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
