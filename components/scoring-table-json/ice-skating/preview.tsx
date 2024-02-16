import { dsShort } from '@/lib/dates';
import { EventLiveData } from '@/lib/event-data';
import {
  AccordionItem,
  AccordionControl,
  Title,
  AccordionPanel,
  Divider,
  Text,
  Accordion,
} from '@mantine/core';
import { Fragment } from 'react';
import styles from './preview.module.css';

export function LiveDataPreviewIceSkating(props: Partial<EventLiveData<'ice-skating'>>) {
  return props.active && props.message && props.results && props.startlist ? (
    <Accordion multiple variant="contained" defaultValue={['active', 'results']}>
      <ActiveAndStartlistPreview active={props.active} startlist={props.startlist} />
      <ResultsPreview segment={props.results.segment} overall={props.results.overall} />
    </Accordion>
  ) : null;
}

type RowPreview<T> = {
  field: string;
  label: string;
  get: (row: T) => string | number | undefined | null;
};

const overallRows: RowPreview<
  NonNullable<EventLiveData<'ice-skating'>['results']['overall']>[number]
>[] = [
  { field: 'id', label: 'entrant.id', get: (row) => row.entrant?.id },
  { field: 'rank', label: 'rank', get: (row) => row.rank },
  { field: 'total', label: 'total', get: (row) => row.total },
  { field: 'first_name', label: 'entrant.first_name', get: (row) => row.entrant?.first_name },
  { field: 'last_name', label: 'entrant.last_name', get: (row) => row.entrant?.last_name },
  { field: 'breakdown', label: 'breakdown', get: (row) => JSON.stringify(row.breakdown) },
];

const segmentRows: RowPreview<
  NonNullable<EventLiveData<'ice-skating'>['results']['segment']>[number]
>[] = [
  { field: 'id', label: 'entrant.id', get: (row) => row.entrant?.id },
  { field: 'rank', label: 'rank', get: (row) => row.rank },
  { field: 'total', label: 'total', get: (row) => row.total },
  { field: 'first_name', label: 'entrant.first_name', get: (row) => row.entrant?.first_name },
  { field: 'last_name', label: 'entrant.last_name', get: (row) => row.entrant?.last_name },
];

function ResultsPreview({
  segment,
  overall,
}: {
  segment: EventLiveData<'ice-skating'>['results']['segment'];
  overall: EventLiveData<'ice-skating'>['results']['overall'];
}) {
  return (
    <AccordionItem value="results">
      <AccordionControl classNames={{ control: styles.control }}>
        <Title order={3}>Results</Title>
      </AccordionControl>
      <AccordionPanel>
        <div className="flex flex-wrap gap-8">
          <div className="grow">
            <Title order={4} mb="xs">
              Segment
            </Title>
            <Divider />
            <PreviewGrid rows={segmentRows} data={segment} />
            <Divider />
          </div>
          <div className="grow">
            <Title order={4} mb="xs">
              Overall
            </Title>
            <Divider />
            <PreviewGrid rows={overallRows} data={overall} />
            <Divider />
          </div>
        </div>
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

const startlistRows: RowPreview<NonNullable<EventLiveData<'ice-skating'>['startlist']>[number]>[] =
  [
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
  active: EventLiveData<'ice-skating'>['active'];
  startlist: EventLiveData<'ice-skating'>['startlist'];
}) {
  return (
    <AccordionItem value="active">
      <AccordionControl classNames={{ control: styles.control }}>
        <Title order={3}>Active & Startlist</Title>
      </AccordionControl>
      <AccordionPanel>
        <div className="flex flex-wrap gap-8 justify-center">
          <div className="flex flex-col gap-2">
            <Title order={4}>Active</Title>
            <Text>
              <span className="text-dimmed italic">Round: </span>
              <span className="text-teal-7 dark:text-teal-4 font-bold">{active.round}</span>
            </Text>
            <Text>
              <span className="text-dimmed italic">Class: </span>
              <span className="text-teal-7 dark:text-teal-4 font-bold">{active.class}</span>
            </Text>
            <Text>
              <span className="text-dimmed italic">Entrant: </span>
            </Text>
            <pre className="relative min-w-[8rem] text-xs my-0 p-4 border border-teal-7 dark:border-teal-4 whitespace-pre-wrap rounded bg-body">
              {JSON.stringify(active.entrant, null, 2)}
            </pre>
          </div>

          <div className="grow">
            <Title order={4} mb="xs">
              Startlist
            </Title>
            <Divider />
            <PreviewGrid rows={startlistRows} data={startlist} />
            <Divider />
          </div>
        </div>

        <div className="flex justify-between"></div>
      </AccordionPanel>
    </AccordionItem>
  );
}
