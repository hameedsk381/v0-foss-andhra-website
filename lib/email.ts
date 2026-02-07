import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true, // true for 465 with SSL/TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    minVersion: 'TLSv1.2', // Ensure modern TLS for Let's Encrypt
    rejectUnauthorized: false, // Temporarily disable for troubleshooting
  },
})

interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  const fromName = process.env.SMTP_FROM_NAME || 'FOSS Andhra'
  const fromEmail = process.env.SMTP_USER

  const mailOptions = {
    from: `"${fromName}" <${fromEmail}>`,
    to: Array.isArray(to) ? to.join(', ') : to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

export async function sendNewsletterEmail(
  email: string,
  subject: string,
  content: string,
  unsubscribeToken?: string
) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3002'
  const unsubscribeLink = unsubscribeToken
    ? `${baseUrl}/newsletter/unsubscribe?token=${unsubscribeToken}`
    : `${baseUrl}/newsletter/unsubscribe?email=${encodeURIComponent(email)}`

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f5f5f5;
      line-height: 1.6;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #015ba7 0%, #0077cc 100%);
      padding: 40px 30px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .logo-container {
      margin-bottom: 20px;
    }
    .logo-image {
      max-width: 120px;
      height: auto;
      display: inline-block;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #ffffff;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .tagline {
      margin: 10px 0 0;
      color: #e0e7ff;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .content {
      padding: 40px 30px;
      color: #1f2937;
    }
    .content h1 {
      color: #015ba7;
      font-size: 28px;
      margin: 0 0 20px;
      font-weight: 700;
    }
    .content h2 {
      color: #015ba7;
      font-size: 22px;
      margin: 30px 0 15px;
      font-weight: 600;
    }
    .content h3 {
      color: #374151;
      font-size: 18px;
      margin: 25px 0 12px;
      font-weight: 600;
    }
    .content p {
      color: #4b5563;
      font-size: 16px;
      line-height: 1.8;
      margin: 0 0 16px;
    }
    .content ul, .content ol {
      color: #4b5563;
      font-size: 16px;
      line-height: 1.8;
      margin: 0 0 16px;
      padding-left: 24px;
    }
    .content li {
      margin: 8px 0;
    }
    .content blockquote {
      border-left: 4px solid #015ba7;
      padding-left: 20px;
      margin: 20px 0;
      color: #6b7280;
      font-style: italic;
    }
    .content a {
      color: #015ba7;
      text-decoration: none;
      font-weight: 500;
    }
    .content a:hover {
      text-decoration: underline;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #015ba7 0%, #0077cc 100%);
      color: #ffffff !important;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
      box-shadow: 0 4px 6px rgba(1, 91, 167, 0.2);
    }
    .cta-button-secondary {
      display: inline-block;
      background: linear-gradient(135deg, #98d339 0%, #7ab82d 100%);
      color: #ffffff !important;
      padding: 12px 28px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 10px 5px;
      box-shadow: 0 3px 5px rgba(152, 211, 57, 0.3);
    }
    .divider {
      border: none;
      border-top: 2px solid #e5e7eb;
      margin: 30px 0;
    }
    .support-box {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border: 2px solid #bae6fd;
      border-radius: 8px;
      padding: 25px;
      margin: 30px 0;
      text-align: center;
    }
    .support-box h3 {
      color: #015ba7;
      margin: 0 0 10px;
      font-size: 20px;
    }
    .support-box p {
      color: #0c4a6e;
      margin: 0 0 20px;
      font-size: 15px;
    }
    .footer {
      background-color: #f9fafb;
      padding: 30px;
      border-radius: 0 0 8px 8px;
      border-top: 1px solid #e5e7eb;
    }
    .social-links {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #e5e7eb;
    }
    .social-links p {
      margin: 0 0 15px;
      color: #6b7280;
      font-size: 14px;
      font-weight: 500;
    }
    .social-links a {
      display: inline-block;
      margin: 0 12px;
      color: #015ba7;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
    }
    .social-links a:hover {
      color: #0077cc;
      text-decoration: underline;
    }
    .footer-info {
      text-align: center;
      padding-top: 20px;
    }
    .footer-info p {
      margin: 10px 0;
      color: #9ca3af;
      font-size: 12px;
      line-height: 1.5;
    }
    .footer-info a {
      color: #015ba7;
      text-decoration: none;
    }
    .footer-info a:hover {
      text-decoration: underline;
    }
    .brand-accent {
      width: 60px;
      height: 4px;
      background: linear-gradient(90deg, #015ba7 0%, #98d339 100%);
      margin: 20px auto;
      border-radius: 2px;
    }
    @media only screen and (max-width: 600px) {
      .header {
        padding: 30px 20px;
      }
      .content {
        padding: 30px 20px;
      }
      .footer {
        padding: 20px;
      }
      .logo {
        font-size: 26px;
      }
      .logo-image {
        max-width: 100px;
      }
      .content h1 {
        font-size: 24px;
      }
      .content h2 {
        font-size: 20px;
      }
      .support-box {
        padding: 20px 15px;
      }
      .cta-button, .cta-button-secondary {
        display: block;
        margin: 10px 0;
      }
    }
  </style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <table class="email-container" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); max-width: 600px;">
          <!-- Header -->
          <tr>
            <td class="header">
              <div class="logo-container">
                <img src="${baseUrl}/foss-andhra-logo-white.png" alt="FOSS Andhra" class="logo-image" style="max-width: 120px; height: auto;" />
              </div>
              <h1 class="logo">FOSS Andhra</h1>
              <div class="brand-accent" style="width: 60px; height: 4px; background: linear-gradient(90deg, #ffffff 0%, #98d339 100%); margin: 15px auto; border-radius: 2px;"></div>
              <p class="tagline">Free & Open Source Software Foundation</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td class="content">
              ${content}
              
              <!-- Support Section -->
              <div class="support-box">
                <h3>💚 Support FOSS Andhra</h3>
                <p>Help us promote Free and Open Source Software in Andhra Pradesh. Your contribution makes a difference!</p>
                <a href="${baseUrl}/contribute/donate" class="cta-button-secondary" style="display: inline-block; background: linear-gradient(135deg, #98d339 0%, #7ab82d 100%); color: #ffffff !important; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; box-shadow: 0 3px 5px rgba(152, 211, 57, 0.3);">
                  Donate Now
                </a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td class="footer">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="social-links">
                    <p>Connect with us</p>
                    <div>
                      <a href="https://twitter.com/fossandhra">Twitter</a>
                      <a href="https://linkedin.com/company/fossandhra">LinkedIn</a>
                      <a href="https://github.com/fossandhra">GitHub</a>
                      <a href="${baseUrl}">Website</a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="footer-info">
                    <p style="font-weight: 500; color: #6b7280; font-size: 13px;">
                      You're receiving this email because you subscribed to FOSS Andhra Foundation newsletter.
                    </p>
                    <p>
                      <a href="${unsubscribeLink}" style="color: #015ba7;">Unsubscribe</a> from this newsletter
                    </p>
                    <div class="brand-accent" style="width: 40px; height: 3px; background: linear-gradient(90deg, #015ba7 0%, #98d339 100%); margin: 15px auto; border-radius: 2px;"></div>
                    <p style="font-weight: 600; color: #374151;">
                      © ${new Date().getFullYear()} FOSS Andhra Foundation. All rights reserved.
                    </p>
                    <p>
                      Promoting Free and Open Source Software in Andhra Pradesh
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `

  return sendEmail({
    to: email,
    subject,
    html,
  })
}

export async function sendWelcomeEmail(email: string, name?: string) {
  const greeting = name ? `Hi ${name}` : 'Hello'
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3002'

  const content = `
    <h1>Welcome to FOSS Andhra Foundation! 🎉</h1>
    <p>
      ${greeting}! Thank you for subscribing to our newsletter.
    </p>
    <p>
      We're excited to have you as part of our community dedicated to promoting Free and Open Source Software in Andhra Pradesh and beyond.
    </p>
    <div class="brand-accent" style="width: 60px; height: 4px; background: linear-gradient(90deg, #015ba7 0%, #98d339 100%); margin: 25px 0; border-radius: 2px;"></div>
    <h2>What to Expect</h2>
    <p>You'll receive updates about:</p>
    <ul style="color: #4b5563; font-size: 16px; line-height: 1.8;">
      <li><strong>FOSS Events & Workshops</strong> - Learn and grow with our community</li>
      <li><strong>Community Initiatives</strong> - FOSStar, FOSServe, FOSSynC and more</li>
      <li><strong>Latest Blog Posts</strong> - AI, LLMs, Agentic AI, and open-source tech</li>
      <li><strong>Success Stories</strong> - Member achievements and case studies</li>
      <li><strong>Exclusive Content</strong> - Early access to announcements</li>
    </ul>
    <p style="color: #015ba7; font-weight: 600; font-size: 17px; margin-top: 30px;">
      Stay tuned for exciting content!
    </p>
    <div style="text-align: center; margin-top: 35px;">
      <a href="${baseUrl}/blog" class="cta-button" style="display: inline-block; background: linear-gradient(135deg, #015ba7 0%, #0077cc 100%); color: #ffffff !important; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; box-shadow: 0 4px 6px rgba(1, 91, 167, 0.2); margin: 5px;">
        Explore Our Blog
      </a>
      <a href="${baseUrl}/programs/fosstar" class="cta-button" style="display: inline-block; background: linear-gradient(135deg, #015ba7 0%, #0077cc 100%); color: #ffffff !important; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; box-shadow: 0 4px 6px rgba(1, 91, 167, 0.2); margin: 5px;">
        Join FOSStar
      </a>
    </div>
    <hr class="divider" style="border: none; border-top: 2px solid #e5e7eb; margin: 35px 0;" />
    <p style="color: #6b7280; font-size: 14px;">
      <strong>Need help?</strong> Reply to this email or visit our <a href="${baseUrl}" style="color: #015ba7;">website</a> for more information.
    </p>
  `

  return sendNewsletterEmail(email, 'Welcome to FOSS Andhra Foundation!', content)
}

// Verify transporter configuration
export async function verifyEmailConfig() {
  try {
    await transporter.verify()
    console.log('✅ Email server is ready')
    return true
  } catch (error) {
    console.error('❌ Email server error:', error)
    return false
  }
}

// Send welcome email to new members
export async function sendMemberWelcomeEmail(to: string, memberData: {
  name: string
  membershipId: string
  expiryDate: Date
  password?: string
}) {
  const { name, membershipId, expiryDate, password } = memberData

  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME || 'FOSS Andhra'}" <${process.env.SMTP_USER}>`,
    to,
    subject: '🎉 Welcome to FOSS Andhra!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #015ba7; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 12px; }
          .button { display: inline-block; padding: 12px 24px; background: #98d339; color: #000; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .membership-card { background: white; border: 2px solid #015ba7; padding: 20px; margin: 20px 0; border-radius: 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to FOSS Andhra!</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>Thank you for joining the FOSS Andhra community! We're excited to have you as a FOSStar member.</p>
            
            <div class="membership-card">
              <h3>Your Membership Details</h3>
              <p><strong>Membership ID:</strong> ${membershipId}</p>
              <p><strong>Type:</strong> FOSStar Annual</p>
              <p><strong>Temporary Password:</strong> ${password}</p>
              <p><strong>Valid Until:</strong> ${expiryDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            <p><strong>Important:</strong> Please log in and change your password immediately.</p>

            <h3>What's Next?</h3>
            <ul>
              <li>Access our members-only resources</li>
              <li>Join upcoming events and workshops</li>
              <li>Connect with the FOSS community</li>
              <li>Contribute to open source projects</li>
            </ul>

            <center>
              <a href="https://fossandhra.org/login" class="button">Login to Member Portal</a>
            </center>

            <p>If you have any questions, feel free to reach out to us at <a href="mailto:office@fossap.in">office@fossap.in</a></p>

            <p>Best regards,<br><strong>FOSS Andhra Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} FOSS Andhra. All rights reserved.</p>
            <p>Promoting Free and Open Source Software in Andhra Pradesh</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('✅ Welcome email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Error sending welcome email:', error)
    return { success: false, error }
  }
}

// Send event registration confirmation
export async function sendEventConfirmationEmail(to: string, eventData: {
  name: string
  eventTitle: string
  eventDate: Date
  eventLocation: string
}) {
  const { name, eventTitle, eventDate, eventLocation } = eventData

  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME || 'FOSS Andhra'}" <${process.env.SMTP_USER}>`,
    to,
    subject: `✅ Event Registration Confirmed - ${eventTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #015ba7; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 12px; }
          .event-card { background: white; border-left: 4px solid #98d339; padding: 20px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Registration Confirmed!</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>Your registration for the following event has been confirmed:</p>
            
            <div class="event-card">
              <h3>${eventTitle}</h3>
              <p><strong>📅 Date:</strong> ${eventDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><strong>📍 Location:</strong> ${eventLocation}</p>
            </div>

            <p>We look forward to seeing you at the event!</p>
            <p>Please save this email for your records.</p>

            <p>Best regards,<br><strong>FOSS Andhra Events Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} FOSS Andhra. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('✅ Event confirmation email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Error sending event confirmation email:', error)
    return { success: false, error }
  }
}

// Send donation receipt
export async function sendDonationReceiptEmail(to: string, donationData: {
  name: string
  amount: number
  type: string
  paymentId: string
  date: Date
}) {
  const { name, amount, type, paymentId, date } = donationData

  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME || 'FOSS Andhra'}" <${process.env.SMTP_USER}>`,
    to,
    subject: '🙏 Thank You for Your Donation - Receipt',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #015ba7; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 12px; }
          .receipt { background: white; border: 2px solid #015ba7; padding: 20px; margin: 20px 0; }
          .amount { font-size: 32px; color: #015ba7; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You!</h1>
          </div>
          <div class="content">
            <h2>Dear ${name},</h2>
            <p>Thank you for your generous donation to FOSS Andhra. Your support helps us promote free and open source software across Andhra Pradesh.</p>
            
            <div class="receipt">
              <h3>Donation Receipt</h3>
              <p class="amount">₹${amount.toLocaleString('en-IN')}</p>
              <hr>
              <p><strong>Type:</strong> ${type}</p>
              <p><strong>Payment ID:</strong> ${paymentId}</p>
              <p><strong>Date:</strong> ${date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            <p>Your contribution will be used for:</p>
            <ul>
              <li>Organizing workshops and training sessions</li>
              <li>Supporting open source projects</li>
              <li>Building the FOSS community in Andhra Pradesh</li>
            </ul>

            <p>Please keep this email for your tax records.</p>

            <p>With gratitude,<br><strong>FOSS Andhra Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} FOSS Andhra. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('✅ Donation receipt email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Error sending donation receipt email:', error)
    return { success: false, error }
  }
}

// Send membership renewal reminder
export async function sendRenewalReminderEmail(to: string, memberData: {
  name: string
  membershipId: string
  expiryDate: Date
  daysUntilExpiry: number
}) {
  const { name, membershipId, expiryDate, daysUntilExpiry } = memberData

  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME || 'FOSS Andhra'}" <${process.env.SMTP_USER}>`,
    to,
    subject: '⚠️ Your FOSStar Membership is Expiring Soon',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ea580c; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 12px; }
          .button { display: inline-block; padding: 12px 24px; background: #98d339; color: #000; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Membership Renewal Reminder</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            
            <div class="warning">
              <p><strong>⚠️ Your FOSStar membership will expire in ${daysUntilExpiry} days!</strong></p>
              <p><strong>Membership ID:</strong> ${membershipId}</p>
              <p><strong>Expiry Date:</strong> ${expiryDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            <p>Don't miss out on the benefits of being a FOSStar member:</p>
            <ul>
              <li>Access to exclusive workshops and events</li>
              <li>Networking with the FOSS community</li>
              <li>Resources and learning materials</li>
              <li>Participation in community projects</li>
            </ul>

            <center>
              <a href="https://fossandhra.org/programs/fosstar#membership" class="button">Renew Membership</a>
            </center>

            <p>Questions? Contact us at <a href="mailto:office@fossap.in">office@fossap.in</a></p>

            <p>Best regards,<br><strong>FOSS Andhra Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} FOSS Andhra. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('✅ Renewal reminder email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Error sending renewal reminder email:', error)
    return { success: false, error }
  }
}

// Send volunteer confirmation email
export async function sendVolunteerConfirmationEmail(to: string, volunteerData: {
  firstName: string
  lastName: string
  skills: string
  interests: string
}) {
  const { firstName, lastName, skills, interests } = volunteerData

  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME || 'FOSS Andhra'}" <${process.env.SMTP_USER}>`,
    to,
    subject: '🎉 Thank You for Volunteering with FOSS Andhra!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #98d339; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 12px; }
          .button { display: inline-block; padding: 12px 24px; background: #015ba7; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .info-box { background: white; border-left: 4px solid #015ba7; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to the FOSS Andhra Volunteer Team!</h1>
          </div>
          <div class="content">
            <h2>Hello ${firstName},</h2>
            <p>Thank you for registering as a volunteer with FOSS Andhra! We're excited to have you join our community of passionate individuals promoting Free and Open Source Software across Andhra Pradesh.</p>
            
            <div class="info-box">
              <h3>Your Registration Details</h3>
              <p><strong>Name:</strong> ${firstName} ${lastName}</p>
              <p><strong>Skills:</strong> ${skills}</p>
              <p><strong>Areas of Interest:</strong> ${interests}</p>
            </div>

            <h3>What's Next?</h3>
            <p>Our volunteer coordination team is reviewing your application. Here's what you can expect:</p>
            <ul>
              <li>📧 We'll contact you within 2-3 business days</li>
              <li>🤝 You'll be matched with suitable volunteer opportunities</li>
              <li>📚 Access to volunteer resources and guidelines</li>
              <li>👥 Introduction to the volunteer community</li>
            </ul>

            <h3>In the Meantime</h3>
            <p>While we review your application, feel free to:</p>
            <ul>
              <li>Explore our <a href="https://fossandhra.org/programs">programs and initiatives</a></li>
              <li>Join our upcoming <a href="https://fossandhra.org/events">events and workshops</a></li>
              <li>Read our <a href="https://fossandhra.org/blog">latest blog posts</a></li>
            </ul>

            <center>
              <a href="https://fossandhra.org" class="button">Visit Our Website</a>
            </center>

            <p>If you have any questions, feel free to reach out to us at <a href="mailto:volunteers@fossandhra.org">volunteers@fossandhra.org</a></p>

            <p>Thank you for your commitment to the FOSS movement!</p>

            <p>Best regards,<br><strong>FOSS Andhra Volunteer Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} FOSS Andhra. All rights reserved.</p>
            <p>Promoting Free and Open Source Software in Andhra Pradesh</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('✅ Volunteer confirmation email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Error sending volunteer confirmation email:', error)
    return { success: false, error }
  }
}

// Send admin notification for new volunteer
export async function sendVolunteerAdminNotification(volunteerData: {
  firstName: string
  lastName: string
  email: string
  phone: string
  skills: string
  interests: string
  availability: string
  id: string
}) {
  const { firstName, lastName, email, phone, skills, interests, availability, id } = volunteerData
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@fossandhra.org'
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3002'

  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME || 'FOSS Andhra'}" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: '🆕 New Volunteer Registration - Action Required',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #015ba7; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 12px; }
          .button { display: inline-block; padding: 12px 24px; background: #98d339; color: #000; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .volunteer-card { background: white; border: 2px solid #015ba7; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .field { margin: 10px 0; }
          .field strong { color: #015ba7; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Volunteer Registration</h1>
          </div>
          <div class="content">
            <p>A new volunteer has registered on the FOSS Andhra website. Please review their application.</p>
            
            <div class="volunteer-card">
              <h3>Volunteer Information</h3>
              <div class="field"><strong>Name:</strong> ${firstName} ${lastName}</div>
              <div class="field"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></div>
              <div class="field"><strong>Phone:</strong> ${phone}</div>
              <div class="field"><strong>Skills:</strong> ${skills}</div>
              <div class="field"><strong>Interests:</strong> ${interests}</div>
              <div class="field"><strong>Availability:</strong> ${availability}</div>
            </div>

            <center>
              <a href="${baseUrl}/admin/volunteers" class="button">Review in Admin Panel</a>
            </center>

            <p style="margin-top: 20px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107;">
              <strong>Action Required:</strong> Please review this volunteer application and update their status in the admin panel.
            </p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} FOSS Andhra. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('✅ Admin notification email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Error sending admin notification email:', error)
    return { success: false, error }
  }
}

// Send event ticket confirmation email with QR codes
export async function sendTicketConfirmationEmail(to: string, orderData: {
  orderNumber: string
  customerName: string
  eventTitle: string
  eventDate: Date
  eventTime: string
  eventLocation: string
  totalAmount: number
  tickets: Array<{
    id: string
    ticketTypeName: string
    attendeeName: string
    qrCode: string
  }>
}) {
  const { orderNumber, customerName, eventTitle, eventDate, eventTime, eventLocation, totalAmount, tickets } = orderData
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

  const ticketsHtml = tickets.map((ticket, index) => `
    <div class="ticket-card">
      <h4 style="margin: 0 0 10px; color: #015ba7;">Ticket ${index + 1} - ${ticket.ticketTypeName}</h4>
      <p style="margin: 5px 0;"><strong>Attendee:</strong> ${ticket.attendeeName}</p>
      <div style="text-align: center; margin: 20px 0;">
        <img src="${ticket.qrCode}" alt="QR Code" style="max-width: 200px; border: 2px solid #015ba7; padding: 10px; background: white;" />
      </div>
      <p style="font-size: 12px; color: #6b7280; text-align: center;">Show this QR code at the event entrance</p>
    </div>
  `).join('')

  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME || 'FOSS Andhra Events'}" <${process.env.SMTP_USER}>`,
    to,
    subject: `🎟️ Your Tickets for ${eventTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #015ba7 0%, #0077cc 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; padding: 12px 24px; background: #98d339; color: #000; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .event-card { background: white; border-left: 4px solid #015ba7; padding: 20px; margin: 20px 0; border-radius: 4px; }
          .ticket-card { background: white; border: 2px dashed #015ba7; padding: 20px; margin: 15px 0; border-radius: 8px; }
          .order-summary { background: #e0f2fe; border: 2px solid #0284c7; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .success-badge { background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; font-weight: bold; }
          .info-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 32px;">🎉 Booking Confirmed!</h1>
            <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Your tickets are ready</p>
          </div>
          <div class="content">
            <div style="text-align: center; margin-bottom: 20px;">
              <span class="success-badge">✓ PAYMENT SUCCESSFUL</span>
            </div>

            <h2 style="color: #015ba7; margin-top: 0;">Hello ${customerName}!</h2>
            <p>Thank you for booking tickets for <strong>${eventTitle}</strong>. Your payment has been processed successfully.</p>
            
            <div class="order-summary">
              <h3 style="margin: 0 0 15px; color: #015ba7;">Order Summary</h3>
              <p style="margin: 5px 0;"><strong>Order Number:</strong> ${orderNumber}</p>
              <p style="margin: 5px 0;"><strong>Number of Tickets:</strong> ${tickets.length}</p>
              <p style="margin: 5px 0;"><strong>Total Amount Paid:</strong> ₹${totalAmount.toLocaleString('en-IN')}</p>
            </div>

            <div class="event-card">
              <h3 style="margin: 0 0 15px; color: #015ba7;">${eventTitle}</h3>
              <p style="margin: 8px 0;"><strong>📅 Date:</strong> ${eventDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p style="margin: 8px 0;"><strong>🕐 Time:</strong> ${eventTime}</p>
              <p style="margin: 8px 0;"><strong>📍 Location:</strong> ${eventLocation}</p>
            </div>

            <h3 style="color: #015ba7; margin-top: 30px;">Your Tickets</h3>
            <p>Please present these QR codes at the event entrance for check-in:</p>
            
            ${ticketsHtml}

            <div class="info-box">
              <h4 style="margin: 0 0 10px; color: #ea580c;">⚠️ Important Information</h4>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Save this email - you'll need it to enter the event</li>
                <li>Each QR code can only be scanned once</li>
                <li>Arrive at least 15 minutes before the event starts</li>
                <li>Carry a valid photo ID for verification</li>
                <li>Screenshots of QR codes are acceptable</li>
              </ul>
            </div>

            <h3 style="color: #015ba7;">Need Help?</h3>
            <p>If you have any questions or need assistance, please contact us:</p>
            <p>
              📧 Email: <a href="mailto:events@fossandhra.org" style="color: #015ba7;">events@fossandhra.org</a><br>
              📞 Phone: +91-XXX-XXX-XXXX
            </p>

            <center>
              <a href="${baseUrl}/events" class="button">View More Events</a>
            </center>

            <p style="margin-top: 30px; font-style: italic; color: #6b7280;">We look forward to seeing you at the event!</p>

            <p>Best regards,<br><strong>FOSS Andhra Events Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} FOSS Andhra. All rights reserved.</p>
            <p>Promoting Free and Open Source Software in Andhra Pradesh</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('✅ Ticket confirmation email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Error sending ticket confirmation email:', error)
    return { success: false, error }
  }
}
