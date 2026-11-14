"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { normaliseCodeInput } from "@/lib/certificates"

export function CertificateLookup() {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)

  return (
    <form
      className="flex flex-col gap-3 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault()
        const normalised = normaliseCodeInput(code)
        if (!/^FOSSAP-CERT-[A-F0-9]{8}$/.test(normalised)) {
          setError("Certificates use a code in the format FOSSAP-CERT-XXXXXXXX — check the certificate you received.")
          return
        }
        setError(null)
        router.push(`/certificates/${normalised}`)
      }}
    >
      <Input
        aria-label="Certificate code"
        placeholder="FOSSAP-CERT-XXXXXXXX"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="sm:max-w-sm font-mono"
      />
      <Button type="submit">Verify certificate</Button>
      {error && <p className="text-sm text-red-600 sm:basis-full">{error}</p>}
    </form>
  )
}
