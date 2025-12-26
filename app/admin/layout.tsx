import type React from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { ResponsiveSidebar } from "@/components/admin/responsive-sidebar"
import { KeyboardShortcuts } from "@/components/admin/keyboard-shortcuts"

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
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <ResponsiveSidebar />
      {/* Main Content */}
      <main className="flex-1 lg:ml-64 overflow-auto">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
      <KeyboardShortcuts />
    </div>
  )
}
