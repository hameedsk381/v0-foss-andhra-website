import { sendEmail } from "@/lib/email"
import { logError } from "@/lib/logger"
import {
  HR_EMAIL,
  INTERNSHIP_MONTHS,
  baseUrl,
  formatDateTime,
  formatLongDate,
  offerUrl,
  officeLine,
} from "@/lib/internship-offer"

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

function layout(title: string, body: string) {
  return `<!DOCTYPE html><html><body style="margin:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;color:#1f2937;line-height:1.6">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:8px;overflow:hidden">
<tr><td style="background:#015ba7;color:#fff;padding:22px 28px"><div style="font-size:20px;font-weight:700">FOSS Andhra</div><div style="font-size:13px;opacity:.85">${esc(title)}</div></td></tr>
<tr><td style="padding:28px">${body}</td></tr>
<tr><td style="background:#f9fafb;padding:16px 28px;font-size:12px;color:#6b7280;border-top:1px solid #e5e7eb">
FOSS Andhra Foundation · Reply to this email or write to <a href="mailto:${HR_EMAIL()}" style="color:#015ba7">${HR_EMAIL()}</a></td></tr>
</table></td></tr></table></body></html>`
}

const button = (href: string, label: string) =>
  `<p style="text-align:center;margin:24px 0"><a href="${href}" style="background:#015ba7;color:#fff;text-decoration:none;padding:13px 28px;border-radius:6px;font-weight:700;display:inline-block">${esc(label)}</a></p>`

/** Email failures must never break the HR action, so every sender resolves to a boolean. */
async function safeSend(to: string, subject: string, html: string, context: string) {
  try {
    await sendEmail({ to, subject, html })
    return true
  } catch (error) {
    logError(error as Error, { context, to })
    return false
  }
}

interface Applicant {
  name: string
  email: string
}

export async function sendApplicationReceived(a: Applicant, roleTitle: string, isInternship: boolean) {
  const next = isInternship
    ? `<li>Our team reviews your application and may shortlist you for a short interview at our office, ${esc(officeLine())}.</li>
       <li>If selected, you will receive your <strong>internship offer letter</strong> by email with your role, responsibilities and start date.</li>`
    : `<li>Our team reviews your application and contacts you by email if there is a match.</li>`
  const html = layout(
    "We received your application",
    `<h2 style="margin:0 0 12px;color:#015ba7">Hi ${esc(a.name)},</h2>
     <p>Thank you for applying for <strong>${esc(roleTitle)}</strong> at FOSS Andhra. Your application is in.</p>
     <p><strong>What happens next</strong></p>
     <ul style="padding-left:20px"><li>We review every application personally.</li>${next}
     <li>Please keep an eye on your inbox (and spam folder) for updates.</li></ul>
     <p>Good luck!<br><strong>FOSS Andhra Team</strong></p>`,
  )
  return safeSend(a.email, `We received your application — ${roleTitle}`, html, "career_application_received")
}

export async function notifyHrNewApplication(a: Applicant & { phone: string }, roleTitle: string) {
  const html = layout(
    "New career application",
    `<p>A new application has been received.</p>
     <p><strong>${esc(a.name)}</strong><br>${esc(a.email)} · ${esc(a.phone)}<br>Role: ${esc(roleTitle)}</p>
     ${button(`${baseUrl()}/admin/careers`, "Review in admin")}`,
  )
  return safeSend(HR_EMAIL(), `New application: ${a.name} — ${roleTitle}`, html, "career_application_hr_notify")
}

export async function sendInterviewInvite(a: Applicant, roleTitle: string, at: Date, note?: string | null) {
  const html = layout(
    "Interview invitation",
    `<h2 style="margin:0 0 12px;color:#015ba7">Hi ${esc(a.name)},</h2>
     <p>Congratulations! You have been shortlisted for <strong>${esc(roleTitle)}</strong>. We would like to meet you.</p>
     <table cellpadding="0" cellspacing="0" style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:16px;width:100%">
       <tr><td style="padding:4px 12px"><strong>When:</strong> ${esc(formatDateTime(at))} (IST)</td></tr>
       <tr><td style="padding:4px 12px"><strong>Where:</strong> ${esc(officeLine())}</td></tr>
     </table>
     ${note ? `<p style="margin-top:16px">${esc(note).replace(/\n/g, "<br>")}</p>` : ""}
     <p><strong>Please bring</strong> a government photo ID and your college ID, and be ready to talk about your interests and any projects you have worked on.</p>
     <p>If you cannot make this time, reply to this email as early as possible and we will try to reschedule.</p>
     <p>Best regards,<br><strong>FOSS Andhra Team</strong></p>`,
  )
  return safeSend(a.email, `Interview invitation — ${roleTitle}`, html, "career_interview_invite")
}

export async function sendOfferEmail(
  a: Applicant,
  roleTitle: string,
  d: { token: string; ref: string; startDate: Date; endDate: Date },
) {
  const link = offerUrl(d.token)
  const html = layout(
    "Internship offer letter",
    `<h2 style="margin:0 0 12px;color:#015ba7">Congratulations ${esc(a.name)}!</h2>
     <p>We are delighted to offer you the position of <strong>${esc(roleTitle)}</strong> at FOSS Andhra.</p>
     <table cellpadding="0" cellspacing="0" style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;width:100%">
       <tr><td style="padding:10px 16px"><strong>Reference:</strong> ${esc(d.ref)}<br>
       <strong>Duration:</strong> ${INTERNSHIP_MONTHS} months<br>
       <strong>Starts:</strong> ${esc(formatLongDate(d.startDate))}<br>
       <strong>Ends:</strong> ${esc(formatLongDate(d.endDate))}<br>
       <strong>We meet at:</strong> ${esc(officeLine())}</td></tr>
     </table>
     <p>Your official offer letter, with your role, responsibilities and terms, is available online. Please read it, then <strong>accept the offer</strong> on the same page to confirm your place.</p>
     ${button(link, "View offer letter & accept")}
     <p style="font-size:12px;color:#6b7280;word-break:break-all">${link}</p>
     <p>We look forward to working with you.<br><strong>FOSS Andhra Team</strong></p>`,
  )
  return safeSend(a.email, `Your internship offer letter — ${roleTitle} (${d.ref})`, html, "career_offer_email")
}

export async function sendAcceptanceConfirmation(
  a: Applicant,
  roleTitle: string,
  startDate: Date,
) {
  const html = layout(
    "Offer accepted",
    `<h2 style="margin:0 0 12px;color:#015ba7">Welcome aboard, ${esc(a.name)}!</h2>
     <p>You have accepted the <strong>${esc(roleTitle)}</strong> internship. We will see you on <strong>${esc(formatLongDate(startDate))}</strong> at ${esc(officeLine())}.</p>
     <p>Your mentor will contact you before the start date with the schedule and what to prepare.</p>
     <p>Best regards,<br><strong>FOSS Andhra Team</strong></p>`,
  )
  const [toIntern] = await Promise.all([
    safeSend(a.email, `Welcome to FOSS Andhra — ${roleTitle}`, html, "career_offer_accepted_intern"),
    safeSend(
      HR_EMAIL(),
      `Offer accepted: ${a.name} — ${roleTitle}`,
      layout("Offer accepted", `<p><strong>${esc(a.name)}</strong> (${esc(a.email)}) accepted the ${esc(roleTitle)} offer. Start date: ${esc(formatLongDate(startDate))}.</p>`),
      "career_offer_accepted_hr",
    ),
  ])
  return toIntern
}

export async function sendRejection(a: Applicant, roleTitle: string) {
  const html = layout(
    "Application update",
    `<h2 style="margin:0 0 12px;color:#015ba7">Hi ${esc(a.name)},</h2>
     <p>Thank you for your interest in <strong>${esc(roleTitle)}</strong> and for the time you put into your application.</p>
     <p>After careful review we are unable to offer you a place this time. We received many strong applications and places are limited. This is not a reflection of your potential.</p>
     <p>We encourage you to keep learning, stay active in the FOSStar community, and apply again when new openings are announced at <a href="${baseUrl()}/careers" style="color:#015ba7">${baseUrl()}/careers</a>.</p>
     <p>Best wishes,<br><strong>FOSS Andhra Team</strong></p>`,
  )
  return safeSend(a.email, `Update on your application — ${roleTitle}`, html, "career_rejection")
}
