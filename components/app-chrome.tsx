"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"
import { BottomNav } from "@/components/bottom-nav"

interface AppChromeProps {
  children: React.ReactNode
}

const APP_SHELL_PREFIXES = ["/admin", "/member"]

export function AppChrome({ children }: AppChromeProps) {
  const pathname = usePathname()
  const isAppShellRoute = APP_SHELL_PREFIXES.some((prefix) => pathname.startsWith(prefix))

  if (isAppShellRoute) {
    return (
      <>
        <main id="main-content" className="flex-1">
          {children}
        </main>
      </>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded-lg shadow-md"
      >
        Skip to main content
      </a>
      <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="app-container flex h-[72px] min-h-[72px] items-center">
          <MainNav />
        </div>
      </header>
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  )
}
