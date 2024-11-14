import {
  EventFormat,
  EventFormatOptions,
  EventLiveData,
  EventResult,
  EventResults,
  JudgeDataClimbing,
} from '@/lib/event-data'
import { EntrantMap, entrantMapAtom } from '../hooks/use-realtime-json-event'
import {
  getBlocScores,
  getBoulderingJudgeStation,
} from '@/components/scoring-table-json/climbing/utils'
import { sortAndRank } from '@/lib/sort-and-rank'
import { atomStore } from '@/components/providers'

export type EventResultClimbing = (
  | ({
      s: number
      z?: number
      t?: number
      tp?: number
      e?: number
    } | null)[]
  | null
)[]

export type EventFormatClimbing = {
  rounds: { id: string; kind?: RoundKind; name: string; classes: RoundClass[] }[]
}

export type EventFormatOptionsClimbing = {
  blocCount: number
  blocDataDsKey?: string
}

export const roundKindClimbingSelection: { value: RoundKind; label: string }[] = [
  { value: 'qualifying', label: 'Qualifying' },
  { value: 'semifinal', label: 'Semifinal' },
  { value: 'final', label: 'Final' },
]

type RoundKind = 'qualifying' | 'semifinal' | 'final'

type RoundClass = {
  id: string
  name: string
  active?: boolean
  entrants: Tables<'entrants'>[]
}

type LiveDataResult = {
  startPos: number
  rank: number
  tops: number
  zones: number
  ta: number
  za: number
  status: EventResult<'climbing'>['status']
  station?: string
  entrant: Tables<'entrants'>['id']
  runs: BlocScores[]
}

export type BlocScores = {
  climbing: boolean
  t: number
  tp: number
  z: number
  a: number
  data: EventResult<'climbing'>['result'][number]
}

type BlocDataRow = Omit<LiveDataResult, 'rank'>

export type EventLiveDataClimbing = {
  active: {
    round?: string
    class?: string
    classId?: string
    entrants?: {
      station: string | undefined
      class: string | undefined
      entrant?: Tables<'entrants'>['id'] | undefined
    }[]
  }[]
  blocData?: BlocDataRow[][]
  judgeActive?: {
    station: string | undefined
    class: string | undefined
    entrant?: Tables<'entrants'>['id'] | undefined
  }[]
  results: {
    [cls: string]: LiveDataResult[] | undefined
  }
  startlist?: {
    class: string
    classId: string
    startlist: { entrant: Tables<'entrants'>['id']; pos: number }[]
  }[]
  entrantMap?: EntrantMap
  message?: unknown
}

export function generateLiveDataClimbing({
  format,
  results,
  judgesData,
  formatOptions,
}: {
  format?: EventFormat<'climbing'>
  results?: EventResults<'climbing'>
  judgesData: JudgeDataClimbing[]
  formatOptions: EventFormatOptions<'climbing'>
}): EventLiveDataClimbing {
  const entrantMap = atomStore.get(entrantMapAtom)
  const liveData: EventLiveDataClimbing = { active: [], results: {} }
  if (!results || !format) return liveData

  const active = results.active

  if (!active?.round) return liveData

  const activeRound = format.rounds.find((round) => round.id === active.round)
  if (!activeRound) return liveData

  liveData.entrantMap = entrantMap

  liveData.startlist = activeRound.classes.map((cls) => ({
    class: cls.name,
    classId: cls.id,
    startlist: cls.entrants.map((entrant, i) => ({ entrant: entrant.id, pos: i + 1 })),
  }))

  liveData.results = generateLiveDataResultsClimbing({
    round: activeRound,
    results,
  })
  // console.log('liveData.results', liveData.results);
  // const liveDataResultsEntrantMap = Object.entries(liveData.results).reduce(
  //   (map, [_cls, results]) => {
  //     // console.log({ map, _cls, results });
  //     if (!results) return map;
  //     results.forEach((result) => {
  //       map[result.entrant] = result;
  //     });
  //     return map;
  //   },
  //   {} as Record<string, LiveDataResult>,
  // );
  // console.log('liveDataResultsEntrantMap', liveDataResultsEntrantMap);
  const judgeActive = judgesData
    .map((judgeData, index) =>
      judgeData
        ? {
            station: judgeData.active?.class
              ? getBoulderingJudgeStation(
                  judgeData.active?.class,
                  index % (formatOptions.blocCount || 4),
                )
              : undefined,
            class: judgeData.active?.class,
            entrant: judgeData.active?.entrant,
          }
        : undefined,
    )
    .filter((ja) => !!ja && !!ja.station)
    .sort((a, b) => a!.station!.localeCompare(b!.station!))

  liveData.judgeActive = judgeActive as NonNullable<(typeof judgeActive)[number]>[]

  const blocData = judgesData.map((judgeData) => {
    const blocResults = Object.entries(judgeData?.[activeRound.id] ?? {})
      .reduce((live, [classId, entrants]) => {
        const blocResult = Object.entries(entrants ?? {}).map(([entrantId, entrantResult]) => {
          const run = getBlocScores(entrantResult)
          const entrantInfo = entrantMap[entrantId]
          const result: BlocDataRow = {
            tops: run.t > 0 ? 1 : 0,
            zones: run.z > 0 ? 1 : 0,
            ta: run.t,
            za: run.z,
            status: results?.[activeRound.id]?.[classId]?.[entrantId]?.status,
            entrant: Number(entrantId),
            runs: [run],
            startPos: entrantInfo?.startPos!,
          }

          return result
        })
        live.push(blocResult)

        return live
      }, [] as BlocDataRow[][])
      .flat()

    const sorted = sortAndRank(blocResults, {
      criteria: [
        { field: 'status', undefinedFirst: true },
        { field: 'tops' },
        { field: 'zones' },
        { field: 'ta', asc: true },
        { field: 'za', asc: true },
        { field: 'startPos' },
      ],
      stabilize: { field: 'entrant.last_name', asc: true },
    })

    // console.log({ sorted });
    return sorted
  })

  if (liveData.results) {
    // for each station, map through the results specific to their class and add the station to the matching entrant
    for (const judge of liveData.judgeActive) {
      if (!judge.class || !judge.entrant) continue

      liveData.results[judge.class]?.forEach((result) => {
        if (result.entrant === judge.entrant) {
          result.station = judge.station
        }
      })
    }
  }

  liveData.active = activeRound.classes.map((cls) => {
    return {
      round: activeRound.name,
      class: cls.name,
      classId: cls.id,
      entrants: judgeActive.filter((judge) => judge?.class === cls.id) as NonNullable<
        (typeof judgeActive)[number]
      >[],
      // startlist: cls.entrants.map((entrant, i) => ({ entrant, pos: i + 1 })),
    }
  })

  liveData.blocData = blocData
  // console.log({ blocDataSize: getSize(blocData), liveDataSize: getSize(liveData) });

  return liveData
}

export function generateLiveDataResultsClimbing({
  round,
  results,
}: {
  round: EventFormat<'climbing'>['rounds'][number]
  results: EventResults<'climbing'>
}): EventLiveData<'climbing'>['results'] {
  return round.classes.reduce(
    (live, cls) => {
      const activeResults = results?.[round.id]?.[cls.id]

      const liveDataResults = getEntrants(cls.entrants, activeResults)

      live[cls.id] = sortAndRank(liveDataResults, {
        criteria: [
          { field: 'status', undefinedFirst: true },
          { field: 'tops' },
          { field: 'zones' },
          { field: 'ta', asc: true },
          { field: 'za', asc: true },
          { field: 'startPos' },
        ],
        stabilize: { field: 'entrant', asc: true },
      })

      return live
    },
    {} as EventLiveData<'climbing'>['results'],
  )
}

function getEntrants(
  entrants: Tables<'entrants'>[],
  results:
    | {
        [entrant: string]: EventResult<'climbing'> | null | undefined
      }
    | undefined,
): Omit<LiveDataResult, 'rank'>[] {
  return entrants.map((entrant, i) => {
    const result = results?.[entrant.id]?.result
    const runs = result?.map((bloc) => getBlocScores(bloc)) ?? []

    const scores = runs.reduce(
      (scores, run) => {
        scores.tops += run?.t ? 1 : 0
        scores.zones += run?.z ? 1 : 0

        scores.ta += run?.t ?? 0
        scores.za += run?.z ?? 0
        return scores
      },
      { tops: 0, zones: 0, ta: 0, za: 0 },
    )

    return {
      ...scores,
      status: results?.[entrant.id]?.status,
      entrant: entrant.id,
      runs,
      startPos: i + 1,
    }
  })
}
