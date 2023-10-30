// import '@/lib/polyfills';
import '@mantine/core/styles.css';
import './globals.css';

import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { theme } from './theme';
import { Shell } from '@/components/shell/shell';
import { Providers } from '@/components/providers';

export const metadata = {
  title: 'TNL Data',
  description: 'TNL Data',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
            <Shell>{children}</Shell>
          </Providers>
        </MantineProvider>
      </body>
    </html>
  );
}
