'use client';

import { ScoringTableProps } from '@/components/scoring-table/scoring-table';
import { createBrowserClient } from '@/lib/db/client';
import { Sport, EventData } from '@/lib/db/event-data';
import { Alert, Button, Divider, NumberInput, Paper, Stack, Text, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCircleCheck, IconCircleCheckFilled, IconExclamationCircle } from '@tabler/icons-react';
import clsx from 'clsx';
import { useParams } from 'next/navigation';
import { useCallback, useState } from 'react';

type Results = Partial<Record<string, Partial<Record<string, Partial<Record<string, Result>>>>>>;
type Result = {
  tech: number;
  pres: number;
  ddct: number;
};
type UpdateResultsHelper = (round: string, cls: string, id: number, data: Result) => void;

export function ScoringTableIceSkating({ format, initialResults }: ScoringTableProps) {
  const params = useParams();
  const [results, setResults] = useState(validateResults(initialResults));
  const supabase = createBrowserClient();
  const [loading, setLoading] = useState<false | [string, string, number]>(false);

  const updateResult = useCallback<UpdateResultsHelper>(
    (round, cls, id, data) => {
      setResults((current) => {
        const newResults = { ...current };
        if (!newResults[round]) newResults[round] = {};
        if (!newResults[round]![cls]) newResults[round]![cls] = {};
        if (!newResults[round]![cls]![id]) newResults[round]![cls]![id] = {} as Result;
        newResults[round]![cls]![id] = data;

        if (!params.event) {
          notifications.show({
            color: 'red',
            title: 'Error',
            message:
              'Scoring Table is not in a valid state. Please contact a member of the Technative broadcast team.',
          });
        } else {
          setLoading([round, cls, id]);
          supabase
            .from('events')
            .update({ results: newResults })
            .eq('slug', params.event)
            .then(() => {
              setLoading(false);
              notifications.show({
                color: 'teal',
                icon: <IconCircleCheck />,

                message: 'Score submitted',
              });
            });
        }

        return newResults;
      });
    },
    [setResults, supabase, params.event]
  );

  if (!isValidEventFormat(format, 'ice-skating'))
    return (
      <Alert color="red" icon={<IconExclamationCircle />} title="Invalid format">
        <Text className="text-sm italic">
          Please contact a member of the Technative broadcast team
        </Text>
      </Alert>
    );

  const activeClass = `round-1.mens`;

  return (
    <Stack>
      {format.rounds.map((round) => (
        <Paper key={round.id} p="sm" shadow="sm" className="bg-body-dimmed" withBorder>
          <div className="flex items-center gap-2 px-2 mb-sm group">
            <Title order={2} id={round.id} className="event-header scroll-m-[5.25rem]">
              {round.name}
            </Title>
            <a
              className="header-anchor text-xl font-semibold text-violet-3 hover:text-violet-5 opacity-0 group-hover:opacity-100 transition-all"
              href={`#${round.id}`}
            >
              #
            </a>
            <Text size="xs" c="dimmed" className="ml-auto">
              ROUND
            </Text>
          </div>
          <div className="flex flex-col gap-md">
            {round.classes.map((cls) => {
              const classId = `${round.id}.${cls.id}`;
              const active = classId === activeClass;

              return (
                <Paper
                  key={classId}
                  p="sm"
                  withBorder
                  className={clsx(
                    'flex flex-col gap-2',
                    active && 'border-teal-4 dark:border-teal-7'
                  )}
                >
                  <div className="flex items-center px-2 gap-2 group">
                    <Title order={3} id={classId} className="event-header scroll-m-[5.25rem]">
                      {cls.name}
                    </Title>
                    <a
                      className="header-anchor text-xl font-semibold text-violet-3 hover:text-violet-5 opacity-0 group-hover:opacity-100 transition-all"
                      href={`#${classId}`}
                    >
                      #
                    </a>
                    <Text size="xs" c="dimmed" className="ml-auto">
                      CLASS
                    </Text>
                    <Button
                      size="compact-sm"
                      variant={active ? 'filled' : 'outline'}
                      leftSection={
                        active ? <IconCircleCheckFilled size={16} /> : <IconCircleCheck size={16} />
                      }
                    >
                      Set Active
                    </Button>
                  </div>
                  <Divider />
                  {cls.entrants.map((entrant) => {
                    const row = typeof entrant === 'number' ? { id: entrant } : entrant;
                    return (
                      <Entrant
                        key={row.id}
                        entrant={row}
                        initialResult={results[round.id]?.[cls.id]?.[row.id]}
                        updateResults={updateResult}
                        roundId={round.id}
                        classId={cls.id}
                        loading={
                          loading &&
                          loading[0] === round.id &&
                          loading[1] === cls.id &&
                          loading[2] === row.id
                        }
                      />
                    );
                  })}
                </Paper>
              );
            })}
          </div>
        </Paper>
      ))}
    </Stack>
  );
}

function Entrant({
  entrant,
  initialResult,
  updateResults,
  roundId,
  classId,
  loading,
}: {
  entrant: Partial<Tables<'entrants'>>;
  initialResult: Result | undefined;
  updateResults: UpdateResultsHelper;
  roundId: string;
  classId: string;
  loading: boolean;
}) {
  const row = typeof entrant === 'number' ? { id: entrant } : entrant;
  // id={`${round.id}.${cls.id}.${row.id}`}

  return (
    <form
      className="flex justify-between items-center px-2 gap-2"
      onSubmit={(ev) => {
        ev.preventDefault();
        const formData = new FormData(ev.currentTarget);
        const result = {
          tech: Number(formData.get('tech')),
          pres: Number(formData.get('pres')),
          ddct: Number(formData.get('ddct')),
        };
        updateResults(roundId, classId, entrant.id!, result);
      }}
    >
      <Title order={4} className="event-header scroll-m-[5.25rem]">
        {row.id}
      </Title>
      <NumberInput name="tech" autoComplete="off" min={0} defaultValue={initialResult?.tech} />
      <NumberInput name="pres" autoComplete="off" min={0} defaultValue={initialResult?.pres} />
      <NumberInput name="ddct" autoComplete="off" min={0} defaultValue={initialResult?.ddct} />
      <Button variant="light" type="submit" className="self-stretch h-auto" loading={loading}>
        Submit
      </Button>
    </form>
  );
}

function isValidEventFormat<S extends Sport>(
  format: Tables<'events'>['format'] | undefined,
  sport: S
): format is EventData<S> {
  return !!(
    sport === 'ice-skating' &&
    format &&
    typeof format === 'object' &&
    'rounds' in format &&
    Array.isArray(format.rounds)
  );
}

function validateResults(results: Tables<'events'>['results'] | undefined): Results {
  if (!results) return {};
  if (typeof results !== 'object' || Array.isArray(results)) return {};

  return results as Results;
}
