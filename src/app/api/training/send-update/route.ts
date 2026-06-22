import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import { query, where, getDocs, addDoc, collection, serverTimestamp } from 'firebase/firestore';

import { FIRESTORE } from 'src/lib/firebase';
import { adminDb } from 'src/lib/firebase-admin';
import { type TrainingUpdateType, sendTrainingUpdateEmail } from 'src/lib/email';

// ----------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const { moduleId, moduleTitle, updateType, moduleUrl, notifyNewsletterSubscribers } =
      (await request.json()) as {
        moduleId: string;
        moduleTitle: string;
        updateType: TrainingUpdateType;
        moduleUrl: string;
        notifyNewsletterSubscribers?: boolean;
      };

    if (!moduleId || !moduleTitle || !updateType || !moduleUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch module-specific subscribers
    const q = query(
      collection(FIRESTORE, 'trainingSubscriptions'),
      where('moduleId', '==', moduleId)
    );
    const snapshot = await getDocs(q);

    const moduleSubscribers = snapshot.docs.map((d) => ({
      email: d.data().userEmail as string,
      name: d.data().userName as string,
    }));

    // Optionally also include newsletter subscribers (use Admin SDK to bypass security rules)
    let newsletterEmails: string[] = [];
    if (notifyNewsletterSubscribers && adminDb) {
      const nlSnap = await adminDb.collection('newsletterSubscribers').get();
      const moduleEmails = new Set(moduleSubscribers.map((s) => s.email));
      newsletterEmails = nlSnap.docs
        .map((d) => d.id)
        .filter((email) => !moduleEmails.has(email));
    }

    const allRecipients = [
      ...moduleSubscribers,
      ...newsletterEmails.map((email) => ({ email, name: '' })),
    ];

    if (allRecipients.length === 0) {
      return NextResponse.json({ status: 'no_subscribers', sent: 0, total: 0, failed: 0 });
    }

    // Send email to each recipient
    const results = await Promise.allSettled(
      allRecipients.map((sub) =>
        sendTrainingUpdateEmail(sub.email, sub.name, moduleTitle, updateType, moduleUrl)
      )
    );

    const sent = results.filter((r) => r.status === 'fulfilled' && r.value === true).length;
    const failed = results.length - sent;

    // Log to sentNewsletters (use Admin SDK to bypass security rules)
    if (adminDb) {
      try {
        const updateTypeLabels: Record<TrainingUpdateType, string> = {
          launched: 'Module Launched',
          updated: 'Module Updated',
          coming_soon: 'Coming Soon Announcement',
        };
        await adminDb.collection('sentNewsletters').add({
          type: 'training_update',
          updateType,
          subject: `Training Module ${updateTypeLabels[updateType]}: ${moduleTitle}`,
          heading: moduleTitle,
          moduleId,
          moduleTitle,
          moduleUrl,
          recipients: allRecipients.map((s) => s.email),
          recipientCount: allRecipients.length,
          sent,
          failed,
          sentAt: new Date(),
        });
      } catch (logErr) {
        console.error('Failed to log training notification:', logErr);
      }
    }

    return NextResponse.json({
      status: 'done',
      total: allRecipients.length,
      sent,
      failed,
    });
  } catch (error) {
    console.error('Training send-update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
