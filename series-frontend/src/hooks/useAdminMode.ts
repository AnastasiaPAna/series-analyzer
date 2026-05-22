'use client';

import { useEffect, useState } from 'react';
import type { Language } from '@/constants/languages';

const ADMIN_MODE_KEY = 'series-admin-mode';
const ADMIN_USER_KEY = 'series-admin-user';

export const ADMIN_LOGIN = 'admin';
export const ADMIN_PASSWORD = 'admin123';
export const ADMIN_ACCESS_TOKEN = 'series-admin-access';

export function getAdminReviewsServiceUrl(language: Language) {
  const params = new URLSearchParams({
    lang: language,
    admin: ADMIN_LOGIN,
    token: ADMIN_ACCESS_TOKEN,
  });

  return `http://localhost:3010/?${params.toString()}`;
}

export function useAdminMode() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    setIsAdmin(window.localStorage.getItem(ADMIN_MODE_KEY) === 'true');
    setAdminUser(window.localStorage.getItem(ADMIN_USER_KEY) || '');
  }, []);

  const login = (username: string) => {
    window.localStorage.setItem(ADMIN_MODE_KEY, 'true');
    window.localStorage.setItem(ADMIN_USER_KEY, username);
    setIsAdmin(true);
    setAdminUser(username);
  };

  const logout = () => {
    window.localStorage.removeItem(ADMIN_MODE_KEY);
    window.localStorage.removeItem(ADMIN_USER_KEY);
    setIsAdmin(false);
    setAdminUser('');
  };

  return { isAdmin, adminUser, login, logout };
}
