'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';

import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

type SendResult = { success: boolean; message: string };

const ORDER_STATUSES = [
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'ready_for_pickup', label: 'Ready for Pickup' },
  { value: 'out_for_delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const TRAINING_UPDATE_TYPES = [
  { value: 'launched', label: 'Launched' },
  { value: 'updated', label: 'Updated' },
  { value: 'coming_soon', label: 'Coming Soon' },
];

// ----------------------------------------------------------------------

export function EmailTestView() {
  const [testEmail, setTestEmail] = useState('');
  const [orderStatus, setOrderStatus] = useState('delivered');
  const [trainingType, setTrainingType] = useState('launched');
  const [sending, setSending] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, SendResult>>({});

  const setResult = (key: string, result: SendResult) =>
    setResults((prev) => ({ ...prev, [key]: result }));

  const setSendingKey = (key: string, value: boolean) =>
    setSending((prev) => ({ ...prev, [key]: value }));

  const send = async (key: string, url: string, body: Record<string, unknown>) => {
    if (!testEmail) return;
    setSendingKey(key, true);
    setResults((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(key, { success: true, message: 'Email sent successfully!' });
      } else {
        setResult(key, { success: false, message: data.error || 'Failed to send email.' });
      }
    } catch {
      setResult(key, { success: false, message: 'Network error. Check the console.' });
    } finally {
      setSendingKey(key, false);
    }
  };

  const handlers: Record<string, () => void> = {
    welcome: () =>
      send('welcome', '/api/auth/welcome', {
        email: testEmail,
        firstName: 'Test User',
      }),

    verification: () =>
      send('verification', '/api/auth/send-verification', {
        email: testEmail,
        firstName: 'Test User',
      }),

    loginAlert: () =>
      send('loginAlert', '/api/auth/login-alert', {
        email: testEmail,
        firstName: 'Test User',
        time: new Date().toLocaleString(),
        device: 'Chrome on macOS (Test)',
      }),

    passwordReset: () =>
      send('passwordReset', '/api/auth/send-password-reset', {
        email: testEmail,
      }),

    orderConfirmation: () =>
      send('orderConfirmation', '/api/orders/send-confirmation', {
        orderNumber: 'ORD-TEST-001',
        customerName: 'Test User',
        customerEmail: testEmail,
        items: [
          { productName: 'Resistor Pack (1kΩ × 100)', quantity: 2, unitPrice: 5000, totalPrice: 10000 },
          { productName: 'Arduino Uno R3', quantity: 1, unitPrice: 45000, totalPrice: 45000 },
        ],
        subtotal: 55000,
        deliveryFee: 5000,
        discount: 0,
        total: 60000,
        shippingAddress: {
          fullName: 'Test User',
          addressLine1: '123 Test Street, Kampala',
          city: 'Kampala',
          phone: '+256 700 000000',
        },
        paymentMethod: 'pesapal',
      }),

    orderStatusUpdate: () =>
      send('orderStatusUpdate', '/api/orders/send-status-update', {
        customerEmail: testEmail,
        customerName: 'Test User',
        orderNumber: 'ORD-TEST-001',
        newStatus: orderStatus,
        statusNote: 'This is a test status update note.',
        items: [{ id: 'test-product-id', name: 'Arduino Uno R3' }],
      }),

    supportConfirmation: () =>
      send('supportConfirmation', '/api/support/send-confirmation', {
        contactEmail: testEmail,
        contactName: 'Test User',
        subject: 'Test Support Request - ComponentPulse',
      }),

    ticketReply: () =>
      send('ticketReply', '/api/tickets/send-reply', {
        customerEmail: testEmail,
        customerName: 'Test User',
        ticketNumber: 'TKT-TEST-001',
        ticketSubject: 'Test Support Request - ComponentPulse',
        replyContent:
          'Thank you for reaching out. This is a test reply from the support team. We have reviewed your issue and will follow up shortly.',
        ticketUrl: `${window.location.origin}/account/support`,
      }),

    trainingUpdate: () =>
      send('trainingUpdate', '/api/training/send-update', {
        moduleId: 'test-module-id',
        moduleTitle: 'Introduction to Electronics',
        updateType: trainingType,
        moduleUrl: `${window.location.origin}/training/test-module-id`,
      }),
  };

  const isEmailValid = testEmail.includes('@') && testEmail.includes('.');

  const renderSendButton = (key: string) => (
    <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap">
      <Button
        variant="contained"
        size="small"
        disabled={!isEmailValid || sending[key]}
        onClick={handlers[key]}
        startIcon={sending[key] ? <CircularProgress size={14} color="inherit" /> : null}
        sx={{ minWidth: 120 }}
      >
        {sending[key] ? 'Sending…' : 'Send Test'}
      </Button>
      {results[key] && (
        <Chip
          size="small"
          label={results[key].message}
          color={results[key].success ? 'success' : 'error'}
          variant="outlined"
        />
      )}
    </Stack>
  );

  return (
    <DashboardContent>
      <Stack spacing={3}>
        {/* Header */}
        <div>
          <Typography variant="h4">Email Testing</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Send test emails to verify templates look correct before going live.
          </Typography>
        </div>

        {/* Email input */}
        <Card>
          <CardContent>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start">
              <TextField
                label="Recipient Email Address"
                placeholder="you@example.com"
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                fullWidth
                size="small"
                helperText="All test emails will be sent to this address."
              />
            </Stack>
            {!isEmailValid && testEmail.length > 0 && (
              <Alert severity="warning" sx={{ mt: 1.5 }}>
                Please enter a valid email address.
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Auth Emails */}
        <div>
          <Typography variant="overline" sx={{ color: 'text.secondary', mb: 1.5, display: 'block' }}>
            Auth Emails
          </Typography>
          <Grid container spacing={2}>
            {/* Welcome */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: '100%' }}>
                <CardHeader
                  title="Welcome Email"
                  subheader="Sent to new users after registration."
                  titleTypographyProps={{ variant: 'subtitle1' }}
                  subheaderTypographyProps={{ variant: 'body2' }}
                />
                <Divider />
                <CardContent>{renderSendButton('welcome')}</CardContent>
              </Card>
            </Grid>

            {/* Login Alert */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: '100%' }}>
                <CardHeader
                  title="Login Alert"
                  subheader="Sent when a new sign-in is detected on an account."
                  titleTypographyProps={{ variant: 'subtitle1' }}
                  subheaderTypographyProps={{ variant: 'body2' }}
                />
                <Divider />
                <CardContent>{renderSendButton('loginAlert')}</CardContent>
              </Card>
            </Grid>

            {/* Email Verification */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: '100%' }}>
                <CardHeader
                  title="Email Verification"
                  subheader="Sent to verify a user's email address."
                  titleTypographyProps={{ variant: 'subtitle1' }}
                  subheaderTypographyProps={{ variant: 'body2' }}
                />
                <Divider />
                <CardContent>
                  <Alert severity="info" sx={{ mb: 1.5, fontSize: 12 }}>
                    Requires the test email to be registered in Firebase.
                  </Alert>
                  {renderSendButton('verification')}
                </CardContent>
              </Card>
            </Grid>

            {/* Password Reset */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: '100%' }}>
                <CardHeader
                  title="Password Reset"
                  subheader="Sent when a user requests a password reset."
                  titleTypographyProps={{ variant: 'subtitle1' }}
                  subheaderTypographyProps={{ variant: 'body2' }}
                />
                <Divider />
                <CardContent>
                  <Alert severity="info" sx={{ mb: 1.5, fontSize: 12 }}>
                    Requires the test email to be registered in Firebase.
                  </Alert>
                  {renderSendButton('passwordReset')}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>

        {/* Order Emails */}
        <div>
          <Typography variant="overline" sx={{ color: 'text.secondary', mb: 1.5, display: 'block' }}>
            Order Emails
          </Typography>
          <Grid container spacing={2}>
            {/* Order Confirmation */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: '100%' }}>
                <CardHeader
                  title="Order Confirmation"
                  subheader="Sent when a new order is placed. Uses mock order data."
                  titleTypographyProps={{ variant: 'subtitle1' }}
                  subheaderTypographyProps={{ variant: 'body2' }}
                />
                <Divider />
                <CardContent>
                  <Box
                    sx={{
                      mb: 1.5,
                      p: 1.5,
                      borderRadius: 1,
                      bgcolor: 'background.neutral',
                      fontSize: 12,
                      color: 'text.secondary',
                      fontFamily: 'monospace',
                    }}
                  >
                    Order #ORD-TEST-001 · 2 items · UGX 60,000
                  </Box>
                  {renderSendButton('orderConfirmation')}
                </CardContent>
              </Card>
            </Grid>

            {/* Order Status Update */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: '100%' }}>
                <CardHeader
                  title="Order Status Update"
                  subheader="Sent when an order status changes."
                  titleTypographyProps={{ variant: 'subtitle1' }}
                  subheaderTypographyProps={{ variant: 'body2' }}
                />
                <Divider />
                <CardContent>
                  <TextField
                    select
                    label="Order Status"
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                    size="small"
                    fullWidth
                    sx={{ mb: 1.5 }}
                  >
                    {ORDER_STATUSES.map((s) => (
                      <MenuItem key={s.value} value={s.value}>
                        {s.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  {renderSendButton('orderStatusUpdate')}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>

        {/* Support & Ticket Emails */}
        <div>
          <Typography variant="overline" sx={{ color: 'text.secondary', mb: 1.5, display: 'block' }}>
            Support Emails
          </Typography>
          <Grid container spacing={2}>
            {/* Support Confirmation */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: '100%' }}>
                <CardHeader
                  title="Support Request Confirmation"
                  subheader="Sent to a customer after they submit a support request."
                  titleTypographyProps={{ variant: 'subtitle1' }}
                  subheaderTypographyProps={{ variant: 'body2' }}
                />
                <Divider />
                <CardContent>{renderSendButton('supportConfirmation')}</CardContent>
              </Card>
            </Grid>

            {/* Ticket Reply */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: '100%' }}>
                <CardHeader
                  title="Ticket Reply"
                  subheader="Sent to a customer when support replies to their ticket."
                  titleTypographyProps={{ variant: 'subtitle1' }}
                  subheaderTypographyProps={{ variant: 'body2' }}
                />
                <Divider />
                <CardContent>{renderSendButton('ticketReply')}</CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>

        {/* Training Emails */}
        <div>
          <Typography variant="overline" sx={{ color: 'text.secondary', mb: 1.5, display: 'block' }}>
            Training Emails
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: '100%' }}>
                <CardHeader
                  title="Training Module Update"
                  subheader="Sent to subscribers of a training module."
                  titleTypographyProps={{ variant: 'subtitle1' }}
                  subheaderTypographyProps={{ variant: 'body2' }}
                />
                <Divider />
                <CardContent>
                  <Alert severity="info" sx={{ mb: 1.5, fontSize: 12 }}>
                    Uses a test module ID. Emails will only go to users subscribed to that module ID in Firestore.
                  </Alert>
                  <TextField
                    select
                    label="Update Type"
                    value={trainingType}
                    onChange={(e) => setTrainingType(e.target.value)}
                    size="small"
                    fullWidth
                    sx={{ mb: 1.5 }}
                  >
                    {TRAINING_UPDATE_TYPES.map((t) => (
                      <MenuItem key={t.value} value={t.value}>
                        {t.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  {renderSendButton('trainingUpdate')}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      </Stack>
    </DashboardContent>
  );
}
