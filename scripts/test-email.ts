import { sendEmail, verifyEmailConfig, sendWelcomeEmail } from '../lib/email'

async function testEmail() {
  console.log('🧪 Testing FOSS Andhra Email Configuration...\n')

  // Test 1: Verify SMTP Connection
  console.log('Test 1: Verifying SMTP Connection...')
  const isConnected = await verifyEmailConfig()
  if (!isConnected) {
    console.error('❌ SMTP connection failed. Please check your credentials in .env')
    process.exit(1)
  }
  console.log('✅ SMTP connection successful!\n')

  // Test 2: Send Simple Test Email
  console.log('Test 2: Sending simple test email...')
  const testEmailAddress = process.env.TEST_EMAIL || 'fossync@fossap.in'
  
  try {
    await sendEmail({
      to: testEmailAddress,
      subject: 'Test Email from FOSS Andhra Newsletter System',
      html: `
        <h1>Test Email</h1>
        <p>This is a test email from the FOSS Andhra newsletter system.</p>
        <p>If you're seeing this, your email configuration is working correctly!</p>
        <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
      `,
    })
    console.log(`✅ Simple test email sent to ${testEmailAddress}\n`)
  } catch (error) {
    console.error('❌ Failed to send simple test email:', error)
    process.exit(1)
  }

  // Test 3: Send Welcome Email Template
  console.log('Test 3: Sending welcome email template...')
  try {
    await sendWelcomeEmail(testEmailAddress, 'Test User')
    console.log(`✅ Welcome email template sent to ${testEmailAddress}\n`)
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error)
    process.exit(1)
  }

  console.log('🎉 All email tests passed successfully!')
  console.log('\nNext steps:')
  console.log('1. Check the inbox of:', testEmailAddress)
  console.log('2. Verify both emails were received')
  console.log('3. Check spam/junk folder if not in inbox')
  console.log('4. Review email formatting and branding')
}

testEmail()
  .catch((error) => {
    console.error('Test failed:', error)
    process.exit(1)
  })
