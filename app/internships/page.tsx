import type { Metadata } from "next"
import Link from "next/link"
import { Clock, IndianRupee, MapPin, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FAQJsonLd, BreadcrumbJsonLd } from "@/components/structured-data"

export const metadata: Metadata = {
  // Absolute: with the "%s | FOSS Andhra" template this would exceed 60 chars.
  title: { absolute: "Internships for Students in Andhra Pradesh | FOSS Andhra" },
  description:
    "3-month hybrid open source internships for students in Andhra Pradesh: AI, web development, DevOps, design and marketing tracks on real community projects.",
  alternates: { canonical: "/internships" },
  openGraph: {
    title: "Open Source Internships for Students in Andhra Pradesh",
    description:
      "3-month hybrid internships on real open source projects: AI, web development, DevOps, design and marketing tracks.",
    url: "https://fossap.in/internships",
  },
}

const SITE_URL = "https://fossap.in"

const TRACKS = [
  { slug: "internship-agentic-ai", name: "Agentic AI", blurb: "Build and evaluate LLM-powered agents on real community workflows." },
  { slug: "internship-website-development", name: "Website Development", blurb: "Ship features on the FOSS Andhra platform with Next.js and TypeScript." },
  { slug: "internship-devops", name: "DevOps", blurb: "Run the pipelines, containers and Linux servers behind our services." },
  { slug: "internship-ai-automation", name: "AI Automation", blurb: "Automate community operations with practical AI tooling." },
  { slug: "internship-system-design", name: "System Design", blurb: "Model and document how community systems fit together." },
  { slug: "internship-ui-ux-design", name: "UI/UX Design", blurb: "Design clear interfaces for students, volunteers and partners." },
  { slug: "internship-digital-marketing", name: "Digital Marketing", blurb: "Grow reach for programs and events with content and analytics." },
]

const FAQ = [
  {
    q: "Is the internship paid?",
    a: "No. FOSS Andhra internships are unpaid community programs. What you get is hands-on experience on real open source projects, a mentor, and public work you can point to in your GitHub portfolio.",
  },
  {
    q: "Who can apply?",
    a: "Students and early-career contributors who are FOSStar members. Join FOSStar first, then apply to the track you want through the careers page.",
  },
  {
    q: "How long is the internship and how does it work?",
    a: "3 months, hybrid — a mix of remote work and in-person sessions in Andhra Pradesh. You work on real FOSS Andhra projects with guidance from community mentors.",
  },
  {
    q: "Do I need prior experience?",
    a: "You need the basics for your track (for example, some Git and JavaScript for web development) and a willingness to learn in public. Each track page on the careers page lists its specific requirements.",
  },
  {
    q: "What will I actually work on?",
    a: "FOSS Andhra's own platforms and programs: the website, community tools, event systems, documentation and outreach. Your contributions are merged into public repositories under your name.",
  },
]

export default function InternshipsPage() {
  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Internships", url: `${SITE_URL}/internships` },
        ]}
      />
      <FAQJsonLd items={FAQ} />

      <div className="container mx-auto max-w-5xl px-4 py-12">
        <header className="mb-10">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Open Source Internships for Students in Andhra Pradesh
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            FOSS Andhra&apos;s internship program gives students hands-on experience building real
            open source projects — not coffee runs. You work with community mentors on the websites,
            tools and systems that run a working nonprofit, and your contributions land in public
            repositories under your own name.
          </p>
        </header>

        {/* The facts */}
        <section aria-labelledby="facts-heading" className="mb-12">
          <h2 id="facts-heading" className="mb-6 text-2xl font-bold tracking-tight">
            The facts, no surprises
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <Clock className="mb-2 h-5 w-5 text-primary" aria-hidden="true" />
                <p className="text-sm font-semibold">Duration</p>
                <p className="text-sm text-muted-foreground">3 months, part-time alongside your studies</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <IndianRupee className="mb-2 h-5 w-5 text-primary" aria-hidden="true" />
                <p className="text-sm font-semibold">Stipend</p>
                <p className="text-sm text-muted-foreground">Unpaid — a community program, not a job</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <MapPin className="mb-2 h-5 w-5 text-primary" aria-hidden="true" />
                <p className="text-sm font-semibold">Mode</p>
                <p className="text-sm text-muted-foreground">Hybrid, with sessions across Andhra Pradesh</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Users className="mb-2 h-5 w-5 text-primary" aria-hidden="true" />
                <p className="text-sm font-semibold">Eligibility</p>
                <p className="text-sm text-muted-foreground">
                  <Link href="/membership" className="text-primary hover:underline">FOSStar members</Link> — students and early-career contributors
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Tracks */}
        <section aria-labelledby="tracks-heading" className="mb-12">
          <h2 id="tracks-heading" className="mb-6 text-2xl font-bold tracking-tight">
            Choose your track
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TRACKS.map((track) => (
              <Link key={track.slug} href={`/careers/${track.slug}`} className="group">
                <Card className="h-full transition-shadow group-hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{track.name} Internship</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{track.blurb}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Why open source */}
        <section aria-labelledby="why-heading" className="mb-12">
          <h2 id="why-heading" className="mb-4 text-2xl font-bold tracking-tight">
            Why intern with an open source community?
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>
              <strong className="text-foreground">Your work is public.</strong> Merged pull requests
              in real repositories become a portfolio employers and open source programs (like GSoC)
              can actually verify.
            </li>
            <li>
              <strong className="text-foreground">You learn how teams really work.</strong> Git
              workflows, code review, issue tracking and documentation — habits that transfer to any
              job.
            </li>
            <li>
              <strong className="text-foreground">Mentors who contribute too.</strong> You are guided
              by community volunteers who maintain the projects you work on.
            </li>
            <li>
              <strong className="text-foreground">A path into the community.</strong> Strong interns
              are first in line for further opportunities, references and program roles.
            </li>
          </ul>
        </section>

        {/* How to apply */}
        <section aria-labelledby="apply-heading" className="mb-12">
          <h2 id="apply-heading" className="mb-4 text-2xl font-bold tracking-tight">
            How to apply
          </h2>
          <ol className="list-decimal space-y-3 pl-5 text-muted-foreground">
            <li>
              <Link href="/membership" className="font-medium text-primary hover:underline">
                Join FOSStar
              </Link>{" "}
              — internship applications are open to members.
            </li>
            <li>
              Browse{" "}
              <Link href="/careers" className="font-medium text-primary hover:underline">
                current internship openings
              </Link>{" "}
              and pick the track that fits you.
            </li>
            <li>
              Submit the application form with your resume and a link to your GitHub, LinkedIn or
              portfolio.
            </li>
          </ol>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="mb-6 text-2xl font-bold tracking-tight">
            Internship FAQ
          </h2>
          <div className="space-y-6">
            {FAQ.map((item) => (
              <div key={item.q}>
                <h3 className="font-semibold text-foreground">{item.q}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
