import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://fossandhra.org"),
  title: {
    default: "FOSS Andhra - Free & Open Source Software Community in Andhra Pradesh",
    template: "%s | FOSS Andhra",
  },
  description:
    "FOSS Andhra promotes free and open source software solutions for education, governance, and society in Andhra Pradesh. Join our community, attend events, and contribute to open source projects.",
  keywords: [
    "FOSS Andhra",
    "open source software",
    "free software",
    "Andhra Pradesh",
    "Linux",
    "open source community",
    "FOSS education",
    "open source governance",
    "software freedom",
    "digital sovereignty",
    "FOSS training",
    "open source projects",
  ],
  authors: [{ name: "FOSS Andhra" }],
  creator: "FOSS Andhra",
  publisher: "FOSS Andhra",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "FOSS Andhra - Free & Open Source Software Community",
    description:
      "Join the leading open source community in Andhra Pradesh. Promoting FOSS in education, governance, and society.",
    url: "https://fossandhra.org",
    siteName: "FOSS Andhra",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FOSS Andhra - Open Source Community",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FOSS Andhra - Free & Open Source Software Community",
    description: "Join the leading open source community in Andhra Pradesh",
    images: ["/twitter-image.png"],
    creator: "@fossandhra",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://fossandhra.org" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="flex flex-col min-h-screen">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded"
            >
              Skip to main content
            </a>
            <header className="border-b">
              <div className="container px-4 md:px-6">
                <MainNav />
              </div>
            </header>
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </div>
          <Toaster />
        </ThemeProvider>

        {/* Structured Data for Organization */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "FOSS Andhra",
              url: "https://fossandhra.org",
              logo: "https://fossandhra.org/logo.png",
              description: "Non-profit organization promoting free and open source software in Andhra Pradesh",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Visakhapatnam",
                addressRegion: "Andhra Pradesh",
                addressCountry: "IN",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+91-98765-43210",
                contactType: "customer service",
                email: "info@fossandhra.org",
              },
              sameAs: [
                "https://twitter.com/fossandhra",
                "https://github.com/fossandhra",
                "https://linkedin.com/company/fossandhra",
              ],
            }),
          }}
        />
      </body>
    </html>
  )
}
