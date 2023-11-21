// import '@/lib/polyfills';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import './globals.css';

import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { theme } from './theme';
import { Shell } from '@/components/shell/shell';
import { Providers } from '@/components/providers';

export const metadata = {
  title: 'TNL Scores',
  description: 'TNL Live Event Judging System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <Providers>
            <Notifications autoClose={4000} />
            <Shell>{children}</Shell>
          </Providers>
        </MantineProvider>
      </body>
    </html>
  );
}
