'use client';

import { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { Alert, Box, Button, Container, IconButton, Snackbar, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useIntl } from 'react-intl';
import SeriesForm from '@/components/SeriesForm';
import SeriesReviewsPanel from '@/components/SeriesReviewsPanel';
import { SERIES_LIST } from '@/constants/pages';
import { useAdminMode } from '@/hooks/useAdminMode';
import { useLocationSearch } from '@/hooks/useLocationSearch';
import { api } from '@/lib/api';
import { localizeSeriesTitle } from '@/lib/series-localization';
import type { Series, SeriesRequest, Studio } from '@/types/series';

export default function SeriesDetailsPage({ id, createMode = false }: { id?: string; createMode?: boolean }) {
  const intl = useIntl();
  const router = useRouter();
  const search = useLocationSearch();
  const { isAdmin } = useAdminMode();
  const [series, setSeries] = useState<Series | undefined>();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [mode, setMode] = useState<'view' | 'edit' | 'create'>(createMode ? 'create' : 'view');
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState('');

  const backUrl = `${SERIES_LIST}?${new URLSearchParams({
    lang: search.lang,
    page: String(search.page),
    size: String(search.size),
    genre: search.genre,
    year: search.year,
    minRating: search.minRating,
    studioId: search.studioId,
  }).toString()}`;

  useEffect(() => {
    const load = async () => {
      try {
        setError('');
        const studioResult = await api.listStudios();
        setStudios(studioResult);
        if (!createMode && id) {
          setSeries(await api.getSeries(id));
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : intl.formatMessage({ id: 'series.load.error' }));
      }
    };
    load();
  }, [createMode, id, intl]);

  const submit = async (data: SeriesRequest) => {
    if (createMode) {
      await api.createSeries(data);
      const backUrlWithMessage = `${backUrl}${backUrl.includes('?') ? '&' : '?'}created=1`;
      router.push(backUrlWithMessage);
      return;
    }
    if (!id) return;
    const updated = await api.updateSeries(id, data);
    setSeries(updated);
    setMode('view');
    setSnackbar(intl.formatMessage({ id: 'series.save.success' }));
  };

  if (createMode && !isAdmin) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Button variant="outlined" onClick={() => router.push(backUrl)} sx={{ mb: 3 }}>
          {intl.formatMessage({ id: 'series.back' })}
        </Button>
        <Alert severity="warning">
          {search.lang === 'en'
            ? 'Admin login is required to create or edit series.'
            : 'Для створення або редагування серіалів потрібен вхід адміністратора.'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button variant="outlined" onClick={() => router.push(backUrl)}>
          {intl.formatMessage({ id: 'series.back' })}
        </Button>
        {!createMode && mode === 'view' && isAdmin && (
          <IconButton color="primary" onClick={() => setMode('edit')}>
            <EditIcon />
          </IconButton>
        )}
      </Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        {createMode ? intl.formatMessage({ id: 'series.add' }) : (series ? localizeSeriesTitle(series.title, search.lang) : '')}
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {(createMode || series) && (
        <SeriesForm
          series={series}
          studios={studios}
          mode={mode}
          onSubmit={submit}
          onCancel={() => createMode ? router.push(backUrl) : setMode('view')}
        />
      )}
      {!createMode && series && <SeriesReviewsPanel series={series} />}
      <Snackbar open={!!snackbar} autoHideDuration={3000} onClose={() => setSnackbar('')} message={snackbar} />
    </Container>
  );
}
