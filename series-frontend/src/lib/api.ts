import { config } from '@/config';
import type {
  Review,
  ReviewRequest,
  Series,
  SeriesListRequest,
  SeriesListResponse,
  SeriesRequest,
  StatisticsResponse,
  Studio
} from '@/types/series';

class ApiError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${config.apiBaseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    let message = response.statusText;
    try {
      const body = await response.json();
      message = body.message || body.error || JSON.stringify(body);
    } catch {
      // keep default message
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

async function reviewsRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${config.reviewsApiBaseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    let message = response.statusText;
    try {
      const body = await response.json();
      message = body.message || body.error || JSON.stringify(body);
    } catch {
      // keep default message
    }
    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<T>;
}

export const api = {
  getAllSeries: () => request<Series[]>('/series'),
  listSeries: (body: SeriesListRequest) => request<SeriesListResponse>('/series/_list', {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  topSeries: (limit = 5) => request<Series[]>(`/series/top?limit=${limit}`),
  searchSeries: (query: string) => request<Series>(`/series/search?query=${encodeURIComponent(query)}`),
  getStatistics: (attribute: string) => request<StatisticsResponse>(`/statistics/${attribute}`),
  getSeries: (id: string | number) => request<Series>(`/series/${id}`),
  createSeries: (body: SeriesRequest) => request<Series>('/series', {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  updateSeries: (id: string | number, body: SeriesRequest) => request<Series>(`/series/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  }),
  deleteSeries: (id: string | number) => request<void>(`/series/${id}`, { method: 'DELETE' }),
  listStudios: () => request<Studio[]>('/studios'),
  listReviews: (seriesId: number, size = 5, from = 0) =>
    reviewsRequest<Review[]>(`/api/entity3?entity1Id=${seriesId}&size=${size}&from=${from}`),
  createReview: (body: ReviewRequest) => reviewsRequest<Review>('/api/entity3', {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  reviewCounts: (seriesIds: number[]) => reviewsRequest<Record<string, number>>('/api/entity3/_counts', {
    method: 'POST',
    body: JSON.stringify({ entity1Ids: seriesIds }),
  }),
};
