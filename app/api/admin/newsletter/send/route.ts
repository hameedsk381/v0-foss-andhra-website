import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendNewsletterEmail } from '@/lib/email'
import { requireAdminAccess } from "@/lib/auth/admin"

// POST - Send newsletter to subscribers
export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdminAccess(["admin"])
    if (authError) return authError

    const body = await request.json()
    const { subject, content, testEmail } = body

    if (!subject || !content) {
      return NextResponse.json({ error: 'Subject and content are required' }, { status: 400 })
    }

    // If test email, send only to test address
    if (testEmail) {
      await sendNewsletterEmail(testEmail, subject, content)
      return NextResponse.json({ 
        success: true, 
        message: 'Test email sent successfully',
        sentTo: 1 
      })
    }

    // Get all active subscribers
    const subscribers = await prisma.subscriber.findMany({
      where: { status: 'active' },
    })

    if (subscribers.length === 0) {
      return NextResponse.json({ error: 'No active subscribers' }, { status: 400 })
    }

    // Send emails in batches to avoid rate limiting
    const batchSize = 50
    let successCount = 0
    let failCount = 0

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize)
      
      const promises = batch.map(async (subscriber: { email: string; name: string | null }) => {
        try {
          await sendNewsletterEmail(subscriber.email, subject, content)
          successCount++
        } catch (error) {
          console.error(`Failed to send to ${subscriber.email}:`, error)
          failCount++
        }
      })

      await Promise.all(promises)
      
      // Small delay between batches
      if (i + batchSize < subscribers.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    return NextResponse.json({ 
      success: true,
      message: `Newsletter sent successfully`,
      sentTo: successCount,
      failed: failCount,
      total: subscribers.length
    })
  } catch (error) {
    console.error('Error sending newsletter:', error)
    return NextResponse.json({ error: 'Failed to send newsletter' }, { status: 500 })
  }
}
