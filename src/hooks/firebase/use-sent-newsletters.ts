'use client';

import { useState, useEffect } from 'react';
import { query, orderBy, collection, onSnapshot } from 'firebase/firestore';

import { FIRESTORE } from 'src/lib/firebase';

// ----------------------------------------------------------------------

export type SentNewsletter = {
  id: string;
  type: 'newsletter' | 'training_update';
  subject: string;
  heading: string;
  body?: string;
  previewText?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  updateType?: string;
  moduleId?: string;
  moduleTitle?: string;
  moduleUrl?: string;
  recipients: string[];
  recipientCount: number;
  sent: number;
  failed: number;
  sentAt: Date | null;
};

export function useSentNewsletters() {
  const [campaigns, setCampaigns] = useState<SentNewsletter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(FIRESTORE, 'sentNewsletters'), orderBy('sentAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched = snapshot.docs.map((doc) => {
          const data = doc.data();
          const raw = data.sentAt;
          const sentAt = raw?.toDate ? raw.toDate() : raw ? new Date(raw) : null;
          return {
            id: doc.id,
            type: data.type,
            subject: data.subject,
            heading: data.heading,
            body: data.body,
            previewText: data.previewText,
            ctaLabel: data.ctaLabel,
            ctaUrl: data.ctaUrl,
            updateType: data.updateType,
            moduleId: data.moduleId,
            moduleTitle: data.moduleTitle,
            moduleUrl: data.moduleUrl,
            recipients: data.recipients || [],
            recipientCount: data.recipientCount || 0,
            sent: data.sent || 0,
            failed: data.failed || 0,
            sentAt,
          } as SentNewsletter;
        });
        setCampaigns(fetched);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching sent newsletters:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { campaigns, loading };
}
