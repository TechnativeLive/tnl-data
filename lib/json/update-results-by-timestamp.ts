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
