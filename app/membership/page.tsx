import { Suspense } from "react"
import type { Metadata } from "next"
import { AudienceSpecificForms } from "./audience-forms"

export const metadata: Metadata = {
  title: "Join FOSStar — Register | FOSS Andhra",
  description:
    "Register as a FOSStar member of FOSS Andhra: student, professional, or institutional membership. Join the community of open source enthusiasts across Andhra Pradesh.",
  alternates: { canonical: "/membership" },
}

function RegisterContent() {
  return <AudienceSpecificForms />
}

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading registration form...</p>
          </div>
        </div>
      }>
        <RegisterContent />
      </Suspense>
    </div>
  )
}
