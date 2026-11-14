"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle } from "lucide-react"

export function LessonCompleteButton({
  lessonId,
  initiallyCompleted,
  signedIn,
}: {
  lessonId: string
  initiallyCompleted: boolean
  signedIn: boolean
}) {
  const router = useRouter()
  const [completed, setCompleted] = useState(initiallyCompleted)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggle = async () => {
    if (!signedIn) {
      router.push("/login")
      return
    }
    setBusy(true)
    setError(null)
    try {
      const r = await fetch("/api/learn/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, completed: !completed }),
      })
      const j = await r.json()
      if (!j.success) throw new Error(j.error || "Failed to save progress")
      setCompleted(!completed)
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save progress")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Button onClick={toggle} disabled={busy} variant={completed ? "outline" : "default"}>
        {completed ? (
          <>
            <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" /> Completed
          </>
        ) : (
          <>
            <Circle className="mr-2 h-4 w-4" /> Mark as complete
          </>
        )}
      </Button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
