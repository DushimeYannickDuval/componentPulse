import { Resend } from 'resend';
import { NextResponse } from 'next/server';

import { buildEmailLayout } from 'src/lib/email';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

const FROM_EMAIL = 'ComponentPulse <newsletter@componentpulseug.com>';

// ----------------------------------------------------------------------

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subject, previewText, heading, body: emailBody, ctaLabel, ctaUrl, recipients } = body;

    if (!subject || !heading || !emailBody || !recipients?.length) {
      return NextResponse.json(
        { error: 'subject, heading, body, and recipients are required' },
        { status: 400 }
      );
    }

    const ctaHtml =
      ctaLabel && ctaUrl
        ? `<div style="text-align:center;margin-top:32px;">
            <a href="${ctaUrl}" style="display:inline-block;background:#00A76F;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">${ctaLabel}</a>
          </div>`
        : '';

    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://componentpulseug.com'}/unsubscribe`;

    const html = buildEmailLayout(`
      ${previewText ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${previewText}</div>` : ''}
      <h2 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#111827;line-height:1.3;">${heading}</h2>
      <div style="color:#374151;font-size:15px;line-height:1.8;margin-bottom:8px;">
        ${emailBody
          .split('\n\n')
          .filter((p: string) => p.trim())
          .map((p: string) => `<p style="margin:0 0 16px;">${p.trim().replace(/\n/g, '<br/>')}</p>`)
          .join('')}
      </div>
      ${ctaHtml}
      <hr style="margin:32px 0;border:none;border-top:1px solid #e5e7eb;" />
      <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;line-height:1.6;">
        You're receiving this because you subscribed to ComponentPulse updates.<br/>
        <a href="${unsubscribeUrl}" style="color:#9ca3af;text-decoration:underline;">Unsubscribe</a>
      </p>
    `);

    const batchSize = 50;
    let sent = 0;
    let failed = 0;

    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      const results = await Promise.allSettled(
        batch.map((email: string) =>
          resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject,
            html,
          })
        )
      );
      results.forEach((r) => {
        if (r.status === 'fulfilled') sent += 1;
        else failed += 1;
      });
    }

    return NextResponse.json({ success: true, sent, failed });
  } catch (error) {
    console.error('Error sending newsletter:', error);
    return NextResponse.json({ error: 'Failed to send newsletter' }, { status: 500 });
  }
}
