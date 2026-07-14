'use client';

import { ReactNode } from 'react';
import { IntlProvider } from 'react-intl';
import { toIntlLocale } from '@/constants/languages';
import { useLocationSearch } from '@/hooks/useLocationSearch';
import { getMessages } from '@/intl';

export default function IntlAppProvider({ children }: { children: ReactNode }) {
  const { lang } = useLocationSearch();
  return (
    <IntlProvider locale={toIntlLocale(lang)} messages={getMessages(lang)} defaultLocale="uk">
      {children}
    </IntlProvider>
  );
}
