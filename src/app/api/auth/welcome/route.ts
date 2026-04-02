import { Resend } from 'resend';
import { NextResponse } from 'next/server';

import { buildEmailLayout } from 'src/lib/email';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, firstName } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const data = await resend.emails.send({
      from: 'Welcome <onboarding@componentpulseug.com>',
      to: [email],
      subject: 'Welcome to Component Pulse!',
      html: buildEmailLayout(`
        <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">Welcome, ${firstName || 'User'}!</h2>
        <p style="margin:0 0 24px;color:#6b7280;font-size:15px;">We're thrilled to have you on board. ComponentPulse gives you the power to manage your components and resources seamlessly.</p>
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px 20px;margin-bottom:28px;">
          <p style="margin:0;color:#374151;font-size:14px;line-height:1.6;">Start exploring the platform to discover all the features available to you — from product management to order tracking and support.</p>
        </div>
        <div style="text-align:center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || '#'}" style="display:inline-block;background:#00A76F;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">Get Started</a>
        </div>
      `),
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return NextResponse.json({ error: 'Failed to send welcome email' }, { status: 500 });
  }
}
