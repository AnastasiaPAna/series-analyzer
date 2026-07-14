'use client';

import { useRouter } from 'next/navigation';

export const useChangePage = () => {
  const router = useRouter();

  return (path: string, params?: Record<string, string | number | undefined | null>) => {
    const search = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        search.set(key, String(value));
      }
    });
    const query = search.toString();
    router.push(query ? `${path}?${query}` : path);
  };
};
