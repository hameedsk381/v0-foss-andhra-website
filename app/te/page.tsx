import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { PROGRAMS } from "@/lib/programs"
import { te } from "@/lib/i18n/te"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "FOSS ఆంధ్ర — ఆంధ్రప్రదేశ్‌లో ఓపెన్ సోర్స్ సంఘం | FOSS Andhra",
  description:
    "ఆంధ్రప్రదేశ్‌లో ఫ్రీ & ఓపెన్ సోర్స్ సాఫ్ట్‌వేర్ సంఘం. తెలుగు విద్యార్థులు మరియు డెవలపర్ల కోసం ఉచిత లర్నింగ్ హబ్, FOSSynC క్లబ్‌లు, హ్యాకథాన్‌లు మరియు మెంటర్‌షిప్.",
  alternates: { canonical: "/te" },
}

export default function TeluguLandingPage() {
  return (
    <div lang={te.lang}>
      {/* Hero */}
      <section className="container mx-auto max-w-5xl px-4 pt-16 pb-12 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">{te.eyebrow}</p>
        <h1 className="mt-3 text-3xl font-bold leading-snug sm:text-5xl">{te.heroTitle}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-gray-600 sm:text-lg">{te.heroSubtitle}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/membership"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {te.heroCtaPrimary} <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 rounded-lg border px-6 py-3 text-sm font-semibold transition-colors hover:bg-muted"
          >
            {te.heroCtaSecondary}
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {te.stats.map((s) => (
            <div key={s.label} className="rounded-lg border bg-muted/30 p-4">
              <p className="text-2xl font-bold text-primary">{s.value}</p>
              <p className="mt-1 text-xs text-gray-600 sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="container mx-auto max-w-3xl px-4 py-10">
        <h2 className="text-2xl font-bold sm:text-3xl">{te.missionHeading}</h2>
        <p className="mt-4 text-gray-700 leading-relaxed">{te.missionBody}</p>
      </section>

      {/* Programs */}
      <section className="container mx-auto max-w-5xl px-4 py-10">
        <h2 className="text-2xl font-bold sm:text-3xl">{te.programsHeading}</h2>
        <p className="mt-2 text-gray-600">{te.programsSubtitle}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {PROGRAMS.map((program) => (
            <Card key={program.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <h3 className="font-semibold text-primary">
                  <Link href={`/programs/${program.slug}`} className="hover:underline">
                    {program.displayName}
                  </Link>
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {te.programDescriptions[program.id as keyof typeof te.programDescriptions]}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Platform sections */}
      <section className="container mx-auto max-w-5xl px-4 py-10">
        <h2 className="text-2xl font-bold sm:text-3xl">{te.sectionsHeading}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {te.sections.map((section) => (
            <Card key={section.href} className="transition-shadow hover:shadow-md">
              <CardContent className="flex h-full flex-col p-5">
                <h3 className="font-semibold">{section.title}</h3>
                <p className="mt-2 flex-1 text-sm text-gray-600">{section.body}</p>
                <Link
                  href={section.href}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                >
                  {section.cta} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Membership CTA */}
      <section className="container mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-xl border bg-primary/5 p-8 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">{te.membershipHeading}</h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-700">{te.membershipBody}</p>
          <Link
            href="/membership"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {te.membershipCta} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Closing note */}
      <section className="container mx-auto max-w-3xl px-4 pb-16">
        <p className="rounded-lg border bg-muted/30 p-4 text-center text-sm text-gray-600">{te.closingBody}</p>
      </section>
    </div>
  )
}
