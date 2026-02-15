"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Calendar,
  Users,
  Heart,
  FileText,
  Settings,
  LogOut,
  BookOpen,
  BarChart,
  FolderTree,
  Mail,
  Bell,
  Menu,
  X,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/members", label: "Members", icon: Users },
  { href: "/admin/donations", label: "Donations", icon: Heart },
  { href: "/admin/blog", label: "Blog", icon: BookOpen },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/programs", label: "Programs", icon: FolderTree },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/notifications/push", label: "Push Notifications", icon: Bell },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export function ResponsiveSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed left-4 top-3 z-[70]">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="h-10 w-10 rounded-lg border-slate-200 bg-white/95 shadow-md backdrop-blur"
          aria-label={isMobileMenuOpen ? "Close admin menu" : "Open admin menu"}
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[2px] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-primary text-white shadow-xl transition-transform duration-300 lg:translate-x-0 lg:shadow-none",
          "sm:w-80 lg:sticky lg:top-0 lg:h-screen lg:w-64",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isCollapsed && "lg:w-20"
        )}
      >
        {/* Header */}
        <div className="border-b border-white/10 px-5 py-5">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-semibold tracking-tight">FOSS Andhra</h1>
                <p className="mt-1 text-xs text-blue-100">Admin Dashboard</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden text-white hover:bg-white/10 lg:flex"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronRight
                className={cn(
                  "h-4 w-4 transition-transform",
                  isCollapsed && "rotate-180"
                )}
              />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || 
              (item.href !== "/admin" && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white/20 text-white shadow-inner"
                    : "text-blue-100 hover:bg-white/10 hover:text-white",
                  isCollapsed && "justify-center px-2"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-white/10 p-4">
          {!isCollapsed && (
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{session?.user?.name}</p>
                <p className="text-xs text-blue-100 truncate">{session?.user?.email}</p>
              </div>
            </div>
          )}
          <form action="/api/auth/signout" method="POST">
            <Button
              type="submit"
              variant="ghost"
              className={cn(
                "w-full text-white hover:bg-white/10",
                isCollapsed && "justify-center px-0"
              )}
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span className="ml-2 text-sm">Logout</span>}
            </Button>
          </form>
        </div>
      </aside>
    </>
  )
}

