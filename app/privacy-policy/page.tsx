import type { Metadata } from "next"
import PrivacyPolicyClientPage from "./PrivacyPolicyClientPage"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How FOSS Andhra collects, uses, and protects your personal data across our website, programs, events, and services.",
  alternates: { canonical: "/privacy-policy" },
}

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClientPage />
}
