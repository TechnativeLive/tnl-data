'use client';

import { ScrollAreaAutosizeWithShadow } from '@/components/mantine-extensions/scroll-area-with-shadow';
import { LiveDataPreviewIceSkating } from '@/components/scoring-table/ice-skating/preview';
import { ScoringTableProps } from '@/components/scoring-table/scoring-table';
import { updateOutlineAtom } from '@/components/shell/event-outline';
import { dsShort } from '@/lib/dates';
import { createBrowserClient } from '@/lib/db/client';
import { Sport, EventFormat, EventResults, EventResult, EventLiveData } from '@/lib/db/event-data';
import { generateLiveDataIceSkating } from '@/lib/db/event-data/ice-skating';
import { updateDatasream } from '@/lib/singular/datastream';
import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Alert,
  Button,
  Collapse,
  Divider,
  NumberInput,
  Paper,
  ScrollAreaAutosize,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDidUpdate, useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconChevronsUp,
  IconCircleCheck,
  IconCircleCheckFilled,
  IconExclamationCircle,
} from '@tabler/icons-react';
import clsx from 'clsx';
import { useSetAtom } from 'jotai';
import { useParams } from 'next/navigation';
import { Fragment, useCallback, useState } from 'react';

type Result = EventResult<'ice-skating'>;
type Results = EventResults<'ice-skating'>;

type UpdateResultsHelper = (round: string, cls: string, id: number, data: Result) => void;
type UpdateActiveHelper = ({
  round,
  cls,
  entrant,
}: {
  round?: string | undefined;
  cls?: string | undefined;
  entrant?: number | undefined;
}) => void;

export function ScoringTableIceSkating({
  format,
  initialResults,
  dsPrivateKey,
}: ScoringTableProps) {
  const params = useParams();
  const [results, setResults] = useState(() => validateResults(initialResults));
  const [liveDataPreview, setLiveDataPreview] = useState<EventLiveData<'ice-skating'>>(
    generateLiveDataIceSkating({
      format: format as EventFormat<'ice-skating'>,
      results,
    })
  );
  const [previewOpened, { toggle: togglePreview }] = useDisclosure(false);
  // Keep results up to date with database changes
  // Note: this causes unnecessary re-renders. Consider using an atom linked to the realtime event
  useDidUpdate(() => {
    setResults(validateResults(initialResults));
  }, [initialResults, setResults]);

  const supabase = createBrowserClient();
  const [loading, setLoading] = useState<
    false | [string | undefined, string | undefined, number | undefined]
  >(false);
  const updateOutline = useSetAtom(updateOutlineAtom);

  const updateActive = useCallback<UpdateActiveHelper>(
    ({ round, cls, entrant }) => {
      if (!format || !dsPrivateKey) {
        notifications.show({
          color: 'red',
          title: 'Error',
          message: `${format ? '' : 'No format provided. '}${
            dsPrivateKey ? '' : 'No datastream key provided'
          }`,
        });
        return;
      }
      setResults((current) => {
        const newResults = { ...current };
        newResults.active.round = round;
        newResults.active.class = cls;
        newResults.active.entrant = entrant;

        if (!params.event) {
          notifications.show({
            color: 'red',
            title: 'Error',
            message:
              'Scoring Table is not in a valid state. Please contact a member of the Technative broadcast team.',
          });
        } else {
          setLoading([round, cls, entrant]);
          // update datastream
          const liveData = generateLiveDataIceSkating({
            format: format as EventFormat<'ice-skating'>,
            results: newResults,
          });
          setLiveDataPreview(liveData);
          updateDatasream(dsPrivateKey, liveData);

          // update db
          supabase
            .from('events')
            .update({ results: newResults })
            .eq('slug', params.event)
            .then(() => {
              setLoading(false);
              const message = entrant
                ? 'Active entrant updated'
                : cls
                ? 'Active class updated'
                : round
                ? 'Active round updated'
                : 'Active cleared';

              notifications.show({
                color: 'teal',
                icon: <IconCircleCheck />,
                message,
              });
            });
        }

        return newResults;
      });
      updateOutline();
    },
    [updateOutline, setResults, setLoading, supabase, params.event, format, dsPrivateKey]
  );

  const updateResult = useCallback<UpdateResultsHelper>(
    (round, cls, id, data) => {
      if (!format || !dsPrivateKey) {
        notifications.show({
          color: 'red',
          title: 'Error',
          message: `${format ? '' : 'No format provided. '}${
            dsPrivateKey ? '' : 'No datastream key provided'
          }`,
        });
        return;
      }

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
          // update datastream
          const liveData = generateLiveDataIceSkating({
            format: format as EventFormat<'ice-skating'>,
            results: newResults,
          });
          setLiveDataPreview(liveData);
          updateDatasream(dsPrivateKey, liveData);

          // update db
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
    [setResults, setLoading, supabase, params.event, format, dsPrivateKey]
  );

  if (!isValidEventFormat(format, 'ice-skating'))
    return (
      <Alert color="red" icon={<IconExclamationCircle />} title="Invalid format">
        <Text className="text-sm italic">
          Please contact a member of the Technative broadcast team
        </Text>
      </Alert>
    );

  return (
    <Stack>
      <div className="fixed bottom-0 left-0 right-0 z-[103] p-2 bg-body border-t">
        <div className="px-6">
          <Button
            fullWidth
            leftSection={
              <IconChevronsUp
                size={16}
                style={{
                  transform: previewOpened ? 'rotate(180deg)' : undefined,
                  transition: 'transform 250ms ease-in-out',
                }}
              />
            }
            color="blue"
            variant="light"
            onClick={togglePreview}
          >
            {previewOpened
              ? 'Hide Preview\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'
              : 'Preview Live Data'}
          </Button>
        </div>
        <Collapse in={previewOpened}>
          <ScrollAreaAutosizeWithShadow mah={'50vh'} mt="xs">
            <div className="flex flex-col gap-8 w-full px-6">
              <LiveDataPreviewIceSkating {...liveDataPreview} />
            </div>
          </ScrollAreaAutosizeWithShadow>
        </Collapse>
      </div>
      {format.rounds.map((round) => {
        const isRoundActive = round.id === results.active.round;
        return (
          <Paper key={round.id} p="sm" shadow="sm" className="bg-body-dimmed" withBorder>
            <div className="flex items-center gap-2 px-2 mb-sm group">
              <Title
                order={2}
                id={round.id}
                data-tnl-active={isRoundActive ?? undefined}
                className="event-header scroll-m-[5.25rem]"
              >
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
              <Button
                size="compact-sm"
                variant={isRoundActive ? 'filled' : 'outline'}
                onClick={() =>
                  updateActive({ round: round.id, cls: undefined, entrant: undefined })
                }
                loading={loading && loading[0] === round.id}
                leftSection={
                  isRoundActive ? (
                    <IconCircleCheckFilled size={16} />
                  ) : (
                    <IconCircleCheck size={16} />
                  )
                }
              >
                Set Active
              </Button>
            </div>
            <div className="flex flex-col gap-md">
              {round.classes.map((cls) => {
                const classId = `${round.id}.${cls.id}`;
                const isClassActive =
                  round.id === results.active.round && cls.id === results.active.class;

                return (
                  <Paper
                    key={classId}
                    p="sm"
                    display="flex"
                    withBorder
                    className={clsx(
                      'flex-col gap-2',
                      isClassActive && 'border-teal-4 dark:border-teal-7'
                    )}
                  >
                    <div className="flex items-center px-2 gap-2 group">
                      <Title
                        order={3}
                        id={classId}
                        data-tnl-active={isClassActive ?? undefined}
                        className="event-header scroll-m-[5.25rem]"
                      >
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
                        variant={isClassActive ? 'filled' : 'outline'}
                        onClick={() =>
                          updateActive({ round: round.id, cls: cls.id, entrant: undefined })
                        }
                        loading={loading && loading[1] === cls.id}
                        leftSection={
                          isClassActive ? (
                            <IconCircleCheckFilled size={16} />
                          ) : (
                            <IconCircleCheck size={16} />
                          )
                        }
                      >
                        Set Active
                      </Button>
                    </div>
                    <Divider />
                    {cls.entrants.map((entrant) => {
                      const row = typeof entrant === 'number' ? { id: entrant } : entrant;
                      const isRowActive =
                        row.id === results.active.entrant && results.active.class === cls.id;
                      return (
                        <Entrant
                          key={row.id}
                          entrant={row}
                          initialResult={results[round.id]?.[cls.id]?.[row.id]}
                          updateResults={updateResult}
                          updateActive={updateActive}
                          roundId={round.id}
                          classId={cls.id}
                          isActive={isRowActive}
                          loading={
                            loading &&
                            ((loading[0] === round.id &&
                              loading[1] === cls.id &&
                              loading[2] === row.id) ||
                              (isRowActive && loading[2] === row.id))
                          }
                        />
                      );
                    })}
                  </Paper>
                );
              })}
            </div>
          </Paper>
        );
      })}
    </Stack>
  );
}
ScoringTableIceSkating.whyDidYouRender = true;

function Entrant({
  entrant,
  initialResult,
  updateResults,
  updateActive,
  isActive,
  roundId,
  classId,
  loading,
}: {
  entrant: Partial<Tables<'entrants'>>;
  initialResult: Result | undefined;
  updateResults: UpdateResultsHelper;
  updateActive: UpdateActiveHelper;
  isActive: boolean;
  roundId: string;
  classId: string;
  loading: boolean;
}) {
  const data = entrant.data as any;
  return (
    <form
      className="grid max-md:grid-cols-1 max-md:mb-4 grid-cols-[4fr,6fr] justify-between items-center px-2 gap-2"
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
      <div className="flex items-center gap-2">
        <Button
          size="compact-xs"
          variant={isActive ? 'filled' : 'default'}
          color="teal"
          onClick={() => updateActive({ round: roundId, cls: classId, entrant: entrant.id })}
        >
          Active
        </Button>
        {typeof entrant === 'number' ? (
          <Title order={4} className="event-header scroll-m-[5.25rem]">
            {entrant}
          </Title>
        ) : (
          <div className="flex flex-col flex-wrap">
            {data?.pair ? (
              <div>
                <Text display="inline-block">{data.pair[0].first_name}</Text>{' '}
                <Text display="inline-block" fw={600}>
                  {data.pair[0].last_name}
                </Text>
                {' / '}
                <Text display="inline-block">{data.pair[1].first_name}</Text>{' '}
                <Text display="inline-block" fw={600}>
                  {data.pair[1].last_name}
                </Text>
              </div>
            ) : (
              <div>
                <Text display="inline-block">{entrant.first_name}</Text>{' '}
                <Text display="inline-block" fw={600}>
                  {entrant.last_name}
                </Text>
              </div>
            )}
            {/* {!data.pair && (
              <div className="flex gap-3 text-dimmed">
               // {/* {entrant.dob && <Text size="xs">{dsShort.format(new Date(entrant.dob))}</Text>} }
                {entrant.country && <Text size="xs">{entrant.country}</Text>}
              </div>
            )} */}
          </div>
        )}
      </div>
      <div className="flex gap-2 justify-end">
        <NumberInput name="tech" autoComplete="off" min={0} defaultValue={initialResult?.tech} />
        <NumberInput name="pres" autoComplete="off" min={0} defaultValue={initialResult?.pres} />
        <NumberInput name="ddct" autoComplete="off" min={0} defaultValue={initialResult?.ddct} />
        <Button variant="light" type="submit" className="self-stretch h-auto" loading={loading}>
          Submit
        </Button>
      </div>
    </form>
  );
}

function isValidEventFormat<S extends Sport>(
  format: Tables<'events'>['format'] | undefined,
  sport: S
): format is EventFormat<S> {
  return !!(
    sport === 'ice-skating' &&
    format &&
    typeof format === 'object' &&
    'rounds' in format &&
    Array.isArray(format.rounds)
  );
}

function validateResults(results: Tables<'events'>['results'] | undefined): Results {
  if (!results || typeof results !== 'object' || Array.isArray(results)) return { active: {} };
  if (!('active' in results)) return { ...results, active: {} };
  return results as Results;
}
