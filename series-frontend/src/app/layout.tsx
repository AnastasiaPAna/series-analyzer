import type { Metadata } from 'next';
import { Suspense } from 'react';
import AppHeader from '@/components/AppHeader';
import IntlAppProvider from '@/pageProviders/IntlAppProvider';
import MuiProvider from '@/pageProviders/MuiProvider';

export const metadata: Metadata = {
  title: 'Series Analyzer',
  description: 'Block 3 frontend for Series Analyzer',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ua">
      <body>
        <MuiProvider>
          <Suspense>
            <IntlAppProvider>
              <AppHeader />
              {children}
            </IntlAppProvider>
          </Suspense>
        </MuiProvider>
      </body>
    </html>
  );
}
