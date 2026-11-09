"use client"

import { useState } from "react"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AcceptOffer({ token, acceptedAt }: { token: string; acceptedAt: string | null }) {
  const [accepted, setAccepted] = useState(!!acceptedAt)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const accept = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/careers/offer/${token}/accept`, { method: "POST" })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Could not accept the offer")
      setAccepted(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not accept the offer")
    } finally {
      setLoading(false)
    }
  }

  if (accepted) {
    return (
      <p className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-800 print:hidden">
        <CheckCircle2 className="h-5 w-5" /> You have accepted this offer. A confirmation has been emailed to you.
      </p>
    )
  }

  return (
    <div className="space-y-2 print:hidden">
      <p className="text-sm text-gray-700">
        By accepting, you confirm that you have read this letter and agree to its terms.
      </p>
      <Button onClick={accept} disabled={loading}>
        {loading ? "Accepting..." : "Accept offer"}
      </Button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
