'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Alert, Button, Container, Stack, Typography } from '@mui/material';
import { getAdminReviewsServiceUrl, useAdminMode } from '@/hooks/useAdminMode';
import { useLocationSearch } from '@/hooks/useLocationSearch';

export default function AllReviewsPage() {
  const search = useLocationSearch();
  const { isAdmin } = useAdminMode();

  const text = search.lang === 'en'
    ? {
        title: 'Redirecting to reviews service',
        subtitle: 'Admin mode opens the standalone reviews service on port 3010.',
        denied: 'Admin login is required to open the reviews service.',
        back: 'Back to home',
        open: 'Open reviews service',
      }
    : {
        title: 'Перехід до сервісу відгуків',
        subtitle: 'Адмінрежим відкриває окремий сервіс усіх відгуків на порті 3010.',
        denied: 'Для цієї сторінки потрібен вхід адміністратора.',
        back: 'На головну',
        open: 'Відкрити сервіс відгуків',
      };

  useEffect(() => {
    if (isAdmin && typeof window !== 'undefined') {
      window.location.replace(getAdminReviewsServiceUrl(search.lang));
    }
  }, [isAdmin, search.lang]);

  if (!isAdmin) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>{text.denied}</Alert>
        <Button component={Link} href={`/?lang=${search.lang}`} variant="contained">{text.back}</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Stack spacing={2}>
        <Typography variant="h3" fontWeight={800}>
          {text.title}
        </Typography>
        <Typography color="text.secondary">
          {text.subtitle}
        </Typography>
        <Button component="a" href={getAdminReviewsServiceUrl(search.lang)} variant="contained">
          {text.open}
        </Button>
      </Stack>
    </Container>
  );
}
