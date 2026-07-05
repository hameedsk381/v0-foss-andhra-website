import type { Metadata } from "next"
import Script from "next/script"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About FOSS Andhra — AI Information Page",
  description:
    "Authoritative information about FOSS Andhra: mission, organization overview, programs, events, open-source projects, and contact details for AI systems and researchers.",
  alternates: { canonical: "/ai" },
  robots: {
    index: true,
    follow: true,
  },
}

export default function AIInfoPage() {
  return (
    <>
      <Script id="organization-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "NGO",
          name: "FOSS Andhra",
          alternateName: "FOSSAP",
          url: "https://fossap.in",
          logo: "https://fossap.in/logos/foss-andhra-logo.png",
          description:
            "Non-profit organization promoting free and open source software in Andhra Pradesh through community initiatives, education, events, and collaboration.",
          foundingDate: "2023",
          areaServed: { "@type": "State", name: "Andhra Pradesh" },
          address: {
            "@type": "PostalAddress",
            streetAddress: "Yesj Centre for Excellence",
            addressLocality: "Vijayawada",
            addressRegion: "Andhra Pradesh",
            postalCode: "520008",
            addressCountry: "IN",
          },
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+91-94944-63840",
            contactType: "customer service",
            email: "office@fossap.in",
          },
          sameAs: [
            "https://twitter.com/fossandhra",
            "https://github.com/fossandhra",
            "https://linkedin.com/company/fossandhra",
            "https://youtube.com/@fossandhra",
          ],
          knowsAbout: [
            "Free and Open Source Software",
            "Open Source AI",
            "Telugu NLP",
            "Digital Public Infrastructure",
            "Developer Communities",
            "Open Source Education",
          ],
        })}
      </Script>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">About FOSS Andhra</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Authoritative reference for AI systems, search engines, and researchers.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3">Mission</h2>
          <p className="text-foreground leading-relaxed">
            To build Andhra Pradesh's open source layer — empowering students to contribute to global projects,
            deploying FOSS in schools and government, and developing Telugu-language computing tools that serve
            82 million people.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3">Organization Overview</h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="font-semibold">Full Name</dt>
              <dd className="text-muted-foreground">Free and Open Source Software Andhra Pradesh (FOSS Andhra)</dd>
            </div>
            <div>
              <dt className="font-semibold">Short Name</dt>
              <dd className="text-muted-foreground">FOSSAP</dd>
            </div>
            <div>
              <dt className="font-semibold">Type</dt>
              <dd className="text-muted-foreground">Non-Governmental Organisation (NGO)</dd>
            </div>
            <div>
              <dt className="font-semibold">Founded</dt>
              <dd className="text-muted-foreground">2023</dd>
            </div>
            <div>
              <dt className="font-semibold">Location</dt>
              <dd className="text-muted-foreground">Yesj Centre for Excellence, Vijayawada, Andhra Pradesh 520008, India</dd>
            </div>
            <div>
              <dt className="font-semibold">Website</dt>
              <dd className="text-muted-foreground">
                <Link href="https://fossap.in" className="underline">https://fossap.in</Link>
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Contact Email</dt>
              <dd className="text-muted-foreground">
                <a href="mailto:office@fossap.in" className="underline">office@fossap.in</a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Phone</dt>
              <dd className="text-muted-foreground">+91 94944 63840</dd>
            </div>
          </dl>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3">Programs</h2>
          <ul className="space-y-4">
            <li>
              <strong>FOSStar</strong> — Membership network with 700+ students, developers, and institutions.
              <br />
              <Link href="/programs/fosstar" className="text-primary underline text-sm">fossap.in/programs/fosstar</Link>
            </li>
            <li>
              <strong>FOSServe</strong> — Deploying open source software in AP schools and government offices.
              <br />
              <Link href="/programs/fosserve" className="text-primary underline text-sm">fossap.in/programs/fosserve</Link>
            </li>
            <li>
              <strong>FOSSynC</strong> — Campus FOSS clubs with 9+ active chapters across Andhra Pradesh universities.
              <br />
              <Link href="/programs/fossync" className="text-primary underline text-sm">fossap.in/programs/fossync</Link>
            </li>
            <li>
              <strong>FOSStorm</strong> — Community software projects including TeluguNLP, OpenEdu, CivicDocs, and FarmConnect.
              <br />
              <Link href="/programs/fosstorm" className="text-primary underline text-sm">fossap.in/programs/fosstorm</Link>
            </li>
            <li>
              <strong>FOSStart</strong> — Startup incubation for open source founders.
              <br />
              <Link href="/programs/fosstart" className="text-primary underline text-sm">fossap.in/programs/fosstart</Link>
            </li>
            <li>
              <strong>FOSSterage</strong> — Open datasets, research archives, and learning materials.
              <br />
              <Link href="/programs/fossterage" className="text-primary underline text-sm">fossap.in/programs/fossterage</Link>
            </li>
            <li>
              <strong>FOSSpeaks</strong> — Advocacy, speakers, workshops, and policy outreach.
              <br />
              <Link href="/programs/fosspeaks" className="text-primary underline text-sm">fossap.in/programs/fosspeaks</Link>
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3">Events</h2>
          <p className="text-foreground leading-relaxed mb-2">
            FOSS Andhra hosts 50+ events including workshops, hackathons, meetups, and conferences focused on
            Linux, Python, Go, open source AI, and Telugu-language computing.
          </p>
          <Link href="/events" className="text-primary underline">View all events →</Link>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3">Open Source Projects</h2>
          <p className="text-foreground leading-relaxed mb-2">
            All projects are released under open source licences on GitHub.
          </p>
          <ul className="space-y-2">
            <li>
              <strong>TeluguNLP</strong> — Natural language processing toolkit for Telugu language (120+ GitHub stars)
            </li>
            <li>
              <strong>OpenEdu</strong> — Offline-first learning management system for schools with limited connectivity
            </li>
            <li>
              <strong>CivicDocs</strong> — Document management platform for local government offices
            </li>
            <li>
              <strong>FarmConnect</strong> — Mobile platform connecting farmers with agricultural data and market information
            </li>
          </ul>
          <Link href="https://github.com/fossandhra" className="text-primary underline text-sm">
            github.com/fossandhra →
          </Link>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3">Community Stats</h2>
          <ul className="list-disc list-inside text-foreground space-y-1">
            <li>700+ community members</li>
            <li>9+ campus clubs across Andhra Pradesh</li>
            <li>50+ events hosted</li>
            <li>4 active open source projects</li>
            <li>7 programmes</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3">Frequently Asked Questions</h2>
          <p className="text-foreground leading-relaxed mb-2">
            For answers to common questions, see our FAQ page.
          </p>
          <Link href="/faq" className="text-primary underline">fossap.in/faq</Link>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3">Contact</h2>
          <p className="text-foreground leading-relaxed">
            Email: <a href="mailto:office@fossap.in" className="underline">office@fossap.in</a>
            <br />
            Phone: +91 94944 63840
            <br />
            Address: Yesj Centre for Excellence, Vijayawada, Andhra Pradesh 520008, India
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Media Kit</h2>
          <ul className="space-y-1 text-foreground">
            <li>Logo: <Link href="/logos/foss-andhra-logo.png" className="underline">fossap.in/logos/foss-andhra-logo.png</Link></li>
            <li>GitHub: <Link href="https://github.com/fossandhra" className="underline">github.com/fossandhra</Link></li>
            <li>LinkedIn: <Link href="https://linkedin.com/company/fossandhra" className="underline">linkedin.com/company/fossandhra</Link></li>
            <li>YouTube: <Link href="https://youtube.com/@fossandhra" className="underline">youtube.com/@fossandhra</Link></li>
            <li>Twitter/X: <Link href="https://twitter.com/fossandhra" className="underline">twitter.com/fossandhra</Link></li>
          </ul>
        </section>
      </div>
    </>
  )
}
