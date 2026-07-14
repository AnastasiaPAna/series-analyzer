'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { DEVELOPER_PAGE, HOME_PAGE, seriesDetails } from '@/constants/pages';
import { useAdminMode } from '@/hooks/useAdminMode';
import { useLocationSearch } from '@/hooks/useLocationSearch';
import { api } from '@/lib/api';
import { localizeSeriesTitle } from '@/lib/series-localization';
import type { Review, ReviewRequest, Series } from '@/types/series';

const emptyForm = {
  reviewId: '',
  seriesId: 0,
  reviewerName: '',
  comment: '',
  rating: 5,
};

export default function AllReviewsPage() {
  const search = useLocationSearch();
  const { isAdmin } = useAdminMode();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [form, setForm] = useState(emptyForm);

  const text = search.lang === 'en'
    ? {
        title: 'All reviews',
        subtitle: 'Moderate the latest reviews from the frontend instead of embedding HTML inside the reviews service.',
        denied: 'Admin login is required to open review moderation.',
        back: 'Back to home',
        developer: 'Developer',
        empty: 'No reviews yet.',
        openSeries: 'Open series',
        edit: 'Edit review',
        delete: 'Delete review',
        reviewer: 'Reviewer name',
        comment: 'Comment',
        rating: 'Rating',
        cancel: 'Cancel',
        save: 'Save changes',
        saveSuccess: 'Review updated successfully.',
        deleteSuccess: 'Review deleted successfully.',
        actionError: 'The requested action failed.',
        deleteConfirm: 'Delete this review?',
        modalTitle: 'Edit review',
        seriesLabel: 'Series',
        dateLabel: 'Published',
      }
    : {
        title: 'Усі відгуки',
        subtitle: 'Модеруй останні відгуки у фронтенді, а сам сервіс відгуків лишай чистим REST API.',
        denied: 'Для цієї сторінки потрібен вхід адміністратора.',
        back: 'На головну',
        developer: 'Developer',
        empty: 'Поки що відгуків немає.',
        openSeries: 'Відкрити серіал',
        edit: 'Редагувати відгук',
        delete: 'Видалити відгук',
        reviewer: "Ім'я автора",
        comment: 'Коментар',
        rating: 'Оцінка',
        cancel: 'Скасувати',
        save: 'Зберегти зміни',
        saveSuccess: 'Відгук успішно оновлено.',
        deleteSuccess: 'Відгук успішно видалено.',
        actionError: 'Не вдалося виконати дію.',
        deleteConfirm: 'Видалити цей відгук?',
        modalTitle: 'Редагування відгуку',
        seriesLabel: 'Серіал',
        dateLabel: 'Опубліковано',
      };

  const seriesTitleById = useMemo(
    () => Object.fromEntries(series.map((item) => [item.id, item.title])),
    [series],
  );

  const load = async () => {
    try {
      setError('');
      const [reviewsResult, seriesResult] = await Promise.all([
        api.listRecentReviews(50),
        api.getAllSeries(),
      ]);
      setReviews(reviewsResult);
      setSeries(seriesResult);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : text.actionError);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      load();
    }
  }, [isAdmin, search.lang]);

  const openEditor = (review: Review) => {
    setStatus(null);
    setForm({
      reviewId: review.id || '',
      seriesId: review.seriesId,
      reviewerName: review.reviewerName,
      comment: review.comment,
      rating: review.rating,
    });
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setForm(emptyForm);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.reviewId) {
      return;
    }

    try {
      setSaving(true);
      setStatus(null);
      const payload: ReviewRequest = {
        seriesId: form.seriesId,
        reviewerName: form.reviewerName.trim(),
        comment: form.comment.trim(),
        rating: form.rating,
      };
      await api.updateReview(form.reviewId, payload);
      closeEditor();
      await load();
      setStatus({ type: 'success', message: text.saveSuccess });
    } catch (saveError) {
      setStatus({
        type: 'error',
        message: saveError instanceof Error ? saveError.message : text.actionError,
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!reviewId || !window.confirm(text.deleteConfirm)) {
      return;
    }

    try {
      setDeletingId(reviewId);
      setStatus(null);
      await api.deleteReview(reviewId);
      await load();
      setStatus({ type: 'success', message: text.deleteSuccess });
    } catch (deleteError) {
      setStatus({
        type: 'error',
        message: deleteError instanceof Error ? deleteError.message : text.actionError,
      });
    } finally {
      setDeletingId('');
    }
  };

  if (!isAdmin) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          {text.denied}
        </Alert>
        <Button component={Link} href={`${HOME_PAGE}?lang=${search.lang}`} variant="contained">
          {text.back}
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h3" fontWeight={800}>
            {text.title}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {text.subtitle}
          </Typography>
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <Button component={Link} href={`${DEVELOPER_PAGE}?lang=${search.lang}`} variant="outlined">
            {text.developer}
          </Button>
        </Stack>

        {error && <Alert severity="error">{error}</Alert>}
        {status && <Alert severity={status.type}>{status.message}</Alert>}

        <Stack spacing={2}>
          {reviews.length ? reviews.map((review) => (
            <Card key={review.id || `${review.seriesId}-${review.publishedAt}-${review.reviewerName}`} variant="outlined">
              <CardContent>
                <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={700}>{review.reviewerName}</Typography>
                    <Typography color="text.secondary" sx={{ mb: 1 }}>
                      {text.seriesLabel}:{' '}
                      {seriesTitleById[review.seriesId]
                        ? localizeSeriesTitle(seriesTitleById[review.seriesId], search.lang)
                        : `#${review.seriesId}`}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }}>{review.comment}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {text.dateLabel}: {new Date(review.publishedAt).toLocaleDateString(search.lang === 'en' ? 'en-US' : 'uk-UA')}
                    </Typography>
                  </Box>

                  <Stack justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'flex-end' }} spacing={1.5}>
                    <Chip color="primary" label={`${review.rating.toFixed(1)}/10`} />
                    <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                      <Button component={Link} href={`${seriesDetails(review.seriesId)}?lang=${search.lang}`} variant="text">
                        {text.openSeries}
                      </Button>
                      <Button variant="text" onClick={() => openEditor(review)}>
                        {text.edit}
                      </Button>
                      <Button
                        variant="text"
                        color="error"
                        disabled={!review.id || deletingId === review.id}
                        onClick={() => review.id && deleteReview(review.id)}
                      >
                        {text.delete}
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          )) : (
            <Typography color="text.secondary">{text.empty}</Typography>
          )}
        </Stack>
      </Stack>

      <Dialog open={editorOpen} onClose={closeEditor} fullWidth maxWidth="sm">
        <DialogTitle>{text.modalTitle}</DialogTitle>
        <DialogContent dividers>
          <Box component="form" id="review-editor-form" onSubmit={submit}>
            <Stack spacing={2}>
              <TextField
                label={text.reviewer}
                value={form.reviewerName}
                onChange={(event) => setForm((current) => ({ ...current, reviewerName: event.target.value }))}
                required
              />
              <TextField
                label={text.comment}
                value={form.comment}
                onChange={(event) => setForm((current) => ({ ...current, comment: event.target.value }))}
                multiline
                minRows={4}
                required
              />
              <TextField
                type="number"
                label={text.rating}
                value={form.rating}
                inputProps={{ min: 1, max: 10, step: 0.1 }}
                onChange={(event) => setForm((current) => ({ ...current, rating: Number(event.target.value) }))}
                required
              />
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditor}>{text.cancel}</Button>
          <Button type="submit" form="review-editor-form" variant="contained" disabled={saving}>
            {text.save}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
