import { verifyEmailConfig, sendWelcomeEmail } from './lib/email'

async function testEmail() {
  console.log('🧪 Testing email configuration...\n')
  
  // Test SMTP connection
  console.log('Step 1: Verifying SMTP connection...')
  const isValid = await verifyEmailConfig()
  
  if (!isValid) {
    console.log('\n❌ Email configuration failed!')
    console.log('Please check your SMTP settings in .env file:\n')
    console.log('SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS')
    process.exit(1)
  }
  
  console.log('✅ SMTP connection successful!\n')
  
  // Send test email
  console.log('Step 2: Sending test welcome email...')
  console.log('Please enter recipient email address:')
  
  // For testing, you can hardcode an email or use command line arg
  const testEmail = process.argv[2] || 'test@example.com'
  
  console.log(`Sending to: ${testEmail}`)
  
  const result = await sendWelcomeEmail(testEmail, {
    name: 'Test User',
    membershipId: 'FOSSTEST123',
    expiryDate: new Date('2025-12-31')
  })
  
  if (result.success) {
    console.log('\n✅ Test email sent successfully!')
    console.log(`Message ID: ${result.messageId}`)
    console.log(`\nCheck inbox of: ${testEmail}`)
    console.log('\n🎉 Email system is working!')
  } else {
    console.log('\n❌ Failed to send email')
    console.log('Error:', result.error)
  }
}

// Run the test
testEmail()
  .then(() => {
    console.log('\n✨ Test complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error)
    process.exit(1)
  })
