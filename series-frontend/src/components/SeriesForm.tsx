'use client';

import { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Checkbox, FormControlLabel, Grid, MenuItem, TextField } from '@mui/material';
import { useIntl } from 'react-intl';
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
};

export default function SeriesForm({ series, studios, mode, onSubmit, onCancel }: {
  series?: Series;
  studios: Studio[];
  mode: 'view' | 'edit' | 'create';
  onSubmit: (data: SeriesRequest) => Promise<void>;
  onCancel: () => void;
}) {
  const intl = useIntl();
  const initial = useMemo<SeriesRequest>(() => series ? {
    title: series.title,
    genre: series.genre,
    seasons: series.seasons,
    rating: series.rating,
    year: series.year,
    finished: series.finished,
    studioId: series.studio?.id || 0,
  } : empty, [series]);

  const [form, setForm] = useState<SeriesRequest>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState('');
  const readonly = mode === 'view';

  useEffect(() => {
    setForm(initial);
    setErrors({});
    setServerError('');
  }, [initial]);

  const validate = () => {
    const next: Errors = {};
    if (form.title.trim().length < 2 || form.title.trim().length > 120) next.title = intl.formatMessage({ id: 'validation.title' });
    if (form.genre.trim().length < 2 || form.genre.trim().length > 80) next.genre = intl.formatMessage({ id: 'validation.genre' });
    if (form.year < 1950 || form.year > 2100) next.year = intl.formatMessage({ id: 'validation.year' });
    if (form.rating < 0 || form.rating > 10) next.rating = intl.formatMessage({ id: 'validation.rating' });
    if (form.seasons < 1 || form.seasons > 60) next.seasons = intl.formatMessage({ id: 'validation.seasons' });
    if (!form.studioId) next.studioId = intl.formatMessage({ id: 'validation.required' });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async () => {
    setServerError('');
    if (!validate()) return;
    try {
      await onSubmit({ ...form, title: form.title.trim(), genre: form.genre.trim() });
    } catch (error) {
      setServerError(error instanceof Error ? error.message : intl.formatMessage({ id: 'series.save.error' }));
    }
  };

  const handleCancel = () => {
    setForm(initial);
    setErrors({});
    setServerError('');
    onCancel();
  };

  return (
    <Card>
      <CardContent>
        {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth disabled={readonly} label={intl.formatMessage({ id: 'series.title' })} value={form.title} error={!!errors.title} helperText={errors.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth disabled={readonly} label={intl.formatMessage({ id: 'series.genre' })} value={form.genre} error={!!errors.genre} helperText={errors.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} /></Grid>
          <Grid size={{ xs: 12, sm: 3 }}><TextField fullWidth disabled={readonly} type="number" label={intl.formatMessage({ id: 'series.seasons' })} value={form.seasons} error={!!errors.seasons} helperText={errors.seasons} onChange={(e) => setForm({ ...form, seasons: Number(e.target.value) })} /></Grid>
          <Grid size={{ xs: 12, sm: 3 }}><TextField fullWidth disabled={readonly} type="number" inputProps={{ step: 0.1 }} label={intl.formatMessage({ id: 'series.rating' })} value={form.rating} error={!!errors.rating} helperText={errors.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} /></Grid>
          <Grid size={{ xs: 12, sm: 3 }}><TextField fullWidth disabled={readonly} type="number" label={intl.formatMessage({ id: 'series.year' })} value={form.year} error={!!errors.year} helperText={errors.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} /></Grid>
          <Grid size={{ xs: 12, sm: 3 }}><TextField fullWidth select disabled={readonly} label={intl.formatMessage({ id: 'series.studio' })} value={form.studioId || ''} error={!!errors.studioId} helperText={errors.studioId} onChange={(e) => setForm({ ...form, studioId: Number(e.target.value) })}>{studios.map((studio) => <MenuItem key={studio.id} value={studio.id}>{studio.name}</MenuItem>)}</TextField></Grid>
          <Grid size={{ xs: 12 }}><FormControlLabel control={<Checkbox disabled={readonly} checked={form.finished} onChange={(e) => setForm({ ...form, finished: e.target.checked })} />} label={intl.formatMessage({ id: 'series.finished' })} /></Grid>
        </Grid>
        {!readonly && <Box sx={{ display: 'flex', gap: 2, mt: 3 }}><Button variant="contained" onClick={submit}>{intl.formatMessage({ id: mode === 'create' ? 'series.create' : 'series.save' })}</Button><Button variant="outlined" onClick={handleCancel}>{intl.formatMessage({ id: 'series.cancel' })}</Button></Box>}
      </CardContent>
    </Card>
  );
}
