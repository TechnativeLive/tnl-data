import { ConfirmButton } from '@/components/mantine-extensions/confirm-button'
import { StackedButton } from '@/components/mantine-extensions/stacked-button'
import { QueryLink } from '@/components/query-link'
import { ScoringTableProps } from '@/components/scoring-table-json/scoring-table-json'
import { useJudgeJson } from '@/components/scoring-table-json/use-judge-json'
import { useEventTimers } from '@/components/timer/event-timers-context'
import { EventResult, JudgeDataClimbing } from '@/lib/event-data'
import { elapsedTime } from '@/lib/timer/utils'
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
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

type Attempt = NonNullable<EventResult<'climbing'>['result'][number]>[number]

function getScoreState(attempt?: Attempt): 0 | 1 | 2 | 3 {
  if (attempt?.topAt !== undefined || attempt?.endedAt !== undefined) return 0
  if (attempt?.topAtProvisional !== undefined) return 3
  if (attempt?.zoneAt !== undefined) return 2
  if (attempt?.startedAt !== undefined) return 1
  return 0
}

type MinorJudgeProps = Omit<
  ScoringTableProps<'climbing'>,
  'judgesData' | 'dsPrivateKey' | 'timers'
> & { judgeData?: JudgeDataClimbing; station: string }

export function ClimbingMinorJudge({
  format,
  results,
  judgeData: initialJudgeData,
  station,
  formatOptions,
}: MinorJudgeProps) {
  const searchParams = useSearchParams()

  const [timer] = useEventTimers()
  // const [isActive, setIsActive] = useState(false);

  const stationClassId = station.charAt(0) === 'M' ? 'mens' : 'womens'
  const activeRound = format.rounds.find((round) => round.id === results.active?.round)
  const stationClass = activeRound?.classes.find((cls) => cls.id === stationClassId)
  const entrantIndex = toNumOr(searchParams.get('entrant'), 1) - 1
  const entrant = stationClass?.entrants[entrantIndex >= 0 ? entrantIndex : 0]

  const { judgeData, updateActive, updateResult } = useJudgeJson({
    judgeData: initialJudgeData,
    station,
    blocCount: formatOptions.blocCount,
    round: activeRound?.id,
    class: stationClassId,
  })

  if (!activeRound)
    return (
      <div className="py-8 w-full grid place-content-center justify-items-center gap-4">
        Waiting for the head judge to set an active round
        <Loader type="bars" />
      </div>
    )

  if (!stationClass)
    return (
      <div className="py-8 w-full grid place-content-center justify-items-center gap-4">
        No class found for Judge {station}
      </div>
    )

  if (!entrant) {
    return (
      <div className="py-8 w-full grid place-content-center justify-items-center gap-4">
        Waiting for the head judge to add entrants
        <Loader type="bars" />
      </div>
    )
  }

  const isActive = judgeData?.active?.entrant === entrant.id

  const prevEntrant = entrantIndex > 0 ? stationClass.entrants[entrantIndex - 1] : undefined
  const nextEntrant =
    entrantIndex > -1 && entrantIndex < stationClass.entrants.length - 1
      ? stationClass.entrants[entrantIndex + 1]
      : undefined

  const entrantStatus = results[activeRound.id]?.[stationClass.id]?.[entrant.id]?.status
  const blocResults = judgeData?.[activeRound.id]?.[stationClass.id]?.[entrant.id] ?? []
  const latestAttempt = blocResults?.[blocResults.length - 1]

  function handleStart() {
    const elapsed = elapsedTime(timer)
    if (!activeRound || !entrant) return
    const newResults = blocResults.slice()

    if (scoreState === 0) {
      const newAttempt = { startedAt: elapsed }
      newResults.push(newAttempt)
    } else {
      // if mid-attempt, wipe the zone/top/ended times but keep the original start time
      const attempt = newResults[newResults.length - 1]
      newResults[newResults.length - 1] = { startedAt: attempt?.startedAt || Date.now() }
    }

    updateResult({
      id: entrant.id,
      data: newResults,
      feedback: null,
    })
  }

  function handleZone() {
    if (!activeRound || !entrant || scoreState === 0 || scoreState === 2) return
    const elapsed = elapsedTime(timer)
    const newResults = blocResults.slice()

    const attempt = newResults[newResults.length - 1]

    if (!attempt) {
      console.warn('No attempt found')
      return
    }

    if (scoreState === 1) {
      newResults[newResults.length - 1] = { startedAt: attempt.startedAt, zoneAt: elapsed }
    } else {
      // scoreState === 3
      newResults[newResults.length - 1] = { startedAt: attempt.startedAt, zoneAt: attempt.zoneAt }
    }

    updateResult({
      id: entrant.id,
      data: newResults,
      feedback: null,
    })
  }

  function handleTop() {
    if (!activeRound || !entrant || scoreState !== 2) return
    const elapsed = elapsedTime(timer)
    const newResults = blocResults.slice()

    const attempt = newResults[newResults.length - 1]

    if (!attempt) {
      console.warn('No attempt found')
      return
    }

    attempt.topAtProvisional = elapsed

    updateResult({
      id: entrant.id,
      data: newResults,
      feedback: null,
    })
  }

  function handleEnd() {
    if (!activeRound || !entrant || scoreState === 0) return
    const elapsed = elapsedTime(timer)
    const newResults = blocResults.slice()

    const attempt = newResults[newResults.length - 1]

    if (!attempt) {
      console.warn('No attempt found')
      return
    }
    if (scoreState === 3) {
      attempt.topAt = attempt.topAtProvisional || elapsed
      attempt.endedAt = attempt.topAt
    } else {
      attempt.endedAt = elapsed
    }

    updateResult({
      id: entrant.id,
      data: newResults,
      feedback: null,
    })
  }

  function handleDelete(attemptNumber: number) {
    if (!activeRound || !entrant) return
    const newResults = blocResults.slice()

    newResults.splice(attemptNumber - 1, 1)

    updateResult({
      id: entrant.id,
      data: newResults,
      feedback: null,
    })
  }

  function handleEdit(attemptNumber: number | undefined, target: 'start' | 'zone' | 'top') {
    if (!activeRound || !entrant || !attemptNumber) return
    const newResults = blocResults.slice()

    const attempt = newResults[attemptNumber - 1]

    if (!attempt) {
      console.warn('No attempt found')
      return
    }

    if (target === 'start') {
      delete newResults[attemptNumber - 1]!.topAt
      delete newResults[attemptNumber - 1]!.topAtProvisional
      delete newResults[attemptNumber - 1]!.zoneAt
    } else if (target === 'zone') {
      delete newResults[attemptNumber - 1]!.topAt
      delete newResults[attemptNumber - 1]!.topAtProvisional
      newResults[attemptNumber - 1]!.zoneAt =
        attempt.zoneAt || attempt.endedAt || elapsedTime(timer)
    } else if (target === 'top') {
      const time =
        attempt.topAt || attempt.topAtProvisional || attempt.endedAt || elapsedTime(timer)
      newResults[attemptNumber - 1]!.topAtProvisional = time
      newResults[attemptNumber - 1]!.topAt = time
      newResults[attemptNumber - 1]!.zoneAt = Math.min(attempt.zoneAt ?? time, time)
    }

    updateResult({
      id: entrant.id,
      data: newResults,
      feedback: `Attempt changed to ${target.toLocaleUpperCase()}`,
    })
  }

  const scoreState = getScoreState(latestAttempt)
  // const isActive = judgeData.active?.entrant === entrant.id;

  return (
    <div className="flex flex-col h-full rounded-lg border border-body-dimmed-hover overflow-hidden">
      <div
        className={clsx(
          entrantStatus
            ? 'bg-red-5 text-dark-7'
            : isActive
              ? 'bg-teal-5 text-dark-7'
              : 'bg-body-dimmed',
          'flex relative text-center text-lg tracking-widest uppercase font-bold w-full border-b',
        )}
      >
        <div className="py-2 px-4 border-r flex items-center shrink-0">{station}</div>
        <div className="py-2 px-4 grow text-black dark:text-white">
          {entrant.first_name} {entrant.last_name}
          {entrantStatus && ` - ${entrantStatus}`}
        </div>

        <div className="py-2 px-4 border-l flex items-center shrink-0">#{entrantIndex + 1}</div>
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
              className="min-w-[6rem] py-2 items-center active:bg-red-400"
              component={QueryLink}
              query={{ entrant: entrantIndex }}
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
              query={{ entrant: entrantIndex + 2 }}
              variant={latestAttempt?.topAt ? 'outline' : 'default'}
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

          <Button
            size="lg"
            className="self-center mt-8 min-w-[15ch]"
            variant={isActive ? 'filled' : 'outline'}
            color={isActive ? 'teal.5' : 'orange'}
            c={isActive ? 'dark.7' : undefined}
            onClick={() =>
              updateActive({
                entrant: !isActive ? entrant.id : undefined,
                feedback: null,
              })
            }
          >
            {isActive ? 'Clear Active' : 'Set Active'}
          </Button>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center mx-4 my-12">
            <ActiveButton
              active={scoreState === 1}
              hint={scoreState === 0 && !latestAttempt?.topAt && isActive}
              disabled={scoreState === 1 || latestAttempt?.topAt !== undefined}
              onClick={handleStart}
            >
              Start Attempt
            </ActiveButton>
            <div className="flex flex-wrap gap-1 grow">
              <ActiveButton
                active={scoreState === 2}
                hint={scoreState === 1}
                disabled={scoreState === 0 || scoreState === 2}
                onClick={handleZone}
              >
                Zone
              </ActiveButton>
              <ActiveButton
                active={scoreState === 3}
                hint={scoreState === 2}
                disabled={scoreState !== 2}
                onClick={handleTop}
              >
                Top
              </ActiveButton>
            </div>
            <ActiveButton
              hint={scoreState !== 0}
              active={false}
              disabled={scoreState === 0}
              onClick={handleEnd}
            >
              {scoreState === 3 ? 'Confirm' : 'End Attempt'}
            </ActiveButton>
          </div>

          <div className="flex flex-col gap-2 p-4">
            <Divider label="Attempts" mb="sm" />
            <div className="flex flex-col-reverse gap-2">
              {blocResults?.map((attempt, i) => (
                <Attempt
                  key={i}
                  attempt={attempt}
                  number={i + 1}
                  active={i === blocResults.length - 1 && scoreState !== 0}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                />
              ))}
            </div>
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
        <div className="absolute inset-0 rounded animate-rotate-border">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pb-[calc(100%*1.42)] w-[calc(100%*1.42)] rounded-full rotate-border-gradient" />
        </div>
      )}
      <Button
        opacity={1}
        radius={3}
        fullWidth
        className="px-2 grow"
        size="xl"
        variant={hint ? 'outline' : 'default'}
        color="orange"
        {...props}
      />
    </div>
  )
}

type BadgeLabel = 'Started' | 'Zone' | 'Top' | 'Top (Provisional)'
function getBadge(attempt: Attempt): {
  label: BadgeLabel
  color: string
} {
  if (attempt?.topAt !== undefined) return { label: 'Top', color: 'teal' }
  if (attempt?.topAtProvisional !== undefined)
    return { label: 'Top (Provisional)', color: 'orange' }
  if (attempt?.zoneAt !== undefined) return { label: 'Zone', color: 'blue' }
  return { label: 'Started', color: 'gray' }
}

function Attempt({
  attempt,
  number,
  active,
  handleEdit,
  handleDelete,
}: {
  attempt: Attempt
  number: number
  active: boolean
  handleEdit: (attemptNumber: number | undefined, target: 'start' | 'zone' | 'top') => void
  handleDelete: (attemptNumber: number) => void
}) {
  const [opened, { open, close }] = useDisclosure(false)
  const [editing, setEditing] = useState<number>()

  const badge = getBadge(attempt)

  const attemptTime =
    attempt?.endedAt !== undefined
      ? dayjs(attempt.endedAt - attempt.startedAt).format('m:ss')
      : undefined

  return (
    <>
      <Modal centered opened={opened} onClose={close} title={`Edit Attempt ${editing}`}>
        {/* show no score / zonne / top options for `editing` attempt and update db on click */}
        <ButtonGroup>
          <Button
            onClick={() => handleEdit(editing, 'start')}
            className="flex-grow flex-shrink-0 basis-0"
            size="lg"
            variant={badge.label === 'Started' ? 'filled' : 'default'}
          >
            No Score
          </Button>
          <Button
            onClick={() => handleEdit(editing, 'zone')}
            className="flex-grow flex-shrink-0 basis-0"
            size="lg"
            variant={badge.label === 'Zone' ? 'filled' : 'default'}
          >
            Zone
          </Button>
          <Button
            onClick={() => handleEdit(editing, 'top')}
            className="flex-grow flex-shrink-0 basis-0"
            size="lg"
            variant={badge.label === 'Top' ? 'filled' : 'default'}
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
            {attemptTime && (
              <Badge variant="light" size="lg" color="gray">
                {attemptTime}
              </Badge>
            )}
            <Badge variant="light" size="lg" color={badge.color || 'gray'}>
              {badge.label}
            </Badge>
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
              disabled={active}
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
