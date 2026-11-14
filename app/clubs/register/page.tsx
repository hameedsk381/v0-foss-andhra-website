import type { Metadata } from "next"
import { ClubRegisterForm } from "./register-form"

export const metadata: Metadata = {
  title: "Register a FOSSynC Campus Club | FOSS Andhra",
  description:
    "Register your college's student-led open source club with FOSSynC by FOSS Andhra. Approved clubs get a public page, mentorship, install-fest kits and a place on the state-wide leaderboard.",
  alternates: { canonical: "/clubs/register" },
}

export default function RegisterClubPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">Register your FOSSynC club</h1>
        <p className="mx-auto mt-3 max-w-xl text-gray-600">
          Start a student-led open source club at your campus, or add your existing club to the FOSSynC network.
          FOSS Andhra reviews every registration before it goes live.
        </p>
      </div>
      <div className="mt-8">
        <ClubRegisterForm />
      </div>
    </div>
  )
}
