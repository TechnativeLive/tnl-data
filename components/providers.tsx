'use client';

import { Provider as JotaiProvider } from 'jotai';
import { ModalsProvider } from '@mantine/modals';
import { DatesProvider } from '@mantine/dates';
import { DatesProviderProps } from '@mantine/dates/lib/components/DatesProvider/DatesProvider';

const datesOptions: DatesProviderProps['settings'] = { timezone: 'GMT' };

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <JotaiProvider>
      <ModalsProvider>
        <DatesProvider settings={datesOptions}>{children}</DatesProvider>
      </ModalsProvider>
    </JotaiProvider>
  );
}
