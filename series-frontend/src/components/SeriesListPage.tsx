'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Pagination,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useIntl } from 'react-intl';
import SeriesFilters from '@/components/SeriesFilters';
import { SERIES_NEW, seriesDetails } from '@/constants/pages';
import { useChangePage } from '@/hooks/useChangePage';
import { useAdminMode } from '@/hooks/useAdminMode';
import { useLocationSearch } from '@/hooks/useLocationSearch';
import { api } from '@/lib/api';
import { localizeGenre, localizeSeriesTitle } from '@/lib/series-localization';
import type { Series, Studio } from '@/types/series';

export default function SeriesListPage() {
  const intl = useIntl();
  const search = useLocationSearch();
  const searchParams = useSearchParams();
  const changePage = useChangePage();
  const { isAdmin } = useAdminMode();
  const [items, setItems] = useState<Series[]>([]);
  const [studios, setStudios] = useState<Studio[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [reviewCounts, setReviewCounts] = useState<Record<string, number>>({});
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Series | null>(null);
  const [deleteError, setDeleteError] = useState('');

  const params = {
    lang: search.lang,
    page: search.page,
    size: search.size,
    genre: search.genre,
    year: search.year,
    minRating: search.minRating,
    studioId: search.studioId,
  };

  const paramsAsStrings = {
    lang: search.lang,
    page: String(search.page),
    size: String(search.size),
    genre: search.genre,
    year: search.year,
    minRating: search.minRating,
    studioId: search.studioId,
  };

  const load = useCallback(async () => {
    try {
      setError('');
      const [seriesResult, studioResult] = await Promise.all([
        api.listSeries({
          page: search.page,
          size: search.size,
          genre: search.genre || undefined,
          year: search.year ? Number(search.year) : undefined,
          minRating: search.minRating ? Number(search.minRating) : undefined,
          studioId: search.studioId ? Number(search.studioId) : undefined,
          sortBy: 'id',
          direction: 'ASC',
        }),
        api.listStudios(),
      ]);
      setItems(seriesResult.list);
      setTotalPages(Math.max(seriesResult.totalPages || 1, 1));
      setStudios(studioResult);
      if (seriesResult.list.length) {
        const counts = await api.reviewCounts(seriesResult.list.map((item) => item.id));
        setReviewCounts(counts);
      } else {
        setReviewCounts({});
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : intl.formatMessage({ id: 'series.load.error' }));
    }
  }, [intl, search.genre, search.minRating, search.page, search.size, search.studioId, search.year]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (searchParams.get('created') === '1') {
      setSnackbar(intl.formatMessage({ id: 'series.create.success' }));
    }
  }, [intl, searchParams]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteError('');
      await api.deleteSeries(deleteTarget.id);
      setDeleteTarget(null);
      setSnackbar(intl.formatMessage({ id: 'series.delete.success' }));
      await load();
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : intl.formatMessage({ id: 'series.delete.error' }));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          mb: 3,
          p: { xs: 3, md: 4 },
          borderRadius: 5,
          color: '#ffffff',
          background: 'linear-gradient(145deg, rgba(14,30,52,0.97) 0%, rgba(28,67,112,0.94) 48%, rgba(107,24,32,0.90) 100%)',
          boxShadow: '0 30px 62px rgba(23, 48, 82, 0.30)',
          border: '1px solid rgba(255,255,255,0.10)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="overline" sx={{ letterSpacing: '0.22em', opacity: 0.78, fontWeight: 700 }}>
              SERIES CATALOG
            </Typography>
            <Typography variant="h4" fontWeight={800} sx={{ mt: 1 }}>
              {intl.formatMessage({ id: 'series.list.title' })}
            </Typography>
            <Typography sx={{ mt: 1.2, color: 'rgba(235,245,255,0.84)', maxWidth: 760 }}>
              {search.lang === 'en'
                ? 'Filter genres, browse ratings, and jump into reviews from one cinematic-looking catalog.'
                : 'Обирай жанри, переглядай рейтинги та переходь у відгуки з одного каталогу з більш кінематографічним вайбом.'}
            </Typography>
          </Box>
          {isAdmin && (
            <Button
              component={Link}
              href={`${SERIES_NEW}?${new URLSearchParams(paramsAsStrings).toString()}`}
              variant="contained"
              color="secondary"
              sx={{
                px: 2.4,
                py: 1.2,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #ff7a18 0%, #ff5b2e 100%)',
                boxShadow: '0 14px 30px rgba(255, 91, 46, 0.28)',
              }}
            >
              {intl.formatMessage({ id: 'series.add' })}
            </Button>
          )}
        </Box>
      </Box>

      <SeriesFilters
        search={search}
        studios={studios}
        onApply={(values) => changePage('/series', { ...params, ...values, page: 1 })}
        onClear={() => changePage('/series', { lang: search.lang, page: 1, size: search.size })}
      />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer
        component={Paper}
        sx={{
          background: 'linear-gradient(180deg, rgba(237,245,255,0.97) 0%, rgba(223,236,252,0.95) 100%)',
          border: '1px solid rgba(76, 123, 184, 0.20)',
          boxShadow: '0 24px 50px rgba(34, 68, 111, 0.14)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                '& .MuiTableCell-root': {
                  bgcolor: 'rgba(16, 36, 60, 0.94)',
                  color: '#eef7ff',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                  fontWeight: 800,
                  letterSpacing: '0.03em',
                },
              }}
            >
              <TableCell>{intl.formatMessage({ id: 'series.title' })}</TableCell>
              <TableCell>{intl.formatMessage({ id: 'series.genre' })}</TableCell>
              <TableCell>{intl.formatMessage({ id: 'series.rating' })}</TableCell>
              <TableCell>{intl.formatMessage({ id: 'series.year' })}</TableCell>
              <TableCell>{intl.formatMessage({ id: 'series.studio' })}</TableCell>
              <TableCell>{intl.formatMessage({ id: 'series.reviews' })}</TableCell>
              {isAdmin && <TableCell align="right" />}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((series) => (
              <TableRow
                key={series.id}
                hover
                sx={isAdmin
                  ? {
                      '& .delete-action': { opacity: 0 },
                      '&:hover .delete-action': { opacity: 1 },
                      '&:hover': {
                        bgcolor: 'rgba(224, 59, 78, 0.10)',
                      },
                    }
                  : {
                      '&:hover': {
                        bgcolor: 'rgba(224, 59, 78, 0.10)',
                      },
                    }}
              >
                <TableCell sx={{ fontWeight: 700 }}>
                  <Link
                    href={`${seriesDetails(series.id)}?${new URLSearchParams(paramsAsStrings).toString()}`}
                    style={{ color: '#17385d', textDecoration: 'none', fontWeight: 700 }}
                  >
                    {localizeSeriesTitle(series.title, search.lang)}
                  </Link>
                </TableCell>
                <TableCell>{localizeGenre(series.genre, search.lang)}</TableCell>
                <TableCell>{series.rating}</TableCell>
                <TableCell>{series.year}</TableCell>
                <TableCell>{series.studio?.name || '-'}</TableCell>
                <TableCell>{reviewCounts[String(series.id)] ?? 0}</TableCell>
                {isAdmin && (
                  <TableCell align="right">
                    <IconButton className="delete-action" color="error" onClick={() => setDeleteTarget(series)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination count={totalPages} page={search.page} onChange={(_, page) => changePage('/series', { ...params, page })} />
      </Box>

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>{intl.formatMessage({ id: 'series.delete.confirmTitle' })}</DialogTitle>
        <DialogContent>
          <Typography>{intl.formatMessage({ id: 'series.delete.confirmText' })}</Typography>
          {deleteError && <Alert severity="error" sx={{ mt: 2 }}>{deleteError}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>{intl.formatMessage({ id: 'series.cancel' })}</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>{intl.formatMessage({ id: 'series.delete' })}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snackbar} autoHideDuration={3000} onClose={() => setSnackbar('')} message={snackbar} />
    </Container>
  );
}

