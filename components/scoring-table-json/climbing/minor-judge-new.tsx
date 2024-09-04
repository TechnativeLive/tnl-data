'use client'

import { ConfirmButton } from '@/components/mantine-extensions/confirm-button'
import { StackedButton } from '@/components/mantine-extensions/stacked-button'
import { QueryLink } from '@/components/query-link'
import { ScoringTableProps } from '@/components/scoring-table-json/scoring-table-json'
import { createBrowserClient } from '@/lib/db/client'
import { toNumOr } from '@/lib/utils'
import {
  Badge,
  Button,
  ButtonGroup,
  ButtonProps,
  Divider,
  Loader,
  Modal,
  Text,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

function getScoreState(attempt?: Tables<'runs_bouldering'>): 0 | 1 | 2 | 3 {
  if (attempt?.top_at || attempt?.ended_at) return 0
  if (attempt?.top_at_provisional) return 3
  if (attempt?.zone_at) return 2
  if (attempt?.started_at) return 1
  return 0
}

type RunUpsert<T extends 'update' | 'insert'> = (
  action: T,
  run: T extends 'update' ? DbUpdate<'runs_bouldering'> : DbInsert<'runs_bouldering'>,
  overwrite?: boolean,
) => void

type MinorJudgeProps = {
  category: Tables<'runs_bouldering'>['category']
  activeRoundId: string
} & Pick<ScoringTableProps<'climbing'>, 'format'>

export function ClimbingMinorJudge({ category, format, activeRoundId }: MinorJudgeProps) {
  const supabase = createBrowserClient()
  const [runs, setRuns] = useState<DbInsert<'runs_bouldering'>[]>([])

  const createRun = useCallback<(run: DbInsert<'runs_bouldering'>) => void>(
    async (run) => {
      setRuns((prevRuns) => [run, ...prevRuns])

      const { error } = await supabase.from('runs_bouldering').insert(run)
      if (error) {
        notifications.show({
          title: 'Error creating run',
          message: error.message,
          color: 'red',
        })
      }
    },
    [supabase, setRuns],
  )

  const updateRun = useCallback<(run: DbUpdate<'runs_bouldering'>, overwrite?: boolean) => void>(
    async (run, overwrite = false) => {
      if (!run.id) {
        console.warn('Run id is required', run)
        return
      }
      setRuns((prevRuns) => {
        const newRuns = [...prevRuns]
        const index = newRuns.findIndex((r) => r.id === run.id)
        if (index === -1) {
          console.warn('Run not found', run)
          return prevRuns
        }
        newRuns[index] = overwrite
          ? (run as DbInsert<'runs_bouldering'>)
          : { ...newRuns[index]!, ...run }
        return newRuns
      })
      const { error } = await supabase.from('runs_bouldering').update(run).eq('id', run.id)
      if (error) {
        notifications.show({
          title: 'Error updating run',
          message: error.message,
          color: 'red',
        })
      }
      return
    },
    [supabase, setRuns],
  )

  const deleteRun = useCallback<(id: Tables<'runs_bouldering'>['id']) => void>(
    async (id) => {
      setRuns((prevRuns) => prevRuns.filter((r) => r.id !== id))

      const { error } = await supabase.from('runs_bouldering').delete().eq('id', id)
      if (error) {
        notifications.show({
          title: 'Error creating run',
          message: error.message,
          color: 'red',
        })
      }
    },
    [supabase, setRuns],
  )

  const searchParams = useSearchParams()
  const judge = searchParams.get('judge')
  const bloc = toNumOr(judge?.charAt(1), undefined)

  useEffect(() => {
    const getRuns = async () => {
      if (!bloc || !category) return
      const { data, error } = await supabase
        .from('runs_bouldering')
        .select('*')
        .filter('category', 'eq', category)
        .filter('bloc', 'eq', bloc)
        .order('started_at', { ascending: false })
      if (error) {
        notifications.show({
          title: 'Error fetching data',
          message: error.message,
          color: 'red',
        })
        return
      }
      setRuns(data)
    }
    getRuns()
  }, [setRuns, category, bloc, supabase])

  if (!judge) return <div>This page should only be used with a `judge` search param</div>

  // const { results, updateResult } = useUpdateJsonResults(props, generateLiveDataClimbing);

  const judgeClassId = judge.charAt(0) === 'M' ? 'mens' : 'womens'
  const activeRound = format.rounds.find((round) => round.id === activeRoundId)

  if (!activeRound)
    return (
      <div className="py-8 w-full grid place-content-center justify-items-center gap-4">
        Waiting for the head judge to set an active round
        <Loader type="bars" />
      </div>
    )

  const judgeClass = activeRound.classes.find((cls) => cls.id === judgeClassId)
  if (!judgeClass)
    return (
      <div className="py-8 w-full grid place-content-center justify-items-center gap-4">
        No class found for Judge {judge}
      </div>
    )

  // const classResults = judgeClass ? results[activeRound.id]?.[judgeClass.id] : undefined;

  const entrantId = Number(searchParams.get('entrant'))
  const entrantIndex = judgeClass.entrants.findIndex((ent) =>
    typeof ent === 'number' ? ent === entrantId : ent.id === entrantId,
  )
  const entrant = judgeClass.entrants[entrantIndex > -1 ? entrantIndex : 0]
  const prevEntrant = entrantIndex > 0 ? judgeClass.entrants[entrantIndex - 1] : undefined
  const nextEntrant =
    entrantIndex > -1 && entrantIndex < judgeClass.entrants.length - 1
      ? judgeClass.entrants[entrantIndex + 1]
      : undefined

  // function handleStart() {
  //   if (!activeRound || !entrant) return;

  //   // if (!Array.isArray(newResults[position - 1])) newResults[position - 1] = [];
  //   // const bloc = newResults[position - 1];

  //   if (scoreState === 0) {
  //     const newAttempt = { started_at: Date.now() };
  //     createRun(newAttempt);
  //   } else {
  //     // if mid-attempt, wipe the zone/top/ended times but keep the original start time
  //     const attempt = bloc[bloc.length - 1];
  //     bloc[bloc.length - 1] = { started_at: attempt.started_at };
  //   }

  //   updateResult({
  //     round: activeRound.id,
  //     cls: judgeClassId,
  //     id: entrant.id,
  //     data: newResults,
  //     feedback: null,
  //   });
  // }

  // function handleZone() {
  //   if (!activeRound || !entrant || scoreState === 0 || scoreState === 2) return;
  //   const newResults = [...(entrantResults ?? [])];
  //   const bloc = newResults[position - 1];

  //   if (scoreState === 1) {
  //     const attempt = bloc[bloc.length - 1];
  //     bloc[bloc.length - 1] = { started_at: attempt.started_at, zone_at: Date.now() };
  //   } else {
  //     // scoreState === 3
  //     const attempt = bloc[bloc.length - 1];
  //     bloc[bloc.length - 1] = { started_at: attempt.started_at, zone_at: attempt.zone_at };
  //   }

  //   updateResult({
  //     round: activeRound.id,
  //     cls: judgeClassId,
  //     id: entrant.id,
  //     data: newResults,
  //     feedback: null,
  //   });
  // }

  // function handleTop() {
  //   if (!activeRound || !entrant || scoreState !== 2) return;
  //   const newResults = [...(entrantResults ?? [])];
  //   const bloc = newResults[position - 1];
  //   const attempt = bloc[bloc.length - 1];

  //   attempt.top_at_provisional = Date.now();
  //   updateResult({
  //     round: activeRound.id,
  //     cls: judgeClassId,
  //     id: entrant.id,
  //     data: newResults,
  //     feedback: null,
  //   });
  // }

  // function handleEnd() {
  //   if (!activeRound || !entrant || scoreState === 0) return;
  //   const newResults = [...(entrantResults ?? [])];
  //   const bloc = newResults[position - 1];
  //   const attempt = bloc[bloc.length - 1];

  //   attempt.ended_at = Date.now();
  //   if (scoreState === 3) {
  //     attempt.top_at = attempt.top_at_provisional || Date.now();
  //   }

  //   updateResult({
  //     round: activeRound.id,
  //     cls: judgeClassId,
  //     id: entrant.id,
  //     data: newResults,
  //     feedback: null,
  //   });
  // }

  // function handleDelete(attemptNumber: number) {
  //   if (!activeRound || !entrant) return;
  //   const newResults = [...(entrantResults ?? [])];
  //   const bloc = newResults[position - 1];
  //   bloc.splice(attemptNumber - 1, 1);

  //   updateResult({
  //     round: activeRound.id,
  //     cls: judgeClassId,
  //     id: entrant.id,
  //     data: newResults,
  //     feedback: null,
  //   });
  // }

  const latestAttempt = runs[0]
  // const scoreState = getScoreState(latestAttempt);

  return (
    <div className="flex flex-col h-full rounded-lg border border-body-dimmed-hover overflow-hidden">
      <div className="px-4 py-2 text-center text-lg tracking-widest uppercase font-bold w-full border-b bg-body-dimmed">
        {judgeClassId}
        {entrant && (
          <span>
            {' - '}
            <span className="text-white">
              {entrant.first_name} {entrant.last_name}
            </span>
          </span>
        )}
      </div>

      {!entrant && (
        <div className="h-full grid place-content-center gap-6 text-center px-8">
          <span>Waiting for the head judge to activate the round</span>
          <span>This page will automatically update when the round starts</span>
        </div>
      )}

      {entrant && (
        <>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 p-4">
            <StackedButton
              disabled={!prevEntrant}
              className="min-w-[6rem] py-2 items-center"
              component={QueryLink}
              query={{ entrant: prevEntrant?.id }}
              leftSection={<IconChevronLeft />}
              rightSection={<IconChevronRight className="opacity-0" />}
            >
              <Text fz="xs">Previous Entrant</Text>
              <Text fw={600}>
                {prevEntrant?.first_name}
                {'\u00A0'}
                {prevEntrant?.last_name}
              </Text>
            </StackedButton>
            <StackedButton
              disabled={!nextEntrant}
              className="min-w-[6rem] py-2 items-center"
              component={QueryLink}
              query={{ entrant: nextEntrant?.id }}
              variant={latestAttempt?.top_at ? 'outline' : 'default'}
              color="orange"
              leftSection={<IconChevronLeft className="opacity-0" />}
              rightSection={<IconChevronRight />}
            >
              <Text fz="xs">Next Entrant</Text>
              <Text fw={600}>
                {nextEntrant?.first_name}
                {'\u00A0'}
                {nextEntrant?.last_name}
              </Text>
            </StackedButton>
          </div>

          {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center mx-4 my-12">
            <ActiveButton
              active={scoreState === 1}
              hint={scoreState === 0 && !latestAttempt?.top_at}
              disabled={scoreState === 1 || !!latestAttempt?.top_at}
              onClick={handleStart}
            >
              Start
            </ActiveButton>
            <div className="flex flex-wrap gap-1 grow">
              <ActiveButton
                active={scoreState === 2}
                hint={scoreState === 1}
                size="md"
                disabled={scoreState === 0 || scoreState === 2}
                onClick={handleZone}
              >
                Zone
              </ActiveButton>
              <ActiveButton
                active={scoreState === 3}
                hint={scoreState === 2}
                size="md"
                disabled={scoreState !== 2}
                onClick={handleTop}
              >
                Top
              </ActiveButton>
            </div>
            <ActiveButton
              hint={scoreState !== 0}
              active={false}
              size="md"
              disabled={scoreState === 0}
              onClick={handleEnd}
            >
              {scoreState === 3 ? 'Confirm' : 'End'}
            </ActiveButton>
          </div> */}

          <div className="flex flex-col gap-2 p-4">
            <Divider label="Attempts" mb="sm" />
            {/* <div className="flex flex-col-reverse gap-2">
              {runs?.map((attempt, i) => (
                <Attempt
                  key={i}
                  attempt={attempt}
                  number={i + 1}
                  active={i === runs.length - 1 && scoreState !== 0}
                  handleDelete={handleDelete}
                />
              ))}
            </div> */}
          </div>
        </>
      )}
    </div>
  )
}

function ActiveButton({
  hint,
  active,
  ...props
}: { hint: boolean; active: boolean } & ButtonProps &
  Omit<
    React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
    'ref'
  >) {
  return (
    <div className="relative grow p-px rounded overflow-hidden">
      {active && (
        <div className="absolute inset-0 p-px animate-rotate-border">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pb-[calc(100%*1.42)] w-[calc(100%*1.42)] rounded-full rotate-border-gradient" />
        </div>
      )}
      <Button
        opacity={1}
        radius={3}
        fullWidth
        className="px-2 grow"
        size="md"
        variant={hint ? 'outline' : 'default'}
        color="orange"
        {...props}
      />
    </div>
  )
}

function getBadge(attempt: Tables<'runs_bouldering'>) {
  if (attempt.top_at) return { label: 'Top', color: 'teal' }
  if (attempt.top_at_provisional) return { label: 'Top (Provisional)', color: 'orange' }
  if (attempt.zone_at) return { label: 'Zone', color: 'blue' }
  return { label: 'Started', color: 'gray' }
}

function Attempt({
  attempt,
  number,
  active,
  handleDelete,
}: {
  attempt: Tables<'runs_bouldering'>
  number: number
  active: boolean
  handleDelete: (attemptNumber: number) => void
}) {
  const [opened, { open, close }] = useDisclosure(false)
  const [editing, setEditing] = useState<number>()

  const score = attempt.top_at ? 'Top' : attempt.zone_at ? 'Zone' : 'No Score'
  const badge = getBadge(attempt)

  const attemptTime = attempt.ended_at
    ? dayjs(attempt.ended_at - attempt.started_at).format('m:ss')
    : undefined

  return (
    <>
      <Modal centered opened={opened} onClose={close} title={`Edit Attempt ${editing}`}>
        {/* show no score / zonne / top options for `editing` attempt and update db on click */}
        <ButtonGroup>
          <Button
            onClick={() => console.warn('implement - set score no score')}
            className="flex-grow flex-shrink-0 basis-0"
            size="lg"
            variant={score === 'No Score' ? 'filled' : 'default'}
          >
            No Score
          </Button>
          <Button
            onClick={() => console.warn('implement - set score zone')}
            className="flex-grow flex-shrink-0 basis-0"
            size="lg"
            variant={score === 'Zone' ? 'filled' : 'default'}
          >
            Zone
          </Button>
          <Button
            onClick={() => console.warn('implement - set score top')}
            className="flex-grow flex-shrink-0 basis-0"
            size="lg"
            variant={score === 'Top' ? 'filled' : 'default'}
          >
            Top
          </Button>
        </ButtonGroup>
      </Modal>
      <div
        className={clsx(
          'relative flex gap-4 items-center rounded-md border p-2 flex-grow border-body-dimmed',
        )}
      >
        {active && (
          <div className="absolute inset-0 shadow-teal-5/50 border border-teal-5/70 shadow-md rounded-md animate-pulse" />
        )}
        <div className="pl-2 shrink-0">
          <Text span fz="xs" c="dimmed">
            ATT.{' '}
          </Text>
          <Text span fz="md">
            {number}
          </Text>
        </div>
        <Divider orientation="vertical" />

        <div className="flex flex-wrap grow items-center gap-x-4 gap-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="light" size="lg" color={badge.color || 'gray'}>
              {badge.label}
            </Badge>
            {attemptTime && (
              <Badge variant="light" size="lg" color="gray">
                {attemptTime}
              </Badge>
            )}
          </div>
          {/* <Badge variant="light" size="lg">
          {status}
        </Badge> */}
          {/* <Divider className="ml-auto max-xs:hidden" orientation="vertical" /> */}
          <div className="flex items-center gap-4 ml-auto">
            <Button
              size="sm"
              color="gray"
              onClick={() => {
                open()
                setEditing(number)
              }}
            >
              Edit
            </Button>
            <ConfirmButton
              confirmMessage="Confirm"
              size="sm"
              color="red"
              confirmVariant="filled"
              onClick={() => handleDelete(number)}
            >
              Delete
            </ConfirmButton>
          </div>
        </div>
      </div>
    </>
  )
}
