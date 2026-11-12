import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { AudienceSpecificForms } from "./audience-forms"

export const metadata: Metadata = {
  title: "Join FOSStar - Register",
  description:
    "Register as a FOSStar member of FOSS Andhra: student, professional, or institutional membership. Join the community of open source enthusiasts across Andhra Pradesh.",
  alternates: { canonical: "/membership" },
}

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Server-rendered heading and intro: crawlers must see real content,
          not just the client-rendered form skeleton. */}
      <header className="mx-auto mb-8 max-w-2xl text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Join FOSStar — FOSS Andhra Membership
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          FOSStar is FOSS Andhra&apos;s membership program for students, professionals, and institutions.
          Members get access to internships and opportunities, community events, workshops, and a network
          of open source contributors across Andhra Pradesh.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          New here? Read about the{" "}
          <Link href="/programs/fosstar" className="font-medium text-primary hover:underline">
            FOSStar program and member benefits
          </Link>
          , browse{" "}
          <Link href="/careers" className="font-medium text-primary hover:underline">
            current internship openings
          </Link>
          , or check the{" "}
          <Link href="/faq" className="font-medium text-primary hover:underline">
            membership FAQ
          </Link>
          .
        </p>
      </header>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading registration form...</p>
          </div>
        </div>
      }>
        <AudienceSpecificForms />
      </Suspense>
    </div>
  )
}
