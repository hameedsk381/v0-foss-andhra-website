import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

const ADMIN_ROLES = new Set(["admin", "editor", "viewer"])
const MUTATION_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"])
const ADMIN_ONLY_API_PREFIXES = ["/api/admin/settings", "/api/admin/newsletter/send"]

function getRole(token: unknown): string {
  const role = (token as any)?.role
  return typeof role === "string" ? role.toLowerCase() : ""
}

function isAdminToken(token: unknown): boolean {
  const userType = (token as any)?.userType
  return userType === "admin" && ADMIN_ROLES.has(getRole(token))
}

function redirectTo(path: string, req: NextRequest) {
  return NextResponse.redirect(new URL(path, req.url))
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const isAuthenticated = !!token
  const role = getRole(token)
  const userType = (token as any)?.userType

  if (pathname === "/admin/login") {
    if (!isAuthenticated) return NextResponse.next()
    return redirectTo(userType === "admin" ? "/admin" : "/member", req)
  }

  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) return redirectTo("/admin/login", req)
    if (!isAdminToken(token)) return redirectTo("/member", req)
    return NextResponse.next()
  }

  if (pathname.startsWith("/api/admin")) {
    if (!isAuthenticated || !isAdminToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (ADMIN_ONLY_API_PREFIXES.some((prefix) => pathname.startsWith(prefix)) && role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    if (MUTATION_METHODS.has(req.method) && role === "viewer") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.next()
  }

  if (pathname.startsWith("/member")) {
    if (!isAuthenticated) return redirectTo("/login", req)
    if (userType === "admin") return redirectTo("/admin", req)
    if (userType !== "member") return redirectTo("/login", req)
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/member/:path*", "/api/admin/:path*"],
}
