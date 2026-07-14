export type Studio = {
  id: number;
  name: string;
  country: string;
};

export type Series = {
  id: number;
  title: string;
  genre: string;
  seasons: number;
  rating: number;
  year: number;
  finished: boolean;
  trailerUrl?: string | null;
  studio?: Studio | null;
};

export type Review = {
  id?: string;
  seriesId: number;
  reviewerName: string;
  comment: string;
  rating: number;
  publishedAt: string;
};

export type ReviewRequest = {
  seriesId: number;
  reviewerName: string;
  comment: string;
  rating: number;
};

export type SeriesRequest = {
  title: string;
  genre: string;
  seasons: number;
  rating: number;
  year: number;
  finished: boolean;
  studioId: number;
  trailerUrl: string;
};

export type SeriesListRequest = {
  studioId?: number;
  minRating?: number;
  year?: number;
  genre?: string;
  page: number;
  size: number;
  sortBy: 'id' | 'title' | 'genre' | 'seasons' | 'rating' | 'year' | 'finished';
  direction: 'ASC' | 'DESC';
};

export type SeriesListResponse = {
  list: Series[];
  totalPages: number;
};

export type StatisticsResponse = Record<string, number>;

export type EmailSettings = {
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  smtpAuth: boolean;
  smtpStarttls: boolean;
  fromEmail: string;
};

export type NotificationSettings = {
  recipientEmail: string;
  newSeriesSubjectTemplate: string;
  newSeriesBodyTemplate: string;
  newSeasonSubjectTemplate: string;
  newSeasonBodyTemplate: string;
};

export type EmailDeliveryStatus = 'PENDING' | 'SENT' | 'FAILED';

export type EmailMessage = {
  id: string;
  eventId: string;
  eventType: string;
  entityType: string;
  entityId: number;
  recipientEmail: string;
  subject: string;
  content: string;
  status: EmailDeliveryStatus;
  attemptCount: number;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
  lastAttemptAt: string | null;
  sentAt: string | null;
};

export type SubscriberProfile = {
  id: number;
  name: string;
  email: string;
  notifyNewSeries: boolean;
  notifyNewSeason: boolean;
  activeNow: boolean;
  createdAt: string;
  updatedAt: string;
  lastSeenAt: string;
};

export type SubscriberProfileRequest = {
  name: string;
  email: string;
  notifyNewSeries: boolean;
  notifyNewSeason: boolean;
};

export type SubscriberRegistrationRequest = SubscriberProfileRequest & {
  password: string;
};

export type SubscriberLoginRequest = {
  email: string;
  password: string;
};

export type SubscriberSession = {
  authToken: string;
  profile: SubscriberProfile;
};

export type SubscriberOverview = {
  totalSubscribers: number;
  activeSubscribers: number;
  newSeriesSubscribers: number;
  newSeasonSubscribers: number;
  subscribers: SubscriberProfile[];
};