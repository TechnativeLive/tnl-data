'use client'

import { useRealtimeJsonEvent } from '@/lib/hooks/use-realtime-json-event'
import {
  ActionIcon,
  ActionIconGroup,
  Button,
  Flex,
  Loader,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useDidUpdate, useDisclosure, useInterval } from '@mantine/hooks'
import clsx from 'clsx'
import { EventFormatOptions, JudgeDataClimbing } from '@/lib/event-data'
import { useUpdateJsonResults } from '@/components/scoring-table-json/use-update-json-results'
import { EventLiveDataClimbing, generateLiveDataClimbing } from '@/lib/event-data/climbing'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { IconArrowLeft, IconArrowsMaximize, IconArrowsMinimize } from '@tabler/icons-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import { Backdrop } from '@/components/backdrop/backdrop'
import {
  autoAnimateRows,
  autoAnimateAnnouncements,
} from '@/components/auto-animate/animate-highlights'
import { BarReveal } from '@/components/bar-reveal/bar-reveal'
import { split } from '@/lib/utils'

const DEFAULT_PAGE_INTERVAL = 10_000
const DEFAULT_MAX_ROWS = 12

function useLeaderboardParams() {
  const params = useSearchParams()
  const rows = parseInt(params.get('rows') || '')
  const interval = parseInt(params.get('interval') || '')
  const scale = Number(params.get('scale') || '')

  useEffect(() => {
    if (scale) {
      document.documentElement.style.setProperty('--mantine-scale', scale.toString())
    }
  })

  return {
    maxRows: Number.isNaN(rows) ? DEFAULT_MAX_ROWS : rows,
    pageInterval: Number.isNaN(interval) ? DEFAULT_PAGE_INTERVAL : interval,
  }
}

export default function ScoreboardPage() {
  const { maxRows, pageInterval } = useLeaderboardParams()
  const containerRef = useRef<HTMLDivElement>(null)

  const { event, loading } = useRealtimeJsonEvent<'climbing'>()

  const round = event?.format.rounds.find((round) => round.id === event.results.active?.round)

  const { liveDataPreview } = useUpdateJsonResults(
    event
      ? {
          format: event.format,
          formatOptions: event.format_options as EventFormatOptions<'climbing'>,
          results: event.results, // as EventResults<Sport>
          judgesData: (event.judge_data ?? []) as JudgeDataClimbing[],
          dsPrivateKey: event.ds_keys?.private!,
          timers: event?.timers,
        }
      : ({} as any),
    generateLiveDataClimbing,
  )

  const pages =
    liveDataPreview?.active
      .flatMap<PageData<keyof LeaderboardPage>[]>(({ class: className, classId }) => {
        const results = classId ? liveDataPreview.results[classId] : []
        const startlist =
          liveDataPreview?.startlist?.find((startlist) => startlist.classId === classId)
            ?.startlist || []

        if (!!results?.length) {
          const pageData: PageData<'results'>[] = split(results, maxRows).map((page, i) => ({
            type: 'results',
            page,
            pageNumber: [i + 1, Math.ceil(results.length / maxRows)],
            class: className,
          }))
          return pageData
        }

        const pageData: PageData<'startlist'>[] = split(startlist, maxRows).map((page, i) => ({
          type: 'startlist',
          page,
          pageNumber: [i + 1, Math.ceil(startlist.length / maxRows)],
          class: className,
        }))
        return pageData
      })
      .filter((v) => !!v)
      .flat() || []

  const [index, setIndex] = useState(0)
  useInterval(() => setIndex((i) => (i + 1) % (pages?.length ?? 0)), pageInterval, {
    autoInvoke: true,
  })

  const page = pages[index]

  return (
    <Flex justify="center" className="flex-1 h-screen" ref={containerRef}>
      {/* <BackdropWebGL /> */}
      <Backdrop />

      <Stack w="100%" pb={48}>
        <Header
          containerRef={containerRef}
          titles={[
            event?.name,
            round?.name,
            page?.class,
            page ? `Page ${page.pageNumber[0]} of ${page.pageNumber[1]}` : undefined,
          ]}
        />
        {!event || loading || !page ? (
          <div className="fixed inset-0 grid place-content-center pointer-events-none">
            <Loader />
          </div>
        ) : (
          <>
            <Leaderboard type={page.type} page={page.page} maxRows={maxRows} />
            {/* <Announcements active={liveDataPreview?.active} results={liveDataPreview?.results} /> */}
          </>
        )}
      </Stack>
    </Flex>
  )
}

function GridLines({ count }: { count: number }) {
  const [parentRef] = useAutoAnimate(autoAnimateRows)

  return (
    <div className="absolute inset-0 pointer-events-none -z-10">
      <div
        ref={parentRef}
        className="absolute inset-0 grid auto-rows-[minmax(calc(1/var(--max-row-count)*100%),min-content)] rounded-lg overflow-hidden"
      >
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={clsx(
              i !== 0 && 'border-t',
              i === count - 1 && 'rounded-b-lg',
              i % 2 === 0 ? 'bg-gray-1/50 dark:bg-gray-9/50' : 'bg-gray-3/50 dark:bg-gray-8/50',
              // 'backdrop-blur-sm',
            )}
          />
        ))}
      </div>
      <div
        className="absolute inset-0 rounded-lg border h-[calc(var(--row-count)/var(--max-row-count)*100%)]"
        style={{
          transition: 'height 0.5s ease-in-out',
        }}
      />
    </div>
  )
}

type LeaderboardPage = {
  results: NonNullable<EventLiveDataClimbing['results'][string]>
  startlist: NonNullable<EventLiveDataClimbing['startlist']>[number]['startlist']
}

type LeaderboardProps<T extends keyof LeaderboardPage> = {
  type: T
  page: LeaderboardPage[T]
}

type PageData<T extends keyof LeaderboardPage> = LeaderboardProps<T> & {
  class?: string
  pageNumber: [number, number]
}

function Leaderboard<T extends keyof LeaderboardPage>({
  type,
  page,
  maxRows,
}: LeaderboardProps<T> & { maxRows: number }) {
  const [parentRef] = useAutoAnimate(autoAnimateRows)
  const count = page?.length ?? 0

  return (
    <>
      <div className="mx-content">
        <TableHeader showResults={type === 'results'} />
      </div>
      <div
        ref={parentRef}
        className="grid grow relative overflow-hidden rounded-lg mx-content auto-rows-[minmax(calc(1/var(--max-row-count)*100%),min-content)]"
        style={{
          '--row-count': count,
          '--max-row-count': maxRows,
        }}
      >
        <GridLines count={count} />
        {page ? (
          type === 'results' ? (
            <Results results={page as LeaderboardPage['results']} />
          ) : (
            <Startlist startlist={page as LeaderboardPage['startlist']} />
          )
        ) : null}
      </div>
    </>
  )
}

function TableHeader({ showResults }: { showResults: boolean }) {
  const [parentRef] = useAutoAnimate(autoAnimateRows)

  return (
    <div
      ref={parentRef}
      className="rounded-lg dark:text-gray-4 border bg-white/50 dark:bg-gray-9/50 backdrop-blur-[2px] overflow-hidden"
    >
      {showResults ? (
        <Row key={1} className="text-lg rounded-lg py-2">
          <div>Rank</div>
          <div className="text-left">Name</div>

          <div className="grid grid-cols-[1fr,1fr,1fr,1fr]">
            <div>B1</div>
            <div>B2</div>
            <div>B3</div>
            <div>B4</div>
          </div>
          <div>Score</div>
        </Row>
      ) : (
        <Row key={2} className="text-lg rounded-lg py-2">
          <div>Pos</div>
          <div className="text-left">Name</div>
        </Row>
      )}
    </div>
  )
}

type ResultRow = NonNullable<EventLiveDataClimbing['results'][string]>[number]
type StartlistRow = NonNullable<EventLiveDataClimbing['startlist']>[number]['startlist'][number]

function Results({ results }: { results: ResultRow[] }) {
  return results.map((result, i) => (
    <ResultsRow key={result.entrant.id} result={result} last={i === results.length - 1} />
  ))
}

function useTransient<T>(value: T, defaultDelay: number = 0): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState(value)
  const originalValue = useRef(value)

  const set = useCallback(
    (newValue: SetStateAction<T>, delay?: number) => {
      // @ts-expect-error
      setState((s) => (typeof newValue === 'function' ? newValue(s) : newValue))
      setTimeout(() => setState(originalValue.current), delay ?? defaultDelay)
    },
    [defaultDelay],
  )

  return [state, set]
}

function ResultsRow({ result, last }: { result: ResultRow; last?: boolean }) {
  const latestRun = result.runs[result.runs.length - 1]

  const [showZone, setZone] = useTransient(false, 4000)
  const [showTop, setTop] = useTransient(false, 4000)

  const zone = useRef(latestRun?.z ?? 0)
  const top = useRef(latestRun?.t ?? 0)

  useDidUpdate(() => {
    if (latestRun?.t && latestRun.t > top.current) {
      setTop(true)
    } else if (latestRun?.z && latestRun.z > zone.current) {
      setZone(true)
    }

    zone.current = latestRun?.z ?? 0
    top.current = latestRun?.t ?? 0
  }, [latestRun?.z, latestRun?.t, setTop, setZone])

  return (
    <Row key={result.entrant.id} last={last} active={!!result.station}>
      <BarReveal
        show={showZone}
        text="ZONE"
        bars={5}
        background="bg-gradient-to-r from-orange-4 to-orange-6"
        color="text-gray-9"
      />
      <BarReveal
        show={showTop}
        text={latestRun?.a === 1 ? 'FLASH' : 'TOP'}
        bars={5}
        background="bg-gradient-to-r from-green-4 to-green-6"
        color="text-gray-9"
      />

      <div>{result.rank}</div>
      <div className="text-left">
        {result.entrant.first_name} {result.entrant.last_name}
      </div>
      <div className="grid grid-cols-[1fr,1fr,1fr,1fr]">
        {result.runs.map((run, i) => (
          <Text
            key={i}
            component="div"
            fz="h2"
            fw="bold"
            className="flex flex-col items-center flex-wrap"
          >
            <div className="flex items-center leading-none">
              <div>{run.t > 0 ? 1 : 0}</div>
              <Text component="div" fz="xl" fw="bold" c="gray.6" className="relative top-px">
                <Text display="inline" fz="lg" fw="bold">
                  {'\u00A0/ '}
                </Text>
                <span className="relative top-px">{run.t}</span>
              </Text>
            </div>
            <div className="flex items-center leading-none">
              <div>{run.z > 0 ? 1 : 0}</div>
              <Text component="div" fz="xl" fw="bold" c="gray.6" className="relative top-px">
                <Text display="inline" fz="lg" fw="bold">
                  {'\u00A0/ '}
                </Text>
                <span className="relative top-px">{run.z}</span>
              </Text>
            </div>
          </Text>
        ))}
      </div>
      <div className="whitespace-nowrap grid grid-cols-[5ch,2ch,2ch] gap-x-2 place-content-center">
        <div>
          {result.tops}T{result.zones}z
        </div>
        <div>{result.ta}</div>
        <div>{result.za}</div>
      </div>
    </Row>
  )
}

function Startlist({ startlist = [] }: { startlist?: StartlistRow[] }) {
  return startlist.map((row) => (
    <Row key={row.entrant.id}>
      <div>{row.pos}</div>
      <div className="text-left">
        {row.entrant.first_name} {row.entrant.last_name}
      </div>
    </Row>
  ))
}

function Row({
  active,
  last,
  children,
  className,
}: {
  active?: boolean
  last?: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <Title
      size={26}
      className={clsx(
        'gap-4 items-center px-4 gap-x-4 grid relative grid-cols-[minmax(60px,1fr),minmax(100px,4fr),minmax(340px,3fr),minmax(120px,2fr)] text-center overflow-hidden will-change-transform',
        className,
      )}
    >
      {children}
      <div
        className={clsx(
          active ? 'translate-x-0' : 'translate-x-full',
          last && 'rounded-b-lg',
          'absolute top-0 right-0 bottom-0 w-1/2 bg-gradient-to-l via-20% via-green-6/5 from-green-6/30 transition-transform duration-500',
        )}
      />
    </Title>
  )
}

function Header({
  titles,
  page,
  pageTotal,
  containerRef,
}: {
  titles?: (string | number | undefined)[]
  page?: number
  pageTotal?: number
  containerRef: React.RefObject<HTMLDivElement>
}) {
  const router = useRouter()
  const [parentRef] = useAutoAnimate(autoAnimateRows)
  const [isFullscreen, setIsFullscreen] = useState(false)

  return (
    <div className="bg-gray-9 text-gray-0 dark:bg-gray-1 dark:text-gray-9 py-4 mb-8 px-content flex justify-between group items-center">
      <Title size={32} ref={parentRef} className="whitespace-nowrap flex h-9">
        {titles
          ?.filter((t) => t !== undefined && t !== '')
          .map((title, i) => (
            <div key={`${i}-${title}`} className="flex items-center">
              {i !== 0 && <div className="text-gray-6">{'\u00A0\u00A0//\u00A0\u00A0'}</div>}
              <div>{title}</div>
            </div>
          ))}
      </Title>
      <ActionIconGroup className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ActionIcon onClick={() => router.back()}>
          <IconArrowLeft size={14} />
        </ActionIcon>
        <ActionIcon
          onClick={async () => {
            try {
              await (isFullscreen
                ? document.exitFullscreen()
                : containerRef.current?.requestFullscreen({ navigationUI: 'hide' }))
              setIsFullscreen(isFullscreen ? false : true)
            } catch (e) {
              setIsFullscreen(isFullscreen ? true : false)
            }
          }}
        >
          {isFullscreen ? <IconArrowsMinimize size={14} /> : <IconArrowsMaximize size={14} />}
        </ActionIcon>
        <ThemeSwitcher />
      </ActionIconGroup>
      {pageTotal !== undefined && (
        <Title size="h3" className="animate-fade">
          Page {page} / {pageTotal}
        </Title>
      )}
    </div>
  )
}

type Announcement = {
  id: string
  title: string
}

function simpleRanking(results: EventLiveDataClimbing['results']) {
  return Object.entries(results).map(([classId, entrants]) => ({
    classId,
    rank: entrants?.map((entrant, i) => i + 1).reduce((a, b) => a + b, 0),
  }))
}

function Announcements({
  active,
  results,
}: {
  active?: EventLiveDataClimbing['active']
  results?: EventLiveDataClimbing['results']
}) {
  const [show, { toggle }] = useDisclosure(false)
  const [parentRef] = useAutoAnimate(autoAnimateAnnouncements)
  const [index, setIndex] = useState(0)
  useInterval(() => setIndex((i) => (i + 1) % (show ? 6 : 3)), 2000, {
    autoInvoke: true,
  })

  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [prevActive, setPrevActive] = useState(active)
  const [prevResults, setPrevResults] = useState(results)

  // useEffect(() => {
  //   if (results.active?.round !== prevResults.active?.round) {
  //     setAnnouncements([])
  //   } else {
  //     const movements = results
  //     // const newAnnouncements =
  //   }

  //   setPrevResults(results)
  // }, [active, ])

  return (
    <footer className="overflow-hidden h-32 shrink-0">
      <div ref={parentRef} className="px-content relative grid grid-cols-4 gap-x-8 h-32">
        <Button className="absolute left-36" onClick={toggle}>
          Update highlights
        </Button>
        {index}
        {show && (
          <>
            <UpdateCard />
            <UpdateCard />
            <UpdateCard />
            <UpdateCard />
          </>
        )}
      </div>
    </footer>
  )
}

function UpdateCard() {
  return (
    <Stack
      className="rounded-lg border-2 border-pink-5 bg-body-dimmed py-2 px-4 h-32 gap-0"
      justify="space-between"
    >
      <Flex justify="space-between" className="font-bold">
        <div className="text-lg">Firstname Lastname</div>
        <div className="text-2xl">#4</div>
      </Flex>
      <div className="text-gray-7 dark:text-gray-5">
        Moved into 3rd place, over Firstname Lastname
      </div>
    </Stack>
  )
}
