'use client';

import { ScrollAreaAutosizeWithShadow } from '@/components/mantine-extensions/scroll-area-with-shadow';
import { RealtimeHeartbeat } from '@/components/realtime-heartbeat';
import { LiveDataPreviewIceSkating } from '@/components/scoring-table-json/ice-skating/preview';
import { ScoringTableProps } from '@/components/scoring-table-json/scoring-table-json';
import {
  UpdateActiveHelper,
  UpdateResultHelper,
  useUpdateJsonResults,
} from '@/components/scoring-table-json/use-update-json-results';
import { updateOutlineAtom } from '@/components/shell/event-outline';
import { EventResult } from '@/lib/event-data';
import { generateLiveDataIceSkating } from '@/lib/event-data/ice-skating';
import {
  Alert,
  Button,
  Collapse,
  Divider,
  List,
  ListItem,
  NumberInput,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDidUpdate, useDisclosure } from '@mantine/hooks';
import { IconChevronsUp, IconCircleCheck, IconInfoCircle } from '@tabler/icons-react';
import clsx from 'clsx';
import { useSetAtom } from 'jotai';
import Link from 'next/link';
import { Fragment } from 'react';

type Result = EventResult<'ice-skating'>;

export function ScoringTableJsonIceSkating(props: ScoringTableProps<'ice-skating'>) {
  const updateOutline = useSetAtom(updateOutlineAtom);
  const { results, updateActive, updateResult, loading, liveDataPreview } = useUpdateJsonResults(
    props,
    generateLiveDataIceSkating,
  );

  const [previewOpened, { toggle: togglePreview }] = useDisclosure(false);

  useDidUpdate(() => {
    updateOutline();
  }, [results, updateOutline]);

  return (
    <Stack>
      <Alert title="How to use this page" variant="light" color="blue" icon={<IconInfoCircle />}>
        <div className="grid gap-y-4 gap-x-8 grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col">
            <Text fw={600} mb="xs" c="blue.1">
              Overview
            </Text>
            <Text size="sm">
              This page is laid out in running order of the event. It powers graphics for the
              livestream. For example, our startlist graphic will use whichever class is active on
              here.
              <br />
              <br />
              The guide on the right (only on large screens) will scroll to each class on click, and
              show which class is active
              <br />
              <br />
              Live scores come from{' '}
              <Link
                className="text-blue-4 font-bold"
                href="http://www.iceresultsuk.org.uk/BritanniaCup/2024/index.htm"
                target="_blank"
                rel="noopener noreferrer"
              >
                IceResultsUK
              </Link>
              . For each category, click on{' '}
              <span className="text-orange-4">Starting Order / Detailed Classification</span>. That
              page will show the live scores as they come in.
            </Text>
          </div>
          <div className="flex flex-col">
            <Text fw={600} mb="xs" c="blue.1">
              Steps
            </Text>
            <List spacing="md">
              <ListItem>
                When an entrant steps onto the ice, set them as{' '}
                <Button component={Text} color="teal" size="compact-xs">
                  Active
                </Button>{' '}
                on the left of the list. This puts up a graphic for ~5 seconds
              </ListItem>
              <ListItem>
                Enter the scores when available. Press{' '}
                <Button component={Text} color="teal" size="compact-xs" variant="subtle">
                  Submit
                </Button>{' '}
                as soon as possible, but wait until the end of a replay if we are on one. This puts
                up a graphic for ~5 seconds. The graphic will{' '}
                <span className="font-bold">only</span> show if the entrant is active
              </ListItem>
              <ListItem>
                At the end of a category, we&apos;ll show a scoreboard. After it has gone off, set
                the next class{' '}
                <Button component={Text} color="teal" size="compact-xs">
                  Active
                </Button>
              </ListItem>
            </List>
          </div>
        </div>
      </Alert>
      <div className="fixed bottom-0 left-0 right-0 z-[103] p-2 bg-body border-t">
        <div className="flex items-center gap-4 px-2">
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
          <RealtimeHeartbeat />
        </div>
        <Collapse in={previewOpened}>
          <ScrollAreaAutosizeWithShadow mah={'50vh'} mt="xs">
            <div className="flex flex-col gap-8 w-full px-6">
              <LiveDataPreviewIceSkating {...liveDataPreview} />
            </div>
          </ScrollAreaAutosizeWithShadow>
        </Collapse>
      </div>
      {props.format.rounds.map((round) => {
        const isRoundActive = round.id === results.active?.round;
        return (
          <Paper key={round.id} p="sm" mb={52} shadow="sm" className="bg-body-dimmed" withBorder>
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
              {/* <Button
                size="compact-sm"
                variant={isRoundActive ? 'filled' : 'default'}
                onClick={() =>
                  updateActive({ round: round.id, cls: undefined, entrant: undefined })
                }
                loading={loading && loading[0] === round.id}
                leftSection={isRoundActive && <IconCircleCheck size={16} />}
              >
                Active
              </Button> */}
              <div
                className={clsx(
                  'w-3 h-3 shrink-0 rounded-full border shadow-xs transition-colors duration-200',
                  isRoundActive
                    ? 'border-green-5/70 bg-green-5/20'
                    : 'border-gray-5/70 bg-gray-5/20',
                )}
              />
            </div>
            <div className="flex flex-col gap-md">
              {round.classes.map((cls) => {
                const classId = `${round.id}.${cls.id}`;
                const isClassActive =
                  round.id === results.active?.round && cls.id === results.active?.class;

                return (
                  <Paper
                    key={classId}
                    p="sm"
                    display="flex"
                    withBorder
                    className={clsx(
                      'flex-col gap-2',
                      isClassActive && 'border-teal-4 dark:border-teal-7',
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
                        variant={isClassActive ? 'filled' : 'default'}
                        onClick={() =>
                          updateActive({ round: round.id, cls: cls.id, entrant: undefined })
                        }
                        loading={loading && loading[1] === cls.id}
                        leftSection={isClassActive && <IconCircleCheck size={16} />}
                      >
                        Active
                      </Button>
                    </div>
                    <Divider />
                    {cls.entrants.map((entrant, i) => {
                      const row = typeof entrant === 'number' ? { id: entrant } : entrant;
                      const isRowActive = row.id === results.active?.entrant && isClassActive;
                      return (
                        <Fragment key={row.id}>
                          {i > 0 && <Divider />}
                          <Entrant
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
                        </Fragment>
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
ScoringTableJsonIceSkating.whyDidYouRender = true;

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
  updateResults: UpdateResultHelper<'ice-skating'>;
  updateActive: UpdateActiveHelper;
  isActive: boolean;
  roundId: string;
  classId: string;
  loading: boolean;
}) {
  const data = entrant.data as any;
  return (
    <form
      className="grid max-md:grid-cols-1 max-md:my-2 grid-cols-[4fr,6fr] justify-between items-center px-2 gap-2"
      onSubmit={(ev) => {
        ev.preventDefault();
        const formData = new FormData(ev.currentTarget);
        const result: Result = {
          result: {
            tech: Number(formData.get('tech')),
            pres: Number(formData.get('pres')),
            ddct: Number(formData.get('ddct')),
          },
          // __ts: Date.now(),
        };
        const isActiveString = String(formData.get('isActive'));
        const isActiveBool = isActiveString === 'true';
        const message = isActiveString.length > 0 && !isActiveBool ? 'silent' : undefined;
        updateResults({
          round: roundId,
          cls: classId,
          id: entrant.id!,
          data: result.result,
          message,
        });
      }}
    >
      <input type="hidden" name="isActive" value={isActive.toString()} />
      <div className="flex items-center gap-2">
        <Button
          size="compact-xs"
          variant={isActive ? 'filled' : 'default'}
          color="teal"
          onClick={() =>
            updateActive({
              round: roundId,
              cls: classId,
              entrant: entrant.id,
              message: 'active entrant',
            })
          }
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
        <NumberInput
          label="Technical"
          labelProps={{ fz: 'xs' }}
          name="tech"
          autoComplete="off"
          min={0}
          defaultValue={initialResult?.result?.tech}
          placeholder={
            initialResult?.result?.tech ? initialResult?.result.tech.toString() : undefined
          }
        />
        <NumberInput
          label="Presentation"
          labelProps={{ fz: 'xs' }}
          name="pres"
          autoComplete="off"
          min={0}
          defaultValue={initialResult?.result?.pres}
          placeholder={
            initialResult?.result?.pres ? initialResult?.result.pres.toString() : undefined
          }
        />
        <NumberInput
          label="Deductions"
          labelProps={{ fz: 'xs' }}
          name="ddct"
          autoComplete="off"
          min={0}
          defaultValue={initialResult?.result?.ddct}
          placeholder={
            initialResult?.result?.ddct ? initialResult?.result.ddct.toString() : undefined
          }
        />
        <Button
          variant="light"
          type="submit"
          className="self-stretch h-auto shrink-0"
          loading={loading}
        >
          Submit
        </Button>
      </div>
    </form>
  );
}

// function isValidEventFormat<S extends Sport>(
//   format: Tables<'events'>['format'] | undefined,
//   sport: S,
// ): format is EventFormat<S> {
//   return !!(
//     sport === 'ice-skating' &&
//     format &&
//     typeof format === 'object' &&
//     'rounds' in format &&
//     Array.isArray(format.rounds)
//   );
// }

// function validateResults(results: Tables<'events'>['results'] | undefined): Results {
//   const now = Date.now()
//   if (!results || typeof results !== 'object' || Array.isArray(results)) return { active: {__ts: now} };
//   if (!('active' in results)) return { ...results, active: {__ts: now} };
//   return results as Results;
// }
