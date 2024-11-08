import { EventLiveData } from '@/lib/event-data'
import { EntrantMap, entrantMapAtom } from '@/lib/hooks/use-realtime-json-event'
import {
  AccordionItem,
  AccordionControl,
  Title,
  AccordionPanel,
  Text,
  Accordion,
} from '@mantine/core'
import { Fragment } from 'react'
import styles from './preview.module.css'
import { useAtomValue } from 'jotai'

export function LiveDataPreviewClimbing(liveData: EventLiveData<'climbing'>) {
  return (
    <Accordion multiple variant="contained" defaultValue={['results']}>
      <ActiveAndStartlistPreview active={liveData.active} startlists={liveData.startlist} />
      {liveData.active.map((activeData) =>
        activeData.classId ? (
          <ResultsPreview
            key={activeData.class}
            overall={liveData.results[activeData.classId]}
            class={activeData.class}
          />
        ) : null,
      )}
    </Accordion>
  )
}

type PreviewCols<T, E> = {
  field: string
  label: string
  get: (row: T, entrant: E) => string | number | undefined | null
}

type ResultRow = NonNullable<EventLiveData<'climbing'>['results'][number]>[number]

const overallRows: PreviewCols<ResultRow, Tables<'entrants'>>[] = [
  { field: 'id', label: 'Id', get: (row) => row.entrant },
  { field: 'rank', label: 'Rank', get: (row) => row.rank },
  { field: 'tops', label: 'Tops', get: (row) => row.tops },
  { field: 'zones', label: 'Zones', get: (row) => row.zones },
  { field: 'ta', label: 'TA', get: (row) => row.ta },
  { field: 'za', label: 'ZA', get: (row) => row.za },
  { field: 'first_name', label: 'First Name', get: (_row, entrant) => entrant?.first_name },
  { field: 'last_name', label: 'Last Name', get: (_row, entrant) => entrant?.last_name },
  { field: 'status', label: 'Status', get: (row) => row.status },
]

function ResultsPreview({
  overall,
  class: cls,
}: {
  overall: EventLiveData<'climbing'>['results'][number]
  class?: string
}) {
  return (
    <AccordionItem value={cls || 'results'}>
      <AccordionControl classNames={{ control: styles.control }}>
        <Title order={3}>Results - {cls}</Title>
      </AccordionControl>
      <AccordionPanel>
        <PreviewGrid cols={overallRows} data={overall} />
      </AccordionPanel>
    </AccordionItem>
  )
}

function PreviewGrid<T, E>({
  title,
  cols,
  data,
}: {
  title?: string
  cols: PreviewCols<T, E>[]
  data?: T[]
}) {
  const entrantMap = useAtomValue(entrantMapAtom)

  return (
    <div className="flex flex-col bg-body rounded-md border overflow-hidden">
      {title && (
        <Title order={4} className="bg-body-dimmed px-12 py-2 border-b">
          {title}
        </Title>
      )}
      <div
        className="grid gap-y-2 gap-x-4 justify-start items-baseline px-4 py-2"
        style={{ gridTemplateColumns: `max-content repeat(${cols.length - 1}, auto)` }}
      >
        {cols.map(({ field, label }) => {
          const isId = field === 'id'
          return (
            <Text key={field} c={isId ? 'dimmed' : undefined} fz={isId ? 'xs' : undefined}>
              {label}
            </Text>
          )
        })}
        {data?.map((row) =>
          cols.map(({ field, get }) => {
            const isId = field === 'id'
            return (
              <Fragment key={field}>
                <Text c={isId ? 'dimmed' : undefined} fz={isId ? 'xs' : undefined}>
                  {/* @ts-expect-error - entrantMap[row.entrant] is not null */}
                  {get(row, entrantMap[row.entrant])}
                </Text>
              </Fragment>
            )
          }),
        )}
      </div>
    </div>
  )
}

type StartlistCols = NonNullable<
  EventLiveData<'climbing'>['startlist']
>[number]['startlist'][number]

const startlistCols: PreviewCols<StartlistCols, Tables<'entrants'>>[] = [
  { field: 'id', label: 'e.id', get: (row) => row.entrant },
  { field: 'pos', label: '#', get: (row) => row.pos },
  { field: 'first_name', label: 'e.first_name', get: (_row, entrant) => entrant?.first_name },
  { field: 'last_name', label: 'e.last_name', get: (_row, entrant) => entrant?.last_name },
  { field: 'country', label: 'e.country', get: (_row, entrant) => entrant?.country },
  // {
  //   field: 'dob',
  //   label: 'dob',
  //   get: (row) => (row.entrant.dob ? dsShort.format(new Date(row.entrant.dob)) : ''),
  // },
]
function ActiveAndStartlistPreview({
  active,
  startlists,
}: {
  active: EventLiveData<'climbing'>['active']
  startlists: EventLiveData<'climbing'>['startlist']
}) {
  const activeRoundName = active[0]?.round
  return (
    <AccordionItem value="active">
      <AccordionControl classNames={{ control: styles.control }}>
        <div className="flex items-center gap-6">
          <Title order={3}>Startlist</Title>
          {activeRoundName && (
            <Text>
              <span className="text-dimmed italic">Active Round: </span>
              <span className="text-teal-7 dark:text-teal-4 font-bold">{activeRoundName}</span>
            </Text>
          )}
        </div>
      </AccordionControl>
      <AccordionPanel>
        <div className="flex flex-wrap justify-around gap-6">
          {startlists?.map((startlist) => (
            <PreviewGrid
              key={startlist.class}
              title={startlist.class}
              cols={startlistCols}
              data={startlist.startlist}
            />
          ))}
        </div>
      </AccordionPanel>
    </AccordionItem>
  )
}
