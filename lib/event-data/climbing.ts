import { EventFormat, EventResult, EventResults } from '@/lib/event-data';
import { sortAndRank } from '@/lib/sort-and-rank';
import { append } from '@/lib/utils';

export type EventResultClimbing = {
  startedAt: number;
  zoneAt?: number;
  topAt?: number;
  topAtProvisional?: number;
  endedAt?: number;
  active?: boolean;
}[][];

export type EventFormatClimbing = {
  rounds: { id: string; kind: RoundKind; name: string; classes: RoundClass[] }[];
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

type LiveDataSegmentResult = {
  rank: number;
  total: number;
  entrant: Tables<'entrants'>;
  runs: EventResult<'climbing'>;
};
type LiveDataOverallResult = {
  rank: number;
  total: number;
  breakdown?: EventResult<'climbing'>;
  entrant?: Tables<'entrants'>;
};
export type EventLiveDataClimbing = {
  active: {
    round?: string;
    class?: string;
    entrants?: Partial<LiveDataSegmentResult>[];
    results: LiveDataOverallResult[];
    startlist?: { entrant: Tables<'entrants'>; pos: number }[];
  }[];
  results: LiveDataOverallResult[][];
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
  const liveData: EventLiveDataClimbing = { active: [], results: [] };
  const active = results.active;
  if (!active?.round) return liveData;

  const activeRound = format.rounds.find((round) => round.id === active.round);
  if (!activeRound || 1 === 1) return liveData;

  liveData.active = activeRound.classes.map((cls) => {
    const activeResults = results?.[activeRound.id]?.[cls.id];
    const activeEntrants = Object.values(activeResults ?? {}).filter((entrant) => entrant);

    return {
      round: activeRound.name,
      class: cls.name,
      entrants: results[activeRound.id]?.[cls.id],
    };
  });

  for (const cls of activeRound.classes) {
    append(cls.name, liveData.active, '');
  }

  liveData.active.round = activeRound.name;
  if (!active.class) return liveData;

  liveData.active.class = activeClass.name;
  liveData.startlist = activeClass.entrants.map((e, i) => ({
    entrant: typeof e === 'number' ? { id: e } : e,
    pos: i + 1,
  })) as NonNullable<EventLiveDataClimbing['startlist']>;

  const activeResults = results?.[active.round]?.[active.class];
  const segmentResults: Omit<LiveDataSegmentResult, 'rank'>[] = getEntrants(
    activeClass.entrants,
    activeResults,
  );

  liveData.results.segment = sortAndRank(segmentResults, {
    criteria: [{ field: 'total' }, { field: 'pres' }, { field: 'tech' }],
  });

  const rankedEntrant = liveData.results.segment.find((e) => e.entrant?.id === active.entrant);

  const roundWithMatchingClass = format.rounds
    .map((round) => {
      const { classes, ...roundInfo } = round;
      const matchingClass = round.classes.find((cls) => cls.id === active.class);
      return matchingClass ? { ...roundInfo, class: matchingClass } : undefined;
    })
    .filter(Boolean);

  // const overallClassResultsObj = roundWithMatchingClass.reduce(
  //   (acc, round) => {
  //     const classResults = getEntrants(
  //       round!.class.entrants,
  //       results?.[round!.id]?.[activeClass.id],
  //     );
  //     for (const entrant of classResults) {
  //       if (acc[entrant.entrant.id]) {
  //         acc[entrant.entrant.id].total += entrant.total;
  //         acc[entrant.entrant.id].breakdown!.pres += entrant.pres;
  //         acc[entrant.entrant.id].breakdown!.tech += entrant.tech;
  //         acc[entrant.entrant.id].breakdown!.ddct += entrant.ddct;
  //       } else {
  //         acc[entrant.entrant.id] = {
  //           total: entrant.total,
  //           breakdown: {
  //             tech: entrant.tech,
  //             pres: entrant.pres,
  //             ddct: entrant.ddct,
  //           },
  //           entrant: entrant.entrant,
  //         };
  //       }
  //     }
  //     return acc;
  //   },
  //   {} as Record<string, Omit<LiveDataOverallResult, 'rank'>>,
  // );

  // const overallClassResultsUnranked = Object.values(overallClassResultsObj);
  // const overallClassResults = sortAndRank(overallClassResultsUnranked, {
  //   criteria: [{ field: 'total' }, { field: 'breakdown.pres' }, { field: 'breakdown.tech' }],
  // });

  // liveData.results.overall = overallClassResults;

  const _entrant = activeClass?.entrants.find((entrant) => entrant.id === active.entrant);
  const entrant = typeof _entrant === 'number' ? undefined : _entrant;
  liveData.active.entrant = {
    entrant,
    rank: rankedEntrant?.rank,
    total: rankedEntrant?.total,
    // ddct: rankedEntrant?.ddct,
    // pres: rankedEntrant?.pres,
    // tech: rankedEntrant?.tech,
  };

  return liveData;
}

function getEntrants(
  entrants: Tables<'entrants'>[],
  results: NonNullable<EventResults<'climbing'>[string]>[string],
): Omit<LiveDataSegmentResult, 'rank'>[] {
  return entrants.map((entrant) => {
    const eResult = results?.[entrant.id];
    // const total = (eResult?.tech ?? 0) + (eResult?.pres ?? 0) - (eResult?.ddct ?? 0);
    return {
      total: 0,
      entrant,
      runs: [],
      // tech: eResult?.tech ?? 0,
      // pres: eResult?.pres ?? 0,
      // ddct: eResult?.ddct ?? 0,
    };
  });
}
