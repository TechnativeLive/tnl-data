import { createEntrant } from '@/app/(app-shell)/entrants/actions'
import { EditEntrantForm } from '@/app/(app-shell)/entrants/edit-entrant-form'
import { PhotoDropzoneSSR } from '@/app/(app-shell)/entrants/photo-dropzone-ssr'
import { SimpleForm } from '@/components/forms/simple-form'
import { SubmitButton } from '@/components/forms/submit-button'
import { PROJECT_ICONS } from '@/components/project-icons'
import { Select } from '@/components/select'
import { countrySelectionCode2 } from '@/lib/countries/countries'
import { createServerClient } from '@/lib/db/server'
import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Alert,
  Card,
  Flex,
  JsonInput,
  Loader,
  SimpleGrid,
  Stack,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { IconCalendarDue, IconExclamationCircle, IconQuestionMark } from '@tabler/icons-react'
import groupBy from 'object.groupby'
import { Suspense } from 'react'

// export const dynamic = 'force-dynamic';

export default async function EntrantsPage() {
  return (
    <Flex justify="center" className="flex-1 py-4 mb-4 mx-content">
      <Stack w="100%">
        <div className="flex justify-between items-end">
          <Title>Entrants</Title>
        </div>

        <Suspense fallback={<Loader />}>
          <CreateEntrant />
        </Suspense>
        <Suspense fallback={<Loader />}>
          <EntrantList />
        </Suspense>
      </Stack>
    </Flex>
  )
}

async function CreateEntrant() {
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
          <TabsTab value="summary">Sumary (stats)</TabsTab>
        </TabsList>

        <TabsPanel value="create">
          <SimpleForm action={createEntrant} reset={false}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-sm">
              <TextInput required label="First Name" name="first_name" />
              <TextInput required label="Last Name" name="last_name" />
              <TextInput label="Nickname" name="nick_name" />
              <DatePickerInput
                label="Date of Birth"
                name="dob"
                rightSection={<IconCalendarDue />}
                rightSectionPointerEvents="none"
              />
              <Select
                label="Country"
                name="country"
                data={countrySelectionCode2}
                defaultValue="GB"
                autoComplete="off"
                searchable
              />
              <PhotoDropzoneSSR />
              <Suspense fallback={<Select />}>
                <PrimarySportSelection />
              </Suspense>
              <JsonInput
                label="Custom Data"
                name="data"
                minRows={1}
                autosize
                formatOnBlur
                variant="default"
                validationError="Invalid JSON (use double-quotes, remove trailing commas)"
              />
              <SubmitButton
                className="self-end max-lg:mt-8 col-span-full"
                type="submit"
                variant="filled"
              >
                Create
              </SubmitButton>
            </div>
          </SimpleForm>
        </TabsPanel>

        <TabsPanel value="edit">
          <EditEntrantForm action={createEntrant} entrants={entrants || []} />
        </TabsPanel>

        <TabsPanel value="summary">
          <Suspense fallback={<Loader />}>
            <EntrantSummary />
          </Suspense>
        </TabsPanel>
      </Tabs>
    </Card>
  )
}

async function PrimarySportSelection() {
  const supabase = createServerClient()
  const { data } = await supabase.from('sports').select('id, name')
  const options = (data ?? []).map((sport) => ({ value: sport.id.toString(), label: sport.name }))

  return (
    <Select
      disabled={!data}
      label="Primary Sport"
      name="primary_sport"
      data={options}
      defaultValue="3"
    />
  )
}

async function EntrantSummary() {
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

const outerAccordionStyles = { content: { padding: 0 } }
async function EntrantList() {
  const supabase = createServerClient()
  const { data: entrants } = await supabase
    .from('entrants')
    .select('id, first_name, last_name, nick_name, country, dob, data, sports(name, slug)')
  const sportGroups = entrants
    ? groupBy(entrants, (entrant) => entrant.sports?.name ?? 'none')
    : null

  return (
    <Accordion styles={outerAccordionStyles}>
      {Object.entries(sportGroups ?? {})?.map(([sport, entrants]) => {
        const slug = entrants[0]?.sports?.slug
        const Icon = slug && slug in PROJECT_ICONS ? PROJECT_ICONS[slug]! : IconQuestionMark

        return (
          <AccordionItem value={sport} key={sport}>
            <AccordionControl icon={<Icon />}>{sport}</AccordionControl>
            <AccordionPanel>
              <Accordion variant="contained">
                {entrants.map((entrant) => (
                  <AccordionItem key={entrant.id} value={entrant.id.toString()}>
                    <AccordionControl>
                      <SimpleGrid cols={4}>
                        <Text span>{entrant.first_name}</Text>
                        <Text span>{entrant.last_name}</Text>
                        <Text span>{entrant.country}</Text>
                        <Text span>{entrant.dob}</Text>
                      </SimpleGrid>
                    </AccordionControl>
                    <AccordionPanel>
                      <JsonInput value={JSON.stringify(entrant.data)} />
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </AccordionPanel>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
