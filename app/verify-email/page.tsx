"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, Loader2, MailCheck } from "lucide-react"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [state, setState] = useState<"verifying" | "success" | "error" | "no-token">(
    token ? "verifying" : "no-token"
  )
  const [errorMessage, setErrorMessage] = useState("")
  const [resendEmail, setResendEmail] = useState("")
  const [resendState, setResendState] = useState<"idle" | "sending" | "sent">("idle")
  const verifiedOnce = useRef(false)

  useEffect(() => {
    if (!token || verifiedOnce.current) return
    verifiedOnce.current = true

    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setState("success")
        } else {
          setErrorMessage(data.error || "Verification failed")
          setState("error")
        }
      })
      .catch(() => {
        setErrorMessage("Something went wrong — please try again")
        setState("error")
      })
  }, [token])

  const resend = async () => {
    if (!resendEmail.includes("@")) return
    setResendState("sending")
    try {
      await fetch("/api/auth/verify-email", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail }),
      })
      setResendState("sent")
    } catch {
      setResendState("idle")
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-background px-4 py-16">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            {state === "verifying" && <Loader2 className="h-8 w-8 text-primary animate-spin" />}
            {state === "success" && <CheckCircle2 className="h-8 w-8 text-green-600" />}
            {state === "error" && <XCircle className="h-8 w-8 text-red-500" />}
            {state === "no-token" && <MailCheck className="h-8 w-8 text-primary" />}
          </div>
          <CardTitle className="font-display text-2xl">
            {state === "verifying" && "Verifying your email…"}
            {state === "success" && "Email verified!"}
            {state === "error" && "Verification failed"}
            {state === "no-token" && "Verify your email"}
          </CardTitle>
          <CardDescription>
            {state === "verifying" && "One moment while we confirm your address."}
            {state === "success" && "Your account is active. You can now log in to the member portal."}
            {state === "error" && errorMessage}
            {state === "no-token" && "Enter your email and we'll send you a fresh verification link."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {state === "success" && (
            <Link href="/login" className="block">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                Go to Login
              </Button>
            </Link>
          )}

          {(state === "error" || state === "no-token") && (
            <>
              {resendState === "sent" ? (
                <p className="text-sm text-center text-muted-foreground">
                  If an unverified account exists for that email, a new link is on its way. Check your inbox (and spam folder).
                </p>
              ) : (
                <div className="space-y-3">
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    disabled={resendState === "sending"}
                  />
                  <Button
                    onClick={resend}
                    disabled={resendState === "sending" || !resendEmail.includes("@")}
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                  >
                    {resendState === "sending" ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending…
                      </>
                    ) : (
                      "Send verification link"
                    )}
                  </Button>
                </div>
              )}
              <p className="text-xs text-center text-muted-foreground">
                Need help? Contact{" "}
                <a href="mailto:office@fossap.in" className="text-primary hover:underline">
                  office@fossap.in
                </a>
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  )
}
