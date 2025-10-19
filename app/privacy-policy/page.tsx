import type { Metadata } from "next"
import PrivacyPolicyClientPage from "./PrivacyPolicyClientPage"

export const metadata: Metadata = {
  title: "Privacy Policy | FOSS Andhra",
  description: "Privacy policy for FOSS Andhra's website, programs, and services.",
}

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClientPage />
}
