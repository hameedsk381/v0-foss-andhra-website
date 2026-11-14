import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CertificateLookup } from "./lookup-form"

export const metadata: Metadata = {
  title: "Verify a Certificate | FOSS Andhra",
  description:
    "Verify a FOSS Andhra certificate online. Enter the code printed on the certificate (FOSSAP-CERT-XXXXXXXX) to confirm it is genuine and currently valid.",
  alternates: { canonical: "/certificates" },
}

export default function VerifyCertificatePage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold sm:text-4xl">Verify a certificate</h1>
      <p className="mt-3 text-gray-600">
        Every certificate issued by FOSS Andhra carries a unique code. Enter it below to confirm who it was issued to,
        what it was awarded for, and that it is still valid.
      </p>

      <Card className="mt-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Enter the certificate code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <CertificateLookup />
          <p className="text-sm text-gray-500">
            The code is printed near the bottom of the certificate and looks like{" "}
            <span className="font-mono text-gray-700">FOSSAP-CERT-9F3A21B7</span>.
          </p>
        </CardContent>
      </Card>

      <div className="mt-10 space-y-2 text-sm text-gray-600">
        <p>
          Certificates are issued to interns, event participants, workshop attendees, campus clubs and open source
          contributors as part of FOSS Andhra&apos;s work across Andhra Pradesh.
        </p>
        <p>
          Suspect a certificate is fake?{" "}
          <Link href="/contact" className="font-semibold text-primary hover:underline">
            Report it to us
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
