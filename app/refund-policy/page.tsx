import type { Metadata } from "next"
import RefundPolicyClientPage from "./RefundPolicyClientPage"

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Refund and cancellation terms for FOSS Andhra's memberships, internship fees, events, and other services.",
  alternates: { canonical: "/refund-policy" },
}

export default function RefundPolicyPage() {
  return <RefundPolicyClientPage />
}
