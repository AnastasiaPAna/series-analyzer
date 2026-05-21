'use client';

import { FormEvent, useState } from 'react';
import { Button, Card, CardContent, Grid, MenuItem, TextField } from '@mui/material';
import { useIntl } from 'react-intl';
import type { Studio } from '@/types/series';
import type { LocationSearch } from '@/hooks/useLocationSearch';

export default function SeriesFilters({ search, studios, onApply, onClear }: {
  search: LocationSearch;
  studios: Studio[];
  onApply: (values: Pick<LocationSearch, 'genre' | 'year' | 'minRating' | 'studioId'>) => void;
  onClear: () => void;
}) {
  const intl = useIntl();
  const [genre, setGenre] = useState(search.genre);
  const [year, setYear] = useState(search.year);
  const [minRating, setMinRating] = useState(search.minRating);
  const [studioId, setStudioId] = useState(search.studioId);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onApply({ genre, year, minRating, studioId });
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent component="form" onSubmit={submit}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth label={intl.formatMessage({ id: 'series.genre' })} value={genre} onChange={(e) => setGenre(e.target.value)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }}>
            <TextField fullWidth type="number" label={intl.formatMessage({ id: 'series.year' })} value={year} onChange={(e) => setYear(e.target.value)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }}>
            <TextField fullWidth type="number" label={intl.formatMessage({ id: 'series.rating' })} value={minRating} onChange={(e) => setMinRating(e.target.value)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth select label={intl.formatMessage({ id: 'series.studio' })} value={studioId} onChange={(e) => setStudioId(e.target.value)}>
              <MenuItem value="">-</MenuItem>
              {studios.map((studio) => <MenuItem key={studio.id} value={studio.id}>{studio.name}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }} sx={{ display: 'flex', gap: 1 }}>
            <Button type="submit" variant="contained">{intl.formatMessage({ id: 'series.filter' })}</Button>
            <Button variant="outlined" onClick={onClear}>{intl.formatMessage({ id: 'series.clear' })}</Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
