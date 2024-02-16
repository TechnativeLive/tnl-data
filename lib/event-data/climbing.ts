import { getBlocScores } from '@/components/scoring-table-json/climbing/utils';
import { EventFormat, EventLiveData, EventResult, EventResults } from '@/lib/event-data';
import { sortAndRank } from '@/lib/sort-and-rank';

export type EventResultClimbing = {
  startedAt: number;
  zoneAt?: number;
  topAt?: number;
  topAtProvisional?: number;
  endedAt?: number;
}[][];

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
  rank: number;
  tops: number;
  zones: number;
  ta: number;
  za: number;
  status: EventResult<'climbing'>['status'];
  entrant: Tables<'entrants'>;
  runs: EventResult<'climbing'>['result'];
};

export type EventLiveDataClimbing = {
  active: {
    round?: string;
    class?: string;
    classId?: string;
    entrants?: Partial<LiveDataResult>[];
    // results: LiveDataResult[];
    // startlist?: { entrant: Tables<'entrants'>; pos: number }[];
  }[];
  results: {
    [cls: string]: LiveDataResult[] | undefined;
  };
  startlist?: { entrant: Tables<'entrants'>; pos: number }[][];
  message?: unknown;
};

export function generateLiveDataClimbing({
  format,
  results,
}: {
  format: EventFormat<'climbing'>;
  results: EventResults<'climbing'>;
}): EventLiveDataClimbing {
  const liveData: EventLiveDataClimbing = { active: [], results: {} };
  const active = results.active;

  if (!active?.round) return liveData;

  const activeRound = format.rounds.find((round) => round.id === active.round);
  if (!activeRound) return liveData;

  liveData.active = activeRound.classes.map((cls) => {
    // const activeResults = results?.[activeRound.id]?.[cls.id];

    // const liveDataResults = getEntrants(cls.entrants, activeResults);
    // const rankedResults = sortAndRank(liveDataResults, {
    //   criteria: [
    //     { field: 'status', undefinedFirst: true },
    //     { field: 'tops' },
    //     { field: 'zones' },
    //     { field: 'ta' },
    //     { field: 'za' },
    //   ],
    //   stabilize: { field: 'entrant.last_name', asc: true },
    // });

    // liveData.results[cls.id] = rankedResults;

    return {
      round: activeRound.name,
      class: cls.name,
      classId: cls.id,
      // nasty
      // entrants: liveDataResults.filter((entrant) => active),
      startlist: cls.entrants.map((entrant, i) => ({ entrant, pos: i + 1 })),
    };
  });

  liveData.results = generateLiveDataResultsClimbing({
    round: activeRound,
    results,
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
          { field: 'ta' },
          { field: 'za' },
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
        [entrant: string]: EventResult<'climbing'> | undefined;
      }
    | undefined,
): Omit<LiveDataResult, 'rank'>[] {
  return entrants.map((entrant) => {
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

    // TODO: find values here
    return {
      ...scores,
      status: results?.[entrant.id]?.status,
      entrant,
      runs: result ?? [],
    };
  });
}
