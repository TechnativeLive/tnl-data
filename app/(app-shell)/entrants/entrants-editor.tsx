import { createEntrant } from '@/app/(app-shell)/entrants/actions'
import { BulkEntrantUploader } from '@/app/(app-shell)/entrants/tabs/bulk/bulk-entrant-uploader'
import { CreateEntrantForm } from '@/app/(app-shell)/entrants/tabs/create/form'
import { EditEntrantForm } from '@/app/(app-shell)/entrants/tabs/edit/form'
import { EntrantSummary } from '@/app/(app-shell)/entrants/tabs/summary'
import { CenteredLoader } from '@/components/mantine-extensions/centered-loader'
import { createServerClient } from '@/lib/db/server'
import { Card, Tabs, TabsList, TabsTab, TabsPanel } from '@mantine/core'
import { Suspense } from 'react'

export async function EntrantsEditor() {
  const supabase = createServerClient()
  const { data: entrants } = await supabase
    .from('entrants')
    .select('*')
    .order('id', { ascending: false })

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Tabs defaultValue="create">
        <TabsList className="mb-4">
          <TabsTab value="create">Create New Entrant</TabsTab>
          <TabsTab value="edit">Edit Entrant</TabsTab>
          <TabsTab value="bulk">Bulk Create</TabsTab>
          <TabsTab value="summary">Sumary (stats)</TabsTab>
        </TabsList>

        <TabsPanel value="create">
          <CreateEntrantForm action={createEntrant} />
        </TabsPanel>

        <TabsPanel value="edit">
          <EditEntrantForm action={createEntrant} entrants={entrants || []} />
        </TabsPanel>

        <TabsPanel value="bulk">
          <Suspense fallback={<CenteredLoader />}>
            <BulkEntrantUploader />
          </Suspense>
        </TabsPanel>

        <TabsPanel value="summary">
          <Suspense fallback={<CenteredLoader />}>
            <EntrantSummary />
          </Suspense>
        </TabsPanel>
      </Tabs>
    </Card>
  )
}
