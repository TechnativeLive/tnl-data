import { EventResults, Sport } from '@/lib/event-data';

export function updateResultsByTimestampInPlace(
  prevResults: EventResults<Sport>,
  newResults: EventResults<Sport>,
) {
  const roundKeys = [...new Set([...Object.keys(prevResults), ...Object.keys(newResults)])];
  for (const roundKey of roundKeys) {
    // Note: we can no longer delete keys from the results object
    if (!newResults[roundKey]) {
      newResults[roundKey] = prevResults[roundKey];
    }

    if (roundKey === 'active') {
      if ((prevResults.active?.__ts || 0) > (newResults.active?.__ts || 0)) {
        newResults.active = prevResults.active;
      }
      continue;
    }

    if (roundKey === 'judgeActive') {
      const prevJudgeActive = prevResults.judgeActive || {};
      const newJudgeActive = newResults.judgeActive || {};

      const allJudgeKeys = [
        ...new Set([...Object.keys(prevJudgeActive), ...Object.keys(newJudgeActive)]),
      ];
      for (const judgeKey of allJudgeKeys) {
        if (!newJudgeActive[judgeKey]) {
          newJudgeActive[judgeKey] = prevJudgeActive[judgeKey]!;
        } else if (!prevJudgeActive[judgeKey]) {
          continue;
        } else {
          if ((prevJudgeActive[judgeKey]?.__ts || 0) > (newJudgeActive[judgeKey]?.__ts || 0)) {
            newJudgeActive[judgeKey] = prevJudgeActive[judgeKey]!;
          }
        }
      }
      continue;
    }

    // This silently fails if the new results are not an object
    const prevClasses = prevResults[roundKey] || {};
    const newClasses = newResults[roundKey] || {};

    const allClassKeys = [...new Set([...Object.keys(prevClasses), ...Object.keys(newClasses)])];
    for (const classKey of allClassKeys) {
      if (!newClasses[classKey]) {
        newClasses[classKey] = prevClasses[classKey];
      }

      const prevEntrants = prevClasses[classKey] || {};
      const newEntrants = newClasses[classKey] || {};

      const allEntrantKeys = [
        ...new Set([...Object.keys(prevEntrants), ...Object.keys(newEntrants)]),
      ];
      for (const entrantKey of allEntrantKeys) {
        const prevEntrant = prevEntrants[entrantKey];
        const newEntrant = newEntrants[entrantKey];

        if (!newEntrant) {
          newEntrants[entrantKey] = prevEntrant;
        } else if (!prevEntrant) {
          continue;
        } else {
          if (prevEntrant.__ts > newEntrant.__ts) {
            newEntrants[entrantKey] = prevEntrant;
          }
        }
      }
    }
  }
}
