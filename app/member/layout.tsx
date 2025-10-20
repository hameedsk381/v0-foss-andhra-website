import type React from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Link from "next/link"
import { LayoutDashboard, User, Calendar, FileText, CreditCard, LogOut, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

async function getMemberSession() {
  const session = await getServerSession(authOptions)
  return session
}

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getMemberSession()

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/login")
  }

  // Redirect admins to admin panel
  if ((session.user as any).userType === "admin") {
    redirect("/admin")
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-primary">Member Portal</h1>
          <p className="text-sm text-gray-600 mt-1">FOSS Andhra</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link
            href="/member"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            <LayoutDashboard className="h-5 w-5 text-gray-600" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/member/profile"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            <User className="h-5 w-5 text-gray-600" />
            <span>Profile</span>
          </Link>

          <Link
            href="/member/membership"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            <CreditCard className="h-5 w-5 text-gray-600" />
            <span>Membership</span>
          </Link>

          <Link
            href="/member/events"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            <Calendar className="h-5 w-5 text-gray-600" />
            <span>My Events</span>
          </Link>

          <Link
            href="/member/certificates"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            <FileText className="h-5 w-5 text-gray-600" />
            <span>Certificates</span>
          </Link>

          <Link
            href="/member/notifications"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            <Bell className="h-5 w-5 text-gray-600" />
            <span>Notifications</span>
          </Link>
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{session.user?.name}</p>
              <p className="text-xs text-gray-500">{session.user?.email}</p>
            </div>
          </div>
          <form action="/api/auth/signout" method="POST">
            <Button type="submit" variant="outline" className="flex items-center gap-2 px-4 py-2 text-sm w-full">
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
