'use client';

import { useEffect } from 'react';
import { api } from '@/lib/api';
import { useSubscriberProfileSession } from '@/hooks/useSubscriberProfileSession';

export default function SubscriberPresenceTracker() {
  const { subscriberToken } = useSubscriberProfileSession();

  useEffect(() => {
    if (!subscriberToken) {
      return;
    }

    let cancelled = false;

    const ping = async () => {
      try {
        if (!cancelled) {
          await api.heartbeatSubscriberProfile(subscriberToken);
        }
      } catch {
        // Presence ping should stay invisible for the user.
      }
    };

    ping();
    const timer = window.setInterval(ping, 120000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [subscriberToken]);

  return null;
}
