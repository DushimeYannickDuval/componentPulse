'use client';

import type { AuthState } from '../../types';

import { onIdTokenChanged } from 'firebase/auth';
import { useSetState } from 'minimal-shared/hooks';
import { useMemo, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

import { AUTH, FIRESTORE } from 'src/lib/firebase';

import { AuthContext } from '../auth-context';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

const getInitialState = (): AuthState => {
  return { user: null, loading: true };
};

export function AuthProvider({ children }: Props) {
  const { state, setState } = useSetState<AuthState>(getInitialState());

  const checkUserSession = useCallback(async () => {
    onIdTokenChanged(AUTH, async (user: AuthState['user']) => {
      try {
        if (!user) {
          console.log('[Auth] No user signed in.');
          setState({ user: null, loading: false });
          return;
        }

        console.log('[Auth] User signed in:', user.uid, '| emailVerified:', user.emailVerified);

        // First check if user is an admin
        let adminDoc;
        try {
          adminDoc = await getDoc(doc(FIRESTORE, 'admins', user.uid));
        } catch (err: any) {
          console.error('[Auth] Firestore read on admins/ failed:', err?.code, err?.message);
          console.error('[Auth] → Check that Firestore security rules are deployed.');
          setState({ user: null, loading: false });
          return;
        }

        if (adminDoc.exists()) {
          const adminData = adminDoc.data();
          console.log('[Auth] Admin doc found. isActive:', adminData.isActive, '| role:', adminData.role);

          if (!adminData.isActive) {
            console.log('[Auth] Admin is inactive — denying access.');
            setState({ user: null, loading: false });
            return;
          }

          setDoc(
            doc(FIRESTORE, 'admins', user.uid),
            { lastLoginAt: serverTimestamp() },
            { merge: true }
          ).catch(console.error);

          const adminPayload = {
            ...user,
            ...adminData,
            isAdmin: true,
            userType: 'admin',
          };
          console.log('[Auth] Setting user as admin ✅');
          setState({ user: adminPayload, loading: false });
          return;
        }

        console.log('[Auth] No admin doc found — checking users collection.');

        // For email/password users, require email verification
        if (!user.emailVerified && user.providerData[0]?.providerId === 'password') {
          console.log('[Auth] Email not verified — blocking sign in.');
          setState({ user: null, loading: false });
          return;
        }

        let userDoc;
        try {
          userDoc = await getDoc(doc(FIRESTORE, 'users', user.uid));
        } catch (err: any) {
          console.error('[Auth] Firestore read on users/ failed:', err?.code, err?.message);
          setState({ user: null, loading: false });
          return;
        }

        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log('[Auth] Customer doc found. isActive:', userData.isActive);

          if (!userData.isActive) {
            console.log('[Auth] Customer is inactive — denying access.');
            setState({ user: null, loading: false });
            return;
          }

          setDoc(
            doc(FIRESTORE, 'users', user.uid),
            { lastLoginAt: serverTimestamp() },
            { merge: true }
          ).catch(console.error);

          const customerPayload = {
            ...user,
            ...userData,
            isAdmin: false,
            userType: 'customer',
          };
          console.log('[Auth] Setting user as customer ✅');
          setState({ user: customerPayload, loading: false });
        } else {
          console.log('[Auth] No Firestore doc found for user — edge case customer.');
          const edgeCaseUser = { ...user, isAdmin: false, userType: 'customer' };
          setState({ user: edgeCaseUser, loading: false });
        }
      } catch (error) {
        console.error('[Auth] Unexpected error in session check:', error);
        setState({ user: null, loading: false });
      }
    });
  }, [setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user
        ? {
            ...state.user,
            id: state.user?.uid,
            accessToken: state.user?.accessToken,
            displayName: state.user?.displayName,
            photoURL: state.user?.photoURL,
            email: state.user?.email,
            role: state.user?.role ?? null,
            isAdmin: state.user?.isAdmin ?? false,
            userType: state.user?.userType ?? 'customer',
          }
        : null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, state.user, status]
  );

  return <AuthContext value={memoizedValue}>{children}</AuthContext>;
}
