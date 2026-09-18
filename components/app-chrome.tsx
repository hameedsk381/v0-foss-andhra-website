"use client"

import type React from "react"
import Link from "next/link"
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
      <div className="hidden bg-[var(--ink)] text-white md:block">
        <div className="app-container flex min-h-8 items-center justify-between gap-4 text-[0.68rem] font-bold uppercase tracking-[0.16em]">
          <span className="text-white/70">Open technology for a stronger Andhra Pradesh</span>
          <Link href="/events" className="text-[var(--lime)] transition-colors hover:text-white">
            See what&apos;s happening <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/75 shadow-[0_1px_0_0_hsl(var(--border)/0.5)]">
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
