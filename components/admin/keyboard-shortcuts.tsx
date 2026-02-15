"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function KeyboardShortcuts() {
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if not typing in an input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return
      }

      // Ctrl/Cmd + K for search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        // Focus search input if available, or show search modal
        const searchInput = document.querySelector('input[type="search"], input[placeholder*="Search"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        } else {
          toast({
            title: "Search",
            description: "Search input is not available on this page",
          })
        }
      }

      // Ctrl/Cmd + / for help
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault()
        toast({
          title: "Keyboard Shortcuts",
          description: "Press Ctrl+K to search, Ctrl+/ for help",
        })
      }

      // Number keys for quick navigation (when not in input)
      if (e.key >= "1" && e.key <= "9" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const shortcuts: Record<string, string> = {
          "1": "/admin",
          "2": "/admin/analytics",
          "3": "/admin/events",
          "4": "/admin/members",
          "5": "/admin/donations",
          "6": "/admin/blog",
          "7": "/admin/content",
          "8": "/admin/programs",
          "9": "/admin/settings",
        }

        if (shortcuts[e.key]) {
          router.push(shortcuts[e.key])
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [router, toast])

  return null
}

