'use client'

import { createStore, Provider as JotaiProvider } from 'jotai'
import { ModalsProvider } from '@mantine/modals'
import { DatesProvider } from '@mantine/dates'
import { DatesProviderProps } from '@mantine/dates/lib/components/DatesProvider/DatesProvider'

const datesOptions: DatesProviderProps['settings'] = { timezone: 'GMT' }

export const atomStore = createStore()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <JotaiProvider store={atomStore}>
      <ModalsProvider>
        <DatesProvider settings={datesOptions}>{children}</DatesProvider>
      </ModalsProvider>
    </JotaiProvider>
  )
}
