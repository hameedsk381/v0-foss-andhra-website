import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { PROGRAMS } from "@/lib/programs"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/80 bg-slate-50/80">
      <div className="app-container py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
              <Image
                src="/logos/foss-andhra-logo.png"
                alt="FOSS Andhra Logo"
                width={200}
                height={50}
                className="h-12 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
              Fostering a vibrant ecosystem of free and open-source software development and adoption across Andhra
              Pradesh.
            </p>
            <div className="mt-6 flex gap-3">
              <Link href="https://x.com/fossandhra" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" aria-label="Twitter" className="rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </Button>
              </Link>
              <Link href="https://github.com/fossandhra" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" aria-label="GitHub" className="rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                </Button>
              </Link>
              <Link href="https://linkedin.com/company/fossandhra" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" aria-label="LinkedIn" className="rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </Button>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-base font-semibold text-foreground">Programs</h3>
            <ul className="space-y-2.5">
              {PROGRAMS.map((program) => (
                <li key={program.id}>
                  <Link
                    href={`/programs/${program.slug}`}
                    className="group flex items-center gap-2 rounded-md px-1 py-1 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Image src={program.logo} alt={`${program.displayName} Logo`} width={80} height={20} className="h-5 w-auto transition-transform duration-200 group-hover:scale-[1.03]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-base font-semibold text-foreground">About</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground transition-colors hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-muted-foreground transition-colors hover:text-foreground">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-muted-foreground transition-colors hover:text-foreground">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/contribute" className="text-muted-foreground transition-colors hover:text-foreground">
                  Contribute
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground transition-colors hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground transition-colors hover:text-foreground">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-base font-semibold text-foreground">Legal</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/privacy-policy" className="text-muted-foreground transition-colors hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-muted-foreground transition-colors hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-muted-foreground transition-colors hover:text-foreground">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border/70 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} FOSS Andhra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
