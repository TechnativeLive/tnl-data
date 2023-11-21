'use client';

import { ScoringTableProps } from '@/components/scoring-table/scoring-table';
import { Sport, EventData } from '@/lib/db/event-data';
import { Alert, Button, Divider, Paper, Stack, Text, Title } from '@mantine/core';
import { IconCircleCheck, IconCircleCheckFilled, IconExclamationCircle } from '@tabler/icons-react';
import clsx from 'clsx';
import { useState } from 'react';

export function ScoringTableIceSkating({ format, initialResults }: ScoringTableProps) {
  const [results, setResults] = useState(validateResults(initialResults));

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
          <div className="flex justify-between items-center px-2 mb-sm">
            <Title order={3} id={round.id} className="event-header scroll-m-20">
              {round.name}
            </Title>
            <Text size="xs" c="dimmed">
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
                  <div className="flex items-center px-2 gap-2">
                    <Title order={4} id={classId} className="event-header scroll-m-20">
                      {cls.name}
                    </Title>
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
                      <div key={row.id} id={`${round.id}.${cls.id}.${row.id}`}>
                        <div className="flex justify-between items-center px-2">
                          <Title order={5} className="event-header scroll-m-20">
                            {row.id}
                          </Title>
                          <Text size="xs" c="dimmed">
                            ENTRANT
                          </Text>
                        </div>
                      </div>
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

function validateResults(results: Tables<'events'>['results'] | undefined) {
  if (!results) return {};

  return results;
}
