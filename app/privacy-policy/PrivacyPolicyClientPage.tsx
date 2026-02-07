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

export default function PrivacyPolicyClientPage() {
  const [pageContent, setPageContent] = useState<ContentData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/content/privacy-policy")
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
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Privacy Policy</h1>
            <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <motion.section variants={fadeIn} className="space-y-4">
            <h2 className="text-2xl font-bold">Introduction</h2>
            <p className="text-gray-500 md:text-lg/relaxed">
              FOSS Andhra ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, disclose, and safeguard your information when you visit our website and use our
              services.
            </p>
            <p className="text-gray-500 md:text-lg/relaxed">
              We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert
              you about any changes by updating the "Last updated" date of this Privacy Policy.
            </p>
          </motion.section>

          <motion.section variants={fadeIn} className="space-y-4">
            <h2 className="text-2xl font-bold">Information We Collect</h2>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Personal Data</h3>
              <p className="text-gray-500 md:text-lg/relaxed">
                We may collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc list-inside text-gray-500 md:text-lg/relaxed space-y-1 pl-4">
                <li>Register for our programs or services</li>
                <li>Sign up for our newsletter</li>
                <li>Participate in our events</li>
                <li>Contact us</li>
                <li>Make a donation</li>
                <li>Complete surveys</li>
              </ul>
              <p className="text-gray-500 md:text-lg/relaxed">
                The personal information we collect may include your name, email address, phone number, mailing address,
                and payment information.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Automatically Collected Information</h3>
              <p className="text-gray-500 md:text-lg/relaxed">
                When you visit our website, we may automatically collect certain information about your device,
                including:
              </p>
              <ul className="list-disc list-inside text-gray-500 md:text-lg/relaxed space-y-1 pl-4">
                <li>IP address</li>
                <li>Browser type</li>
                <li>Operating system</li>
                <li>Pages visited</li>
                <li>Time and date of your visit</li>
                <li>Referring website</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Cookies and Tracking Technologies</h3>
              <p className="text-gray-500 md:text-lg/relaxed">
                We use cookies and similar tracking technologies to track activity on our website and hold certain
                information. Cookies are files with a small amount of data that may include an anonymous unique
                identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being
                sent.
              </p>
            </div>
          </motion.section>

          <motion.section variants={fadeIn} className="space-y-4">
            <h2 className="text-2xl font-bold">How We Use Your Information</h2>
            <p className="text-gray-500 md:text-lg/relaxed">
              We may use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc list-inside text-gray-500 md:text-lg/relaxed space-y-1 pl-4">
              <li>Providing, operating, and maintaining our website and services</li>
              <li>Improving, personalizing, and expanding our website and services</li>
              <li>Understanding and analyzing how you use our website</li>
              <li>Developing new products, services, features, and functionality</li>
              <li>Communicating with you, including for customer service, updates, and marketing purposes</li>
              <li>Processing your transactions</li>
              <li>Finding and preventing fraud</li>
            </ul>
          </motion.section>

          <motion.section variants={fadeIn} className="space-y-4">
            <h2 className="text-2xl font-bold">Disclosure of Your Information</h2>
            <p className="text-gray-500 md:text-lg/relaxed">
              We may share information we have collected about you in certain situations. Your information may be
              disclosed as follows:
            </p>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">By Law or to Protect Rights</h3>
              <p className="text-gray-500 md:text-lg/relaxed">
                If we believe the release of information about you is necessary to respond to legal process, to
                investigate or remedy potential violations of our policies, or to protect the rights, property, and
                safety of others, we may share your information as permitted or required by any applicable law, rule, or
                regulation.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Third-Party Service Providers</h3>
              <p className="text-gray-500 md:text-lg/relaxed">
                We may share your information with third parties that perform services for us or on our behalf,
                including payment processing, data analysis, email delivery, hosting services, customer service, and
                marketing assistance.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Marketing Communications</h3>
              <p className="text-gray-500 md:text-lg/relaxed">
                With your consent, or with an opportunity for you to withdraw consent, we may share your information
                with third parties for marketing purposes.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Affiliates</h3>
              <p className="text-gray-500 md:text-lg/relaxed">
                We may share your information with our affiliates, in which case we will require those affiliates to
                honor this Privacy Policy.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Business Partners</h3>
              <p className="text-gray-500 md:text-lg/relaxed">
                We may share your information with our business partners to offer you certain products, services, or
                promotions.
              </p>
            </div>
          </motion.section>

          <motion.section variants={fadeIn} className="space-y-4">
            <h2 className="text-2xl font-bold">Security of Your Information</h2>
            <p className="text-gray-500 md:text-lg/relaxed">
              We use administrative, technical, and physical security measures to help protect your personal
              information. While we have taken reasonable steps to secure the personal information you provide to us,
              please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method
              of data transmission can be guaranteed against any interception or other type of misuse.
            </p>
          </motion.section>

          <motion.section variants={fadeIn} className="space-y-4">
            <h2 className="text-2xl font-bold">Children's Privacy</h2>
            <p className="text-gray-500 md:text-lg/relaxed">
              Our website and services are not directed to individuals under the age of 13. We do not knowingly collect
              personal information from children under 13. If you are a parent or guardian and you are aware that your
              child has provided us with personal information, please contact us.
            </p>
          </motion.section>

          <motion.section variants={fadeIn} className="space-y-4">
            <h2 className="text-2xl font-bold">Your Rights</h2>
            <p className="text-gray-500 md:text-lg/relaxed">
              You may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc list-inside text-gray-500 md:text-lg/relaxed space-y-1 pl-4">
              <li>The right to access the personal information we have about you</li>
              <li>The right to request that we correct or update any personal information we have about you</li>
              <li>The right to request that we delete any personal information we have about you</li>
              <li>The right to opt-out of marketing communications</li>
            </ul>
            <p className="text-gray-500 md:text-lg/relaxed">
              To exercise these rights, please contact us using the information provided below.
            </p>
          </motion.section>

          <motion.section variants={fadeIn} className="space-y-4">
            <h2 className="text-2xl font-bold">Contact Us</h2>
            <p className="text-gray-500 md:text-lg/relaxed">
              If you have questions or concerns about this Privacy Policy, please contact us at:
            </p>
            <p className="text-gray-500 md:text-lg/relaxed">
              FOSS Andhra
              <br />
              Email: privacy@fossap.in
              <br />
              Address: Foss andhra, Yesj centre for excellence, Vijayawada 520008
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
