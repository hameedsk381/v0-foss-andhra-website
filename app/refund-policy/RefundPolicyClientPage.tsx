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

export default function RefundPolicyClientPage() {
  const [pageContent, setPageContent] = useState<ContentData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/content/refund-policy")
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
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Refund Policy</h1>
            <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <motion.section variants={fadeIn} className="space-y-4">
            <h2 className="text-2xl font-bold">Introduction</h2>
            <p className="text-gray-500 md:text-lg/relaxed">
              This Refund Policy outlines the terms and conditions for refunds related to FOSS Andhra's programs,
              events, memberships, and other services. By making a payment to FOSS Andhra, you agree to be bound by this
              Refund Policy.
            </p>
            <p className="text-gray-500 md:text-lg/relaxed">
              We are committed to fair and transparent refund practices. Please read this policy carefully before making
              any payments.
            </p>
          </motion.section>

          <motion.section variants={fadeIn} className="space-y-4">
            <h2 className="text-2xl font-bold">Membership Fees</h2>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Annual Membership</h3>
              <p className="text-gray-500 md:text-lg/relaxed">
                Annual membership fees are refundable within 14 days of payment, provided no membership benefits have
                been utilized. After 14 days, or if membership benefits have been utilized, membership fees are
                non-refundable.
              </p>
              <p className="text-gray-500 md:text-lg/relaxed">
                To request a refund for your annual membership fee, please contact us at membership@fossandhra.org with
                your name and the email address used for registration.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Lifetime Membership</h3>
              <p className="text-gray-500 md:text-lg/relaxed">
                Lifetime membership fees are refundable within 30 days of payment, provided no membership benefits have
                been utilized. After 30 days, or if membership benefits have been utilized, lifetime membership fees are
                non-refundable.
              </p>
            </div>
          </motion.section>

          <motion.section variants={fadeIn} className="space-y-4">
            <h2 className="text-2xl font-bold">Event Registration Fees</h2>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Cancellation by You</h3>
              <p className="text-gray-500 md:text-lg/relaxed">If you cancel your registration for an event:</p>
              <ul className="list-disc list-inside text-gray-500 md:text-lg/relaxed space-y-1 pl-4">
                <li>More than 30 days before the event: Full refund minus a 5% processing fee</li>
                <li>15-30 days before the event: 50% refund</li>
                <li>Less than 15 days before the event: No refund</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Cancellation by FOSS Andhra</h3>
              <p className="text-gray-500 md:text-lg/relaxed">
                If FOSS Andhra cancels an event, you will be offered one of the following options:
              </p>
              <ul className="list-disc list-inside text-gray-500 md:text-lg/relaxed space-y-1 pl-4">
                <li>Full refund of the registration fee</li>
                <li>Transfer of registration to a future event</li>
                <li>Conversion of the registration fee into a donation to FOSS Andhra</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Virtual Events</h3>
              <p className="text-gray-500 md:text-lg/relaxed">
                For virtual events, refunds are available up to 7 days before the event. After this time, no refunds
                will be issued.
              </p>
            </div>
          </motion.section>

          <motion.section variants={fadeIn} className="space-y-4">
            <h2 className="text-2xl font-bold">Program Fees</h2>
            <p className="text-gray-500 md:text-lg/relaxed">
              Refunds for program fees (e.g., FOSStar, FOSServe, FOSSynC, etc.) are subject to the following terms:
            </p>
            <ul className="list-disc list-inside text-gray-500 md:text-lg/relaxed space-y-1 pl-4">
              <li>Within 14 days of payment and before the program starts: Full refund</li>
              <li>After 14 days but before the program starts: 50% refund</li>
              <li>After the program has started: No refund</li>
            </ul>
          </motion.section>

          <motion.section variants={fadeIn} className="space-y-4">
            <h2 className="text-2xl font-bold">Donations</h2>
            <p className="text-gray-500 md:text-lg/relaxed">
              Donations to FOSS Andhra are generally non-refundable. However, if you made a donation in error or were
              charged an incorrect amount, please contact us immediately at donations@fossandhra.org, and we will
              address your concern.
            </p>
          </motion.section>

          <motion.section variants={fadeIn} className="space-y-4">
            <h2 className="text-2xl font-bold">Digital Products</h2>
            <p className="text-gray-500 md:text-lg/relaxed">
              For digital products (e.g., e-books, online courses, etc.):
            </p>
            <ul className="list-disc list-inside text-gray-500 md:text-lg/relaxed space-y-1 pl-4">
              <li>
                If you have not accessed or downloaded the digital product: Refunds are available within 14 days of
                purchase
              </li>
              <li>
                If you have accessed or downloaded the digital product: No refund is available unless the product is
                defective
              </li>
            </ul>
            <p className="text-gray-500 md:text-lg/relaxed">
              If you believe a digital product is defective, please contact us at support@fossandhra.org with details of
              the issue.
            </p>
          </motion.section>

          <motion.section variants={fadeIn} className="space-y-4">
            <h2 className="text-2xl font-bold">Refund Process</h2>
            <p className="text-gray-500 md:text-lg/relaxed">
              To request a refund, please contact us at refunds@fossandhra.org with the following information:
            </p>
            <ul className="list-disc list-inside text-gray-500 md:text-lg/relaxed space-y-1 pl-4">
              <li>Your full name</li>
              <li>Email address used for the purchase</li>
              <li>Date of purchase</li>
              <li>Item or service purchased</li>
              <li>Reason for the refund request</li>
              <li>Order or transaction ID (if available)</li>
            </ul>
            <p className="text-gray-500 md:text-lg/relaxed">
              We will process refund requests within 7 business days of receiving all necessary information. Approved
              refunds will be issued using the original payment method, and may take 5-10 business days to appear on
              your statement, depending on your payment provider.
            </p>
          </motion.section>

          <motion.section variants={fadeIn} className="space-y-4">
            <h2 className="text-2xl font-bold">Exceptions</h2>
            <p className="text-gray-500 md:text-lg/relaxed">
              FOSS Andhra reserves the right to make exceptions to this policy at its discretion. We may consider
              exceptions in cases of:
            </p>
            <ul className="list-disc list-inside text-gray-500 md:text-lg/relaxed space-y-1 pl-4">
              <li>Illness or emergency (with documentation)</li>
              <li>Technical issues that prevented access to our services</li>
              <li>Other extenuating circumstances</li>
            </ul>
            <p className="text-gray-500 md:text-lg/relaxed">
              To request an exception, please contact us with relevant details and documentation.
            </p>
          </motion.section>

          <motion.section variants={fadeIn} className="space-y-4">
            <h2 className="text-2xl font-bold">Changes to This Policy</h2>
            <p className="text-gray-500 md:text-lg/relaxed">
              We reserve the right to modify this Refund Policy at any time. Changes will be effective immediately upon
              posting on our website. Your continued use of our services after any changes to the Refund Policy
              constitutes your acceptance of the new policy.
            </p>
          </motion.section>

          <motion.section variants={fadeIn} className="space-y-4">
            <h2 className="text-2xl font-bold">Contact Us</h2>
            <p className="text-gray-500 md:text-lg/relaxed">
              If you have any questions about this Refund Policy, please contact us at:
            </p>
            <p className="text-gray-500 md:text-lg/relaxed">
              FOSS Andhra
              <br />
              Email: refunds@fossandhra.org
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
