import { createServerClient } from '@/lib/db/server'
import { Alert, Text } from '@mantine/core'
import { IconExclamationCircle } from '@tabler/icons-react'
import groupBy from 'object.groupby'

export async function EntrantSummary() {
  const supabase = createServerClient()
  const { data: entrants, error } = await supabase.from('entrants').select('id, sports(name)')
  const sportGroups = entrants
    ? groupBy(entrants, (entrant) => entrant.sports?.name ?? 'none')
    : null

  return (
    <Alert
      variant="light"
      color={error ? 'red' : 'blue'}
      title={error ? 'Entrant Count' : `Entrant Count: ${entrants?.length}`}
      icon={<IconExclamationCircle />}
    >
      {error && 'An error occurred'}
      {entrants && (
        <>
          {sportGroups &&
            Object.entries(sportGroups).map(([sport, entrants]) => (
              <Text key={sport}>
                {sport}: {entrants.length}
              </Text>
            ))}
        </>
      )}
    </Alert>
  )
}
