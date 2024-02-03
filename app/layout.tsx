// import '@/lib/polyfills';
import './globals.css';

import { setUseWhatChange } from '@simbathesailor/use-what-changed';
setUseWhatChange({ active: process.env.NODE_ENV === 'development' })

import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { theme } from './theme';
import { Providers } from '@/components/providers';

export const metadata = {
  title: 'TNL Event Data',
  description: 'TNL Live Event Judging System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.png" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <meta name="google" content="notranslate" />
        <meta name="googlebot" content="notranslate" />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <Providers>
            {children}
          </Providers>
        </MantineProvider>
      </body>
    </html>
  );
}
