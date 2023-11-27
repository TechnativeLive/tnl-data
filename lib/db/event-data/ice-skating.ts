import { EventFormat, EventResult, EventResults } from '@/lib/db/event-data';
import { sortAndRank } from '@/lib/sort-and-rank';

export type EventResultIceSkating = {
  tech: number;
  pres: number;
  ddct: number;
};

export type EventFormatIceSkating = {
  rounds: { id: string; kind: RoundKind; name: string; classes: RoundClass[] }[];
};

type RoundKind = 'short-prog' | 'free-skate';

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
} & EventResult<'ice-skating'>;
type LiveDataOverallResult = {
  rank: number;
  total: number;
  breakdown?: EventResult<'ice-skating'>;
  entrant?: Tables<'entrants'>;
};
export type EventLiveDataIceSkating = {
  active: {
    round?: string;
    class?: string;
    entrant?: Partial<LiveDataSegmentResult>;
  };
  results: { segment?: LiveDataSegmentResult[]; overall?: LiveDataOverallResult[] };
  startlist?: (Tables<'entrants'> & { pos: number })[];
};

export function generateLiveDataIceSkating({
  format,
  results,
}: {
  format: EventFormat<'ice-skating'>;
  results: EventResults<'ice-skating'>;
}): EventLiveDataIceSkating {
  const liveData: EventLiveDataIceSkating = { active: {}, results: {} };
  const active = results.active;

  if (!active.round) return liveData;
  const round = format.rounds.find((round) => round.id === active.round);
  if (!round) return liveData;
  liveData.active.round = round.name;

  if (!active.class) return liveData;
  const cls = round?.classes.find((cls) => cls.id === active.class);
  if (!cls) return liveData;
  liveData.active.class = cls.name;
  liveData.startlist = cls.entrants.map((e, i) =>
    typeof e === 'number' ? { id: e, pos: i + 1 } : { ...e, pos: i + 1 }
  ) as NonNullable<EventLiveDataIceSkating['startlist']>;
  const activeResults = results?.[active.round]?.[active.class];

  const segmentResults: Omit<LiveDataSegmentResult, 'rank'>[] = cls.entrants.map((e) => {
    const id = typeof e === 'number' ? e : e.id;
    const eResult = activeResults?.[id];
    const total = (eResult?.tech ?? 0) + (eResult?.pres ?? 0) - (eResult?.ddct ?? 0);
    return {
      total,
      entrant: typeof e === 'number' ? ({ id: e } as Tables<'entrants'>) : e,
      tech: eResult?.tech ?? 0,
      pres: eResult?.pres ?? 0,
      ddct: eResult?.ddct ?? 0,
    };
  });
  liveData.results.segment = sortAndRank(segmentResults, {
    criteria: [{ field: 'total' }, { field: 'pres' }, { field: 'tech' }],
  });

  const roundKindToMerge: RoundKind = round.kind === 'short-prog' ? 'free-skate' : 'short-prog';
  const twinRound = format.rounds.find((r) => r.kind === roundKindToMerge);

  let relevantResults = [{ round, results: activeResults }];
  if (twinRound)
    relevantResults.push({ round: twinRound, results: results?.[twinRound.id]?.[active.class] });

  const overallResults = relevantResults.reduce(
    (acc, cur) => {
      for (const [entry, result] of Object.entries(cur.results ?? {})) {
        // if (!result) continue;
        const entrant = cur.round.classes
          .find((cls) => cls.id === active.class)
          ?.entrants.find((e) =>
            typeof e === 'number' ? e === Number(entry) : e.id === Number(entry)
          );

        const total = (result?.tech ?? 0) + (result?.pres ?? 0) - (result?.ddct ?? 0);
        if (!acc[entry]) {
          acc[entry] = {
            total,
            entrant:
              typeof entrant === 'number' ? ({ id: entrant } as Tables<'entrants'>) : entrant,
          };
        } else {
          acc[entry].total += total;

          if (result) {
            if (!acc[entry].breakdown) acc[entry].breakdown = { tech: 0, pres: 0, ddct: 0 };
            acc[entry].breakdown!.pres += result.pres;
            acc[entry].breakdown!.tech += result.tech;
            acc[entry].breakdown!.ddct += result.ddct;
          }
        }
      }

      return acc;
    },
    {} as Record<
      string,
      {
        total: number;
        breakdown?: EventResult<'ice-skating'>;
        entrant?: Tables<'entrants'>;
      }
    >
  );

  const overallResultsArray = Object.values(overallResults);
  const orderedOverallResults = sortAndRank(overallResultsArray, {
    criteria: [{ field: 'total' }, { field: 'breakdown.pres' }, { field: 'breakdown.tech' }],
  });

  const rankedEntrant = orderedOverallResults.find((e) => e.entrant?.id === active.entrant);
  liveData.results.overall = orderedOverallResults;

  if (!active.entrant) return liveData;
  const _entrant = cls?.entrants.find(
    (entrant) => (typeof entrant === 'number' ? entrant : entrant.id) === active.entrant
  );
  const entrant = typeof _entrant === 'number' ? undefined : _entrant;
  liveData.active.entrant = {
    entrant,
    rank: rankedEntrant?.rank,
    total: rankedEntrant?.total,
    ddct: activeResults?.[active.entrant]?.ddct,
    pres: activeResults?.[active.entrant]?.pres,
    tech: activeResults?.[active.entrant]?.tech,
  };

  return liveData;
}
