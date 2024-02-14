'use client';

import { ScrollAreaAutosizeWithShadow } from '@/components/mantine-extensions/scroll-area-with-shadow';
import { QueryLink } from '@/components/query-link';
import { RealtimeHeartbeat } from '@/components/realtime-heartbeat';
import { LiveDataPreviewClimbing } from '@/components/scoring-table-json/climbing/preview';
import { ScoringTableProps } from '@/components/scoring-table-json/scoring-table-json';
import {
  UpdateResultHelper,
  useUpdateJsonResults,
} from '@/components/scoring-table-json/use-update-json-results';
import { TimersRealtime } from '@/components/timer/controls/realtime';
import { EventResult } from '@/lib/event-data';
import { EventResultClimbing, generateLiveDataClimbing } from '@/lib/event-data/climbing';
import { toNumOr } from '@/lib/utils';
import {
  Alert,
  Button,
  Collapse,
  Divider,
  List,
  ListItem,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconArrowDown,
  IconChevronsUp,
  IconCircleCheck,
  IconInfoCircle,
} from '@tabler/icons-react';
import clsx from 'clsx';
import { Fragment } from 'react';

export function ClimbingHeadJudge(props: ScoringTableProps<'climbing'>) {
  const [previewOpened, { toggle: togglePreview }] = useDisclosure(false);
  const { results, updateActive, updateResult, loading, liveDataPreview } = useUpdateJsonResults(
    props,
    generateLiveDataClimbing,
  );

  return (
    <Stack mb={52}>
      <div className="sticky top-0 w-full pt-[60px] -mt-[60px] z-10 pointer-events-none max-w-[calc(100vw-3rem)]">
        {/* <div className="bg-red-4 h-16" /> */}
        <div className="bg-body sm:w-min flex justify-center sm:justify-start gap-2 -mx-content overflow-x-auto p-2 rounded-br-xl pointer-events-auto sm:border-b sm:border-r border-violet-4">
          <TimersRealtime size="compact-sm" ids={props.timers} />
        </div>
        <div className="sm:hidden border-b border-violet-4 -mx-content" />
      </div>
      <Alert title="How to use this page" variant="light" color="blue" icon={<IconInfoCircle />}>
        <Text fw={600} mb="xs" c="blue.1">
          Overview
        </Text>
        <List spacing="md">
          <ListItem>
            This page is for overseeing the scoring of the climbing event. This page must remain
            open for the live graphics to recieve updates.
          </ListItem>
          <ListItem>
            Update the{' '}
            <Button component={Text} color="teal" size="compact-xs">
              Active
            </Button>{' '}
            state for each round when they start.
          </ListItem>
        </List>
        <Text size="sm"></Text>
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
        {liveDataPreview && (
          <Collapse in={previewOpened}>
            <ScrollAreaAutosizeWithShadow mah={'50vh'} mt="xs">
              <div className="flex flex-col gap-8 w-full px-6">
                <LiveDataPreviewClimbing {...liveDataPreview} />
              </div>
            </ScrollAreaAutosizeWithShadow>
          </Collapse>
        )}
      </div>
      {props.format.rounds.map((round, i) => {
        const isRoundActive = round.id === results.active?.round;
        return (
          <Fragment key={round.id}>
            <Paper
              p="sm"
              shadow="sm"
              className={clsx(
                'bg-body-dimmed',
                isRoundActive && 'border-teal-4 dark:border-teal-7',
              )}
              withBorder
            >
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
                  variant={isRoundActive ? 'filled' : 'default'}
                  onClick={() =>
                    updateActive({ round: round.id, cls: undefined, entrant: undefined })
                  }
                  loading={loading && loading[0] === round.id}
                  leftSection={isRoundActive && <IconCircleCheck size={16} />}
                >
                  Active
                </Button>
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
                      </div>
                      <Divider />
                      {cls.entrants.map((entrant, i) => {
                        const row = typeof entrant === 'number' ? { id: entrant } : entrant;
                        const isRowActive = row.id === results.active?.entrant && isClassActive;
                        return (
                          <Fragment key={row.id}>
                            {i > 0 && <Divider />}
                            <Entrant
                              index={i}
                              entrant={row}
                              initialResult={results[round.id]?.[cls.id]?.[row.id]}
                              updateResults={updateResult}
                              roundId={round.id}
                              classId={cls.id}
                              isActive={isRowActive}
                              blocCount={props.formatOptions.blocCount}
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
            {i < props.format.rounds.length - 1 && (
              <Button
                fullWidth
                disabled
                className="max-w-sm mx-auto"
                leftSection={<IconArrowDown />}
                rightSection={<IconArrowDown />}
              >
                Progress {round.name} to {props.format.rounds[i + 1].name}
              </Button>
            )}
          </Fragment>
        );
      })}
    </Stack>
  );
}

type EntrantProps = {
  index?: number;
  entrant: Partial<Tables<'entrants'>>;
  initialResult: EventResult<'climbing'> | undefined;
  updateResults: UpdateResultHelper<'climbing'>;
  isActive: boolean;
  roundId: string;
  classId: string;
  loading: boolean;
  blocCount: number;
};

function Entrant({
  index,
  entrant,
  initialResult,
  updateResults,
  isActive,
  roundId,
  classId,
  loading,
  blocCount,
}: EntrantProps) {
  return (
    <form
      className="grid max-md:grid-cols-1 max-md:my-2 grid-cols-[1fr,4fr] justify-between items-center px-2 gap-2"
      onSubmit={(ev) => {
        ev.preventDefault();
        const formData = new FormData(ev.currentTarget);
        const result: EventResultClimbing = [
          [
            {
              startedAt: toNumOr(formData.get('startedAt'), Date.now()),
              zoneAt: toNumOr(formData.get('zoneAt'), undefined),
              topAt: toNumOr(formData.get('topAt'), undefined),
              endedAt: toNumOr(formData.get('endedAt'), undefined),
            },
          ],
        ];
        const isActiveString = String(formData.get('isActive'));
        const isActiveBool = isActiveString === 'true';
        const message = isActiveString.length > 0 && !isActiveBool ? 'silent' : undefined;
        updateResults({ round: roundId, cls: classId, id: entrant.id!, data: result, message });
      }}
    >
      <input type="hidden" name="isActive" value={isActive.toString()} />
      <div className="flex items-center gap-2">
        {/* <Button
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
        </Button> */}
        {typeof entrant === 'number' ? (
          <Title order={4} className="event-header scroll-m-[5.25rem]">
            {entrant}
          </Title>
        ) : (
          <div className="flex flex-wrap gap-x-1 gap-y-2">
            <Text display="inline-block">{entrant.first_name}</Text>{' '}
            <Text display="inline-block" fw={600}>
              {entrant.last_name}
            </Text>
          </div>
        )}
      </div>
      <div className="flex gap-4 justify-end">
        <EntrantScores
          index={index}
          isActive={isActive}
          blocCount={blocCount}
          initialResult={initialResult}
          classId={classId}
          entrantId={entrant.id}
        />
        <Button variant="light" type="submit" className="self-center shrink-0" loading={loading}>
          Submit
        </Button>
      </div>
    </form>
  );
}

function EntrantScores({
  index,
  isActive,
  blocCount,
  initialResult,
  classId,
  entrantId,
}: Pick<EntrantProps, 'index' | 'isActive' | 'initialResult' | 'blocCount' | 'classId'> & {
  entrantId: EntrantProps['entrant']['id'];
}) {
  return (
    <div className="flex flex-wrap gap-2 items-center justify-around">
      {Array.from({ length: blocCount }).map((_, i) => {
        const blocScores = getBlocScores(initialResult?.result[i]);

        return (
          <div key={i} className="flex flex-col">
            {index === 0 && <Divider label={`Bloc ${i + 1}`} mt={-4} />}
            <Button
              component={QueryLink}
              query={{
                judge: `${classId.charAt(0).toUpperCase()}${i + 1}`,
                entrant: entrantId,
              }}
              removeOthers
              size="compact-md"
              variant={isActive ? 'outline' : blocScores ? 'light' : 'subtle'}
              color={blocScores?.climbing ? 'orange' : 'blue'}
            >
              <div className="flex space-x-2">
                <Text
                  miw={20}
                  c={blocScores?.top || blocScores?.topProvisional ? undefined : 'dimmed'}
                >
                  T{blocScores?.top || blocScores?.topProvisional || '\u00A0'}
                </Text>
                <Text miw={20} c={blocScores?.zone ? undefined : 'dimmed'}>
                  Z{blocScores?.zone || '\u00A0'}
                </Text>
                <Text miw={20} c={blocScores?.attempts ? undefined : 'dimmed'}>
                  A{blocScores?.attempts || '\u00A0'}
                </Text>
              </div>
            </Button>
          </div>
        );
      })}
    </div>
  );
}

type BlocScores = {
  climbing: boolean;
  top: number;
  topProvisional: number;
  zone: number;
  attempts: number;
};

function getBlocScores(result?: EventResult<'climbing'>['result'][number]): BlocScores | undefined {
  if (!result) return undefined;
  const scores = { attempts: result.length } as BlocScores;

  for (let i = 0; i < result.length; i++) {
    const bloc = result[i];
    scores.climbing ||= bloc.startedAt !== undefined && bloc.endedAt === undefined;
    scores.topProvisional ||= bloc.topAtProvisional !== undefined ? i + 1 : 0;
    scores.top ||= bloc.topAt !== undefined ? i + 1 : 0;
    scores.zone ||= bloc.zoneAt !== undefined ? i + 1 : 0;
  }

  return scores;
}
