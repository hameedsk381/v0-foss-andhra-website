"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { fadeIn } from "@/lib/animation"

interface ContentData {
  title: string
  content: string
}

export default function TermsOfServicePageClient() {
  const [pageContent, setPageContent] = useState<ContentData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/content/terms-of-service")
      .then(res => res.json())
      .then(data => {
        if (data.success) setPageContent(data.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])
  return (
    <main className="flex-1">
      <div className="container max-w-4xl py-12 px-4 md:px-6">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Terms of Service</h1>
            <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <motion.section variants={fadeIn} className="space-y-4">
            <h2 className="text-2xl font-bold">Introduction</h2>
            <p className="text-gray-500 md:text-lg/relaxed">
              These Terms of Service ("Terms") govern your access to and use of the FOSS Andhra website and services. By
              accessing or using our website and services, you agree to be bound by these Terms and our Privacy Policy.
            </p>
            <p className="text-gray-500 md:text-lg/relaxed">
              Please read these Terms carefully before using our website and services. If you do not agree to these
              Terms, you must not access or use our website and services.
            </p>
          </motion.section>

          <motion.section variants={fadeIn} className="space-y-4">
            <h2 className="text-2xl font-bold">Definitions</h2>
            <p className="text-gray-500 md:text-lg/relaxed">
              Throughout these Terms, the following terms have the following meanings:
            </p>
            <ul className="list-disc list-inside text-gray-500 md:text-lg/relaxed space-y-1 pl-4">
              <li>"FOSS Andhra," "we," "us," and "our" refer to FOSS Andhra, its programs, and its services.</li>
              <li>"You" and "your" refer to the individual or entity accessing or using our website and services.</li>
              <li>
                "Website" refers to the FOSS Andhra website, including all content, pages, and services available
                through the domain.
              </li>
              <li>"Services" refers to all programs, initiatives, events, and activities offered by FOSS Andhra.</li>
              <li>"Content" refers to all text, images, videos, audio, code, and other materials on our website.</li>
            </ul>
          </motion.section>

          <motion.section variants={fadeIn} className="space-y-4">
            <h2 className="text-2xl font-bold">Eligibility</h2>
            <p className="text-gray-500 md:text-lg/relaxed">
              You must be at least 13 years old to access or use our website and services. By accessing or using our
              website and services, you represent and warrant that you are at least 13 years old.
            </p>
            <p className="text-gray-500 md:text-lg/relaxed">
              If you are under 18 years old, you represent and warrant that you have your parent's or guardian's
              permission to access or use our website and services, and that your parent or guardian has read and agrees
              to these Terms on your behalf.
            </p>
          </motion.section>

          <motion.section variants={fadeIn} className="space-y-4">
            <h2 className="text-2xl font-bold">Account Registration</h2>
            <p className="text-gray-500 md:text-lg/relaxed">
              Some features of our website and services may require you to register for an account. When you register
              for an account, you agree to provide accurate, current, and complete information about yourself.
            </p>
            <p className="text-gray-500 md:text-lg/relaxed">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities
              that occur under your account. You agree to notify us immediately of any unauthorized use of your account
              or any other breach of security.
            </p>
          </motion.section>

          <motion.section variants={fadeIn} className="space-y-4">
            <h2 className="text-2xl font-bold">User Conduct</h2>
            <p className="text-gray-500 md:text-lg/relaxed">You agree not to use our website and services to:</p>
            <ul className="list-disc list-inside text-gray-500 md:text-lg/relaxed space-y-1 pl-4">
              <li>Violate any applicable law, regulation, or these Terms</li>
              <li>Infringe upon the rights of others, including intellectual property rights</li>
              <li>Harass, abuse, or harm another person</li>
              <li>Send spam or other unsolicited messages</li>
              <li>Upload or transmit viruses, malware, or other harmful code</li>
              <li>Interfere with the proper functioning of our website and services</li>
              <li>Attempt to gain unauthorized access to our website, user accounts, or computer systems</li>
              <li>Collect or harvest user information without consent</li>
              <li>Engage in any activity that disrupts or diminishes the quality of our website and services</li>
            </ul>
          </motion.section>

          <motion.section variants={fadeIn} className="space-y-4">
            <h2 className="text-2xl font-bold">Intellectual Property</h2>
            <p className="text-gray-500 md:text-lg/relaxed">
              Our website and its original content, features, and functionality are owned by FOSS Andhra and are
              protected by international copyright, trademark, patent, trade secret, and other intellectual property or
              proprietary rights laws.
            </p>
            <p className="text-gray-500 md:text-lg/relaxed">
              Unless otherwise specified, all materials on our website are licensed under open-source licenses. However,
              the FOSS Andhra name, logo, and related marks are trademarks of FOSS Andhra and may not be used without
              our prior written consent.
            </p>
          </motion.section>

          <motion.section variants={fadeIn} className="space-y-4">
            <h2 className="text-2xl font-bold">User Content</h2>
            <p className="text-gray-500 md:text-lg/relaxed">
              You may be able to post, upload, publish, submit, or transmit content on our website ("User Content"). By
              submitting User Content, you grant us a worldwide, irrevocable, perpetual, non-exclusive, transferable,
              royalty-free license to use, copy, modify, create derivative works based upon, distribute, publicly
              display, publicly perform, and otherwise exploit your User Content in connection with our website and
              services.
            </p>
            <p className="text-gray-500 md:text-lg/relaxed">
              You represent and warrant that you have all rights necessary to grant us the license above and that your
              User Content does not violate any law or the rights of any third party.
            </p>
          </motion.section>

          <motion.section variants={fadeIn} className="space-y-4">
            <h2 className="text-2xl font-bold">Third-Party Websites and Services</h2>
            <p className="text-gray-500 md:text-lg/relaxed">
              Our website may contain links to third-party websites and services that are not owned or controlled by
              FOSS Andhra. We have no control over, and assume no responsibility for, the content, privacy policies, or
              practices of any third-party websites or services.
            </p>
            <p className="text-gray-500 md:text-lg/relaxed">
              You acknowledge and agree that FOSS Andhra shall not be responsible or liable, directly or indirectly, for
              any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any
              such content, goods, or services available on or through any such websites or services.
            </p>
          </motion.section>

          <motion.section variants={fadeIn} className="space-y-4">
            <h2 className="text-2xl font-bold">Termination</h2>
            <p className="text-gray-500 md:text-lg/relaxed">
              We may terminate or suspend your access to our website and services immediately, without prior notice or
              liability, for any reason, including, without limitation, if you breach these Terms.
            </p>
            <p className="text-gray-500 md:text-lg/relaxed">
              All provisions of these Terms which by their nature should survive termination shall survive termination,
              including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of
              liability.
            </p>
          </motion.section>

          <motion.section variants={fadeIn} className="space-y-4">
            <h2 className="text-2xl font-bold">Disclaimer of Warranties</h2>
            <p className="text-gray-500 md:text-lg/relaxed">
              Our website and services are provided "as is" and "as available" without any warranties of any kind,
              either express or implied, including, but not limited to, the implied warranties of merchantability,
              fitness for a particular purpose, or non-infringement.
            </p>
            <p className="text-gray-500 md:text-lg/relaxed">
              We do not warrant that our website and services will be uninterrupted, timely, secure, or error-free, or
              that any defects in our website and services will be corrected.
            </p>
          </motion.section>

          <motion.section variants={fadeIn} className="space-y-4">
            <h2 className="text-2xl font-bold">Limitation of Liability</h2>
            <p className="text-gray-500 md:text-lg/relaxed">
              To the maximum extent permitted by law, in no event shall FOSS Andhra, its directors, employees, partners,
              agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or
              punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible
              losses, resulting from:
            </p>
            <ul className="list-disc list-inside text-gray-500 md:text-lg/relaxed space-y-1 pl-4">
              <li>Your access to or use of or inability to access or use our website and services</li>
              <li>Any conduct or content of any third party on our website</li>
              <li>Any content obtained from our website</li>
              <li>Unauthorized access, use, or alteration of your transmissions or content</li>
            </ul>
          </motion.section>

          <motion.section variants={fadeIn} className="space-y-4">
            <h2 className="text-2xl font-bold">Indemnification</h2>
            <p className="text-gray-500 md:text-lg/relaxed">
              You agree to indemnify, defend, and hold harmless FOSS Andhra, its directors, employees, partners, agents,
              suppliers, and affiliates, from and against any claims, liabilities, damages, judgments, awards, losses,
              costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your
              violation of these Terms or your use of our website and services.
            </p>
          </motion.section>

          <motion.section variants={fadeIn} className="space-y-4">
            <h2 className="text-2xl font-bold">Governing Law</h2>
            <p className="text-gray-500 md:text-lg/relaxed">
              These Terms shall be governed by and construed in accordance with the laws of India, without regard to its
              conflict of law provisions.
            </p>
            <p className="text-gray-500 md:text-lg/relaxed">
              Our failure to enforce any right or provision of these Terms will not be considered a waiver of those
              rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining
              provisions of these Terms will remain in effect.
            </p>
          </motion.section>

          <motion.section variants={fadeIn} className="space-y-4">
            <h2 className="text-2xl font-bold">Changes to These Terms</h2>
            <p className="text-gray-500 md:text-lg/relaxed">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will make
              reasonable efforts to provide notice of any significant changes to these Terms. Your continued use of our
              website and services after any such changes constitutes your acceptance of the new Terms.
            </p>
          </motion.section>

          <motion.section variants={fadeIn} className="space-y-4">
            <h2 className="text-2xl font-bold">Contact Us</h2>
            <p className="text-gray-500 md:text-lg/relaxed">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="text-gray-500 md:text-lg/relaxed">
              FOSS Andhra
              <br />
              Email: legal@fossandhra.org
              <br />
              Address: 123 Open Source Street, Andhra Pradesh, India
            </p>
          </motion.section>

          <div className="flex justify-center pt-8">
            <Link
              href="/"
              className={cn(
                "inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
              )}
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
