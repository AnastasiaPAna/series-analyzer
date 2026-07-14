'use client';

import { useEffect, useState } from 'react';
import { ADMIN_LOGIN, ADMIN_PASSWORD } from '@/constants/admin';

const ADMIN_MODE_KEY = 'series-admin-mode';
const ADMIN_USER_KEY = 'series-admin-user';

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
    // This is intentionally lightweight: we only need to unlock admin tools
    // in the demo UI, not run a full authentication flow.
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

export { ADMIN_LOGIN, ADMIN_PASSWORD };
