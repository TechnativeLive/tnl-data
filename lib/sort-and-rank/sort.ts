import { SortCriteria, SortCriterion } from '@/lib/sort-and-rank';
import { compare, partition } from '@/lib/sort-and-rank/helpers';
import get from 'lodash.get';

export function sort<Datum extends Record<string, unknown>>(
  data: Datum[],
  criteria: SortCriteria,
): Datum[] {
  if (criteria.length === 0) return data;
  const [firstPass, firstPassTies] = splitAndSort(data, criteria[0]);
  return breakTies(firstPass, criteria.slice(1), firstPassTies);
}

function breakTies<Datum extends Record<string, unknown>>(
  data: Datum[],
  criteria: SortCriteria,
  ties: [number, number][] = [],
): Datum[] {
  if (ties.length === 0) {
    return data;
  }

  // We update tiesToBreak in each loop. If any are remaining, we use the next criteria to break them
  let tiesToBreak = ties;
  for (let i = 0; i < criteria.length && tiesToBreak.length > 0; i++) {
    for (const tieGroup of ties) {
      const [sorted, furtherTies] = splitAndSort(
        data.slice(tieGroup[0], tieGroup[1] + 1),
        criteria[i],
      );
      tiesToBreak = furtherTies;
      if (sorted.length !== tieGroup[1] - tieGroup[0] + 1) {
        console.warn('Sanity check - sorted length does not match tie group length');
      }
      data.splice(tieGroup[0], sorted.length, ...sorted);
    }
  }

  return data;
}

function splitAndSort<Datum extends Record<string, unknown>>(
  data: Datum[],
  criterion: SortCriterion,
): [Datum[], [number, number][]] {
  const [undef, def] = partition(data, criterion.field, undefined);
  sortByCriterion(def, criterion);

  const sorted = criterion.undefinedFirst ? undef.concat(def) : def.concat(undef);
  const ties = getTieGroups(sorted, criterion);

  return [sorted, ties];
}

function sortByCriterion<Datum extends Record<string, unknown>>(
  data: Datum[],
  criterion: SortCriterion,
): Datum[] {
  return data.sort((aDatum, bDatum) => {
    const a = get(aDatum, criterion.field);
    const b = get(bDatum, criterion.field);

    return compare(a, b, criterion);
  });
}

// Returns an array of [start, end] indices for each group of ties
function getTieGroups<Datum extends Record<string, unknown>>(
  data: Datum[],
  criterion: SortCriterion,
): [number, number][] {
  const tieGroups: [number, number][] = [];
  let currentTieGroup: number[] = [];
  let prevIsTied = false;

  for (let i = 1; i < data.length; i++) {
    const isTied = get(data[i], criterion.field) === get(data[i - 1], criterion.field);

    // On a tie, check to see if previous comparison was a tie.
    if (isTied) {
      if (!prevIsTied) {
        // 'Start' the tied group
        currentTieGroup[0] = i - 1;
        prevIsTied = true;
      }

      // if we are tied, and last element, 'end' the tie group
      if (i === data.length - 1) {
        currentTieGroup[1] = i;
        tieGroups.push(currentTieGroup as [number, number]);
        // currentTieGroup = []; // unnecessary
      }
    } else if (prevIsTied) {
      // 'End' the tied group and push it to the ties array
      currentTieGroup[1] = i - 1;
      tieGroups.push(currentTieGroup as [number, number]);
      currentTieGroup = [];
      prevIsTied = false;
    }
  }

  return tieGroups;
}
