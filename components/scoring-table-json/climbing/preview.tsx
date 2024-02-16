import { EventLiveData } from '@/lib/event-data';
import {
  AccordionItem,
  AccordionControl,
  Title,
  AccordionPanel,
  Text,
  Accordion,
} from '@mantine/core';
import { Fragment } from 'react';
import styles from './preview.module.css';

export function LiveDataPreviewClimbing(liveData: EventLiveData<'climbing'>) {
  return (
    <Accordion multiple variant="contained" defaultValue={['results']}>
      <ActiveAndStartlistPreview active={liveData.active} startlist={liveData.startlist} />
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
  );
}

type RowPreview<T> = {
  field: string;
  label: string;
  get: (row: T) => string | number | undefined | null;
};

const overallRows: RowPreview<NonNullable<EventLiveData<'climbing'>['results'][number]>[number]>[] =
  [
    { field: 'id', label: 'entrant.id', get: (row) => row.entrant?.id },
    { field: 'rank', label: 'rank', get: (row) => row.rank },
    { field: 'tops', label: 'tops', get: (row) => row.tops },
    { field: 'zones', label: 'zones', get: (row) => row.zones },
    { field: 'ta', label: 'TA', get: (row) => row.ta },
    { field: 'za', label: 'ZA', get: (row) => row.za },
    { field: 'first_name', label: 'entrant.first_name', get: (row) => row.entrant?.first_name },
    { field: 'last_name', label: 'entrant.last_name', get: (row) => row.entrant?.last_name },
    { field: 'status', label: 'status', get: (row) => row.status },
  ];

function ResultsPreview({
  overall,
  class: cls,
}: {
  overall: EventLiveData<'climbing'>['results'][number];
  class?: string;
}) {
  return (
    <AccordionItem value={cls || 'results'}>
      <AccordionControl classNames={{ control: styles.control }}>
        <Title order={3}>Results - {cls}</Title>
      </AccordionControl>
      <AccordionPanel>
        <PreviewGrid rows={overallRows} data={overall} />
      </AccordionPanel>
    </AccordionItem>
  );
}

function PreviewGrid({ rows, data }: { rows: RowPreview<any>[]; data?: any[] }) {
  return (
    <div
      className="grid gap-y-2 gap-x-4 justify-start p-4 items-baseline"
      style={{ gridTemplateColumns: `repeat(${rows.length},auto)` }}
    >
      {rows.map(({ field, label }) => {
        const isId = field === 'id';
        return (
          <Text key={field} c={isId ? 'dimmed' : undefined} fz={isId ? 'xs' : undefined}>
            {label}
          </Text>
        );
      })}
      {data?.map((row) =>
        rows.map(({ field, get }) => {
          const isId = field === 'id';
          return (
            <Fragment key={field}>
              <Text c={isId ? 'dimmed' : undefined} fz={isId ? 'xs' : undefined}>
                {get(row)}
              </Text>
            </Fragment>
          );
        }),
      )}
    </div>
  );
}

const startlistRows: RowPreview<
  NonNullable<EventLiveData<'climbing'>['startlist']>[number][number]
>[] = [
  { field: 'id', label: 'entrant.id', get: (row) => row.entrant.id },
  { field: 'pos', label: 'pos', get: (row) => row.pos },
  { field: 'first_name', label: 'entrant.first_name', get: (row) => row.entrant.first_name },
  { field: 'last_name', label: 'entrant.last_name', get: (row) => row.entrant.last_name },
  { field: 'country', label: 'entrant.country', get: (row) => row.entrant.country },
  // {
  //   field: 'dob',
  //   label: 'dob',
  //   get: (row) => (row.entrant.dob ? dsShort.format(new Date(row.entrant.dob)) : ''),
  // },
];
function ActiveAndStartlistPreview({
  active,
  startlist,
}: {
  active: EventLiveData<'climbing'>['active'];
  startlist: EventLiveData<'climbing'>['startlist'];
}) {
  return (
    <AccordionItem value="active">
      <AccordionControl classNames={{ control: styles.control }}>
        <div className="flex items-center gap-6">
          <Title order={3}>Startlist</Title>
          <Text>
            <span className="text-dimmed italic">Active Rounds: </span>
            <span className="text-teal-7 dark:text-teal-4 font-bold">
              {active.map((a) => a.round).join(',')}
            </span>
          </Text>
        </div>
      </AccordionControl>
      <AccordionPanel>
        <PreviewGrid rows={startlistRows} data={startlist} />
      </AccordionPanel>
    </AccordionItem>
  );
}
