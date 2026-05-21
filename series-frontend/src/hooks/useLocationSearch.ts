'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { config } from '@/config';
import { languages, type Language } from '@/constants/languages';

export type LocationSearch = {
  lang: Language;
  page: number;
  size: number;
  genre: string;
  year: string;
  minRating: string;
  studioId: string;
};

const toPositiveInt = (value: string | null, fallback: number) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

export const useLocationSearch = (): LocationSearch => {
  const searchParams = useSearchParams();

  return useMemo(() => {
    const langParam = searchParams.get('lang') as Language | null;
    const lang = langParam && languages.includes(langParam) ? langParam : (config.defaultLanguage as Language);

    return {
      lang,
      page: toPositiveInt(searchParams.get('page'), 1),
      size: toPositiveInt(searchParams.get('size'), 10),
      genre: searchParams.get('genre') || '',
      year: searchParams.get('year') || '',
      minRating: searchParams.get('minRating') || '',
      studioId: searchParams.get('studioId') || '',
    };
  }, [searchParams]);
};
