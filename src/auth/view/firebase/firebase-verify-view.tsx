'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useSearchParams } from 'src/routes/hooks';

import { EmailInboxIcon } from 'src/assets/icons';

import { getErrorMessage } from '../../utils';
import { FormHead } from '../../components/form-head';
import { resendVerificationEmail } from '../../context/firebase';
import { FormReturnLink } from '../../components/form-return-link';

// ----------------------------------------------------------------------

const COOLDOWN_SECONDS = 60;

export function FirebaseVerifyView() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResendEmail = async () => {
    if (cooldown > 0) return;
    try {
      setIsResending(true);
      setErrorMessage(null);
      setResendSuccess(false);
      await resendVerificationEmail(email);
      setResendSuccess(true);
      setCooldown(COOLDOWN_SECONDS);
    } catch (error) {
      console.error(error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      <FormHead
        icon={<EmailInboxIcon />}
        title="Please check your email!"
        description={
          <>
            We&apos;ve sent a verification link to <strong>{email}</strong>.
            <br />
            Please click the link in the email to verify your account.
          </>
        }
      />

      <Alert severity="warning" sx={{ mb: 3 }}>
        Can&apos;t find the email? <strong>Check your spam or junk folder</strong> — verification
        emails sometimes get filtered there.
      </Alert>

      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      {resendSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Verification email sent! Check your inbox and spam folder.
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
          Still didn&apos;t receive it? Click below to resend.
        </Typography>

        <Button
          variant="outlined"
          color="inherit"
          onClick={handleResendEmail}
          disabled={isResending || cooldown > 0}
        >
          {isResending
            ? 'Sending...'
            : cooldown > 0
              ? `Resend in ${cooldown}s`
              : 'Resend verification email'}
        </Button>
      </Box>

      <FormReturnLink href={paths.auth.firebase.signIn} sx={{ mt: 3 }} />
    </>
  );
}
