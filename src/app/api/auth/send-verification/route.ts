import { Resend } from 'resend';
import { NextResponse } from 'next/server';

import { buildEmailLayout } from 'src/lib/email';
import { adminAuth } from 'src/lib/firebase-admin';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function POST(request: Request) {
  try {
    const { email, firstName } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!adminAuth) {
      console.warn('Firebase Admin is not configured. Email will not be sent securely.');
      return NextResponse.json({ error: 'System configuration error' }, { status: 500 });
    }

    const actionCodeSettings = {
      // The Next.js custom action page created to handle the tokens
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:8083'}/auth/firebase/action`,
      handleCodeInApp: true,
    };

    // Generates the out-of-band code required for the validation action
    const link = await adminAuth.generateEmailVerificationLink(email, actionCodeSettings);

    // Send the beautifully designed custom email template via Resend
    const data = await resend.emails.send({
      from: 'Component Pulse <onboarding@componentpulseug.com>',
      to: [email],
      subject: 'Verify your email address - Component Pulse',
      html: buildEmailLayout(`
        <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">Verify Your Email</h2>
        <p style="margin:0 0 8px;color:#6b7280;font-size:15px;">Hello ${firstName || 'User'},</p>
        <p style="margin:0 0 28px;color:#6b7280;font-size:15px;">Thank you for registering with ComponentPulse! Please verify your email address to activate your account.</p>
        <div style="text-align:center;margin-bottom:28px;">
          <a href="${link}" style="display:inline-block;background:#00A76F;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">Verify Email Address</a>
        </div>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
        <p style="color:#9ca3af;font-size:13px;text-align:center;margin:0 0 8px;">If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="text-align:center;margin:0 0 16px;"><a href="${link}" style="color:#00A76F;font-size:13px;word-break:break-all;">${link}</a></p>
        <p style="color:#9ca3af;font-size:13px;text-align:center;margin:0;">If you didn't request this, you can safely ignore this email.</p>
      `),
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error generating verification link:', error);
    return NextResponse.json({ error: 'Failed to generate verification link' }, { status: 500 });
  }
}
