'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import { DEVELOPER_PAGE, HOME_PAGE } from '@/constants/pages';
import { useAdminMode } from '@/hooks/useAdminMode';
import { useLocationSearch } from '@/hooks/useLocationSearch';
import { api } from '@/lib/api';
import type { EmailDeliveryStatus, EmailMessage } from '@/types/series';

const FILTERS: Array<'ALL' | EmailDeliveryStatus> = ['ALL', 'SENT', 'FAILED', 'PENDING'];

export default function AllEmailsPage() {
  const search = useLocationSearch();
  const { isAdmin } = useAdminMode();
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [filter, setFilter] = useState<'ALL' | EmailDeliveryStatus>('ALL');
  const [loading, setLoading] = useState(false);
  const [retryingAll, setRetryingAll] = useState(false);
  const [retryingId, setRetryingId] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const text = search.lang === 'en'
    ? {
        title: 'Email control center',
        subtitle: 'Watch delivery statuses, inspect failed attempts, and trigger retries from the frontend.',
        denied: 'Admin login is required to open the email control center.',
        back: 'Back to home',
        developer: 'Developer tools',
        refresh: 'Refresh',
        retryFailed: 'Retry failed batch',
        all: 'All',
        sent: 'Sent',
        failed: 'Failed',
        pending: 'Pending',
        loaded: 'Loaded now',
        sentCount: 'Sent',
        failedCount: 'Failed',
        pendingCount: 'Pending',
        recipient: 'Recipient',
        created: 'Created',
        attempts: 'Attempts',
        lastAttempt: 'Last attempt',
        eventType: 'Event',
        errorLabel: 'Error',
        noError: 'No error',
        empty: 'No messages match the selected filter yet.',
        retry: 'Retry now',
        mailpit: 'Open Mailpit',
        kibana: 'Open Kibana',
        health: 'Health',
        batchSuccess: 'Failed messages were queued for another delivery attempt.',
        singleSuccess: 'The email was queued for another delivery attempt.',
        actionError: 'Failed to perform the requested action.',
      }
    : {
        title: '\u0426\u0435\u043d\u0442\u0440 \u043a\u043e\u043d\u0442\u0440\u043e\u043b\u044e email',
        subtitle: '\u041f\u0435\u0440\u0435\u0433\u043b\u044f\u0434\u0430\u0439 \u0441\u0442\u0430\u0442\u0443\u0441\u0438 \u0434\u043e\u0441\u0442\u0430\u0432\u043a\u0438, \u043f\u043e\u043c\u0438\u043b\u043a\u0438 \u0432\u0456\u0434\u043f\u0440\u0430\u0432\u043a\u0438 \u0442\u0430 \u0437\u0430\u043f\u0443\u0441\u043a\u0430\u0439 \u043f\u043e\u0432\u0442\u043e\u0440\u043d\u0456 \u0441\u043f\u0440\u043e\u0431\u0438 \u043f\u0440\u044f\u043c\u043e \u0437 \u0456\u043d\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0443.',
        denied: '\u0414\u043b\u044f \u0432\u0456\u0434\u043a\u0440\u0438\u0442\u0442\u044f \u0446\u0435\u043d\u0442\u0440\u0443 \u043a\u043e\u043d\u0442\u0440\u043e\u043b\u044e email \u043f\u043e\u0442\u0440\u0456\u0431\u0435\u043d \u0432\u0445\u0456\u0434 \u0430\u0434\u043c\u0456\u043d\u0456\u0441\u0442\u0440\u0430\u0442\u043e\u0440\u0430.',
        back: '\u041d\u0430 \u0433\u043e\u043b\u043e\u0432\u043d\u0443',
        developer: '\u0406\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u0438 \u0440\u043e\u0437\u0440\u043e\u0431\u043d\u0438\u043a\u0430',
        refresh: '\u041e\u043d\u043e\u0432\u0438\u0442\u0438',
        retryFailed: '\u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u0438 \u043f\u043e\u043c\u0438\u043b\u043a\u043e\u0432\u0456',
        all: '\u0423\u0441\u0456',
        sent: '\u0412\u0456\u0434\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0456',
        failed: '\u041f\u043e\u043c\u0438\u043b\u043a\u043e\u0432\u0456',
        pending: '\u0412 \u043e\u0447\u0456\u043a\u0443\u0432\u0430\u043d\u043d\u0456',
        loaded: '\u0417\u0430\u0432\u0430\u043d\u0442\u0430\u0436\u0435\u043d\u043e',
        sentCount: '\u0412\u0456\u0434\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0456',
        failedCount: '\u041f\u043e\u043c\u0438\u043b\u043a\u043e\u0432\u0456',
        pendingCount: '\u0412 \u043e\u0447\u0456\u043a\u0443\u0432\u0430\u043d\u043d\u0456',
        recipient: '\u041e\u0442\u0440\u0438\u043c\u0443\u0432\u0430\u0447',
        created: '\u0421\u0442\u0432\u043e\u0440\u0435\u043d\u043e',
        attempts: '\u0421\u043f\u0440\u043e\u0431\u0438',
        lastAttempt: '\u041e\u0441\u0442\u0430\u043d\u043d\u044f \u0441\u043f\u0440\u043e\u0431\u0430',
        eventType: '\u041f\u043e\u0434\u0456\u044f',
        errorLabel: '\u041f\u043e\u043c\u0438\u043b\u043a\u0430',
        noError: '\u0411\u0435\u0437 \u043f\u043e\u043c\u0438\u043b\u043a\u0438',
        empty: '\u041f\u043e\u043a\u0438 \u0449\u043e \u043d\u0435\u043c\u0430\u0454 \u043b\u0438\u0441\u0442\u0456\u0432 \u0434\u043b\u044f \u0432\u0438\u0431\u0440\u0430\u043d\u043e\u0433\u043e \u0444\u0456\u043b\u044c\u0442\u0440\u0430.',
        retry: '\u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u0438',
        mailpit: '\u0412\u0456\u0434\u043a\u0440\u0438\u0442\u0438 Mailpit',
        kibana: '\u0412\u0456\u0434\u043a\u0440\u0438\u0442\u0438 Kibana',
        health: 'Health',
        batchSuccess: '\u041f\u043e\u043c\u0438\u043b\u043a\u043e\u0432\u0456 \u043b\u0438\u0441\u0442\u0438 \u043f\u043e\u0441\u0442\u0430\u0432\u043b\u0435\u043d\u043e \u0432 \u0447\u0435\u0440\u0433\u0443 \u043d\u0430 \u043f\u043e\u0432\u0442\u043e\u0440\u043d\u0443 \u0432\u0456\u0434\u043f\u0440\u0430\u0432\u043a\u0443.',
        singleSuccess: '\u041b\u0438\u0441\u0442 \u043f\u043e\u0441\u0442\u0430\u0432\u043b\u0435\u043d\u043e \u0432 \u0447\u0435\u0440\u0433\u0443 \u043d\u0430 \u043f\u043e\u0432\u0442\u043e\u0440\u043d\u0443 \u0432\u0456\u0434\u043f\u0440\u0430\u0432\u043a\u0443.',
        actionError: '\u041d\u0435 \u0432\u0434\u0430\u043b\u043e\u0441\u044f \u0432\u0438\u043a\u043e\u043d\u0430\u0442\u0438 \u0434\u0456\u044e.',
      };

  const stats = useMemo(() => ({
    total: messages.length,
    sent: messages.filter((item) => item.status === 'SENT').length,
    failed: messages.filter((item) => item.status === 'FAILED').length,
    pending: messages.filter((item) => item.status === 'PENDING').length,
  }), [messages]);

  const load = async (nextFilter = filter) => {
    try {
      setLoading(true);
      setError('');
      const result = await api.listEmailMessages(nextFilter === 'ALL' ? undefined : nextFilter);
      setMessages(result);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : text.actionError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      load(filter);
    }
  }, [isAdmin, filter]);

  const retryFailedBatch = async () => {
    try {
      setRetryingAll(true);
      setStatus(null);
      await api.retryFailedEmailMessages();
      await load(filter);
      setStatus({ type: 'success', message: text.batchSuccess });
    } catch (retryError) {
      setStatus({
        type: 'error',
        message: retryError instanceof Error ? retryError.message : text.actionError,
      });
    } finally {
      setRetryingAll(false);
    }
  };

  const retrySingle = async (id: string) => {
    try {
      setRetryingId(id);
      setStatus(null);
      await api.retryEmailMessage(id);
      await load(filter);
      setStatus({ type: 'success', message: text.singleSuccess });
    } catch (retryError) {
      setStatus({
        type: 'error',
        message: retryError instanceof Error ? retryError.message : text.actionError,
      });
    } finally {
      setRetryingId('');
    }
  };

  const formatDate = (value: string | null) => {
    if (!value) {
      return '\u2014';
    }

    return new Date(value).toLocaleString(search.lang === 'en' ? 'en-US' : 'uk-UA');
  };

  const filterLabel = (value: 'ALL' | EmailDeliveryStatus) => {
    switch (value) {
      case 'SENT':
        return text.sent;
      case 'FAILED':
        return text.failed;
      case 'PENDING':
        return text.pending;
      default:
        return text.all;
    }
  };

  if (!isAdmin) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          {text.denied}
        </Alert>
        <Button component={Link} href={`${HOME_PAGE}?lang=${search.lang}`} variant="contained">
          {text.back}
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h3" fontWeight={800}>
            {text.title}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {text.subtitle}
          </Typography>
        </Box>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} flexWrap="wrap" useFlexGap>
          <Button component={Link} href={`${DEVELOPER_PAGE}?lang=${search.lang}`} variant="outlined">
            {text.developer}
          </Button>
          <Button variant="outlined" onClick={() => load(filter)} disabled={loading}>
            {text.refresh}
          </Button>
          <Button variant="contained" onClick={retryFailedBatch} disabled={retryingAll}>
            {text.retryFailed}
          </Button>
          <Button component="a" href="http://localhost:8026" target="_blank" rel="noreferrer" variant="outlined">
            {text.mailpit}
          </Button>
          <Button component="a" href="http://localhost:5602" target="_blank" rel="noreferrer" variant="outlined">
            {text.kibana}
          </Button>
          <Button component="a" href="http://localhost:3021/health" target="_blank" rel="noreferrer" variant="outlined">
            {text.health}
          </Button>
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <Card variant="outlined" sx={{ flex: 1 }}><CardContent><Typography variant="overline">{text.loaded}</Typography><Typography variant="h4" fontWeight={800}>{stats.total}</Typography></CardContent></Card>
          <Card variant="outlined" sx={{ flex: 1 }}><CardContent><Typography variant="overline">{text.sentCount}</Typography><Typography variant="h4" fontWeight={800}>{stats.sent}</Typography></CardContent></Card>
          <Card variant="outlined" sx={{ flex: 1 }}><CardContent><Typography variant="overline">{text.failedCount}</Typography><Typography variant="h4" fontWeight={800}>{stats.failed}</Typography></CardContent></Card>
          <Card variant="outlined" sx={{ flex: 1 }}><CardContent><Typography variant="overline">{text.pendingCount}</Typography><Typography variant="h4" fontWeight={800}>{stats.pending}</Typography></CardContent></Card>
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} flexWrap="wrap" useFlexGap>
          {FILTERS.map((item) => (
            <Button
              key={item}
              variant={filter === item ? 'contained' : 'outlined'}
              onClick={() => setFilter(item)}
            >
              {filterLabel(item)}
            </Button>
          ))}
        </Stack>

        {error && <Alert severity="error">{error}</Alert>}
        {status && <Alert severity={status.type}>{status.message}</Alert>}

        <Stack spacing={2}>
          {messages.length ? messages.map((message) => (
            <Card key={message.id} variant="outlined">
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={700}>{message.subject}</Typography>
                      <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                        {text.recipient}: {message.recipientEmail}
                      </Typography>
                    </Box>
                    <Chip
                      color={message.status === 'SENT' ? 'success' : message.status === 'FAILED' ? 'error' : 'warning'}
                      label={message.status}
                    />
                  </Stack>

                  <Typography>{message.content}</Typography>

                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} flexWrap="wrap" useFlexGap>
                    <Typography variant="body2" color="text.secondary">{text.eventType}: {message.eventType}</Typography>
                    <Typography variant="body2" color="text.secondary">{text.created}: {formatDate(message.createdAt)}</Typography>
                    <Typography variant="body2" color="text.secondary">{text.attempts}: {message.attemptCount}</Typography>
                    <Typography variant="body2" color="text.secondary">{text.lastAttempt}: {formatDate(message.lastAttemptAt)}</Typography>
                  </Stack>

                  <Alert severity={message.status === 'FAILED' ? 'error' : 'info'}>
                    {text.errorLabel}: {message.errorMessage || text.noError}
                  </Alert>

                  <Box>
                    <Button
                      variant="outlined"
                      onClick={() => retrySingle(message.id)}
                      disabled={retryingId === message.id}
                    >
                      {text.retry}
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          )) : (
            <Typography color="text.secondary">{text.empty}</Typography>
          )}
        </Stack>
      </Stack>
    </Container>
  );
}
