'use client'

import { ConfirmButton } from '@/components/mantine-extensions/confirm-button'
import { ScrollAreaAutosizeWithShadow } from '@/components/mantine-extensions/scroll-area-with-shadow'
import { QueryLink } from '@/components/query-link'
import { RealtimeHeartbeat } from '@/components/realtime-heartbeat'
import { LiveDataPreviewClimbing } from '@/components/scoring-table-json/climbing/preview'
import {
  getAttemptsFromScore,
  getBlocScores,
  getBoulderingJudgeIndex,
} from '@/components/scoring-table-json/climbing/utils'
import { ScoringTableProps } from '@/components/scoring-table-json/scoring-table-json'
import {
  UpdateResultHelper,
  useUpdateJsonResults,
} from '@/components/scoring-table-json/use-update-json-results'
import { TimersRealtime } from '@/components/timer/controls/realtime'
import { createBrowserClient } from '@/lib/db/client'
import {
  EventFormatOptions,
  EventLiveData,
  EventResult,
  JudgeDataClimbing,
  Sport,
} from '@/lib/event-data'
import {
  BlocScores,
  generateLiveDataClimbing,
  generateLiveDataResultsClimbing,
} from '@/lib/event-data/climbing'
import { entrantMapAtom } from '@/lib/hooks/use-realtime-json-event'
import { isFormatClimbing } from '@/lib/json/generated/format'
import { cn, toNumOr } from '@/lib/utils'
import {
  ActionIcon,
  Alert,
  Button,
  ButtonGroup,
  Checkbox,
  CheckboxProps,
  Collapse,
  Divider,
  List,
  ListItem,
  Modal,
  ModalProps,
  NumberInput,
  NumberInputProps,
  Paper,
  ScrollAreaAutosize,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core'
import { useDidUpdate, useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import {
  IconCheck,
  IconEdit,
  IconExclamationMark,
  IconLoader2,
  IconProgressAlert,
  IconProgressCheck,
} from '@tabler/icons-react'
import {
  IconArrowDown,
  IconArrowRight,
  IconChevronsUp,
  IconCircleCheck,
  IconInfoCircle,
  IconMinus,
  IconX,
} from '@tabler/icons-react'
import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import { useParams, useSearchParams } from 'next/navigation'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'

export function ClimbingHeadJudge(props: ScoringTableProps<'climbing'>) {
  const params = useSearchParams()
  const direct = !params.get('default')

  const [previewOpened, { toggle: togglePreview }] = useDisclosure(false)
  const { results, updateActive, updateResult, loading, liveDataPreview } = useUpdateJsonResults(
    props,
    generateLiveDataClimbing,
  )

  const [opened, { close, open }] = useDisclosure(false)

  return (
    <Stack mb={52}>
      <EventProgressionModal opened={opened} onClose={close} {...props} />
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
        const isRoundActive = round.id === results.active?.round
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
                  const classId = `${round.id}.${cls.id}`
                  const isClassActive =
                    round.id === results.active?.round && cls.id === results.active?.class

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
                        const row = typeof entrant === 'number' ? { id: entrant } : entrant
                        if (row === null) {
                          console.log('NULL ENTRANT', { i, cls })
                          return null
                        }
                        return (
                          <Fragment key={row.id}>
                            {i > 0 && <Divider />}
                            <Entrant
                              index={i}
                              judgesData={props.judgesData}
                              entrant={row}
                              initialResult={results[round.id]?.[cls.id]?.[row.id]}
                              updateResults={updateResult}
                              formatOptions={props.formatOptions}
                              roundId={round.id}
                              classId={cls.id}
                              blocCount={props.formatOptions.blocCount}
                              loading={
                                loading &&
                                loading[0] === round.id &&
                                loading[1] === cls.id &&
                                loading[2] === row.id
                              }
                              direct={direct}
                            />
                          </Fragment>
                        )
                      })}
                    </Paper>
                  )
                })}
              </div>
            </Paper>
            {i < props.format.rounds.length - 1 && (
              <Button
                fullWidth
                className="max-w-sm mx-auto"
                leftSection={<IconArrowDown />}
                rightSection={<IconArrowDown />}
                onClick={open}
              >
                Progress {round.name} to {props.format.rounds[i + 1]?.name}
              </Button>
            )}
          </Fragment>
        )
      })}
    </Stack>
  )
}

type EntrantProps = {
  index?: number
  entrant: Partial<Tables<'entrants'>>
  judgesData: JudgeDataClimbing[]
  initialResult: EventResult<'climbing'> | null | undefined
  updateResults: UpdateResultHelper<'climbing'>
  roundId: string
  classId: string
  loading: boolean
  blocCount: number
  formatOptions: EventFormatOptions<'climbing'>
  direct: boolean
}
function Entrant({
  index,
  entrant,
  judgesData,
  initialResult,
  updateResults,
  formatOptions,
  roundId,
  classId,
  blocCount,
  direct,
}: EntrantProps) {
  const [opened, { close, open }] = useDisclosure(false)
  function updateStatus(status: EventResult<'climbing'>['status']) {
    if (entrant.id === undefined || !initialResult) return
    updateResults({
      round: roundId,
      cls: classId,
      id: entrant.id,
      data: initialResult.result,
      status,
      feedback: status ? `Entrant status set to ${status}` : 'Entrant status cleared',
    })
  }

  return (
    <div className="grid max-sm:grid-cols-1 max-sm:my-2 grid-cols-[auto,auto] justify-between items-center px-2 gap-2">
      <Modal centered opened={opened} onClose={close} title="Edit entrant status">
        <ButtonGroup mb="md">
          <Button
            onClick={() => updateStatus('DNS')}
            className="flex-grow flex-shrink-0 basis-0"
            size="lg"
            color="red"
            variant={initialResult?.status === 'DNS' ? 'filled' : 'default'}
          >
            DNS
          </Button>
          <Button
            onClick={() => updateStatus('DNF')}
            className="flex-grow flex-shrink-0 basis-0"
            size="lg"
            color="red"
            variant={initialResult?.status === 'DNF' ? 'filled' : 'default'}
          >
            DNF
          </Button>
          <Button
            onClick={() => updateStatus('DQ')}
            className="flex-grow flex-shrink-0 basis-0"
            size="lg"
            color="red"
            variant={initialResult?.status === 'DQ' ? 'filled' : 'default'}
          >
            DQ
          </Button>
        </ButtonGroup>
        <Button fullWidth onClick={() => updateStatus(undefined)}>
          Clear Status
        </Button>
      </Modal>
      <div className="flex items-center gap-2">
        <Tooltip label={initialResult?.status || 'Entrant Status'}>
          <ActionIcon
            size="sm"
            onClick={open}
            color={initialResult?.status ? 'red' : 'dark'}
            variant={'light'}
          >
            {initialResult?.status ? (
              <IconProgressAlert size={16} />
            ) : (
              <IconProgressCheck size={16} />
            )}
          </ActionIcon>
        </Tooltip>
        <div className="flex flex-wrap gap-x-1 gap-y-2">
          <Text display="inline-block">{entrant.first_name}</Text>{' '}
          <Text display="inline-block" fw={600}>
            {entrant.last_name}
          </Text>
        </div>
      </div>
      <div className="flex gap-4 justify-end">
        <EntrantScores
          index={index}
          blocCount={blocCount}
          judgesData={judgesData}
          initialResult={initialResult}
          classId={classId}
          roundId={roundId}
          entrantId={entrant.id}
          formatOptions={formatOptions}
          direct={direct}
        />
      </div>
    </div>
  )
}

function EntrantScores({
  index,
  blocCount,
  judgesData,
  initialResult,
  classId,
  roundId,
  entrantId,
  formatOptions,
  direct,
}: Pick<
  EntrantProps,
  | 'index'
  | 'initialResult'
  | 'blocCount'
  | 'classId'
  | 'roundId'
  | 'judgesData'
  | 'formatOptions'
  | 'direct'
> & {
  entrantId: EntrantProps['entrant']['id']
}) {
  const allBlocScores = Array.from({ length: blocCount }).map((_, i) =>
    getBlocScores(initialResult?.result[i], formatOptions),
  )
  const totalScore = allBlocScores.reduce((acc, cur) => acc + cur.s, 0)

  return (
    <div className="flex flex-wrap gap-2 items-center justify-around">
      <div className="flex flex-col items-end gap-0.5">
        {index === 0 && (
          <Text c="dimmed" size="xs" mt={-8}>
            Score
          </Text>
        )}
        <Text>{totalScore.toFixed(1)}</Text>
      </div>
      <div className="flex flex-row gap-2 flex-wrap justify-center sm:flex-nowrap">
        {allBlocScores.map((blocScores, i) => {
          const classInitial = classId.charAt(0).toUpperCase()
          const station = `${classInitial}${i + 1}`

          const judgeIndex = getBoulderingJudgeIndex(station, blocCount)
          const isActive = judgesData[judgeIndex]?.active?.entrant === entrantId

          return (
            <div key={i} className="flex flex-col">
              {index === 0 && <Divider label={`Bloc ${i + 1}`} mt={-4} />}
              {direct ? (
                <DirectBlocScore
                  key={i}
                  index={i}
                  judgeIndex={judgeIndex}
                  roundId={roundId}
                  classId={classId}
                  entrantId={entrantId?.toString() || ''}
                  initialBlocScores={blocScores}
                  scoring={formatOptions.scoring}
                />
              ) : (
                <Button
                  component={QueryLink}
                  query={{
                    judge: `${classInitial}${i + 1}`,
                    entrant: (index ?? 0) + 1,
                  }}
                  removeOthers
                  size="compact-md"
                  variant={isActive ? 'outline' : blocScores ? 'light' : 'subtle'}
                  color={blocScores?.climbing ? 'orange' : 'teal'}
                >
                  <div className="flex space-x-2">
                    <Text miw={27} c={blocScores?.t || blocScores?.tp ? undefined : 'dimmed'}>
                      T{blocScores?.t || blocScores?.tp || '\u00A0'}
                    </Text>
                    <Text miw={27} c={blocScores?.z ? undefined : 'dimmed'}>
                      Z{blocScores?.z || '\u00A0'}
                    </Text>
                    <Text miw={27} c={blocScores?.a ? undefined : 'dimmed'}>
                      A{blocScores?.a || '\u00A0'}
                    </Text>
                  </div>
                </Button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DirectBlocScore({
  index,
  judgeIndex,
  roundId,
  classId,
  entrantId,
  initialBlocScores,
  scoring,
}: {
  index: number
  judgeIndex: number
  roundId: string
  classId: string
  entrantId: string
  initialBlocScores: BlocScores
  scoring: EventFormatOptions<'climbing'>['scoring']
}) {
  const [score, setScore] = useState(initialBlocScores.s)
  const [loading, setLoading] = useState(false)
  const { event } = useParams<{ event: string }>()
  const supabase = createBrowserClient()

  useDidUpdate(() => {
    setLoading(false)
  }, [initialBlocScores.s])

  if (!scoring) return

  const updateScores = (callback?: () => void) => {
    if (typeof score !== 'number' || Number.isNaN(score)) {
      console.log('Invalid score:', score)
    }

    const { t, z } = getAttemptsFromScore(score, scoring)

    if (score > scoring.top || score < 0) {
      console.log('Invalid score:', { score, scoringOpts: scoring, t, z })
      return
    }

    const blocScore: NonNullable<NonNullable<EventResult<'climbing'>['result'][number]>[number]>[] =
      Array.from({ length: Math.max(t, z) }, () => ({
        s: 0,
        e: 0,
      }))

    const zAdj = t > 0 && z === 0 ? t : z
    if (zAdj) blocScore[zAdj - 1] = { s: 0, z: 0, e: 0 }
    if (t) blocScore[t - 1] = { s: 0, z: 0, t: 0, tp: 0, e: 0 }

    supabase
      .rpc('update_judge_data_by_entrant', {
        event,
        judge_index: judgeIndex,
        round: roundId,
        class: classId,
        entrant: entrantId,
        value: blocScore,
      })
      .then(callback)
  }

  const invalidScore = score > scoring.top || score < 0
  const noChange = initialBlocScores.s === score
  const submit = () => {
    setLoading(true)
    updateScores()
  }

  return (
    <div className="flex space-x-1 items-center">
      <DirectNumberInput
        value={score || undefined}
        onChange={(v) => {
          setScore(Number(v))
          setLoading(false)
        }}
        submit={submit}
      />
      {/* <DirectNumberInput prefix="Z" value={z || undefined} onChange={(v) => setZ(toNumOrZero(v))} /> */}
      <Tooltip label="Invalid score" hidden={!invalidScore}>
        <ActionIcon
          size="sm"
          onClick={submit}
          disabled={noChange}
          aria-disabled={noChange || invalidScore}
          color={noChange ? 'dark' : invalidScore ? 'red' : loading ? 'orange' : 'green'}
          variant={'light'}
          className={cn(
            'disabled:cursor-default disabled:bg-white/0',
            invalidScore && 'cursor-default',
          )}
        >
          <div className={loading && !invalidScore ? 'animate-spin' : ''}>
            {invalidScore ? (
              <IconExclamationMark size={16} />
            ) : loading ? (
              <IconLoader2 size={16} />
            ) : (
              <IconCheck size={16} />
            )}
          </div>
        </ActionIcon>
      </Tooltip>
    </div>
  )
}

function DirectNumberInput({
  value,
  onChange,
  prefix,
  submit,
}: Pick<NumberInputProps, 'value' | 'onChange' | 'prefix'> & { submit: () => void }) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <NumberInput
      ref={ref}
      onClick={() => ref.current?.select()}
      prefix={prefix}
      placeholder={prefix}
      miw={1}
      w={50}
      min={0}
      decimalScale={1}
      step={0.1}
      p={0}
      hideControls
      classNames={{ input: 'p-2' }}
      value={value}
      onChange={onChange}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          submit()
        }
      }}
    />
  )
}

function EventProgressionModal({
  opened,
  onClose,
  ...props
}: ScoringTableProps<'climbing'> & Pick<ModalProps, 'opened' | 'onClose'>) {
  return (
    <Modal
      centered
      opened={opened}
      onClose={onClose}
      title="Progress Entrants"
      size="xl"
      scrollAreaComponent={ScrollAreaAutosize}
    >
      {opened && (
        <EventProgressionModalInternals
          results={props.results}
          format={props.format}
          formatOptions={props.formatOptions}
          onClose={onClose}
        />
      )}
    </Modal>
  )
}

const CheckboxIcon: CheckboxProps['icon'] = ({ indeterminate, ...others }) =>
  indeterminate ? <IconMinus {...others} /> : <IconX {...others} />

function EventProgressionModalInternals({
  results,
  format,
  formatOptions,
  onClose,
}: Pick<ScoringTableProps<'climbing'>, 'results' | 'format' | 'formatOptions'> &
  Pick<ModalProps, 'onClose'>) {
  const supabase = createBrowserClient()
  const params = useParams() as { sport: Sport; event: string }
  const [from, setFrom] = useState<string | null>(format.rounds[0]?.id ?? null)
  const [to, setTo] = useState<string | null>(null)
  const [countInput, setCountInput] = useState<string | number>(6)
  const [reverseOrder, setReverseOrder] = useState(true)
  const progressEntrantCount = toNumOr(countInput, 0)

  // entrant ids stored for use in checkbox to manually DQ entrants
  const [manualDQ, setManualDQ] = useState<number[]>([])

  const entrantMap = useAtomValue(entrantMapAtom)

  const [preview, setPreview] = useState<EventLiveData<'climbing'>['results']>()

  const fromRound = format.rounds.find((round) => round.id === from)

  // This modal skips the liveDataPreview dn generates the results directly. Problem then is it is missing the entrantMap. Maybe the entrantMap should be in an atom and available to all children - but where to update the atom? In the eventJSON fetch/update pattern i guss

  useEffect(() => {
    // const round = format.rounds.find((round) => round.id === from);
    if (fromRound)
      setPreview(generateLiveDataResultsClimbing({ round: fromRound, results, formatOptions }))
  }, [fromRound, results, format.rounds, formatOptions])

  let cutoff = progressEntrantCount
  const previewEntries = Object.entries(preview ?? {})

  return (
    <div className="flex flex-col items-stretch gap-4 p-4">
      <div className="flex flex-wrap justify-between gap-2 items-center">
        <Select
          label="From"
          className="grow"
          data={format.rounds.map((round) => ({
            value: round.id,
            label: round.name,
            disabled: round.id === from,
          }))}
          value={from}
          onChange={(val) => setFrom(val)}
        />
        <div className="w-9 h-9 self-end grid place-content-center">
          <IconArrowRight />
        </div>
        <Select
          label="To"
          labelProps={{
            c: !to ? 'orange' : undefined,
          }}
          className="grow"
          data={format.rounds.map((round) => ({
            value: round.id,
            label: round.name,
            disabled: round.id === from || round.id === to,
          }))}
          clearable={false}
          value={to}
          onChange={(val) => setTo(val)}
        />
        <NumberInput
          label="# to progress"
          defaultValue={6}
          min={1}
          allowNegative={false}
          allowDecimal={false}
          value={countInput}
          onChange={setCountInput}
        />
        <Checkbox
          className="ml-auto"
          label="Reverse Order?"
          labelPosition="left"
          checked={reverseOrder}
          onChange={() => setReverseOrder((o) => !o)}
        />
      </div>

      {previewEntries.map(([classId, results], i) => {
        const className = fromRound?.classes.find((cls) => cls.id === classId)?.name
        const cantProgress = !to
          ? 'Select a target round'
          : from === to
            ? 'Cannot progress to the same round'
            : undefined
        return !results?.length ? null : (
          <div className="flex flex-col gap-8" key={classId}>
            <div
              className="grid gap-x-4"
              style={{ gridTemplateColumns: `min-content repeat(7,auto) min-content` }}
            >
              <Text mb="sm" fw={600}>
                {className}
              </Text>
              <div className="subgrid-cols col-span-full items-center py-2 px-4 border border-b-0 rounded-t bg-body-dimmed">
                <Text fw={600} size="xs" c="dimmed">
                  ID
                </Text>
                <Text fw={600}>Rank</Text>
                <Text fw={600}>Name</Text>
                <Text fw={600}>T</Text>
                <Text fw={600}>Z</Text>
                <Text fw={600}>TA</Text>
                <Text fw={600}>TZ</Text>
                <Text fw={600}>Status</Text>
                <Checkbox
                  color="red"
                  size="xs"
                  icon={CheckboxIcon}
                  indeterminate={manualDQ.length > 0 && manualDQ.length < results.length}
                  checked={!!manualDQ.length}
                  onChange={() =>
                    setManualDQ((dqs) =>
                      dqs.length === results.length ? [] : results.map((r) => r.entrant),
                    )
                  }
                />
              </div>
              {results.map((result, i) => {
                const entrant = entrantMap[result.entrant]
                const isManualDQ = manualDQ.includes(result.entrant)
                if (isManualDQ) cutoff += 1

                return (
                  <div
                    key={result.entrant}
                    className={clsx(
                      (i >= cutoff || isManualDQ) &&
                        'border-red-5 text-gray-6 border-dashed bg-red-5/10',
                      'border-x border-t last:border-b last:rounded-b',
                      'py-2 px-4 subgrid-cols col-span-full items-center',
                    )}
                  >
                    <Text size="xs" c="dimmed">
                      {result.entrant}
                    </Text>
                    <Text>{result.rank}</Text>
                    <Text>
                      {entrant?.first_name} {entrant?.last_name}
                    </Text>
                    <Text>{result.tops}</Text>
                    <Text>{result.zones}</Text>
                    <Text>{result.ta}</Text>
                    <Text>{result.za}</Text>
                    <Text>{result.status || '-'}</Text>
                    <Checkbox
                      color="red"
                      size="xs"
                      icon={CheckboxIcon}
                      className="[&_svg]:translate-x-px"
                      checked={isManualDQ}
                      onChange={() =>
                        setManualDQ((dqs) =>
                          isManualDQ
                            ? dqs.filter((id) => id !== result.entrant)
                            : [...dqs, result.entrant],
                        )
                      }
                    />
                  </div>
                )
              })}
            </div>
            <ConfirmButton
              confirmColor="teal"
              confirmMessage="Confirm - This will overwrite the target round"
              disabled={!to || from === to}
              onClick={async () => {
                const entrants = results
                  .filter((result) => !manualDQ.includes(result.entrant))
                  .slice(0, progressEntrantCount)
                if (reverseOrder) entrants.reverse()

                const newFormat = {
                  rounds: format.rounds.map((round) => {
                    if (round.id !== to) {
                      return round
                    }

                    return {
                      ...round,
                      classes: round.classes.map((cls) => {
                        if (cls.id !== classId) {
                          return cls
                        }

                        return {
                          ...cls,
                          entrants: entrants.map((entrant) => entrant.entrant),
                        }
                      }),
                    }
                  }),
                }

                const isValidFormat = isFormatClimbing(newFormat)
                if (isValidFormat) {
                  const { error } = await supabase
                    .from('events')
                    .update({ format: newFormat })
                    .eq('slug', params.event)

                  notifications.show({
                    title: error ? 'Error Progressing Entrants' : 'Progressing Entrants',
                    message: error
                      ? error.message
                      : `Progressing ${entrants.length} entrants from ${from} to ${to}`,
                    color: error ? 'red' : 'teal',
                  })
                } else {
                  notifications.show({
                    title: 'Error Progressing Entrants',
                    message: 'Resulting format is invalid. Please edit the event manually',
                    color: 'red',
                  })
                }

                onClose()
              }}
            >
              Progress {className} Entrants{cantProgress && ` - ${cantProgress}`}
            </ConfirmButton>
            {i < previewEntries.length - 1 && <Divider />}
          </div>
        )
      })}

      {/* {Object.entries(preview ?? {}).map(([classId, results]) => {
        return !results?.length ? null : (
          <div
            key={classId}
            className="grid gap-2 relative items-center justify-items-center"
            style={{ gridTemplateColumns: `repeat(8,auto)` }}
          >
            <Text fw={600} c="dimmed">
              ID
            </Text>
            <Text fw={600}>Rank</Text>
            <Text fw={600}>Name</Text>
            <Text fw={600}>T</Text>
            <Text fw={600}>Z</Text>
            <Text fw={600}>TA</Text>
            <Text fw={600}>TZ</Text>
            <Text fw={600}>Status</Text>
            {results.map((result, i) => (
              <>
                <div
                  className={clsx(
                    'col-span-full w-full border-b',
                    i > progressEntrantCount - 1
                      ? 'border-red-5 border-dashed'
                      : 'border-dimmed border-solid',
                  )}
                />
                <Text c="dimmed">{result.entrant.id}</Text>
                <Text>{result.rank}</Text>
                <Text>
                  {' '}
                  {result.entrant.first_name} {result.entrant.last_name}{' '}
                </Text>
                <Text>{result.tops}</Text>
                <Text>{result.zones}</Text>
                <Text>{result.ta}</Text>
                <Text>{result.za}</Text>
                <Text>{result.status || '-'}</Text>
              </>
            ))}
          </div>
        );
      })} */}
    </div>
  )
}
