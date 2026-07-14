'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import CasinoRoundedIcon from '@mui/icons-material/CasinoRounded';
import PlayCircleFilledWhiteRoundedIcon from '@mui/icons-material/PlayCircleFilledWhiteRounded';
import { useIntl } from 'react-intl';
import {
  PROFILE_PAGE,
  REVIEWS_PAGE,
  SERIES_LIST,
  SERIES_NEW,
  STATISTICS_PAGE,
  TOP_PAGE,
  seriesDetails,
} from '@/constants/pages';
import { useAdminMode } from '@/hooks/useAdminMode';
import { useLocationSearch } from '@/hooks/useLocationSearch';
import { api } from '@/lib/api';
import { getSeriesPosterDataUrl, getSeriesSpotlight } from '@/lib/series-details-metadata';
import { localizeGenre, localizeSeriesTitle } from '@/lib/series-localization';
import type { Review, Series, Studio } from '@/types/series';

type MoodOption = {
  id: string;
  emoji: string;
  uaLabel: string;
  enLabel: string;
  genres: string[];
};

const moodOptions: MoodOption[] = [
  { id: 'comfort', emoji: '☕', uaLabel: 'Хочу щось затишне', enLabel: 'Comfort mode', genres: ['Comedy', 'Drama', 'Romance', 'Medical Drama'] },
  { id: 'mystery', emoji: '🕵️', uaLabel: 'Хочу загадку', enLabel: 'Mystery hunt', genres: ['Mystery', 'Detective', 'Thriller', 'Crime'] },
  { id: 'magic', emoji: '✨', uaLabel: 'Хочу магію', enLabel: 'Magic vibe', genres: ['Fantasy', 'Adventure', 'Supernatural'] },
  { id: 'dark', emoji: '🩸', uaLabel: 'Хочу темне', enLabel: 'Dark night', genres: ['Horror', 'Thriller', 'Crime', 'Political Drama'] },
  { id: 'epic', emoji: '🐉', uaLabel: 'Хочу епік', enLabel: 'Epic scale', genres: ['Fantasy', 'Adventure', 'Science Fiction', 'Political Drama'] },
  { id: 'marvel', emoji: '🛡️', uaLabel: 'Хочу Marvel', enLabel: 'Marvel energy', genres: ['Marvel Universe'] },
  { id: 'mind', emoji: '🧠', uaLabel: 'Хочу щось розумне', enLabel: 'Brain mode', genres: ['Science Fiction', 'Mystery', 'Detective', 'Drama'] },
];

function formatReviewDate(value: string, language: string) {
  try {
    return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function HomePage() {
  const intl = useIntl();
  const search = useLocationSearch();
  const { isAdmin } = useAdminMode();
  const [series, setSeries] = useState<Series[]>([]);
  const [studios, setStudios] = useState<Studio[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState('');
  const [selectedMood, setSelectedMood] = useState('mystery');
  const [pickedSeriesId, setPickedSeriesId] = useState<number | null>(null);

  const moodText = search.lang === 'en'
    ? {
        kicker: 'Mood randomizer',
        title: 'Cannot decide what to watch?',
        subtitle: 'Pick a mood, roll the cube, and get a matching series with a poster, a quick vibe-check, and a trailer right on the page.',
        diceTitle: 'Mood dice',
        diceHint: 'Choose the emoji that fits your mood and let the site pick something for tonight.',
        randomize: 'Roll again',
        resultTitle: "Tonight's recommendation",
        trailer: 'Trailer for this pick',
        trailerHint: 'The trailer plays right on the page, and the button below opens the same video on YouTube in a separate tab.',
        openTrailer: 'Open trailer on YouTube',
        openSeries: 'Open series page',
        topTitle: 'Top right now',
        reviewsTitle: 'Latest reviews',
        reviewsEmpty: 'There are no fresh reviews yet.',
        aboutTitle: 'What is available right now',
        aboutText: 'Series list, details pages, filters, pagination, statistics, reviews, profile subscriptions, admin moderation, and email delivery control are available from one interface.',
      }
    : {
        kicker: 'Mood randomizer',
        title: 'Не можеш визначитися, що дивитися?',
        subtitle: 'Обери настрій, кинь кубик і отримай серіал під цей вайб: з постером, коротким описом і трейлером прямо на сторінці.',
        diceTitle: 'Кубик настрою',
        diceHint: 'Обери смайлик під свій настрій і дозволь сайту підібрати серіал на вечір.',
        randomize: 'Кинути ще раз',
        resultTitle: 'Рекомендація на цей вечір',
        trailer: 'Трейлер під настрій',
        trailerHint: 'Трейлер відтворюється прямо тут, а кнопка нижче відкриє це саме відео на YouTube в окремій вкладці.',
        openTrailer: 'Відкрити трейлер на YouTube',
        openSeries: 'Відкрити сторінку серіалу',
        topTitle: 'Найкращі зараз',
        reviewsTitle: 'Останні відгуки',
        reviewsEmpty: 'Поки що нових відгуків немає.',
        aboutTitle: 'Що доступно зараз',
        aboutText: 'Список серіалів, сторінки деталей, фільтри, пагінація, статистика, відгуки, профілі підписників, адмін-модерація та контроль email-розсилки доступні в одному інтерфейсі.',
      };

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
        setReviews(reviewsResult);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : intl.formatMessage({ id: 'series.load.error' }));
      }
    };

    load();
  }, [intl]);

  const stats = useMemo(() => {
    const averageRating = series.length
      ? (series.reduce((sum, item) => sum + item.rating, 0) / series.length).toFixed(1)
      : '0.0';
    const finishedCount = series.filter((item) => item.finished).length;

    return [
      { label: intl.formatMessage({ id: 'home.metrics.series' }), value: series.length },
      { label: intl.formatMessage({ id: 'home.metrics.studios' }), value: studios.length },
      { label: intl.formatMessage({ id: 'home.metrics.rating' }), value: averageRating },
      { label: intl.formatMessage({ id: 'home.metrics.finished' }), value: finishedCount },
    ];
  }, [intl, series, studios.length]);

  const topSeries = useMemo(
    () => [...series].sort((left, right) => right.rating - left.rating).slice(0, 5),
    [series],
  );

  const randomizeByMood = useCallback((moodId: string) => {
    const mood = moodOptions.find((item) => item.id === moodId) || moodOptions[0];
    const matching = series.filter(
      (item) => mood.genres.some((genre) => item.genre.includes(genre)) && !!item.trailerUrl,
    );
    const fallbackWithTrailer = series.filter((item) => !!item.trailerUrl);
    const pool = matching.length ? matching : (fallbackWithTrailer.length ? fallbackWithTrailer : series);

    if (!pool.length) {
      setPickedSeriesId(null);
      return;
    }

    const picked = pool[Math.floor(Math.random() * pool.length)];
    setPickedSeriesId(picked.id);
  }, [series]);

  useEffect(() => {
    if (!series.length) {
      return;
    }

    randomizeByMood(selectedMood);
  }, [randomizeByMood, selectedMood, series]);

  const pickedSeries = useMemo(
    () => series.find((item) => item.id === pickedSeriesId) || null,
    [pickedSeriesId, series],
  );

  const pickedMood = moodOptions.find((item) => item.id === selectedMood) || moodOptions[0];
  const canonicalEnglishTitle = pickedSeries ? localizeSeriesTitle(pickedSeries.title, 'en') : '';
  const spotlight = pickedSeries
    ? getSeriesSpotlight(
        {
          title: localizeSeriesTitle(pickedSeries.title, search.lang),
          genre: pickedSeries.genre,
          seasons: pickedSeries.seasons,
          year: pickedSeries.year,
          finished: pickedSeries.finished,
          studioName: pickedSeries.studio?.name,
          trailerUrl: pickedSeries.trailerUrl,
        },
        canonicalEnglishTitle,
        search.lang,
      )
    : null;

  const posterUrl = pickedSeries && spotlight
    ? getSeriesPosterDataUrl(
        {
          title: localizeSeriesTitle(pickedSeries.title, search.lang),
          genre: pickedSeries.genre,
          year: pickedSeries.year,
        },
        canonicalEnglishTitle,
        search.lang,
      )
    : '';

  return (
    <Container maxWidth="xl" sx={{ py: 4, overflowX: 'clip' }}>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 7 }} sx={{ minWidth: 0 }}>
          <Card
            sx={{
              height: '100%',
              color: 'common.white',
              background: 'linear-gradient(145deg, #1f3a66 0%, #31568b 100%)',
              boxShadow: '0 28px 60px rgba(49, 86, 139, 0.24)',
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
              <Typography variant="overline" sx={{ letterSpacing: 3, opacity: 0.78 }}>
                {intl.formatMessage({ id: 'home.kicker' })}
              </Typography>
              <Typography variant="h1" sx={{ mt: 1.5, mb: 2, fontSize: { xs: '3rem', md: '5rem' }, lineHeight: 1.02, fontWeight: 800 }}>
                {intl.formatMessage({ id: 'home.title' })}
              </Typography>
              <Typography sx={{ maxWidth: 760, fontSize: { xs: '1.05rem', md: '1.25rem' }, opacity: 0.92 }}>
                {intl.formatMessage({ id: 'home.subtitle' })}
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4, flexWrap: 'wrap' }}>
                <Button component={Link} href={`${SERIES_LIST}?lang=${search.lang}`} variant="contained" color="warning" size="large">
                  {intl.formatMessage({ id: 'home.catalog' })}
                </Button>
                <Button component={Link} href={`${STATISTICS_PAGE}?lang=${search.lang}`} variant="outlined" color="inherit" size="large">
                  {intl.formatMessage({ id: 'home.statistics' })}
                </Button>
                {isAdmin && (
                  <Button component={Link} href={`${SERIES_NEW}?lang=${search.lang}`} variant="outlined" color="inherit" size="large">
                    {intl.formatMessage({ id: 'home.create' })}
                  </Button>
                )}
                <Button component={Link} href={`${PROFILE_PAGE}?lang=${search.lang}`} variant="outlined" color="inherit" size="large">
                  {intl.formatMessage({ id: 'home.profile' })}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Grid container spacing={3}>
            {stats.map((item) => (
              <Grid key={item.label} size={{ xs: 6 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="overline" color="text.secondary">
                      {item.label}
                    </Typography>
                    <Typography variant="h2" fontWeight={800}>
                      {item.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Card sx={{ mt: 3, overflow: 'hidden', background: 'linear-gradient(180deg, rgba(234,244,255,0.98) 0%, rgba(220,235,255,0.95) 100%)' }}>
        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
          <Grid container spacing={3} alignItems="stretch">
            <Grid size={{ xs: 12, lg: 7 }}>
              <Typography variant="overline" sx={{ letterSpacing: 3, color: '#59708b', fontWeight: 700 }}>
                {moodText.kicker}
              </Typography>
              <Typography variant="h2" fontWeight={800} sx={{ mt: 1, color: '#14233a', maxWidth: 680, fontSize: { xs: '2.55rem', sm: '3.4rem', md: '4.25rem' }, lineHeight: 1.03, overflowWrap: 'anywhere' }}>
                {moodText.title}
              </Typography>
              <Typography sx={{ mt: 1.5, maxWidth: 700, color: '#5b7088', fontSize: '1.08rem', lineHeight: 1.7 }}>
                {moodText.subtitle}
              </Typography>

              <Card sx={{ mt: 3, borderRadius: 5, background: 'linear-gradient(145deg, #204277 0%, #2f5a95 100%)', color: '#f7fbff', boxShadow: '0 24px 46px rgba(26, 53, 93, 0.26)' }}>
                <CardContent sx={{ px: { xs: 3, sm: 4 }, py: { xs: 3, sm: 3.5 } }}>
                  <Typography variant="overline" sx={{ display: 'block', pl: 0.5, letterSpacing: { xs: '0.12em', sm: '0.18em' }, opacity: 0.82, fontWeight: 700 }}>
                    {moodText.diceTitle}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                    <Box sx={{ width: 110, height: 110, borderRadius: '32px', display: 'grid', placeItems: 'center', fontSize: '3.3rem', background: 'radial-gradient(circle at 30% 30%, #ffb566 0%, #ff7a18 48%, #7c90ff 100%)', boxShadow: '0 24px 40px rgba(9, 18, 37, 0.28)' }}>
                      {pickedMood.emoji}
                    </Box>
                  </Box>
                  <Typography sx={{ textAlign: 'center', color: 'rgba(247,251,255,0.88)', maxWidth: 520, mx: 'auto', lineHeight: 1.7 }}>
                    {moodText.diceHint}
                  </Typography>
                  <Button
                    startIcon={<CasinoRoundedIcon />}
                    onClick={() => randomizeByMood(selectedMood)}
                    variant="contained"
                    sx={{
                      mt: 3,
                      width: '100%',
                      borderRadius: 999,
                      py: 1.2,
                      background: 'linear-gradient(135deg, #ff7a18 0%, #ff5b2e 100%)',
                      boxShadow: '0 16px 28px rgba(255, 104, 42, 0.24)',
                    }}
                  >
                    {moodText.randomize}
                  </Button>
                </CardContent>
              </Card>

              <Grid container spacing={1.5} sx={{ mt: 1.5 }}>
                {moodOptions.map((option) => {
                  const active = option.id === selectedMood;
                  return (
                    <Grid key={option.id} size={{ xs: 6, sm: 4 }}>
                      <Card
                        onClick={() => {
                          setSelectedMood(option.id);
                          randomizeByMood(option.id);
                        }}
                        sx={{
                          cursor: 'pointer',
                          borderRadius: 4,
                          border: active ? '1px solid rgba(255,120,24,0.64)' : '1px solid rgba(120, 151, 194, 0.18)',
                          background: active
                            ? 'linear-gradient(135deg, rgba(255,122,24,0.98) 0%, rgba(255,91,46,0.95) 55%, rgba(92,111,226,0.88) 100%)'
                            : 'rgba(255,255,255,0.84)',
                          color: active ? '#ffffff' : '#244267',
                          transform: active ? 'translateY(-2px)' : 'none',
                          transition: 'all 180ms ease',
                          '&:hover': {
                            transform: 'translateY(-3px)',
                            boxShadow: active
                              ? '0 20px 34px rgba(255, 104, 42, 0.26)'
                              : '0 16px 28px rgba(65, 98, 146, 0.18)',
                          },
                        }}
                      >
                        <CardContent sx={{ py: 2.1 }}>
                          <Typography sx={{ fontSize: '1.8rem', mb: 0.8 }}>{option.emoji}</Typography>
                          <Typography fontWeight={800} sx={{ lineHeight: 1.25 }}>
                            {search.lang === 'en' ? option.enLabel : option.uaLabel}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>

            {pickedSeries && spotlight && (
              <Grid size={{ xs: 12, lg: 5 }}>
                <Stack spacing={3}>
                  <Card sx={{ borderRadius: 5, overflow: 'hidden', background: 'rgba(255,255,255,0.85)' }}>
                    <Grid container>
                      <Grid size={{ xs: 12, md: 5 }}>
                        <Box component="img" src={posterUrl} alt={localizeSeriesTitle(pickedSeries.title, search.lang)} sx={{ width: '100%', height: '100%', minHeight: 320, objectFit: 'cover' }} />
                      </Grid>
                      <Grid size={{ xs: 12, md: 7 }}>
                        <CardContent sx={{ p: 3 }}>
                          <Typography variant="overline" sx={{ letterSpacing: 3, color: '#6b7f98', fontWeight: 700 }}>
                            {moodText.resultTitle}
                          </Typography>
                          <Typography variant="h3" fontWeight={800} sx={{ mt: 1.2, color: '#162640' }}>
                            {localizeSeriesTitle(pickedSeries.title, search.lang)}
                          </Typography>
                          <Typography sx={{ mt: 1, color: '#60738b', fontWeight: 600 }}>
                            {localizeGenre(pickedSeries.genre, search.lang)} {'•'} {pickedSeries.rating.toFixed(1)}/10 {'•'} {pickedSeries.year}
                          </Typography>
                          <Typography sx={{ mt: 1.8, color: '#324a67', lineHeight: 1.75 }}>
                            {spotlight.description}
                          </Typography>
                          <Button
                            component={Link}
                            href={`${seriesDetails(pickedSeries.id)}?lang=${search.lang}`}
                            variant="contained"
                            sx={{ mt: 2.3, borderRadius: 999, px: 2.3, background: 'linear-gradient(135deg, #ff7a18 0%, #ff5b2e 100%)' }}
                          >
                            {moodText.openSeries}
                          </Button>
                        </CardContent>
                      </Grid>
                    </Grid>
                  </Card>

                  <Card sx={{ borderRadius: 4, background: 'rgba(255,255,255,0.84)', border: '1px solid rgba(84, 124, 183, 0.18)' }}>
                    <CardContent>
                      <Typography variant="h5" fontWeight={800} sx={{ mb: 2, color: '#14233a' }}>
                        {moodText.trailer}
                      </Typography>
                      {spotlight.trailerAvailable ? (
                        <Box sx={{ overflow: 'hidden', borderRadius: 3, border: '1px solid rgba(73, 118, 175, 0.16)', boxShadow: '0 18px 36px rgba(20, 37, 60, 0.16)', bgcolor: '#0f1c31' }}>
                          <Box
                            component="iframe"
                            key={spotlight.trailerEmbedUrl}
                            src={spotlight.trailerEmbedUrl}
                            title={`${localizeSeriesTitle(pickedSeries.title, search.lang)} trailer`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            referrerPolicy="strict-origin-when-cross-origin"
                            sx={{ width: '100%', height: { xs: 260, md: 320 }, border: 0, display: 'block' }}
                          />
                        </Box>
                      ) : (
                        <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: 3, border: '1px solid rgba(73, 118, 175, 0.16)', boxShadow: '0 18px 36px rgba(20, 37, 60, 0.16)', bgcolor: '#112133', minHeight: 320 }}>
                          <Box component="img" src={posterUrl} alt={`${localizeSeriesTitle(pickedSeries.title, search.lang)} trailer preview`} sx={{ width: '100%', height: 320, display: 'block', objectFit: 'cover', filter: 'brightness(0.56) saturate(1.08)' }} />
                          <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(11,26,44,0.14) 0%, rgba(11,26,44,0.78) 100%)' }} />
                          <Stack spacing={1.6} sx={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center', textAlign: 'center', px: 3, color: '#f7fbff' }}>
                            <PlayCircleFilledWhiteRoundedIcon sx={{ fontSize: 72, filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.32))' }} />
                            <Typography sx={{ maxWidth: 420, fontWeight: 700, lineHeight: 1.65 }}>
                              {search.lang === 'en'
                                ? 'The trailer is loading from YouTube. If it does not appear, use the button below to open it directly.'
                                : "Трейлер завантажується з YouTube. Якщо саме це відео не з’явиться, відкрий його кнопкою нижче."}
                            </Typography>
                          </Stack>
                        </Box>
                      )}
                      <Typography sx={{ mt: 1.4, color: '#55708e', lineHeight: 1.7 }}>
                        {spotlight.trailerAvailable
                          ? (search.lang === 'en'
                            ? 'The trailer plays right here, and the button below opens it on YouTube in a separate tab.'
                            : 'Трейлер відтворюється прямо тут, а кнопка нижче відкриє його на YouTube у повному вікні.')
                          : moodText.trailerHint}
                      </Typography>
                      <Button component="a" href={spotlight.trailerSearchUrl} target="_blank" rel="noreferrer" variant="contained" sx={{ mt: 2, borderRadius: 999, background: 'linear-gradient(135deg, #ff7a18 0%, #ff5b2e 100%)', boxShadow: '0 16px 28px rgba(255, 104, 42, 0.24)' }}>
                        {moodText.openTrailer}
                      </Button>
                    </CardContent>
                  </Card>
                </Stack>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
                {moodText.aboutTitle}
              </Typography>
              <Typography color="text.secondary">
                {moodText.aboutText}
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 3 }}>
                <Button component={Link} href={`${SERIES_LIST}?lang=${search.lang}`} variant="outlined">{intl.formatMessage({ id: 'home.catalog' })}</Button>
                <Button component={Link} href={`${REVIEWS_PAGE}?lang=${search.lang}`} variant="outlined">Reviews</Button>
                <Button component={Link} href={`${TOP_PAGE}?lang=${search.lang}`} variant="outlined">Top 5</Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h4" fontWeight={800} sx={{ mb: 2 }}>
                {moodText.topTitle}
              </Typography>
              <Stack spacing={1.5}>
                {topSeries.map((item) => (
                  <Box key={item.id}>
                    <Typography fontWeight={700}>{localizeSeriesTitle(item.title, search.lang)}</Typography>
                    <Typography color="text.secondary">
                      {localizeGenre(item.genre, search.lang)} {'•'} {item.rating.toFixed(1)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h4" fontWeight={800} sx={{ mb: 2 }}>
            {moodText.reviewsTitle}
          </Typography>
          {reviews.length ? (
            <Grid container spacing={2}>
              {reviews.map((review) => (
                <Grid key={review.id} size={{ xs: 12, md: 4 }}>
                  <Card sx={{ height: '100%', border: '1px solid rgba(92, 121, 164, 0.14)' }}>
                    <CardContent>
                      <Typography fontWeight={800}>{review.reviewerName}</Typography>
                      <Typography sx={{ color: '#4f6f9f', fontWeight: 700, mt: 0.5 }}>{review.rating.toFixed(1)}/10</Typography>
                      <Typography sx={{ mt: 1.2, color: 'text.secondary', lineHeight: 1.65 }}>{review.comment}</Typography>
                      <Chip size="small" label={formatReviewDate(review.publishedAt, search.lang)} sx={{ mt: 2 }} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography color="text.secondary">{moodText.reviewsEmpty}</Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}




