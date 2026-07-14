import { config } from '@/config';
import { ADMIN_ACCESS_TOKEN } from '@/constants/admin';
import type {
  EmailDeliveryStatus,
  EmailMessage,
  EmailSettings,
  NotificationSettings,
  Review,
  ReviewRequest,
  SubscriberLoginRequest,
  SubscriberOverview,
  SubscriberProfile,
  SubscriberProfileRequest,
  SubscriberRegistrationRequest,
  SubscriberSession,
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

function extractApiErrorMessage(body: unknown, fallback: string) {
  if (!body || typeof body !== 'object') {
    return fallback;
  }

  const candidate = body as {
    message?: string;
    error?: string;
    fields?: Record<string, string>;
  };

  if (candidate.fields && Object.keys(candidate.fields).length) {
    return Object.values(candidate.fields).join('. ');
  }

  return candidate.message || candidate.error || fallback;
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
      message = extractApiErrorMessage(body, message);
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
      message = extractApiErrorMessage(body, message);
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

async function emailRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${config.emailApiBaseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Token': ADMIN_ACCESS_TOKEN,
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    let message = response.statusText;
    try {
      const body = await response.json();
      message = extractApiErrorMessage(body, message);
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
  updateReview: (id: string, body: ReviewRequest) => reviewsRequest<Review>(`/api/entity3/${id}`, {
    method: 'PUT',
    headers: {
      'X-Admin-Token': ADMIN_ACCESS_TOKEN,
    },
    body: JSON.stringify(body),
  }),
  deleteReview: (id: string) => reviewsRequest<void>(`/api/entity3/${id}`, {
    method: 'DELETE',
    headers: {
      'X-Admin-Token': ADMIN_ACCESS_TOKEN,
    },
  }),
  listRecentReviews: (size = 5) => reviewsRequest<Review[]>(`/api/entity3/recent?size=${size}`),
  reviewCounts: (seriesIds: number[]) => reviewsRequest<Record<string, number>>('/api/entity3/_counts', {
    method: 'POST',
    body: JSON.stringify({ entity1Ids: seriesIds }),
  }),
  listEmailMessages: (status?: EmailDeliveryStatus) =>
    emailRequest<EmailMessage[]>(status ? `/api/admin/messages?status=${status}` : '/api/admin/messages'),
  retryFailedEmailMessages: () =>
    emailRequest<{ retried: number; status: string }>('/api/admin/messages/retry-failed', {
      method: 'POST',
    }),
  retryEmailMessage: (id: string) =>
    emailRequest<EmailMessage>(`/api/admin/messages/${id}/retry`, {
      method: 'POST',
    }),
  getEmailSettings: () => emailRequest<EmailSettings>('/api/admin/email-settings'),
  updateEmailSettings: (body: EmailSettings) => emailRequest<EmailSettings>('/api/admin/email-settings', {
    method: 'PUT',
    body: JSON.stringify(body),
  }),
  getNotificationSettings: () => request<NotificationSettings>('/admin/notification-settings', {
    headers: {
      'X-Admin-Token': ADMIN_ACCESS_TOKEN,
    },
  }),
  updateNotificationSettings: (body: NotificationSettings) => request<NotificationSettings>('/admin/notification-settings', {
    method: 'PUT',
    headers: {
      'X-Admin-Token': ADMIN_ACCESS_TOKEN,
    },
    body: JSON.stringify(body),
  }),
  registerSubscriber: (body: SubscriberRegistrationRequest) => request<SubscriberSession>('/subscribers/register', {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  loginSubscriber: (body: SubscriberLoginRequest) => request<SubscriberSession>('/subscribers/login', {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  logoutSubscriber: (authToken: string) => request<void>('/subscribers/logout', {
    method: 'POST',
    headers: {
      'X-Subscriber-Token': authToken,
    },
  }),
  getSubscriberProfile: (authToken: string) => request<SubscriberProfile>('/subscribers/me', {
    headers: {
      'X-Subscriber-Token': authToken,
    },
  }),
  saveSubscriberProfile: (authToken: string, body: SubscriberProfileRequest) => request<SubscriberProfile>('/subscribers/me', {
    method: 'PUT',
    headers: {
      'X-Subscriber-Token': authToken,
    },
    body: JSON.stringify(body),
  }),
  heartbeatSubscriberProfile: (authToken: string) => request<SubscriberProfile>('/subscribers/me/heartbeat', {
    method: 'POST',
    headers: {
      'X-Subscriber-Token': authToken,
    },
  }),
  getSubscriberOverview: () => request<SubscriberOverview>('/admin/subscribers/overview', {
    headers: {
      'X-Admin-Token': ADMIN_ACCESS_TOKEN,
    },
  }),
};
