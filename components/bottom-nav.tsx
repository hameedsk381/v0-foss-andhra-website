"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calendar, BookOpen, Users, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/blog", label: "Blog", icon: BookOpen },
  { href: "/programs", label: "Programs", icon: Users },
  { href: "/member", label: "Profile", icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  // Only show on mobile and for public pages
  const isPublicPage = !pathname.startsWith("/admin")
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768

  if (!isPublicPage || !isMobile) {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50 md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || 
            (item.href !== "/" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full transition-colors",
                isActive
                  ? "text-primary"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

