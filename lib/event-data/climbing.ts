import { EventFormat, EventResult, EventResults } from '@/lib/event-data';
import { sortAndRank } from '@/lib/sort-and-rank';

export type EventResultClimbing = {
  tech: number;
  pres: number;
  ddct: number;
};

export type EventFormatClimbing = {
  rounds: { id: string; kind: RoundKind; name: string; classes: RoundClass[] }[];
};

export type EventFormatOptionsClimbing = {
  blocCount: number;
};

type RoundKind = 'qualifying' | 'semifinal' | 'final';

type RoundClass = {
  id: string;
  name: string;
  active?: boolean;
  entrants: Tables<'entrants'>[] | Tables<'entrants'>['id'][];
};

type LiveDataSegmentResult = {
  rank: number;
  total: number;
  entrant: Tables<'entrants'>;
} & EventResult<'climbing'>;
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
    entrant?: Partial<LiveDataSegmentResult>;
  };
  results: { segment?: LiveDataSegmentResult[]; overall?: LiveDataOverallResult[] };
  startlist?: { entrant: Tables<'entrants'>; pos: number }[];
  message?: unknown;
};

export function generateLiveDataClimbing({
  format,
  results,
}: {
  format: EventFormat<'climbing'>;
  results: EventResults<'climbing'>;
}): EventLiveDataClimbing {
  const liveData: EventLiveDataClimbing = { active: {}, results: {} };

  const active = results.active;
  if (!active.round) return liveData;

  const activeRound = format.rounds.find((round) => round.id === active.round);
  if (!activeRound) return liveData;

  liveData.active.round = activeRound.name;
  if (!active.class) return liveData;

  const activeClass = activeRound?.classes.find((cls) => cls.id === active.class);
  if (!activeClass) return liveData;

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

  const overallClassResultsObj = roundWithMatchingClass.reduce(
    (acc, round) => {
      const classResults = getEntrants(
        round!.class.entrants,
        results?.[round!.id]?.[activeClass.id],
      );
      for (const entrant of classResults) {
        if (acc[entrant.entrant.id]) {
          acc[entrant.entrant.id].total += entrant.total;
          acc[entrant.entrant.id].breakdown!.pres += entrant.pres;
          acc[entrant.entrant.id].breakdown!.tech += entrant.tech;
          acc[entrant.entrant.id].breakdown!.ddct += entrant.ddct;
        } else {
          acc[entrant.entrant.id] = {
            total: entrant.total,
            breakdown: {
              tech: entrant.tech,
              pres: entrant.pres,
              ddct: entrant.ddct,
            },
            entrant: entrant.entrant,
          };
        }
      }
      return acc;
    },
    {} as Record<string, Omit<LiveDataOverallResult, 'rank'>>,
  );

  const overallClassResultsUnranked = Object.values(overallClassResultsObj);
  const overallClassResults = sortAndRank(overallClassResultsUnranked, {
    criteria: [{ field: 'total' }, { field: 'breakdown.pres' }, { field: 'breakdown.tech' }],
  });

  liveData.results.overall = overallClassResults;

  // @ts-expect-error regression? array of union of types
  const _entrant = activeClass?.entrants.find(
    (entrant: (typeof activeClass.entrants)[number]) =>
      (typeof entrant === 'number' ? entrant : entrant.id) === active.entrant,
  );
  const entrant = typeof _entrant === 'number' ? undefined : _entrant;
  liveData.active.entrant = {
    entrant,
    rank: rankedEntrant?.rank,
    total: rankedEntrant?.total,
    ddct: rankedEntrant?.ddct,
    pres: rankedEntrant?.pres,
    tech: rankedEntrant?.tech,
  };

  return liveData;
}

function getEntrants(
  entrants: Tables<'entrants'>[] | Tables<'entrants'>['id'][],
  results: NonNullable<EventResults<'climbing'>[string]>[string],
): Omit<LiveDataSegmentResult, 'rank'>[] {
  return entrants.map((e) => {
    const id = typeof e === 'number' ? e : e.id;
    const eResult = results?.[id];
    const total = (eResult?.tech ?? 0) + (eResult?.pres ?? 0) - (eResult?.ddct ?? 0);
    return {
      total,
      entrant: typeof e === 'number' ? ({ id: e } as Tables<'entrants'>) : e,
      tech: eResult?.tech ?? 0,
      pres: eResult?.pres ?? 0,
      ddct: eResult?.ddct ?? 0,
    };
  });
}
