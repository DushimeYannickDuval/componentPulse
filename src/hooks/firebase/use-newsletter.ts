'use client';

import { useState, useEffect } from 'react';
import {
  doc,
  query,
  setDoc,
  getDoc,
  orderBy,
  deleteDoc,
  collection,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';

import { FIRESTORE } from 'src/lib/firebase';

// ----------------------------------------------------------------------

export type NewsletterSubscriber = {
  email: string;
  subscribedAt: Date | null;
};

export function useNewsletterSubscribers() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(FIRESTORE, 'newsletterSubscribers'), orderBy('subscribedAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched = snapshot.docs.map((document) => {
          const data = document.data();
          const raw = data.subscribedAt;
          const subscribedAt = raw?.toDate ? raw.toDate() : raw ? new Date(raw) : null;
          return { email: document.id, subscribedAt };
        });
        setSubscribers(fetched);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching newsletter subscribers:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { subscribers, loading };
}

// ----------------------------------------------------------------------

export function useNewsletter() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const subscribe = async (email: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const emailLower = email.toLowerCase().trim();
      const docRef = doc(FIRESTORE, 'newsletterSubscribers', emailLower);

      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setError('This email is already subscribed.');
        setLoading(false);
        return false;
      }

      await setDoc(docRef, {
        email: emailLower,
        subscribedAt: serverTimestamp(),
      });

      setSuccess(true);
      return true;
    } catch (err: any) {
      console.error('Newsletter subscription error:', err);
      setError('Failed to subscribe. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const checkSubscription = async (email: string) => {
    try {
      const emailLower = email.toLowerCase().trim();
      const docRef = doc(FIRESTORE, 'newsletterSubscribers', emailLower);
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    } catch (err: any) {
      console.error('Error checking subscription:', err);
      return false;
    }
  };

  const unsubscribe = async (email: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const emailLower = email.toLowerCase().trim();
      const docRef = doc(FIRESTORE, 'newsletterSubscribers', emailLower);
      await setDoc(docRef, { unsubscribedAt: serverTimestamp() }, { merge: true }); // We could deleteDoc, but keeping a record and ignoring it might be better, wait... actually let's deleteDoc to make it fully clean and allow resubscribing.
      await deleteDoc(docRef);
      setSuccess(true);
      return true;
    } catch (err: any) {
      console.error('Newsletter unsubscribe error:', err);
      setError('Failed to unsubscribe. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { subscribe, checkSubscription, unsubscribe, loading, error, success };
}
