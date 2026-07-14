'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  FormControlLabel,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import { EMAIL_CONTROL_PAGE, REVIEWS_PAGE } from '@/constants/pages';
import { useLocationSearch } from '@/hooks/useLocationSearch';
import { useAdminMode } from '@/hooks/useAdminMode';
import { api } from '@/lib/api';
import type { EmailSettings, NotificationSettings, SubscriberOverview } from '@/types/series';

const defaultEmailSettings: EmailSettings = {
  smtpHost: '',
  smtpPort: 1025,
  smtpUsername: '',
  smtpPassword: '',
  smtpAuth: false,
  smtpStarttls: false,
  fromEmail: '',
};

const defaultNotificationSettings: NotificationSettings = {
  recipientEmail: '',
  newSeriesSubjectTemplate: '',
  newSeriesBodyTemplate: '',
  newSeasonSubjectTemplate: '',
  newSeasonBodyTemplate: '',
};

const defaultOverview: SubscriberOverview = {
  totalSubscribers: 0,
  activeSubscribers: 0,
  newSeriesSubscribers: 0,
  newSeasonSubscribers: 0,
  subscribers: [],
};

export default function DeveloperToolsPage() {
  const search = useLocationSearch();
  const { isAdmin } = useAdminMode();
  const [emailSettings, setEmailSettings] = useState<EmailSettings>(defaultEmailSettings);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(defaultNotificationSettings);
  const [overview, setOverview] = useState<SubscriberOverview>(defaultOverview);
  const [loadError, setLoadError] = useState('');
  const [emailSaveMessage, setEmailSaveMessage] = useState('');
  const [notificationSaveMessage, setNotificationSaveMessage] = useState('');
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingNotification, setSavingNotification] = useState(false);

  const text = useMemo(
    () =>
      search.lang === 'en'
        ? {
            title: 'Developer tools',
            subtitle: 'Admin tools for review moderation, subscriber accounts, and email delivery settings.',
            denied: 'Admin login is required to open developer tools.',
            back: 'Back to home',
            moderationTitle: 'Moderation and service control',
            moderationText: 'Open the frontend review moderation page or the email delivery control center in one click.',
            moderationOpen: 'Open review moderation',
            emailOpen: 'Open email control center',
            accountsTitle: 'Subscriber accounts',
            accountsText: 'People can save their email in a profile and subscribe to new series or new season updates.',
            totalAccounts: 'Total accounts',
            activeAccounts: 'Active now',
            seriesSubscribers: 'Subscribed to new series',
            seasonSubscribers: 'Subscribed to new seasons',
            active: 'Active',
            idle: 'Idle',
            deliveryTitle: 'Email delivery settings',
            deliveryText: 'The email service uses these values for the next delivery attempts.',
            notificationTitle: 'Fallback recipient and message templates',
            notificationText: 'If nobody is subscribed yet, the backend can still send notifications to this fallback address. You can also update the subject and body used for new series and new season emails.',
            smtpHost: 'SMTP host',
            smtpPort: 'SMTP port',
            smtpUsername: 'SMTP username',
            smtpPassword: 'SMTP password',
            smtpAuth: 'Use SMTP authentication',
            smtpStarttls: 'Use STARTTLS',
            fromEmail: 'Sender email',
            recipientEmail: 'Fallback email',
            newSeriesSubject: 'New series subject',
            newSeriesBody: 'New series email body',
            newSeasonSubject: 'New season subject',
            newSeasonBody: 'New season email body',
            placeholders: 'Available placeholders: {title}, {genre}, {year}, {rating}, {studio}, {status}, {previousSeasons}, {currentSeasons}',
            saveEmail: 'Save email settings',
            saveNotification: 'Save notification settings',
            emailSaved: 'Email delivery settings were updated.',
            notificationSaved: 'Notification settings were updated.',
            loadError: 'Failed to load admin settings.',
            saveError: 'Failed to save settings.',
            noAccounts: 'No subscriber accounts yet.',
            newSeriesFlag: 'new series',
            newSeasonFlag: 'new seasons',
          }
        : {
            title: '\u0406\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u0438 \u0440\u043e\u0437\u0440\u043e\u0431\u043d\u0438\u043a\u0430',
            subtitle: '\u041f\u0430\u043d\u0435\u043b\u044c \u0430\u0434\u043c\u0456\u043d\u0456\u0441\u0442\u0440\u0430\u0442\u043e\u0440\u0430 \u0434\u043b\u044f \u043c\u043e\u0434\u0435\u0440\u0430\u0446\u0456\u0457 \u0432\u0456\u0434\u0433\u0443\u043a\u0456\u0432, \u043a\u0435\u0440\u0443\u0432\u0430\u043d\u043d\u044f \u0430\u043a\u0430\u0443\u043d\u0442\u0430\u043c\u0438 \u043f\u0456\u0434\u043f\u0438\u0441\u043d\u0438\u043a\u0456\u0432 \u0456 \u043d\u0430\u043b\u0430\u0448\u0442\u0443\u0432\u0430\u043d\u044c email-\u0440\u043e\u0437\u0441\u0438\u043b\u043a\u0438.',
            denied: '\u0414\u043b\u044f \u0432\u0456\u0434\u043a\u0440\u0438\u0442\u0442\u044f \u0456\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u0456\u0432 \u0440\u043e\u0437\u0440\u043e\u0431\u043d\u0438\u043a\u0430 \u043f\u043e\u0442\u0440\u0456\u0431\u0435\u043d \u0432\u0445\u0456\u0434 \u0430\u0434\u043c\u0456\u043d\u0456\u0441\u0442\u0440\u0430\u0442\u043e\u0440\u0430.',
            back: '\u041d\u0430 \u0433\u043e\u043b\u043e\u0432\u043d\u0443',
            moderationTitle: '\u041c\u043e\u0434\u0435\u0440\u0430\u0446\u0456\u044f \u0442\u0430 \u043a\u043e\u043d\u0442\u0440\u043e\u043b\u044c \u0441\u0435\u0440\u0432\u0456\u0441\u0456\u0432',
            moderationText: '\u0412\u0456\u0434\u043a\u0440\u0438\u0432\u0430\u0439 \u0441\u0442\u043e\u0440\u0456\u043d\u043a\u0443 \u043c\u043e\u0434\u0435\u0440\u0430\u0446\u0456\u0457 \u0432\u0456\u0434\u0433\u0443\u043a\u0456\u0432 \u0430\u0431\u043e \u0446\u0435\u043d\u0442\u0440 \u043a\u043e\u043d\u0442\u0440\u043e\u043b\u044e email-\u0440\u043e\u0437\u0441\u0438\u043b\u043a\u0438 \u0432 \u043e\u0434\u0438\u043d \u043a\u043b\u0456\u043a.',
            moderationOpen: '\u0412\u0456\u0434\u043a\u0440\u0438\u0442\u0438 \u043c\u043e\u0434\u0435\u0440\u0430\u0446\u0456\u044e \u0432\u0456\u0434\u0433\u0443\u043a\u0456\u0432',
            emailOpen: '\u0412\u0456\u0434\u043a\u0440\u0438\u0442\u0438 \u043a\u043e\u043d\u0442\u0440\u043e\u043b\u044c email',
            accountsTitle: '\u0410\u043a\u0430\u0443\u043d\u0442\u0438 \u043f\u0456\u0434\u043f\u0438\u0441\u043d\u0438\u043a\u0456\u0432',
            accountsText: '\u041a\u043e\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0456 \u043c\u043e\u0436\u0443\u0442\u044c \u0437\u0431\u0435\u0440\u0456\u0433\u0430\u0442\u0438 \u0441\u0432\u0456\u0439 email \u0443 \u043f\u0440\u043e\u0444\u0456\u043b\u0456 \u0442\u0430 \u043f\u0456\u0434\u043f\u0438\u0441\u0443\u0432\u0430\u0442\u0438\u0441\u044c \u043d\u0430 \u0441\u043f\u043e\u0432\u0456\u0449\u0435\u043d\u043d\u044f \u043f\u0440\u043e \u043d\u043e\u0432\u0456 \u0441\u0435\u0440\u0456\u0430\u043b\u0438 \u0430\u0431\u043e \u043d\u043e\u0432\u0456 \u0441\u0435\u0437\u043e\u043d\u0438.',
            totalAccounts: '\u0423\u0441\u044c\u043e\u0433\u043e \u0430\u043a\u0430\u0443\u043d\u0442\u0456\u0432',
            activeAccounts: '\u0410\u043a\u0442\u0438\u0432\u043d\u0456 \u0437\u0430\u0440\u0430\u0437',
            seriesSubscribers: '\u041f\u0456\u0434\u043f\u0438\u0441\u0430\u043d\u0456 \u043d\u0430 \u043d\u043e\u0432\u0456 \u0441\u0435\u0440\u0456\u0430\u043b\u0438',
            seasonSubscribers: '\u041f\u0456\u0434\u043f\u0438\u0441\u0430\u043d\u0456 \u043d\u0430 \u043d\u043e\u0432\u0456 \u0441\u0435\u0437\u043e\u043d\u0438',
            active: '\u0410\u043a\u0442\u0438\u0432\u043d\u0438\u0439',
            idle: '\u041d\u0435\u0430\u043a\u0442\u0438\u0432\u043d\u0438\u0439',
            deliveryTitle: '\u041d\u0430\u043b\u0430\u0448\u0442\u0443\u0432\u0430\u043d\u043d\u044f email-\u0434\u043e\u0441\u0442\u0430\u0432\u043a\u0438',
            deliveryText: '\u0421\u0435\u0440\u0432\u0456\u0441 \u0440\u043e\u0437\u0441\u0438\u043b\u043a\u0438 \u0432\u0438\u043a\u043e\u0440\u0438\u0441\u0442\u043e\u0432\u0443\u0454 \u0446\u0456 \u0437\u043d\u0430\u0447\u0435\u043d\u043d\u044f \u0434\u043b\u044f \u043d\u0430\u0441\u0442\u0443\u043f\u043d\u0438\u0445 \u0441\u043f\u0440\u043e\u0431 \u0432\u0456\u0434\u043f\u0440\u0430\u0432\u043a\u0438 \u043b\u0438\u0441\u0442\u0456\u0432.',
            notificationTitle: '\u0420\u0435\u0437\u0435\u0440\u0432\u043d\u0438\u0439 \u043e\u0442\u0440\u0438\u043c\u0443\u0432\u0430\u0447 \u0456 \u0448\u0430\u0431\u043b\u043e\u043d\u0438 \u043b\u0438\u0441\u0442\u0456\u0432',
            notificationText: '\u042f\u043a\u0449\u043e \u043f\u0456\u0434\u043f\u0438\u0441\u043d\u0438\u043a\u0456\u0432 \u0449\u0435 \u043d\u0435\u043c\u0430\u0454, backend \u043c\u043e\u0436\u0435 \u0432\u0456\u0434\u043f\u0440\u0430\u0432\u0438\u0442\u0438 \u0441\u043f\u043e\u0432\u0456\u0449\u0435\u043d\u043d\u044f \u043d\u0430 \u0440\u0435\u0437\u0435\u0440\u0432\u043d\u0438\u0439 email. \u0422\u0443\u0442 \u0442\u0430\u043a\u043e\u0436 \u043c\u043e\u0436\u043d\u0430 \u0437\u043c\u0456\u043d\u0438\u0442\u0438 \u0442\u0435\u043c\u0443 \u0456 \u0442\u0435\u043a\u0441\u0442 \u043b\u0438\u0441\u0442\u0456\u0432 \u0434\u043b\u044f \u043d\u043e\u0432\u0438\u0445 \u0441\u0435\u0440\u0456\u0430\u043b\u0456\u0432 \u0442\u0430 \u043d\u043e\u0432\u0438\u0445 \u0441\u0435\u0437\u043e\u043d\u0456\u0432.',
            smtpHost: 'SMTP \u0445\u043e\u0441\u0442',
            smtpPort: 'SMTP \u043f\u043e\u0440\u0442',
            smtpUsername: 'SMTP \u043b\u043e\u0433\u0456\u043d',
            smtpPassword: 'SMTP \u043f\u0430\u0440\u043e\u043b\u044c',
            smtpAuth: '\u0412\u0438\u043a\u043e\u0440\u0438\u0441\u0442\u043e\u0432\u0443\u0432\u0430\u0442\u0438 SMTP-\u0430\u0432\u0442\u0435\u043d\u0442\u0438\u0444\u0456\u043a\u0430\u0446\u0456\u044e',
            smtpStarttls: '\u0412\u0438\u043a\u043e\u0440\u0438\u0441\u0442\u043e\u0432\u0443\u0432\u0430\u0442\u0438 STARTTLS',
            fromEmail: 'Email \u0432\u0456\u0434\u043f\u0440\u0430\u0432\u043d\u0438\u043a\u0430',
            recipientEmail: '\u0420\u0435\u0437\u0435\u0440\u0432\u043d\u0438\u0439 email',
            newSeriesSubject: '\u0422\u0435\u043c\u0430 \u043b\u0438\u0441\u0442\u0430 \u043f\u0440\u043e \u043d\u043e\u0432\u0438\u0439 \u0441\u0435\u0440\u0456\u0430\u043b',
            newSeriesBody: '\u0422\u0435\u043a\u0441\u0442 \u043b\u0438\u0441\u0442\u0430 \u043f\u0440\u043e \u043d\u043e\u0432\u0438\u0439 \u0441\u0435\u0440\u0456\u0430\u043b',
            newSeasonSubject: '\u0422\u0435\u043c\u0430 \u043b\u0438\u0441\u0442\u0430 \u043f\u0440\u043e \u043d\u043e\u0432\u0438\u0439 \u0441\u0435\u0437\u043e\u043d',
            newSeasonBody: '\u0422\u0435\u043a\u0441\u0442 \u043b\u0438\u0441\u0442\u0430 \u043f\u0440\u043e \u043d\u043e\u0432\u0438\u0439 \u0441\u0435\u0437\u043e\u043d',
            placeholders: '\u0414\u043e\u0441\u0442\u0443\u043f\u043d\u0456 \u043f\u043b\u0435\u0439\u0441\u0445\u043e\u043b\u0434\u0435\u0440\u0438: {title}, {genre}, {year}, {rating}, {studio}, {status}, {previousSeasons}, {currentSeasons}',
            saveEmail: '\u0417\u0431\u0435\u0440\u0435\u0433\u0442\u0438 \u043d\u0430\u043b\u0430\u0448\u0442\u0443\u0432\u0430\u043d\u043d\u044f email',
            saveNotification: '\u0417\u0431\u0435\u0440\u0435\u0433\u0442\u0438 \u0448\u0430\u0431\u043b\u043e\u043d\u0438 \u0442\u0430 \u043e\u0442\u0440\u0438\u043c\u0443\u0432\u0430\u0447\u0430',
            emailSaved: '\u041d\u0430\u043b\u0430\u0448\u0442\u0443\u0432\u0430\u043d\u043d\u044f email-\u0434\u043e\u0441\u0442\u0430\u0432\u043a\u0438 \u043e\u043d\u043e\u0432\u043b\u0435\u043d\u043e.',
            notificationSaved: '\u041d\u0430\u043b\u0430\u0448\u0442\u0443\u0432\u0430\u043d\u043d\u044f \u0441\u043f\u043e\u0432\u0456\u0449\u0435\u043d\u044c \u043e\u043d\u043e\u0432\u043b\u0435\u043d\u043e.',
            loadError: '\u041d\u0435 \u0432\u0434\u0430\u043b\u043e\u0441\u044f \u0437\u0430\u0432\u0430\u043d\u0442\u0430\u0436\u0438\u0442\u0438 \u043d\u0430\u043b\u0430\u0448\u0442\u0443\u0432\u0430\u043d\u043d\u044f \u0430\u0434\u043c\u0456\u043d\u0456\u0441\u0442\u0440\u0430\u0442\u043e\u0440\u0430.',
            saveError: '\u041d\u0435 \u0432\u0434\u0430\u043b\u043e\u0441\u044f \u0437\u0431\u0435\u0440\u0435\u0433\u0442\u0438 \u043d\u0430\u043b\u0430\u0448\u0442\u0443\u0432\u0430\u043d\u043d\u044f.',
            noAccounts: '\u041f\u043e\u043a\u0438 \u0449\u043e \u043d\u0435\u043c\u0430\u0454 \u0436\u043e\u0434\u043d\u043e\u0433\u043e \u0430\u043a\u0430\u0443\u043d\u0442\u0430 \u043f\u0456\u0434\u043f\u0438\u0441\u043d\u0438\u043a\u0430.',
            newSeriesFlag: '\u043d\u043e\u0432\u0456 \u0441\u0435\u0440\u0456\u0430\u043b\u0438',
            newSeasonFlag: '\u043d\u043e\u0432\u0456 \u0441\u0435\u0437\u043e\u043d\u0438',
          },
    [search.lang],
  );

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    const load = async () => {
      try {
        setLoadError('');
        const [emailResult, notificationResult, overviewResult] = await Promise.all([
          api.getEmailSettings(),
          api.getNotificationSettings(),
          api.getSubscriberOverview(),
        ]);
        setEmailSettings(emailResult);
        setNotificationSettings(notificationResult);
        setOverview(overviewResult);
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : text.loadError);
      }
    };

    load();
  }, [isAdmin, text.loadError]);

  const saveEmailSettings = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setSavingEmail(true);
      setEmailSaveMessage('');
      await api.updateEmailSettings(emailSettings);
      setEmailSaveMessage(text.emailSaved);
    } catch (error) {
      setEmailSaveMessage(error instanceof Error ? error.message : text.saveError);
    } finally {
      setSavingEmail(false);
    }
  };

  const saveNotificationSettings = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setSavingNotification(true);
      setNotificationSaveMessage('');
      await api.updateNotificationSettings(notificationSettings);
      setNotificationSaveMessage(text.notificationSaved);
    } catch (error) {
      setNotificationSaveMessage(error instanceof Error ? error.message : text.saveError);
    } finally {
      setSavingNotification(false);
    }
  };

  if (!isAdmin) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          {text.denied}
        </Alert>
        <Button component={Link} href={`/?lang=${search.lang}`} variant="contained">
          {text.back}
        </Button>
      </Container>
    );
  }

  const statCards = [
    { label: text.totalAccounts, value: overview.totalSubscribers },
    { label: text.activeAccounts, value: overview.activeSubscribers },
    { label: text.seriesSubscribers, value: overview.newSeriesSubscribers },
    { label: text.seasonSubscribers, value: overview.newSeasonSubscribers },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h3" fontWeight={800} sx={{ mb: 1 }}>
            {text.title}
          </Typography>
          <Typography color="text.secondary">{text.subtitle}</Typography>
        </Box>

        {loadError && <Alert severity="error">{loadError}</Alert>}

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                  {text.moderationTitle}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  {text.moderationText}
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <Button component={Link} href={`${REVIEWS_PAGE}?lang=${search.lang}`} variant="contained">
                    {text.moderationOpen}
                  </Button>
                  <Button component={Link} href={`${EMAIL_CONTROL_PAGE}?lang=${search.lang}`} variant="outlined">
                    {text.emailOpen}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardContent>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                  {text.accountsTitle}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  {text.accountsText}
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {statCards.map((item) => (
                    <Grid key={item.label} size={{ xs: 6, md: 3 }}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="overline" color="text.secondary">
                            {item.label}
                          </Typography>
                          <Typography variant="h4" fontWeight={800}>
                            {item.value}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                <Stack spacing={1.5}>
                  {overview.subscribers.length ? (
                    overview.subscribers.map((subscriber) => (
                      <Box key={subscriber.id} sx={{ p: 2, borderRadius: 3, bgcolor: 'grey.100' }}>
                        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1}>
                          <Box>
                            <Typography fontWeight={700}>{subscriber.name}</Typography>
                            <Typography color="text.secondary">{subscriber.email}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {subscriber.notifyNewSeries ? text.newSeriesFlag : ''}
                              {subscriber.notifyNewSeries && subscriber.notifyNewSeason ? ' • ' : ''}
                              {subscriber.notifyNewSeason ? text.newSeasonFlag : ''}
                            </Typography>
                          </Box>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Chip
                              color={subscriber.activeNow ? 'success' : 'default'}
                              label={subscriber.activeNow ? text.active : text.idle}
                            />
                          </Stack>
                        </Stack>
                      </Box>
                    ))
                  ) : (
                    <Typography color="text.secondary">{text.noAccounts}</Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                  {text.notificationTitle}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  {text.notificationText}
                </Typography>
                <Box component="form" onSubmit={saveNotificationSettings}>
                  <Stack spacing={2}>
                    <TextField
                      label={text.recipientEmail}
                      type="email"
                      value={notificationSettings.recipientEmail}
                      onChange={(event) => setNotificationSettings((current) => ({ ...current, recipientEmail: event.target.value }))}
                      fullWidth
                    />
                    <TextField
                      label={text.newSeriesSubject}
                      value={notificationSettings.newSeriesSubjectTemplate}
                      onChange={(event) => setNotificationSettings((current) => ({ ...current, newSeriesSubjectTemplate: event.target.value }))}
                      fullWidth
                    />
                    <TextField
                      label={text.newSeriesBody}
                      value={notificationSettings.newSeriesBodyTemplate}
                      onChange={(event) => setNotificationSettings((current) => ({ ...current, newSeriesBodyTemplate: event.target.value }))}
                      fullWidth
                      multiline
                      minRows={5}
                    />
                    <TextField
                      label={text.newSeasonSubject}
                      value={notificationSettings.newSeasonSubjectTemplate}
                      onChange={(event) => setNotificationSettings((current) => ({ ...current, newSeasonSubjectTemplate: event.target.value }))}
                      fullWidth
                    />
                    <TextField
                      label={text.newSeasonBody}
                      value={notificationSettings.newSeasonBodyTemplate}
                      onChange={(event) => setNotificationSettings((current) => ({ ...current, newSeasonBodyTemplate: event.target.value }))}
                      fullWidth
                      multiline
                      minRows={5}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {text.placeholders}
                    </Typography>
                    {notificationSaveMessage && (
                      <Alert severity={notificationSaveMessage === text.notificationSaved ? 'success' : 'error'}>
                        {notificationSaveMessage}
                      </Alert>
                    )}
                    <Box>
                      <Button type="submit" variant="contained" disabled={savingNotification}>
                        {text.saveNotification}
                      </Button>
                    </Box>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Card>
              <CardContent>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                  {text.deliveryTitle}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  {text.deliveryText}
                </Typography>
                <Box component="form" onSubmit={saveEmailSettings}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        label={text.smtpHost}
                        value={emailSettings.smtpHost}
                        onChange={(event) => setEmailSettings((current) => ({ ...current, smtpHost: event.target.value }))}
                        fullWidth
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        label={text.smtpPort}
                        type="number"
                        value={emailSettings.smtpPort}
                        onChange={(event) => setEmailSettings((current) => ({ ...current, smtpPort: Number(event.target.value) }))}
                        fullWidth
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        label={text.smtpUsername}
                        value={emailSettings.smtpUsername}
                        onChange={(event) => setEmailSettings((current) => ({ ...current, smtpUsername: event.target.value }))}
                        fullWidth
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        label={text.smtpPassword}
                        type="password"
                        value={emailSettings.smtpPassword}
                        onChange={(event) => setEmailSettings((current) => ({ ...current, smtpPassword: event.target.value }))}
                        fullWidth
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        label={text.fromEmail}
                        type="email"
                        value={emailSettings.fromEmail}
                        onChange={(event) => setEmailSettings((current) => ({ ...current, fromEmail: event.target.value }))}
                        fullWidth
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={emailSettings.smtpAuth}
                            onChange={(event) => setEmailSettings((current) => ({ ...current, smtpAuth: event.target.checked }))}
                          />
                        }
                        label={text.smtpAuth}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={emailSettings.smtpStarttls}
                            onChange={(event) => setEmailSettings((current) => ({ ...current, smtpStarttls: event.target.checked }))}
                          />
                        }
                        label={text.smtpStarttls}
                      />
                    </Grid>
                  </Grid>
                  <Stack spacing={2} sx={{ mt: 2 }}>
                    {emailSaveMessage && (
                      <Alert severity={emailSaveMessage === text.emailSaved ? 'success' : 'error'}>
                        {emailSaveMessage}
                      </Alert>
                    )}
                    <Box>
                      <Button type="submit" variant="contained" disabled={savingEmail}>
                        {text.saveEmail}
                      </Button>
                    </Box>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}


