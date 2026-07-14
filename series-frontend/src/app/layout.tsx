import type { Metadata } from 'next';
import { Suspense } from 'react';
import AppHeader from '@/components/AppHeader';
import SubscriberPresenceTracker from '@/components/SubscriberPresenceTracker';
import IntlAppProvider from '@/pageProviders/IntlAppProvider';
import MuiProvider from '@/pageProviders/MuiProvider';

export const metadata: Metadata = {
  title: 'Series Analyzer',
  description: 'Block 3 frontend for Series Analyzer',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ua">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          background: [
            'radial-gradient(circle at 14% 12%, rgba(92, 177, 255, 0.34), transparent 0 24%)',
            'radial-gradient(circle at 86% 10%, rgba(255, 76, 76, 0.20), transparent 0 18%)',
            'radial-gradient(circle at 50% 100%, rgba(32, 91, 179, 0.22), transparent 0 28%)',
            'linear-gradient(180deg, #d8ecff 0%, #c7e2fb 30%, #b7d7f5 68%, #d9efff 100%)',
          ].join(','),
          backgroundAttachment: 'fixed',
        }}
      >
        <MuiProvider>
          <Suspense>
            <IntlAppProvider>
              <div
                style={{
                  minHeight: '100vh',
                  background: [
                    'radial-gradient(circle at top right, rgba(255,91,91,0.14), transparent 24%)',
                    'radial-gradient(circle at top left, rgba(79,158,255,0.20), transparent 26%)',
                    'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
                  ].join(','),
                }}
              >
                <AppHeader />
                <SubscriberPresenceTracker />
                {children}
              </div>
            </IntlAppProvider>
          </Suspense>
        </MuiProvider>
      </body>
    </html>
  );
}

