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
        text: "FOSS Andhra (fossap.in) is an independent non-governmental community organisation based in Vijayawada, Andhra Pradesh. We promote free and open source software in education, governance, and society through seven programmes: FOSStar (membership), FOSServe (education and governance deployment), FOSSynC (student clubs), FOSStorm (community software projects), FOSStart (startup incubation), FOSSterage (open datasets and knowledge), and FOSSpeaks (advocacy and outreach).",
      },
    },
    {
      "@type": "Question",
      name: "What is FOSS Andhra's role in the AI era?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "In 2026, the most critical AI infrastructure — training frameworks like PyTorch, language models like Llama and Mistral, and toolchains like Hugging Face — is open source. FOSS Andhra helps AP students and institutions understand, use, and contribute to this stack rather than depending solely on proprietary AI products. Our FOSStorm programme is building Telugu-language NLP tools and open datasets specifically to address the gap in regional-language AI resources.",
      },
    },
    {
      "@type": "Question",
      name: "How does FOSS Andhra relate to India's Digital Public Infrastructure?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "India's Digital Public Infrastructure (DPI) — including UPI, Aadhaar, ONDC, DIGIT, and Beckn — is built on open source principles. FOSS Andhra advocates for AP government bodies and institutions to adopt DPI-compatible open source tools, and our FOSServe programme works directly with educational institutions and local government offices to deploy and support these solutions.",
      },
    },
    {
      "@type": "Question",
      name: "What is FOSSynC and how can my college start a club?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "FOSSynC is FOSS Andhra's campus club programme with 9+ active chapters across AP universities including JNTU Kakinada, Andhra University, NIT Tadepalligudem, and IIT Tirupati. To start a club, email office@fossap.in with your college name and a founding team of at least 10 students. FOSS Andhra provides a resource kit, mentor access, and a speaker for your inaugural event at no cost. Full guide at fossap.in/programs/fossync.",
      },
    },
    {
      "@type": "Question",
      name: "What open source projects does FOSS Andhra build?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "FOSS Andhra's FOSStorm programme develops community software addressing Andhra Pradesh's specific needs. Active projects include TeluguNLP (a natural language processing toolkit for Telugu), OpenEdu (an offline-first learning management system for schools with limited connectivity), CivicDocs (document management for local government offices), and FarmConnect (a mobile platform connecting farmers with agricultural data and market information). All projects are released under open source licences on GitHub at github.com/fossandhra.",
      },
    },
    {
      "@type": "Question",
      name: "How can I join FOSS Andhra?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Join through the FOSStar membership programme at fossap.in/programs/fosstar. Membership tiers are available for Students, Professionals, and Institutions. Members get access to events, workshops, the FOSS Andhra mentor network, and early access to FOSStorm project opportunities. Visit fossap.in/membership for current pricing.",
      },
    },
    {
      "@type": "Question",
      name: "What is FOSStart?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "FOSStart is FOSS Andhra's startup incubation programme for founders building products on open source foundations. It provides seed funding support, mentorship from practitioners, legal and compliance guidance for open source licensing, and connections to the wider AP tech ecosystem. Apply or enquire at fossap.in/programs/fosstart.",
      },
    },
    {
      "@type": "Question",
      name: "How can I contribute if I am not a developer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non-developer contributions are essential to FOSS Andhra. You can help through technical writing and documentation, event organisation, translation of content into Telugu, design, outreach to colleges, or financial support via donation or corporate sponsorship. Visit fossap.in/contribute for all options, or email office@fossap.in to discuss how your skills can be used.",
      },
    },
    {
      "@type": "Question",
      name: "Where is FOSS Andhra located and how can I contact them?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "FOSS Andhra is based at Yesj Centre for Excellence, Vijayawada, Andhra Pradesh 520008, India. Contact: office@fossap.in or +91 94944 63840. Website: fossap.in. Social: github.com/fossandhra, linkedin.com/company/fossandhra, youtube.com/@fossandhra.",
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
