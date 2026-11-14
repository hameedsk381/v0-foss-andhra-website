import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { certificateTypeLabel, normaliseCodeInput } from "@/lib/certificates"
import { formatLongDate } from "@/lib/internship-offer"
import { PrintButton } from "@/components/member/print-button"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Certificate Verification | FOSS Andhra",
  robots: { index: false, follow: false },
}

export default async function CertificatePage({ params }: { params: { code: string } }) {
  const code = normaliseCodeInput(decodeURIComponent(params.code))
  if (!/^FOSSAP-CERT-[A-F0-9]{8}$/.test(code)) notFound()

  const certificate = await prisma.certificate.findUnique({ where: { code } })
  if (!certificate) notFound()

  const revoked = certificate.status === "revoked"
  const dateLine =
    certificate.startDate && certificate.endDate
      ? `${formatLongDate(certificate.startDate)} to ${formatLongDate(certificate.endDate)}`
      : certificate.startDate
        ? formatLongDate(certificate.startDate)
        : null

  return (
    <div className="bg-gray-100 px-4 py-8 print:bg-white print:p-0">
      <div className="mx-auto mb-4 flex max-w-3xl justify-end print:hidden">
        {!revoked && <PrintButton label="Print / Save as PDF" />}
      </div>

      <article className="mx-auto max-w-3xl bg-white p-8 text-gray-900 shadow-sm sm:p-12 print:shadow-none">
        <header className="border-b-4 border-[#015ba7] pb-4">
          <h1 className="text-2xl font-bold text-[#015ba7]">FOSS Andhra Foundation</h1>
          <p className="text-sm text-gray-600">Promoting Free and Open Source Software in Andhra Pradesh</p>
        </header>

        {revoked && (
          <div className="mt-6 rounded-lg border-2 border-red-300 bg-red-50 p-4 text-sm text-red-800">
            <p className="font-semibold">This certificate has been revoked.</p>
            {certificate.revokedReason && <p className="mt-1">{certificate.revokedReason}</p>}
            <p className="mt-1">It is no longer valid and should not be accepted as proof of achievement.</p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-between gap-2 text-sm">
          <p>
            <strong>Code:</strong> <span className="font-mono">{certificate.code}</span>
          </p>
          <p>
            <strong>Issued:</strong> {formatLongDate(certificate.issuedAt)}
          </p>
        </div>

        <h2 className="mt-8 text-center text-xl font-bold uppercase tracking-wide text-gray-700">
          {certificate.title}
        </h2>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">This certificate is awarded to</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{certificate.name}</p>
          <p className="mt-1 text-sm text-gray-500">
            {certificateTypeLabel(certificate.type)}
            {certificate.program ? ` — ${certificate.program}` : ""}
          </p>
        </div>

        <p className="mt-8 text-sm leading-relaxed text-gray-700">
          {certificate.program ? (
            <>
              FOSS Andhra hereby certifies that <strong>{certificate.name}</strong> successfully completed{" "}
              <strong>{certificate.program}</strong> as part of our work to promote free and open source software in
              Andhra Pradesh.
            </>
          ) : (
            <>
              FOSS Andhra hereby certifies that <strong>{certificate.name}</strong> is recognised for their
              contribution to our work promoting free and open source software in Andhra Pradesh.
            </>
          )}
          {certificate.description && (
            <>
              {" "}
              {certificate.description}
            </>
          )}
        </p>

        {dateLine && (
          <p className="mt-4 text-sm text-gray-700">
            <strong>Period:</strong> {dateLine}
          </p>
        )}

        <div className="mt-10 border-t pt-4">
          <p className="text-xs text-gray-500">
            This certificate is verified online. Anyone can confirm its authenticity and current status at{" "}
            <span className="font-mono">
              fossap.in/certificates/{certificate.code}
            </span>
            . If the code does not resolve to this page, the certificate was not issued by FOSS Andhra.
          </p>
        </div>
      </article>

      <div className="mx-auto mt-6 max-w-3xl text-center print:hidden">
        <Link href="/certificates" className="text-sm font-semibold text-primary hover:underline">
          Verify another certificate
        </Link>
      </div>
    </div>
  )
}
