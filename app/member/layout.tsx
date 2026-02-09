import type React from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { MemberResponsiveSidebar } from "@/components/member/responsive-sidebar"

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
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <MemberResponsiveSidebar />
      {/* Main Content */}
      <main className="flex-1 lg:ml-64 overflow-auto">
        <div className="p-3 lg:p-6">{children}</div>
      </main>
    </div>
  )
}
