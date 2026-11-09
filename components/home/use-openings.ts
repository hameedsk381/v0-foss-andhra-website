"use client"

import { useEffect, useState } from "react"

export interface PublicOpening {
  id: string
  slug: string
  title: string
  type: string
  summary: string | null
  location: string
  workMode: string
  applyDeadline: string | null
  featured: boolean
}

/** Loads the currently open career openings from the public API (once per mount). */
export function useOpenings() {
  const [openings, setOpenings] = useState<PublicOpening[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch("/api/careers", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((json) => {
        if (!cancelled) setOpenings(Array.isArray(json?.data) ? json.data : [])
      })
      .catch(() => {
        if (!cancelled) setOpenings([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { openings, loading }
}
