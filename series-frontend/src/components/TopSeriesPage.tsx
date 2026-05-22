'use client';

import { useEffect, useState } from 'react';
import { Alert, Card, CardContent, Chip, Container, Grid, Typography } from '@mui/material';
import { useIntl } from 'react-intl';
import { api } from '@/lib/api';
import type { Series } from '@/types/series';

export default function TopSeriesPage() {
  const intl = useIntl();
  const [items, setItems] = useState<Series[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setError('');
        setItems(await api.topSeries(5));
      } catch (e) {
        setError(e instanceof Error ? e.message : intl.formatMessage({ id: 'series.load.error' }));
      }
    };

    load();
  }, [intl]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" fontWeight={800} sx={{ mb: 1 }}>
        {intl.formatMessage({ id: 'top.title' })}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {intl.formatMessage({ id: 'top.subtitle' })}
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Grid container spacing={3}>
        {items.map((series, index) => (
          <Grid key={series.id} size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Chip label={`#${index + 1}`} color="warning" sx={{ mb: 2 }} />
                <Typography variant="h5" fontWeight={700}>{series.title}</Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  {series.genre} • {series.year}
                </Typography>
                <Typography>{intl.formatMessage({ id: 'series.rating' })}: <strong>{series.rating}</strong></Typography>
                <Typography>{intl.formatMessage({ id: 'series.seasons' })}: <strong>{series.seasons}</strong></Typography>
                <Typography>{intl.formatMessage({ id: 'series.studio' })}: <strong>{series.studio?.name || '-'}</strong></Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
