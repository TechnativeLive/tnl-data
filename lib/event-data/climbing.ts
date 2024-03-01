import {
  getBlocScores,
  getBoulderingJudgeStation,
} from '@/components/scoring-table-json/climbing/utils';
import {
  EventFormat,
  EventLiveData,
  EventResult,
  EventResults,
  JudgeDataClimbing,
} from '@/lib/event-data';
import { sortAndRank } from '@/lib/sort-and-rank';

export type EventResultClimbing = ({
  startedAt: number;
  zoneAt?: number;
  topAt?: number;
  topAtProvisional?: number;
  endedAt?: number;
} | null)[][];

export type EventFormatClimbing = {
  rounds: { id: string; kind?: RoundKind; name: string; classes: RoundClass[] }[];
};

export type EventFormatOptionsClimbing = {
  blocCount: number;
};

export const roundKindClimbingSelection: { value: RoundKind; label: string }[] = [
  { value: 'qualifying', label: 'Qualifying' },
  { value: 'semifinal', label: 'Semifinal' },
  { value: 'final', label: 'Final' },
];

type RoundKind = 'qualifying' | 'semifinal' | 'final';

type RoundClass = {
  id: string;
  name: string;
  active?: boolean;
  entrants: Tables<'entrants'>[];
};

type LiveDataResult = {
  startPos: number;
  rank: number;
  tops: number;
  zones: number;
  ta: number;
  za: number;
  status: EventResult<'climbing'>['status'];
  station?: string;
  entrant: Tables<'entrants'>;
  runs: BlocScores[];
};

export type BlocScores = {
  climbing: boolean;
  top: number;
  topProvisional: number;
  zone: number;
  attempts: number;
  data: EventResult<'climbing'>['result'][number];
};

export type EventLiveDataClimbing = {
  active: {
    round?: string;
    class?: string;
    classId?: string;
    entrants?: {
      station: string | undefined;
      class: string | undefined;
      entrant: LiveDataResult | undefined;
    }[];
  }[];
  judgeActive?: {
    station: string | undefined;
    class: string | undefined;
    entrant: LiveDataResult | undefined;
  }[];
  results: {
    [cls: string]: LiveDataResult[] | undefined;
  };
  startlist?: {
    class: string;
    classId: string;
    startlist: { entrant: Tables<'entrants'>; pos: number }[];
  }[];
  message?: unknown;
};

export function generateLiveDataClimbing({
  format,
  results,
  judgesData,
}: {
  format: EventFormat<'climbing'>;
  results: EventResults<'climbing'>;
  judgesData: JudgeDataClimbing[];
}): EventLiveDataClimbing {
  const liveData: EventLiveDataClimbing = { active: [], results: {} };
  const active = results.active;

  if (!active?.round) return liveData;

  const activeRound = format.rounds.find((round) => round.id === active.round);
  if (!activeRound) return liveData;

  liveData.startlist = activeRound.classes.map((cls) => ({
    class: cls.name,
    classId: cls.id,
    startlist: cls.entrants.map((entrant, i) => ({ entrant, pos: i + 1 })),
  }));

  liveData.results = generateLiveDataResultsClimbing({
    round: activeRound,
    results,
  });
  // console.log('liveData.results', liveData.results);
  const liveDataResultsEntrantMap = Object.entries(liveData.results).reduce(
    (map, [_cls, results]) => {
      // console.log({ map, _cls, results });
      if (!results) return map;
      results.forEach((result) => {
        map[result.entrant.id] = result;
      });
      return map;
    },
    {} as Record<string, LiveDataResult>,
  );
  // console.log('liveDataResultsEntrantMap', liveDataResultsEntrantMap);
  const judgeActive = judgesData
    .map((judgeData, index) =>
      judgeData
        ? {
            station: judgeData.active?.class
              ? getBoulderingJudgeStation(judgeData.active?.class, index)
              : undefined,
            class: judgeData.active?.class,
            entrant: judgeData.active?.entrant
              ? liveDataResultsEntrantMap[judgeData.active?.entrant]
              : undefined,
          }
        : undefined,
    )
    .filter((ja) => !!ja && !!ja.station)
    .sort((a, b) => a!.station!.localeCompare(b!.station!));

  // const judgeActive = Object.entries(results.judgeActive ?? {})
  //   .map(([station, { class: cls, entrant }]) => {
  //     return {
  //       station,
  //       class: cls,
  //       entrant: entrant ? liveDataResultsEntrantMap[entrant] : undefined,
  //     };
  //   })
  //   .sort((a, b) => a.station.localeCompare(b.station));

  liveData.judgeActive = judgeActive as NonNullable<(typeof judgeActive)[number]>[];

  if (liveData.results) {
    // for each class, map through the results and find the matching entrant in the judgeActive array
    // for (const cls in liveData.results) {
    //   if (liveData.results[cls]) {
    //     liveData.results[cls] = liveData.results[cls]?.map((entrant, i) => {
    //       const activeStation = judgeActive.find(
    //         (judge) => judge.entrant?.entrant.id === entrant.entrant.id,
    //       );
    //       return { ...entrant, station: activeStation?.station };
    //     });
    //   }
    // }

    // for each station, map through the results specific to their class and add the station to the matching entrant

    for (const judge of liveData.judgeActive) {
      if (!judge.class || !judge.entrant) continue;
      // console.log(judge);
      liveData.results[judge.class]?.forEach((result) => {
        if (result.entrant.id === judge.entrant?.entrant.id) {
          result.station = judge.station;
        }
      });

      // liveData.results[judge.class] = liveData.results[judge.class]?.map((entrant) => {
      //   const activeStation =
      //     judge.entrant?.entrant.id === entrant.entrant.id ? judge.station : undefined;
      //   console.log(entrant.entrant.last_name, activeStation);
      //   return { ...entrant, station: activeStation };
      // });
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
    };
  });

  return liveData;
}

export function generateLiveDataResultsClimbing({
  round,
  results,
}: {
  round: EventFormat<'climbing'>['rounds'][number];
  results: EventResults<'climbing'>;
}): EventLiveData<'climbing'>['results'] {
  return round.classes.reduce(
    (live, cls) => {
      const activeResults = results?.[round.id]?.[cls.id];

      const liveDataResults = getEntrants(cls.entrants, activeResults);

      live[cls.id] = sortAndRank(liveDataResults, {
        criteria: [
          { field: 'status', undefinedFirst: true },
          { field: 'tops' },
          { field: 'zones' },
          { field: 'ta', asc: true },
          { field: 'za', asc: true },
          { field: 'startPos' },
        ],
        stabilize: { field: 'entrant.last_name', asc: true },
      });

      return live;
    },
    {} as EventLiveData<'climbing'>['results'],
  );
}

function getEntrants(
  entrants: Tables<'entrants'>[],
  results:
    | {
        [entrant: string]: EventResult<'climbing'> | null | undefined;
      }
    | undefined,
): Omit<LiveDataResult, 'rank'>[] {
  return entrants.map((entrant, i) => {
    const result = results?.[entrant.id]?.result;
    const runs = result?.map((bloc) => getBlocScores(bloc)) ?? [];

    const scores = runs.reduce(
      (scores, run) => {
        scores.tops += run?.top ? 1 : 0;
        scores.zones += run?.zone ? 1 : 0;

        scores.ta += run?.top ?? 0;
        scores.za += run?.zone ?? 0;
        return scores;
      },
      { tops: 0, zones: 0, ta: 0, za: 0 },
    );

    return {
      ...scores,
      status: results?.[entrant.id]?.status,
      entrant,
      runs,
      startPos: i + 1,
    };
  });
}
