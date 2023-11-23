import { SortCriteria, SortCriterion } from '@/lib/sort-and-rank';
import { partition } from '@/lib/sort-and-rank/helpers';
import get from 'lodash.get';

const stringComparator = new Intl.Collator('en', { sensitivity: 'base' }).compare;

export function sort<Datum extends Record<string, unknown>>(
  data: Datum[],
  criteria: SortCriteria
): Datum[] {
  if (criteria.length === 0) return data;
  const [firstPass, firstPassTies] = splitAndSort(data, criteria[0]);
  return breakTies(firstPass, criteria.slice(1), firstPassTies);
}

function breakTies<Datum extends Record<string, unknown>>(
  data: Datum[],
  criteria: SortCriteria,
  ties: [number, number][] = []
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
        criteria[i]
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
  criterion: SortCriterion
): [Datum[], [number, number][]] {
  const [undef, def] = partition(data, criterion.field, undefined);
  sortByCriterion(def, criterion);

  const sorted = criterion.undefinedFirst ? undef.concat(def) : def.concat(undef);
  const ties = getTieGroups(sorted, criterion);

  return [sorted, ties];
}

function sortByCriterion<Datum extends Record<string, unknown>>(
  data: Datum[],
  criterion: SortCriterion
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
  criterion: SortCriterion
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
      } else if (i === data.length - 1) {
        // continue the tied group, and only 'end' it if it's the last element
        currentTieGroup[1] = i;
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

function compare(a: unknown, b: unknown, criterion: SortCriterion): number {
  const comparison = criterion.treatAs
    ? compareByType(a, b, criterion.treatAs)
    : genericCompare(a, b);
  return criterion.asc ? comparison : -comparison;
}

function genericCompare(a: unknown, b: unknown): number {
  if (a === b) return 0;
  if (a === null) return 1;
  if (b === null) return -1;

  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }

  if (typeof a === 'string' && typeof b === 'string') {
    return stringComparator(a, b);
  }

  if (typeof a === 'boolean' && typeof b === 'boolean') {
    return Number(a) - Number(b);
  }

  console.log(
    `Incompatible types or incorrect field/accessor. Proceeding without sorting these values: [A: ${a}] \u00B7 [B: ${b}]`
  );
  return 0;
}

function compareByType(a: unknown, b: unknown, type: SortCriterion['treatAs']): number {
  try {
    if (type === 'string') return stringComparator(a as string, b as string);
    if (type === 'number' || type === 'boolean') return Number(a) - Number(b);
    if (type === 'date') return new Date(a as string).getTime() - new Date(b as string).getTime();
  } catch (e) {
    console.warn(
      `Sorting incompatible types. Proceeding without sorting these values: [A: ${a}] \u00B7 [B: ${b}] (Coerced to ${type})`
    );
  }
  return 0;
}
