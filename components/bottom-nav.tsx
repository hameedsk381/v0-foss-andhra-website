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

  // Don't show on admin pages
  if (pathname.startsWith("/admin")) {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border z-40 md:hidden pb-[env(safe-area-inset-bottom)]">
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
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
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

