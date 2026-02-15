import type React from "react"
import { redirect } from "next/navigation"
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
  
  // Defense in depth: authenticated members should never view admin layout
  if ((session.user as any).userType !== "admin") {
    redirect("/member")
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 lg:flex">
      <ResponsiveSidebar />
      <main className="min-w-0 flex-1 overflow-x-hidden">
        <div className="mx-auto w-full max-w-7xl px-4 pb-8 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-8">
          {children}
        </div>
      </main>
      <KeyboardShortcuts />
    </div>
  )
}
