'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useIntl } from 'react-intl';
import { api } from '@/lib/api';
import type { Review, ReviewRequest, Series } from '@/types/series';

const emptyForm = {
  reviewerName: '',
  comment: '',
  rating: 5,
};

export default function SeriesReviewsPanel({ series }: { series: Series }) {
  const intl = useIntl();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');

  const load = async (from = 0, append = false) => {
    try {
      const next = await api.listReviews(series.id, 5, from);
      setReviews((current) => append ? [...current, ...next] : next);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : intl.formatMessage({ id: 'reviews.loadError' }));
    }
  };

  useEffect(() => {
    load();
  }, [series.id]);

  const canShowMore = reviews.length > 0 && reviews.length % 5 === 0;

  const average = useMemo(() => {
    if (!reviews.length) return '0.0';
    return (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1);
  }, [reviews]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setFormError('');
      const payload: ReviewRequest = {
        seriesId: series.id,
        reviewerName: form.reviewerName.trim(),
        comment: form.comment.trim(),
        rating: form.rating,
      };
      await api.createReview(payload);
      setOpen(false);
      setForm(emptyForm);
      await load();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : intl.formatMessage({ id: 'reviews.saveError' }));
    }
  };

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      await load(reviews.length, true);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight={700}>{intl.formatMessage({ id: 'reviews.sectionTitle' })}</Typography>
            <Typography color="text.secondary">
              {intl.formatMessage({ id: 'reviews.summary' }, { count: reviews.length, rating: average })}
            </Typography>
          </Box>
          <Button variant="contained" onClick={() => setOpen(true)}>
            {intl.formatMessage({ id: 'reviews.add' })}
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack spacing={2}>
          {reviews.map((review) => (
            <Card key={`${review._id || review.publishedAt}-${review.reviewerName}`} variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 1 }}>
                  <Typography fontWeight={700}>{review.reviewerName}</Typography>
                  <Typography color="text.secondary">
                    {new Date(review.publishedAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Rating value={review.rating / 2} precision={0.5} readOnly sx={{ mb: 1 }} />
                <Typography>{review.comment}</Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>

        {!reviews.length && !error && (
          <Typography color="text.secondary">
            {intl.formatMessage({ id: 'reviews.empty' })}
          </Typography>
        )}

        {canShowMore && (
          <Button sx={{ mt: 3 }} variant="outlined" onClick={loadMore} disabled={loadingMore}>
            {intl.formatMessage({ id: 'reviews.showMore' })}
          </Button>
        )}
      </CardContent>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{intl.formatMessage({ id: 'reviews.add' })}</DialogTitle>
        <DialogContent dividers>
          <Box component="form" id="review-form" onSubmit={submit}>
            <Stack spacing={2}>
              <TextField
                label={intl.formatMessage({ id: 'reviews.reviewer' })}
                value={form.reviewerName}
                onChange={(event) => setForm({ ...form, reviewerName: event.target.value })}
                required
              />
              <TextField
                label={intl.formatMessage({ id: 'reviews.comment' })}
                value={form.comment}
                onChange={(event) => setForm({ ...form, comment: event.target.value })}
                multiline
                minRows={4}
                required
              />
              <TextField
                type="number"
                label={intl.formatMessage({ id: 'reviews.rating' })}
                value={form.rating}
                inputProps={{ min: 1, max: 10, step: 0.1 }}
                onChange={(event) => setForm({ ...form, rating: Number(event.target.value) })}
                required
              />
              {formError && <Alert severity="error">{formError}</Alert>}
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>{intl.formatMessage({ id: 'series.cancel' })}</Button>
          <Button type="submit" form="review-form" variant="contained">{intl.formatMessage({ id: 'reviews.save' })}</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
