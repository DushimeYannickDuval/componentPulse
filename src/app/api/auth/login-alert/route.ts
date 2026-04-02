import { Resend } from 'resend';
import { NextResponse } from 'next/server';

import { buildEmailLayout } from 'src/lib/email';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function POST(request: Request) {
  try {
    const { email, firstName, time, device } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Send the beautifully designed custom email template via Resend
    const data = await resend.emails.send({
      from: 'Component Pulse Security <security@componentpulseug.com>',
      to: [email],
      subject: 'New login to your Component Pulse account',
      html: buildEmailLayout(`
        <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">New Login Detected</h2>
        <p style="margin:0 0 24px;color:#6b7280;font-size:15px;">Hello ${firstName || 'User'}, we noticed a new sign-in to your ComponentPulse account.</p>
        <div style="background:#f9fafb;border-radius:8px;padding:20px;margin-bottom:24px;border:1px solid #e5e7eb;">
          <p style="margin:0 0 10px;color:#374151;font-size:14px;"><strong>Time:</strong> ${time || new Date().toLocaleString()}</p>
          <p style="margin:0;color:#374151;font-size:14px;"><strong>Device / Browser:</strong> ${device || 'Unknown Device'}</p>
        </div>
        <p style="margin:0 0 8px;color:#6b7280;font-size:15px;">If this was you, no action is needed.</p>
        <p style="margin:0;color:#6b7280;font-size:15px;">If this wasn't you, we recommend changing your password immediately to secure your account.</p>
      `),
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error sending login alert:', error);
    return NextResponse.json({ error: 'Failed to send login alert' }, { status: 500 });
  }
}
