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
