import { Flex, Stack, Title } from '@mantine/core'
import { Suspense } from 'react'
import { EntrantList } from '@/app/(app-shell)/entrants/entrant-list'
import { CenteredLoader } from '@/components/mantine-extensions/centered-loader'
import { EntrantsEditor } from '@/app/(app-shell)/entrants/entrants-editor'

// export const dynamic = 'force-dynamic';

export default async function EntrantsPage() {
  return (
    <Flex justify="center" className="flex-1 py-4 mb-4 mx-content">
      <Stack w="100%">
        <div className="flex justify-between items-end">
          <Title>Entrants</Title>
        </div>

        <Suspense fallback={<CenteredLoader />}>
          <EntrantsEditor />
        </Suspense>

        <Suspense fallback={<CenteredLoader />}>
          <EntrantList />
        </Suspense>
      </Stack>
    </Flex>
  )
}
