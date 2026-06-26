import Link from "next/link"
import Image from "next/image"
import { PROGRAMS } from "@/lib/programs"
import { Mail, Phone, MapPin } from "lucide-react"

const footerLinks = {
  about: [
    { label: "About Us", href: "/about" },
    { label: "Events", href: "/events" },
    { label: "Gallery", href: "/gallery" },
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/faq" },
  ],
  contribute: [
    { label: "Volunteer", href: "/contribute/volunteer" },
    { label: "Donate", href: "/contribute/donate" },
    { label: "Sponsor", href: "/contribute/sponsor" },
    { label: "Contact Us", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Refund Policy", href: "/refund-policy" },
  ],
}

const socialLinks = [
  {
    label: "Twitter / X",
    href: "https://x.com/fossandhra",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/fossandhra",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/fossandhra",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@fossandhra",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-[#020d1f] text-white/80">
      {/* Main footer grid */}
      <div className="app-container py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-6">

          {/* Brand column */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
              <Image
                src="/logos/foss-andhra-logo.png"
                alt="FOSS Andhra Logo"
                width={200}
                height={50}
                className="h-11 w-auto brightness-200"
              />
            </Link>
            <p className="text-sm leading-relaxed text-white/50 max-w-xs">
              Fostering free and open-source software adoption across education, governance, and
              society in Andhra Pradesh.
            </p>

            {/* Contact info */}
            <div className="space-y-2.5 text-sm">
              <a href="mailto:office@fossap.in" className="flex items-center gap-2.5 text-white/50 hover:text-white/80 transition-colors">
                <Mail className="h-3.5 w-3.5 flex-shrink-0 text-secondary/80" />
                office@fossap.in
              </a>
              <a href="tel:+919494463840" className="flex items-center gap-2.5 text-white/50 hover:text-white/80 transition-colors">
                <Phone className="h-3.5 w-3.5 flex-shrink-0 text-secondary/80" />
                +91&nbsp;94944&nbsp;63840
              </a>
              <div className="flex items-start gap-2.5 text-white/50">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-secondary/80 mt-0.5" />
                <span>Yesj Centre for Excellence,<br />Vijayawada, AP 520008</span>
              </div>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-2 pt-1">
              {socialLinks.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-white/8 hover:bg-white/15 flex items-center justify-center text-white/60 hover:text-white transition-all"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Programs */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40">Programs</h3>
            <ul className="space-y-2.5">
              {PROGRAMS.map((program) => (
                <li key={program.id}>
                  <Link
                    href={`/programs/${program.slug}`}
                    className="group flex items-center gap-2 text-sm text-white/50 hover:text-white/90 transition-colors"
                  >
                    <Image
                      src={program.logo}
                      alt={`${program.displayName} Logo`}
                      width={80}
                      height={20}
                      className="h-4 w-auto brightness-200 opacity-60 group-hover:opacity-90 transition-opacity"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40">About</h3>
            <ul className="space-y-2.5">
              {footerLinks.about.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/50 hover:text-white/90 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contribute */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40">Contribute</h3>
            <ul className="space-y-2.5">
              {footerLinks.contribute.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/50 hover:text-white/90 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40">Legal</h3>
            <ul className="space-y-2.5">
              {footerLinks.legal.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/50 hover:text-white/90 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/6">
        <div className="app-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <p>&copy; {new Date().getFullYear()} FOSS Andhra. All rights reserved.</p>
          <p>
            Built with{" "}
            <span className="text-secondary/70">♥</span>
            {" "}for the open source community
          </p>
        </div>
      </div>
    </footer>
  )
}
