import { EventResults, JudgeDataClimbing } from '@/lib/event-data';

type RequiredData = {
  results: EventResults<'climbing'> | undefined;
  judgesData: JudgeDataClimbing[] | null | undefined;
  blocCount: number;
};

export function mergeBoulderingResults({
  results = {} as EventResults<'climbing'>,
  judgesData,
  blocCount,
}: RequiredData) {
  // results contains data directly from the head judge, specifically entrant status data.
  // judgesData contains scoring data from each judge.

  (judgesData || []).forEach((judgeData, judgeIndex) => {
    if (!judgeData) return;

    for (const round in judgeData) {
      if (round === 'active') {
        // const ja = judgeData.active;
        // if (ja?.round && ja?.class && ja?.entrant) {
        //   if (!results[ja.round]) results[ja.round] = {};
        //   if (!results[ja.round]![ja.class]) results[ja.round]![ja.class] = {};
        //   if (!results[ja.round]![ja.class]![ja.entrant]) results[ja.round]![ja.class]![ja.entrant] = { result: [] };
        //   if (!results[ja.round]![ja.class]![ja.entrant]!.result) results[ja.round]![ja.class]![ja.entrant]!.result = [];

        //   results[ja.round]![ja.class]![ja.entrant]!.
        // }
        continue;
      } else {
        const roundData = judgeData[round] || {};
        for (const cls in roundData) {
          const classData = roundData[cls] || {};
          for (const entrant in classData) {
            const entrantData = classData[entrant];
            if (!entrantData) continue;
            if (!results[round]) results[round] = {};
            if (!results[round]![cls]) results[round]![cls] = {};
            if (!results[round]![cls]![entrant]) results[round]![cls]![entrant] = { result: [] };
            if (!results[round]![cls]![entrant]!.result)
              results[round]![cls]![entrant]!.result = [];

            results[round]![cls]![entrant]!.result[judgeIndex % blocCount] = entrantData;
          }
        }
      }
    }
  });

  return results;
}
