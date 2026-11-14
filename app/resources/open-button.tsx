"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

/** Opens the resource URL while counting the click (fire-and-forget). */
export function ResourceOpenButton({ id, url }: { id: string; url: string }) {
  const open = () => {
    fetch(`/api/resources/${id}/track`, { method: "POST" }).catch(() => {})
    window.open(url, "_blank", "noopener,noreferrer")
  }
  return (
    <Button size="sm" variant="outline" onClick={open}>
      <Download className="mr-1.5 h-3.5 w-3.5" /> Open
    </Button>
  )
}
