'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Container, Grid, Stack, Typography } from '@mui/material';
import { useIntl } from 'react-intl';
import { SERIES_LIST, SERIES_NEW, STATISTICS_PAGE, TOP_PAGE } from '@/constants/pages';
import { useAdminMode } from '@/hooks/useAdminMode';
import { useLocationSearch } from '@/hooks/useLocationSearch';
import { api } from '@/lib/api';
import { localizeGenre, localizeSeriesTitle } from '@/lib/series-localization';
import type { Review, Series, Studio } from '@/types/series';

export default function HomePage() {
  const intl = useIntl();
  const search = useLocationSearch();
  const { isAdmin } = useAdminMode();
  const [series, setSeries] = useState<Series[]>([]);
  const [studios, setStudios] = useState<Studio[]>([]);
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setError('');
        const [seriesResult, studiosResult, reviewsResult] = await Promise.all([
          api.getAllSeries(),
          api.listStudios(),
          api.listRecentReviews(3),
        ]);
        setSeries(seriesResult);
        setStudios(studiosResult);
        setRecentReviews(reviewsResult);
      } catch (e) {
        setError(e instanceof Error ? e.message : intl.formatMessage({ id: 'series.load.error' }));
      }
    };

    load();
  }, [intl]);

  const metrics = useMemo(() => {
    const averageRating = series.length
      ? (series.reduce((sum, item) => sum + item.rating, 0) / series.length).toFixed(1)
      : '0.0';

    return [
      { label: intl.formatMessage({ id: 'home.metrics.series' }), value: series.length },
      { label: intl.formatMessage({ id: 'home.metrics.studios' }), value: studios.length },
      { label: intl.formatMessage({ id: 'home.metrics.rating' }), value: averageRating },
      { label: intl.formatMessage({ id: 'home.metrics.finished' }), value: series.filter((item) => item.finished).length },
    ];
  }, [intl, series, studios.length]);

  const topThree = [...series].sort((a, b) => b.rating - a.rating).slice(0, 3);
  const withLang = (path: string) => `${path}?lang=${search.lang}`;
  const seriesTitles = useMemo(
    () => Object.fromEntries(series.map((item) => [item.id, localizeSeriesTitle(item.title, search.lang)])),
    [search.lang, series]
  );

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #0f2744 0%, #184d7a 100%)', color: '#fff' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="overline" sx={{ letterSpacing: 2, opacity: 0.8 }}>
                {intl.formatMessage({ id: 'home.kicker' })}
              </Typography>
              <Typography variant="h2" sx={{ mt: 1, mb: 2, fontSize: { xs: '2.6rem', md: '4rem' }, fontWeight: 800, lineHeight: 1 }}>
                {intl.formatMessage({ id: 'home.title' })}
              </Typography>
              <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
                {intl.formatMessage({ id: 'home.subtitle' })}
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button component={Link} href={withLang(SERIES_LIST)} variant="contained" color="warning">
                  {intl.formatMessage({ id: 'home.catalog' })}
                </Button>
                <Button component={Link} href={withLang(STATISTICS_PAGE)} variant="outlined" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.45)' }}>
                  {intl.formatMessage({ id: 'home.statistics' })}
                </Button>
                {isAdmin && (
                  <Button component={Link} href={withLang(SERIES_NEW)} variant="outlined" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.45)' }}>
                    {intl.formatMessage({ id: 'home.create' })}
                  </Button>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Grid container spacing={2}>
            {metrics.map((metric) => (
              <Grid key={metric.label} size={{ xs: 6 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="overline" color="text.secondary">{metric.label}</Typography>
                    <Typography variant="h3" fontWeight={800}>{metric.value}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}

      <Grid container spacing={3} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                {intl.formatMessage({ id: 'home.aboutTitle' })}
              </Typography>
              <Typography color="text.secondary">
                {intl.formatMessage({ id: 'home.aboutText' })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                {intl.formatMessage({ id: 'home.topTitle' })}
              </Typography>
              <Stack spacing={1.5}>
                {topThree.map((item, index) => (
                  <Box key={item.id} sx={{ p: 1.5, borderRadius: 2, bgcolor: 'grey.100' }}>
                    <Typography fontWeight={700}>{index + 1}. {localizeSeriesTitle(item.title, search.lang)}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {localizeGenre(item.genre, search.lang)} • {item.rating}
                    </Typography>
                  </Box>
                ))}
                <Button component={Link} href={withLang(TOP_PAGE)} variant="text">
                  {intl.formatMessage({ id: 'home.openTop' })}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
            {intl.formatMessage({ id: 'home.reviewsTitle' })}
          </Typography>
          <Stack spacing={1.5}>
            {recentReviews.length ? recentReviews.map((review) => (
              <Box key={`${review.id || review.publishedAt}-${review.reviewerName}`} sx={{ p: 1.5, borderRadius: 2, bgcolor: 'grey.100' }}>
                <Typography fontWeight={700}>
                  {review.reviewerName} — {intl.formatMessage({ id: 'home.reviewsSeriesLabel' })}:{' '}
                  {seriesTitles[review.seriesId] || `#${review.seriesId}`}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {new Date(review.publishedAt).toLocaleDateString('uk-UA')} • {review.rating.toFixed(1)}/10
                </Typography>
                <Typography sx={{ mb: 1 }}>{review.comment}</Typography>
                <Button
                  component={Link}
                  href={`/series/${review.seriesId}?lang=${search.lang}`}
                  size="small"
                  variant="text"
                  sx={{ px: 0 }}
                >
                  {intl.formatMessage({ id: 'home.openReviewSeries' })}
                </Button>
              </Box>
            )) : (
              <Typography color="text.secondary">
                {intl.formatMessage({ id: 'home.reviewsEmpty' })}
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
