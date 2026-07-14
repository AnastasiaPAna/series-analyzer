'use client';

import { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import PlayCircleFilledWhiteRoundedIcon from '@mui/icons-material/PlayCircleFilledWhiteRounded';
import { Alert, Box, Button, Container, IconButton, Snackbar, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useIntl } from 'react-intl';
import SeriesForm from '@/components/SeriesForm';
import SeriesReviewsPanel from '@/components/SeriesReviewsPanel';
import { SERIES_LIST } from '@/constants/pages';
import { useAdminMode } from '@/hooks/useAdminMode';
import { useLocationSearch } from '@/hooks/useLocationSearch';
import { api } from '@/lib/api';
import { getSeriesPosterDataUrl, getSeriesSpotlight } from '@/lib/series-details-metadata';
import { localizeSeriesTitle } from '@/lib/series-localization';
import type { Series, SeriesRequest, Studio } from '@/types/series';

function getSeasonWordUa(seasons: number) {
  if (seasons === 1) {
    return 'сезон';
  }

  if (seasons >= 2 && seasons <= 4) {
    return 'сезони';
  }

  return 'сезонів';
}

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

    if (!id) {
      return;
    }

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

  const canonicalEnglishTitle = series ? localizeSeriesTitle(series.title, 'en') : '';
  const spotlight = series
    ? getSeriesSpotlight(
        {
          title: localizeSeriesTitle(series.title, search.lang),
          genre: series.genre,
          seasons: series.seasons,
          year: series.year,
          finished: series.finished,
          studioName: series.studio?.name,
          trailerUrl: series.trailerUrl,
        },
        canonicalEnglishTitle,
        search.lang,
      )
    : null;
  const posterUrl = series
    ? getSeriesPosterDataUrl(
        {
          title: localizeSeriesTitle(series.title, search.lang),
          genre: series.genre,
          year: series.year,
        },
        canonicalEnglishTitle,
        search.lang,
      )
    : '';

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

      {(createMode || mode !== 'view') && (createMode || series) && (
        <SeriesForm
          series={series}
          studios={studios}
          mode={mode}
          onSubmit={submit}
          onCancel={() => (createMode ? router.push(backUrl) : setMode('view'))}
        />
      )}

      {!createMode && series && spotlight && (
        <Box
          sx={{
            mt: 4,
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' },
          }}
        >
          <Box
            sx={{
              p: 3,
              borderRadius: 4,
              color: '#f5fbff',
              background: spotlight.accent,
              boxShadow: '0 22px 46px rgba(18, 34, 59, 0.22)',
            }}
          >
            <Typography variant="overline" sx={{ letterSpacing: '0.18em', opacity: 0.72, fontWeight: 700 }}>
              {search.lang === 'en' ? 'SERIES OVERVIEW' : 'КОРОТКИЙ ОПИС'}
            </Typography>
            <Typography variant="h5" fontWeight={800} sx={{ mt: 1.2, mb: 1.6 }}>
              {search.lang === 'en' ? 'What this series feels like' : 'Який вайб у цього серіалу'}
            </Typography>
            <Typography sx={{ color: 'rgba(245,251,255,0.90)', lineHeight: 1.75, fontSize: '1rem' }}>
              {spotlight.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2.4 }}>
              <Box sx={{ px: 1.4, py: 0.8, borderRadius: 999, bgcolor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.14)' }}>
                {search.lang === 'en'
                  ? `${series.seasons} seasons`
                  : `${series.seasons} ${getSeasonWordUa(series.seasons)}`}
              </Box>
              <Box sx={{ px: 1.4, py: 0.8, borderRadius: 999, bgcolor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.14)' }}>
                {series.year}
              </Box>
              <Box sx={{ px: 1.4, py: 0.8, borderRadius: 999, bgcolor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.14)' }}>
                {series.finished
                  ? (search.lang === 'en' ? 'Finished' : 'Завершений')
                  : (search.lang === 'en' ? 'Ongoing' : 'Триває')}
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              p: { xs: 2.25, md: 2.5 },
              borderRadius: 4,
              bgcolor: 'rgba(246, 251, 255, 0.96)',
              border: '1px solid rgba(73, 118, 175, 0.16)',
              boxShadow: '0 22px 46px rgba(18, 34, 59, 0.12)',
            }}
          >
            <Typography variant="overline" sx={{ letterSpacing: '0.18em', color: '#4c6581', fontWeight: 700 }}>
              {search.lang === 'en' ? 'TRAILER' : 'ТРЕЙЛЕР'}
            </Typography>
            <Typography
              variant="h5"
              fontWeight={800}
              sx={{ mt: 1.2, mb: 1.8, color: '#14233a', fontSize: { xs: '1.55rem', sm: '1.95rem' }, lineHeight: 1.12, maxWidth: 360 }}
            >
              {search.lang === 'en' ? 'Watch the trailer here' : 'Подивись трейлер прямо тут'}
            </Typography>

            {spotlight.trailerAvailable ? (
              <Box sx={{ overflow: 'hidden', borderRadius: 3, border: '1px solid rgba(73, 118, 175, 0.16)', boxShadow: '0 18px 38px rgba(17, 40, 74, 0.18)', bgcolor: '#0f1c31' }}>
                <Box
                  component="iframe"
                  src={spotlight.trailerEmbedUrl}
                  title={`${localizeSeriesTitle(series.title, search.lang)} trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  sx={{ width: '100%', height: { xs: 260, md: 320 }, border: 0, display: 'block' }}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 3,
                  border: '1px solid rgba(73, 118, 175, 0.16)',
                  boxShadow: '0 18px 38px rgba(17, 40, 74, 0.18)',
                  bgcolor: '#112133',
                  minHeight: 320,
                }}
              >
                <Box
                  component="img"
                  src={posterUrl}
                  alt={`${localizeSeriesTitle(series.title, search.lang)} trailer preview`}
                  sx={{ width: '100%', height: 320, display: 'block', objectFit: 'cover', filter: 'brightness(0.54) saturate(1.06)' }}
                />
                <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(11,26,44,0.12) 0%, rgba(11,26,44,0.82) 100%)' }} />
                <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 2, px: 3, color: '#f7fbff' }}>
                  <PlayCircleFilledWhiteRoundedIcon sx={{ fontSize: 72, filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.32))' }} />
                  <Typography sx={{ maxWidth: 360, fontWeight: 700, lineHeight: 1.65 }}>
                    {search.lang === 'en'
                      ? 'This exact video cannot be embedded right now, but the button below still opens the official trailer on YouTube.'
                      : 'Саме це відео зараз не можна вбудувати, але кнопка нижче все одно відкриє офіційний трейлер на YouTube.'}
                  </Typography>
                </Box>
              </Box>
            )}

            <Typography sx={{ mt: 1.4, color: '#55708e', lineHeight: 1.7 }}>
              {spotlight.trailerAvailable
                ? (search.lang === 'en'
                  ? 'The player works directly on the page, and the button below opens the same trailer on YouTube in a separate tab.'
                  : 'Плеєр працює прямо на сторінці, а кнопка нижче відкриє цей самий трейлер на YouTube в окремій вкладці.')
                : (search.lang === 'en'
                  ? 'The YouTube player is blocked only for this exact trailer. Use the button below as a fallback.'
                  : 'YouTube-плеєр заблокований лише для цього конкретного трейлера. Використай кнопку нижче як запасний варіант.')}
            </Typography>
            <Button
              component="a"
              href={spotlight.trailerSearchUrl}
              target="_blank"
              rel="noreferrer"
              variant="contained"
              sx={{ mt: 2, borderRadius: 999, px: 2.3, py: 1.1, background: 'linear-gradient(135deg, #ff7a18 0%, #ff5b2e 100%)', boxShadow: '0 16px 28px rgba(255, 104, 42, 0.24)' }}
            >
              {search.lang === 'en' ? 'Open trailer on YouTube' : 'Відкрити трейлер на YouTube'}
            </Button>
          </Box>
        </Box>
      )}

      {!createMode && series && <SeriesReviewsPanel series={series} />}
      <Snackbar open={!!snackbar} autoHideDuration={3000} onClose={() => setSnackbar('')} message={snackbar} />
    </Container>
  );
}
