'use client';

import type { SentNewsletter } from 'src/hooks/firebase';
import type { NewsletterSubscriber } from 'src/hooks/firebase';

import { useState, useMemo } from 'react';
import { format } from 'date-fns';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import CardContent from '@mui/material/CardContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';

import { useSentNewsletters, useNewsletterSubscribers } from 'src/hooks/firebase';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type SendResult = { sent: number; failed: number } | null;

export function NewsletterView() {
  const { subscribers, loading } = useNewsletterSubscribers();
  const { campaigns, loading: campaignsLoading } = useSentNewsletters();
  const [selectedCampaign, setSelectedCampaign] = useState<SentNewsletter | null>(null);

  const [tab, setTab] = useState('subscribers');
  const [search, setSearch] = useState('');
  const [deleteEmail, setDeleteEmail] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [subject, setSubject] = useState('');
  const [previewText, setPreviewText] = useState('');
  const [heading, setHeading] = useState('');
  const [body, setBody] = useState('');
  const [ctaLabel, setCtaLabel] = useState('');
  const [ctaUrl, setCtaUrl] = useState('');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<SendResult>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return subscribers;
    return subscribers.filter((s) => s.email.toLowerCase().includes(search.toLowerCase()));
  }, [subscribers, search]);

  const handleDelete = async () => {
    if (!deleteEmail) return;
    setDeleting(true);
    try {
      const { doc, deleteDoc } = await import('firebase/firestore');
      const { FIRESTORE } = await import('src/lib/firebase');
      await deleteDoc(doc(FIRESTORE, 'newsletterSubscribers', deleteEmail));
    } catch (err) {
      console.error('Error removing subscriber:', err);
    } finally {
      setDeleting(false);
      setDeleteEmail(null);
    }
  };

  const handleExportCsv = () => {
    const rows = ['Email,Subscribed At', ...subscribers.map((s) => `${s.email},${s.subscribedAt ? format(s.subscribedAt, 'yyyy-MM-dd HH:mm') : ''}`)];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSend = async () => {
    setSending(true);
    setSendResult(null);
    setSendError(null);
    setConfirmOpen(false);
    try {
      const res = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          previewText,
          heading,
          body,
          ctaLabel,
          ctaUrl,
          recipients: subscribers.map((s) => s.email),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSendResult({ sent: data.sent, failed: data.failed });
        setSubject('');
        setPreviewText('');
        setHeading('');
        setBody('');
        setCtaLabel('');
        setCtaUrl('');
      } else {
        setSendError(data.error || 'Failed to send newsletter.');
      }
    } catch {
      setSendError('Network error. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const isFormValid = subject.trim() && heading.trim() && body.trim() && subscribers.length > 0;

  const renderSubscribersTab = () => (
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
        <TextField
          size="small"
          placeholder="Search subscribers…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 260 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="outlined"
          size="small"
          startIcon={<Iconify icon="eva:download-outline" />}
          onClick={handleExportCsv}
          disabled={subscribers.length === 0}
        >
          Export CSV
        </Button>
      </Stack>

      <Card>
        {loading ? (
          <LinearProgress />
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>Subscribed</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                      {search ? 'No matching subscribers.' : 'No subscribers yet.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((sub) => (
                    <TableRow key={sub.email} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{sub.email}</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>
                        {sub.subscribedAt ? format(sub.subscribedAt, 'dd MMM yyyy, HH:mm') : '—'}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Remove subscriber">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setDeleteEmail(sub.email)}
                          >
                            <Iconify icon="eva:trash-2-outline" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      {/* Delete confirmation */}
      <Dialog open={!!deleteEmail} onClose={() => setDeleteEmail(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Remove Subscriber</DialogTitle>
        <DialogContent>
          <Typography>
            Remove <strong>{deleteEmail}</strong> from the newsletter list?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteEmail(null)} disabled={deleting}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete} disabled={deleting}>
            {deleting ? <CircularProgress size={18} color="inherit" /> : 'Remove'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );

  const renderComposeTab = () => (
    <Stack spacing={3}>
      {sendResult && (
        <Alert severity={sendResult.failed === 0 ? 'success' : 'warning'} onClose={() => setSendResult(null)}>
          Newsletter sent! <strong>{sendResult.sent}</strong> delivered
          {sendResult.failed > 0 && `, ${sendResult.failed} failed`}.
        </Alert>
      )}
      {sendError && (
        <Alert severity="error" onClose={() => setSendError(null)}>{sendError}</Alert>
      )}

      <Card>
        <CardContent>
          <Stack spacing={2.5}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: -1 }}>
              Email Metadata
            </Typography>
            <TextField
              label="Subject line"
              placeholder="e.g. New arrivals just landed at ComponentPulse 🚀"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Preview text (optional)"
              placeholder="Short summary shown in inbox previews"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              fullWidth
              helperText="Appears after the subject line in most email clients."
            />
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={2.5}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: -1 }}>
              Email Content
            </Typography>
            <TextField
              label="Heading"
              placeholder="e.g. We've restocked your favourites!"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Body"
              placeholder="Write your newsletter content here. Separate paragraphs with a blank line."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              fullWidth
              required
              multiline
              minRows={6}
              helperText="Separate paragraphs with a blank line. Plain text only — no HTML."
            />
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={2.5}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: -1 }}>
              Call to Action (optional)
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Button label"
                placeholder="e.g. Shop Now"
                value={ctaLabel}
                onChange={(e) => setCtaLabel(e.target.value)}
                fullWidth
              />
              <TextField
                label="Button URL"
                placeholder="https://componentpulseug.com/products"
                value={ctaUrl}
                onChange={(e) => setCtaUrl(e.target.value)}
                fullWidth
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Will be sent to <strong>{subscribers.length}</strong> subscriber{subscribers.length !== 1 ? 's' : ''}
        </Typography>
        <Button
          variant="contained"
          size="large"
          disabled={!isFormValid || sending}
          onClick={() => setConfirmOpen(true)}
          startIcon={sending ? <CircularProgress size={18} color="inherit" /> : <Iconify icon="eva:email-outline" />}
        >
          {sending ? 'Sending…' : 'Send Newsletter'}
        </Button>
      </Box>

      {/* Send confirmation dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Send Newsletter?</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 1.5 }}>
            You're about to send <strong>"{subject}"</strong> to{' '}
            <strong>{subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''}</strong>.
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSend}>
            Confirm &amp; Send
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );

  const renderSentHistoryTab = () => (
    <Stack spacing={2}>
      <Card>
        {campaignsLoading ? (
          <LinearProgress />
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Subject</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Sent</TableCell>
                  <TableCell align="center">Delivered</TableCell>
                  <TableCell align="center">Failed</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {campaigns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                      No newsletters sent yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  campaigns.map((c) => (
                    <TableRow key={c.id} hover>
                      <TableCell sx={{ maxWidth: 260 }}>
                        <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
                          {c.subject}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={c.type === 'training_update' ? 'Training' : 'Newsletter'}
                          color={c.type === 'training_update' ? 'info' : 'primary'}
                          variant="soft"
                        />
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>
                        {c.sentAt ? format(c.sentAt, 'dd MMM yyyy, HH:mm') : '—'}
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>
                          {c.sent}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          variant="body2"
                          sx={{ color: c.failed > 0 ? 'error.main' : 'text.disabled', fontWeight: 600 }}
                        >
                          {c.failed}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="View details">
                          <IconButton size="small" onClick={() => setSelectedCampaign(c)}>
                            <Iconify icon="eva:eye-outline" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      {/* Campaign detail dialog */}
      <Dialog
        open={!!selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedCampaign && (
          <>
            <DialogTitle>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h6" noWrap sx={{ maxWidth: '80%' }}>
                  {selectedCampaign.subject}
                </Typography>
                <Chip
                  size="small"
                  label={selectedCampaign.type === 'training_update' ? 'Training Update' : 'Newsletter'}
                  color={selectedCampaign.type === 'training_update' ? 'info' : 'primary'}
                />
              </Stack>
            </DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2.5}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Box sx={{ flex: 1, p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Sent At</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {selectedCampaign.sentAt ? format(selectedCampaign.sentAt, 'dd MMM yyyy, HH:mm') : '—'}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, p: 2, bgcolor: 'success.lighter', borderRadius: 1 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Delivered</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.dark' }}>
                      {selectedCampaign.sent} / {selectedCampaign.recipientCount}
                    </Typography>
                  </Box>
                  {selectedCampaign.failed > 0 && (
                    <Box sx={{ flex: 1, p: 2, bgcolor: 'error.lighter', borderRadius: 1 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>Failed</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'error.dark' }}>
                        {selectedCampaign.failed}
                      </Typography>
                    </Box>
                  )}
                </Stack>

                {selectedCampaign.heading && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Heading</Typography>
                    <Typography variant="body2">{selectedCampaign.heading}</Typography>
                  </Box>
                )}

                {selectedCampaign.body && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Body</Typography>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: 'background.neutral',
                        borderRadius: 1,
                        fontSize: 14,
                        color: 'text.secondary',
                        whiteSpace: 'pre-wrap',
                        maxHeight: 200,
                        overflow: 'auto',
                      }}
                    >
                      {selectedCampaign.body}
                    </Box>
                  </Box>
                )}

                {(selectedCampaign.ctaLabel || selectedCampaign.ctaUrl) && (
                  <Stack direction="row" spacing={2}>
                    {selectedCampaign.ctaLabel && (
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>CTA Label</Typography>
                        <Typography variant="body2">{selectedCampaign.ctaLabel}</Typography>
                      </Box>
                    )}
                    {selectedCampaign.ctaUrl && (
                      <Box sx={{ flex: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>CTA URL</Typography>
                        <Typography variant="body2" noWrap sx={{ color: 'primary.main' }}>
                          {selectedCampaign.ctaUrl}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                )}

                {selectedCampaign.moduleTitle && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Training Module</Typography>
                    <Typography variant="body2">{selectedCampaign.moduleTitle}</Typography>
                  </Box>
                )}

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Recipients ({selectedCampaign.recipients.length})
                  </Typography>
                  <Box
                    sx={{
                      maxHeight: 220,
                      overflow: 'auto',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                    }}
                  >
                    <Table size="small">
                      <TableBody>
                        {selectedCampaign.recipients.map((email) => (
                          <TableRow key={email}>
                            <TableCell sx={{ fontSize: 13 }}>{email}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedCampaign(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Stack>
  );

  return (
    <DashboardContent>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4">Newsletter</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Manage subscribers and send branded newsletters.
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Card sx={{ flex: 1, minWidth: 160 }}>
            <CardContent sx={{ textAlign: 'center', py: 2.5 }}>
              <Typography variant="h3" sx={{ color: 'primary.main' }}>
                {loading ? '—' : subscribers.length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Total Subscribers
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1, minWidth: 160 }}>
            <CardContent sx={{ textAlign: 'center', py: 2.5 }}>
              <Typography variant="h3" sx={{ color: 'success.main' }}>
                {loading ? '—' : subscribers.filter((s) => s.subscribedAt && s.subscribedAt >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                New (Last 30 days)
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1, minWidth: 160 }}>
            <CardContent sx={{ textAlign: 'center', py: 2.5 }}>
              <Typography variant="h3" sx={{ color: 'warning.main' }}>
                {campaignsLoading ? '—' : campaigns.length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Campaigns Sent
              </Typography>
            </CardContent>
          </Card>
        </Stack>

        <Divider />

        <TabContext value={tab}>
          <TabList onChange={(_, v) => setTab(v)} sx={{ mb: 1 }}>
            <Tab
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <span>Subscribers</span>
                  {!loading && <Chip label={subscribers.length} size="small" />}
                </Stack>
              }
              value="subscribers"
            />
            <Tab label="Compose & Send" value="compose" />
            <Tab
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <span>Sent History</span>
                  {!campaignsLoading && <Chip label={campaigns.length} size="small" />}
                </Stack>
              }
              value="history"
            />
          </TabList>

          <TabPanel value="subscribers" sx={{ p: 0 }}>
            {renderSubscribersTab()}
          </TabPanel>

          <TabPanel value="compose" sx={{ p: 0 }}>
            {renderComposeTab()}
          </TabPanel>

          <TabPanel value="history" sx={{ p: 0 }}>
            {renderSentHistoryTab()}
          </TabPanel>
        </TabContext>
      </Stack>
    </DashboardContent>
  );
}
