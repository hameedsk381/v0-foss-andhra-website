import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { RegisterSW } from "./register-sw"
import { InstallPrompt } from "@/components/install-prompt"
import { OfflineIndicator } from "@/components/offline-indicator"
import { WebVitals } from "./web-vitals"
import Script from "next/script"
import { AppChrome } from "@/components/app-chrome"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://fossap.in"),
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
    "Vijayawada",
    "Amaravati",
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
    url: "https://fossap.in",
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
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://fossap.in" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <AppChrome>{children}</AppChrome>
            <Toaster />
            <RegisterSW />
            <InstallPrompt />
            <OfflineIndicator />
            <WebVitals />
          </AuthProvider>
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
              url: "https://fossap.in",
              logo: "https://fossap.in/logos/foss-andhra-logo.png",
              description: "Non-profit organization promoting free and open source software in Andhra Pradesh",
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
              ],
            }),
          }}
        />
      </body>
    </html>
  )
}
