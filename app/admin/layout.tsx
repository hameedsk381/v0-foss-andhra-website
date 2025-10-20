import type React from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Link from "next/link"
import { LayoutDashboard, Calendar, Users, Heart, FileText, Settings, LogOut, BookOpen, BarChart, FolderTree, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  // If no session, render children without sidebar (for login page)
  if (!session) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold">FOSS Andhra CMS</h1>
          <p className="text-sm text-blue-100 mt-1">Admin Dashboard</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition"
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/admin/analytics"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition"
          >
            <BarChart className="h-5 w-5" />
            <span>Analytics</span>
          </Link>

          <Link
            href="/admin/events"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition"
          >
            <Calendar className="h-5 w-5" />
            <span>Events</span>
          </Link>

          <Link
            href="/admin/members"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition"
          >
            <Users className="h-5 w-5" />
            <span>Members</span>
          </Link>

          <Link
            href="/admin/donations"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition"
          >
            <Heart className="h-5 w-5" />
            <span>Donations</span>
          </Link>

          <Link
            href="/admin/blog"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition"
          >
            <BookOpen className="h-5 w-5" />
            <span>Blog</span>
          </Link>

          <Link
            href="/admin/content"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition"
          >
            <FileText className="h-5 w-5" />
            <span>Content</span>
          </Link>

          <Link
            href="/admin/programs"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition"
          >
            <FolderTree className="h-5 w-5" />
            <span>Programs</span>
          </Link>

          <Link
            href="/admin/newsletter"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition"
          >
            <Mail className="h-5 w-5" />
            <span>Newsletter</span>
          </Link>

          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition"
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{session.user?.name}</p>
              <p className="text-xs text-blue-100">{session.user?.email}</p>
            </div>
          </div>
          <form action="/api/auth/signout" method="POST">
            <Button type="submit" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-white/10 rounded-lg w-full transition bg-transparent border-0">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
