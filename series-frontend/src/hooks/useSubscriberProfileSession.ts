'use client';

import { useEffect, useState } from 'react';

const SUBSCRIBER_TOKEN_KEY = 'series-subscriber-token';

function readStoredSubscriberToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  const stored = window.localStorage.getItem(SUBSCRIBER_TOKEN_KEY);
  return stored && stored.trim() ? stored : null;
}

export function useSubscriberProfileSession() {
  const [subscriberToken, setSubscriberTokenState] = useState<string | null>(readStoredSubscriberToken);

  useEffect(() => {
    setSubscriberTokenState(readStoredSubscriberToken());
  }, []);

  const setSubscriberToken = (token: string | null) => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!token) {
      window.localStorage.removeItem(SUBSCRIBER_TOKEN_KEY);
      setSubscriberTokenState(null);
      return;
    }

    window.localStorage.setItem(SUBSCRIBER_TOKEN_KEY, token);
    setSubscriberTokenState(token);
  };

  return { subscriberToken, setSubscriberToken };
}
