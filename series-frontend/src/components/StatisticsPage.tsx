'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Container, LinearProgress, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useIntl } from 'react-intl';
import { api } from '@/lib/api';
import type { StatisticsResponse } from '@/types/series';

const attributes = ['genre', 'studio', 'year', 'rating', 'seasons', 'finished', 'title'] as const;

export default function StatisticsPage() {
  const intl = useIntl();
  const [attribute, setAttribute] = useState<(typeof attributes)[number]>('genre');
  const [stats, setStats] = useState<StatisticsResponse>({});
  const [error, setError] = useState('');

  const load = async (event?: FormEvent) => {
    event?.preventDefault();
    try {
      setError('');
      setStats(await api.getStatistics(attribute));
    } catch (e) {
      setError(e instanceof Error ? e.message : intl.formatMessage({ id: 'series.load.error' }));
    }
  };

  const entries = useMemo(() => {
    const data = Object.entries(stats);
    const maxValue = Math.max(...data.map(([, value]) => value), 1);
    return data.map(([key, value]) => ({
      key: attribute === 'finished'
        ? intl.formatMessage({ id: key === 'true' ? 'statistics.finished.true' : 'statistics.finished.false' })
        : key,
      value,
      progress: (value / maxValue) * 100,
    }));
  }, [attribute, intl, stats]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" fontWeight={800} sx={{ mb: 1 }}>
        {intl.formatMessage({ id: 'statistics.title' })}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {intl.formatMessage({ id: 'statistics.subtitle' })}
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent component="form" onSubmit={load}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }}>
            <TextField
              select
              fullWidth
              label={intl.formatMessage({ id: 'statistics.attribute' })}
              value={attribute}
              onChange={(event) => setAttribute(event.target.value as typeof attribute)}
            >
              {attributes.map((item) => (
                <MenuItem key={item} value={item}>
                  {intl.formatMessage({ id: `statistics.attributes.${item}` })}
                </MenuItem>
              ))}
            </TextField>
            <Button type="submit" variant="contained">
              {intl.formatMessage({ id: 'statistics.load' })}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Stack spacing={2}>
        {entries.map((entry) => (
          <Card key={`${entry.key}-${entry.value}`}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 1 }}>
                <Typography fontWeight={700}>{entry.key}</Typography>
                <Typography>{entry.value}</Typography>
              </Box>
              <LinearProgress variant="determinate" value={entry.progress} sx={{ height: 10, borderRadius: 999 }} />
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}
