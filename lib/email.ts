import { Resend } from 'resend';

/** Email is optional — sends are silently skipped when RESEND_API_KEY is unset. */
export const emailEnabled = Boolean(process.env.RESEND_API_KEY);

const resend = emailEnabled ? new Resend(process.env.RESEND_API_KEY as string) : null;

const FROM = process.env.EMAIL_FROM ?? 'Sterling & Crane <onboarding@resend.dev>';

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[];
  subject: string;
  html: string;
}) {
  if (!resend || !to) return;
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
  } catch (err) {
    // Notifications are best-effort; never block the user action on email failure.
    console.error('Email send failed:', err);
  }
}

/** Minimal branded wrapper for transactional emails. */
export function emailLayout(heading: string, body: string) {
  return `
  <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:24px;color:#1a1a2e">
    <div style="border-bottom:2px solid #c5a35a;padding-bottom:12px;margin-bottom:20px">
      <span style="font-size:20px;font-weight:bold">Sterling &amp; Crane</span>
      <span style="color:#6b7280;font-size:12px;display:block">Attorneys at Law</span>
    </div>
    <h1 style="font-size:18px">${heading}</h1>
    <div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#374151">${body}</div>
    <p style="font-family:Arial,sans-serif;font-size:12px;color:#9ca3af;margin-top:24px">
      Sterling &amp; Crane LLP · This is an automated message from your client portal.
    </p>
  </div>`;
}
