import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const contentPages = [
  {
    type: 'page',
    slug: 'about',
    title: 'About FOSS Andhra',
    content: `<h2>Our Story</h2>
<p>FOSS Andhra was established with a vision to promote the adoption of free and open source software across educational institutions, government bodies, and society at large in Andhra Pradesh. We believe that open source solutions offer numerous advantages including cost-effectiveness, transparency, security, and customizability.</p>
<p>Our journey began with a small group of FOSS enthusiasts who recognized the potential of open source software to transform digital infrastructure in the region. Today, we have grown into a vibrant community of developers, educators, policy advocates, and technology enthusiasts working together to advance the cause of free and open source software.</p>
<h2>Our Mission</h2>
<p>To promote the adoption of free and open source software across educational institutions, government bodies, and society at large in Andhra Pradesh, fostering a culture of digital freedom, innovation, and collaboration.</p>
<h2>Our Vision</h2>
<p>A digitally empowered Andhra Pradesh where free and open source software forms the backbone of education, governance, and society, ensuring digital sovereignty, inclusivity, and innovation.</p>`,
    metaDescription: 'Learn about FOSS Andhra\'s mission to promote free and open source software across education, governance, and society in Andhra Pradesh.',
    keywords: 'FOSS Andhra, about, mission, vision, open source, free software, Andhra Pradesh',
    status: 'published',
  },
  {
    type: 'page',
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    content: `<h2>Introduction</h2>
<p>FOSS Andhra ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.</p>
<h2>Information We Collect</h2>
<p>We may collect personal information that you voluntarily provide to us when you register for our programs, sign up for our newsletter, participate in our events, contact us, make a donation, or complete surveys.</p>
<h2>Use of Your Information</h2>
<p>We use the information we collect to provide, maintain, and improve our services, communicate with you, and process your transactions.</p>
<h2>Security of Your Information</h2>
<p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.</p>
<h2>Contact Us</h2>
<p>If you have questions or concerns about this Privacy Policy, please contact us at privacy@fossandhra.org</p>`,
    metaDescription: 'Privacy policy for FOSS Andhra\'s website, programs, and services.',
    keywords: 'privacy policy, data protection, FOSS Andhra',
    status: 'published',
  },
  {
    type: 'page',
    slug: 'terms-of-service',
    title: 'Terms of Service',
    content: `<h2>Introduction</h2>
<p>These Terms of Service ("Terms") govern your access to and use of the FOSS Andhra website and services. By accessing or using our website and services, you agree to be bound by these Terms and our Privacy Policy.</p>
<h2>Use of Our Services</h2>
<p>You may use our services only as permitted by law and these Terms. You must not misuse our services by interfering with their normal operation, or attempting to access them using unauthorized methods.</p>
<h2>User Content</h2>
<p>You may be able to post, upload, publish, submit, or transmit content on our website. By submitting User Content, you grant us a worldwide, irrevocable, perpetual, non-exclusive, transferable, royalty-free license to use, copy, modify, create derivative works based upon, distribute, publicly display, publicly perform, and otherwise exploit your User Content.</p>
<h2>Disclaimer</h2>
<p>Our services are provided "as is" without warranties of any kind, either express or implied. We do not warrant that our services will be uninterrupted, error-free, or secure.</p>
<h2>Contact Us</h2>
<p>If you have any questions about these Terms, please contact us at legal@fossandhra.org</p>`,
    metaDescription: 'Terms and conditions for using FOSS Andhra\'s website, programs, and services.',
    keywords: 'terms of service, terms and conditions, FOSS Andhra',
    status: 'published',
  },
  {
    type: 'page',
    slug: 'refund-policy',
    title: 'Refund Policy',
    content: `<h2>Introduction</h2>
<p>This Refund Policy outlines the terms and conditions for refunds related to FOSS Andhra's programs, events, memberships, and other services. By making a payment to FOSS Andhra, you agree to be bound by this Refund Policy.</p>
<h2>Membership Fees</h2>
<p>Annual membership fees are refundable within 14 days of payment, provided no membership benefits have been utilized. After 14 days, or if membership benefits have been utilized, membership fees are non-refundable.</p>
<h2>Event Registration Fees</h2>
<p>Cancellation policies vary by event timing:</p>
<ul>
<li>More than 30 days before the event: Full refund minus a 5% processing fee</li>
<li>15-30 days before the event: 50% refund</li>
<li>Less than 15 days before the event: No refund</li>
</ul>
<h2>Donations</h2>
<p>Donations to FOSS Andhra are generally non-refundable. However, if you made a donation in error or were charged an incorrect amount, please contact us immediately at donations@fossandhra.org.</p>
<h2>Refund Process</h2>
<p>To request a refund, please contact us at refunds@fossandhra.org with your name, email address, date of purchase, item purchased, and reason for the refund request.</p>
<h2>Contact Us</h2>
<p>If you have any questions about this Refund Policy, please contact us at refunds@fossandhra.org</p>`,
    metaDescription: 'Refund policy for FOSS Andhra\'s programs, events, and services.',
    keywords: 'refund policy, cancellation, FOSS Andhra',
    status: 'published',
  },
]

async function main() {
  console.log('🌱 Seeding content pages...\n')

  for (const page of contentPages) {
    const content = await prisma.content.upsert({
      where: { slug: page.slug },
      update: {
        ...page,
        author: 'admin',
        publishedAt: new Date(),
      },
      create: {
        ...page,
        author: 'admin',
        publishedAt: new Date(),
      },
    })
    console.log(`✅ ${content.title} (${content.slug})`)
  }

  console.log('\n✨ Content pages seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding content pages:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
