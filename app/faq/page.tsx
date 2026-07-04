import type { Metadata } from "next"
import Script from "next/script"
import FAQPageClient from "./FAQPageClient"

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is FOSS Andhra?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "FOSS Andhra is a community organization promoting free and open source software adoption across Andhra Pradesh in education, governance, and society.",
      },
    },
    {
      "@type": "Question",
      name: "Is FOSS Andhra a government organization?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, FOSS Andhra is an independent non-governmental community organization. We work with government bodies and educational institutions but are not affiliated with any government agency.",
      },
    },
    {
      "@type": "Question",
      name: "How can I join the FOSS Andhra community?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can join by registering for our FOSStar membership program at fossap.in/programs/fosstar. Membership is open to students, professionals, and institutions.",
      },
    },
    {
      "@type": "Question",
      name: "What are the different types of membership?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "FOSS Andhra offers memberships for Students, Professionals, and Institutions. Each tier provides tailored resources, events, and community access.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a fee for membership?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Please visit fossap.in/membership for current membership pricing and available tiers.",
      },
    },
    {
      "@type": "Question",
      name: "What is FOSSynC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "FOSSynC is FOSS Andhra's initiative to establish student-led open source clubs in colleges and educational institutions across Andhra Pradesh.",
      },
    },
    {
      "@type": "Question",
      name: "How can my college start a FOSS club?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Contact FOSS Andhra at office@fossap.in or visit fossap.in/programs/fossync to learn how to register your institution and get mentorship and resources for starting a FOSS club.",
      },
    },
    {
      "@type": "Question",
      name: "What is FOSStart?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "FOSStart is FOSS Andhra's entrepreneurship program providing seed funding, mentorship, and networking support to open source startups in Andhra Pradesh.",
      },
    },
    {
      "@type": "Question",
      name: "How can I contribute if I'm not a developer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can contribute by volunteering your skills (writing, design, events, outreach), donating to support our programs, or becoming a corporate sponsor. Visit fossap.in/contribute for all options.",
      },
    },
    {
      "@type": "Question",
      name: "Can I sponsor a specific event or project?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, FOSS Andhra offers tiered sponsorship packages for specific events and programs. Contact office@fossap.in or visit fossap.in/contribute/sponsor for details.",
      },
    },
  ],
}

export const metadata: Metadata = {
  title: "Frequently Asked Questions | FOSS Andhra",
  description:
    "Answers to common questions about FOSS Andhra, FOSStar membership, FOSSynC student clubs, and how to contribute to open source in Andhra Pradesh.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQ | FOSS Andhra",
    description: "Common questions about FOSS Andhra programs, membership, and contributions.",
    url: "https://fossap.in/faq",
  },
}

export default function FAQPage() {
  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FAQPageClient />
    </>
  )
}
