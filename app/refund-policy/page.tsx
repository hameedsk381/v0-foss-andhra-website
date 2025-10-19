import type { Metadata } from "next"
import RefundPolicyClientPage from "./RefundPolicyClientPage"

export const metadata: Metadata = {
  title: "Refund Policy | FOSS Andhra",
  description: "Refund policy for FOSS Andhra's programs, events, and services.",
}

export default function RefundPolicyPage() {
  return <RefundPolicyClientPage />
}
