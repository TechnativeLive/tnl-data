import { SortCriteria, Strategy } from '@/lib/sort-and-rank';
import { findNextFalsey, isTied } from '@/lib/sort-and-rank/helpers';

export function getRanks<Datum extends Record<string, unknown>>(
  data: Datum[],
  criteria: SortCriteria,
  strategem?: Strategy,
): number[] {
  const tiedRanks: boolean[] = [];
  let assignableRanks: number[] = [];

  for (let i = 0; i < data.length - 1; i++) {
    tiedRanks.push(isTied(data[i], data[i + 1], criteria));
  }
  tiedRanks.push(false); // don't forget about our last person, we care even though no one else does.

  let denseDupeCounter = 0;
  let rank;

  switch (strategem) {
    // Modified: 1334 - ties are ranked as the lowest rank in the group
    case 'modified':
      assignableRanks = tiedRanks.map((isTied, index) =>
        isTied ? findNextFalsey(index + 1, tiedRanks) : index + 1,
      );
      break;

    //Dense: 1223 - after a tie, continue counting up from the last rank
    case 'dense':
      for (let i = 0; i < tiedRanks.length; i++) {
        assignableRanks.push(i + 1 - denseDupeCounter);
        if (tiedRanks[i]) denseDupeCounter++;
      }
      break;

    // Ordinal: 1234 - no tied ranks ever
    case 'ordinal':
      assignableRanks = tiedRanks.map((_, i) => i + 1);
      break;

    // Fractional: 1.5 1.5 3 4 - ties ranks are averaged
    case 'fractional':
      let avg: number | undefined = undefined;
      for (let i = 0; i < tiedRanks.length; i++) {
        // default ranking (same as standard)
        let rank = i + 1;
        if (tiedRanks[i]) {
          // on the first tied element, store a value for the average rank of that tied group
          if (avg === undefined) {
            const nextUntiedIndex = findNextFalsey(i + 1, tiedRanks);
            avg = (rank + nextUntiedIndex) / 2;
          }
          rank = avg;
        } else if (tiedRanks[i - 1]) {
          // this is the last element of a tied group
          rank = assignableRanks[i - 1];
          avg = undefined;
        }
        // if the element is not tied with any other, fallback to default ranking
        assignableRanks.push(rank);
      }
      break;

    // Standard || undefined: 1224 - ties are ranked as the highest in the group
    default:
      assignableRanks = [1];
      for (let i = 1; i < tiedRanks.length; i++) {
        rank = i + 1;
        if (tiedRanks[i - 1]) {
          rank = assignableRanks[i - 1];
        }
        assignableRanks.push(rank);
      }
      break;
  }

  return assignableRanks;
}
