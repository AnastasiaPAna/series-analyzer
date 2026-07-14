'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import { useIntl } from 'react-intl';
import { GENRE_OPTIONS, MAX_SELECTED_GENRES } from '@/constants/genres';
import { useLocationSearch } from '@/hooks/useLocationSearch';
import { localizeGenre, localizeSeriesTitle } from '@/lib/series-localization';
import type { Series, SeriesRequest, Studio } from '@/types/series';

type Errors = Partial<Record<keyof SeriesRequest, string>>;

const empty: SeriesRequest = {
  title: '',
  genre: '',
  seasons: 1,
  rating: 0,
  year: new Date().getFullYear(),
  finished: false,
  studioId: 0,
  trailerUrl: '',
};

function isValidYouTubeUrl(value: string) {
  if (!value.trim()) {
    return true;
  }

  try {
    const url = new URL(value);
    return ['youtube.com', 'www.youtube.com', 'youtu.be', 'm.youtube.com'].includes(url.hostname);
  } catch {
    return false;
  }
}

export default function SeriesForm({ series, studios, mode, onSubmit, onCancel }: {
  series?: Series;
  studios: Studio[];
  mode: 'view' | 'edit' | 'create';
  onSubmit: (data: SeriesRequest) => Promise<void>;
  onCancel: () => void;
}) {
  const intl = useIntl();
  const search = useLocationSearch();
  const trailerLabel = search.lang === 'en' ? 'YouTube trailer link' : 'Посилання на YouTube трейлер';
  const trailerHint = search.lang === 'en'
    ? 'Paste a YouTube link here to show the exact trailer in the player.'
    : 'Встав сюди посилання на YouTube, щоб у плеєрі показувався саме цей трейлер.';
  const trailerErrorText = search.lang === 'en'
    ? 'Use a valid YouTube link.'
    : 'Використай коректне посилання на YouTube.';

  const initial = useMemo<SeriesRequest>(() => series ? {
    title: series.title,
    genre: series.genre,
    seasons: series.seasons,
    rating: series.rating,
    year: series.year,
    finished: series.finished,
    studioId: series.studio?.id || 0,
    trailerUrl: series.trailerUrl || '',
  } : empty, [series]);

  const [form, setForm] = useState<SeriesRequest>(initial);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState('');
  const readonly = mode === 'view';
  const displayTitle = readonly ? localizeSeriesTitle(form.title, search.lang) : form.title;
  const displayGenre = readonly ? localizeGenre(form.genre, search.lang) : form.genre;

  useEffect(() => {
    setForm(initial);
    setSelectedGenres(
      initial.genre
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean)
    );
    setErrors({});
    setServerError('');
  }, [initial]);

  const genreOptions = useMemo(
    () => [...new Set([...GENRE_OPTIONS, ...selectedGenres])],
    [selectedGenres]
  );

  const validate = () => {
    const next: Errors = {};
    if (form.title.trim().length < 2 || form.title.trim().length > 120) next.title = intl.formatMessage({ id: 'validation.title' });
    if (selectedGenres.length < 1 || selectedGenres.length > MAX_SELECTED_GENRES) next.genre = intl.formatMessage({ id: 'validation.genre' });
    if (form.year < 1950 || form.year > 2100) next.year = intl.formatMessage({ id: 'validation.year' });
    if (form.rating < 0 || form.rating > 10) next.rating = intl.formatMessage({ id: 'validation.rating' });
    if (form.seasons < 1 || form.seasons > 60) next.seasons = intl.formatMessage({ id: 'validation.seasons' });
    if (!form.studioId) next.studioId = intl.formatMessage({ id: 'validation.required' });
    if (!isValidYouTubeUrl(form.trailerUrl)) next.trailerUrl = trailerErrorText;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async () => {
    setServerError('');
    if (!validate()) return;
    try {
      await onSubmit({
        ...form,
        title: form.title.trim(),
        genre: selectedGenres.join(', '),
        trailerUrl: form.trailerUrl.trim(),
      });
    } catch (error) {
      setServerError(error instanceof Error ? error.message : intl.formatMessage({ id: 'series.save.error' }));
    }
  };

  const handleCancel = () => {
    setForm(initial);
    setSelectedGenres(
      initial.genre
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean)
    );
    setErrors({});
    setServerError('');
    onCancel();
  };

  const handleGenreChange = (_: unknown, values: string[]) => {
    if (values.length > MAX_SELECTED_GENRES) {
      return;
    }

    setSelectedGenres(values);
    setForm((current) => ({ ...current, genre: values.join(', ') }));
  };

  const setBoundedNumber = (
    value: string,
    min: number,
    max: number,
    setter: (next: number) => void
  ) => {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) {
      return;
    }

    setter(Math.max(min, Math.min(max, parsed)));
  };

  return (
    <Card>
      <CardContent>
        {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              disabled={readonly}
              label={intl.formatMessage({ id: 'series.title' })}
              value={displayTitle}
              error={!!errors.title}
              helperText={errors.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            {readonly ? (
              <TextField fullWidth disabled label={intl.formatMessage({ id: 'series.genre' })} value={displayGenre} />
            ) : (
              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {intl.formatMessage({ id: 'series.genre' })}
                </Typography>
                <ToggleButtonGroup value={selectedGenres} onChange={handleGenreChange} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {genreOptions.map((genre) => (
                    <ToggleButton key={genre} value={genre} sx={{ borderRadius: 3, textTransform: 'none' }}>
                      {localizeGenre(genre, search.lang)}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
                <Typography variant="caption" color={errors.genre ? 'error' : 'text.secondary'}>
                  {errors.genre || intl.formatMessage({ id: 'series.genre.limit' })}
                </Typography>
              </Stack>
            )}
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              disabled={readonly}
              label={trailerLabel}
              placeholder="https://www.youtube.com/watch?v=..."
              value={form.trailerUrl}
              error={!!errors.trailerUrl}
              helperText={errors.trailerUrl || trailerHint}
              onChange={(e) => setForm({ ...form, trailerUrl: e.target.value })}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              fullWidth
              disabled={readonly}
              type="number"
              inputProps={{ min: 1, max: 60 }}
              label={intl.formatMessage({ id: 'series.seasons' })}
              value={form.seasons}
              error={!!errors.seasons}
              helperText={errors.seasons}
              onChange={(e) => setBoundedNumber(e.target.value, 1, 60, (next) => setForm({ ...form, seasons: next }))}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              fullWidth
              disabled={readonly}
              type="number"
              inputProps={{ min: 0, max: 10, step: 0.1 }}
              label={intl.formatMessage({ id: 'series.rating' })}
              value={form.rating}
              error={!!errors.rating}
              helperText={errors.rating}
              onChange={(e) => setBoundedNumber(e.target.value, 0, 10, (next) => setForm({ ...form, rating: next }))}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              fullWidth
              disabled={readonly}
              type="number"
              inputProps={{ min: 1950, max: 2100 }}
              label={intl.formatMessage({ id: 'series.year' })}
              value={form.year}
              error={!!errors.year}
              helperText={errors.year}
              onChange={(e) => setBoundedNumber(e.target.value, 1950, 2100, (next) => setForm({ ...form, year: next }))}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              fullWidth
              select
              disabled={readonly}
              label={intl.formatMessage({ id: 'series.studio' })}
              value={form.studioId || ''}
              error={!!errors.studioId}
              helperText={errors.studioId}
              onChange={(e) => setForm({ ...form, studioId: Number(e.target.value) })}
            >
              {studios.map((studio) => <MenuItem key={studio.id} value={studio.id}>{studio.name}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormControlLabel
              control={<Checkbox disabled={readonly} checked={form.finished} onChange={(e) => setForm({ ...form, finished: e.target.checked })} />}
              label={intl.formatMessage({ id: 'series.finished' })}
            />
          </Grid>
        </Grid>
        {!readonly && (
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button variant="contained" onClick={submit}>{intl.formatMessage({ id: mode === 'create' ? 'series.create' : 'series.save' })}</Button>
            <Button variant="outlined" onClick={handleCancel}>{intl.formatMessage({ id: 'series.cancel' })}</Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
