"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { BottomNav } from "@/components/bottom-nav"

interface AppChromeProps {
  children: React.ReactNode
  footer?: React.ReactNode
}

const APP_SHELL_PREFIXES = ["/admin", "/member"]

export function AppChrome({ children, footer }: AppChromeProps) {
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
    <div className="flex flex-col min-h-screen pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded-lg shadow-md"
      >
        Skip to main content
      </a>
      <div className="hidden bg-[#071426] text-white md:block">
        <div className="app-container flex min-h-8 items-center justify-between gap-4 text-[0.68rem] font-bold uppercase tracking-[0.16em]">
          <span className="text-white/70">Open technology for a stronger Andhra Pradesh</span>
          <Link href="/events" className="text-white transition-colors hover:text-white/80">
            See what&apos;s happening <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
        <div className="app-container flex h-[72px] min-h-[72px] items-center">
          <MainNav />
        </div>
      </header>
      <main id="main-content" className="flex-1">
        {children}
      </main>
      {footer}
      <BottomNav />
    </div>
  )
}
