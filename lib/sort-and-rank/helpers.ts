import { SortCriteria, SortCriterion } from '@/lib/sort-and-rank';
import get from 'lodash.get';

const stringComparator = new Intl.Collator('en', { sensitivity: 'base' }).compare;

export function findNextFalsey(index: number, list: unknown[]): number {
  for (let i = index; i < list.length; i++) {
    if (!list[i]) {
      return i;
    }
  }
  // Return -1 if no falsey value is found
  return -1;
}

export function isTied<D extends Record<string, unknown>>(
  a: D,
  b: D,
  criteria: SortCriteria,
): boolean {
  for (let i = 0; i < criteria.length; i++) {
    const aValue = get(a, criteria[i]!.field);
    const bValue = get(b, criteria[i]!.field);

    if (aValue !== bValue) {
      return false;
    }
  }

  return true;
}

export function partition<Datum extends Record<string, unknown>>(
  data: Datum[],
  field: string,
  condition: unknown,
): [Datum[], Datum[]] {
  const pass: Datum[] = [];
  const fail: Datum[] = [];

  for (const datum of data) {
    get(datum, field) === condition ? pass.push(datum) : fail.push(datum);
  }

  return [pass, fail];
}

export function compare(a: unknown, b: unknown, criterion: SortCriterion): number {
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

  return 0;
}

function compareByType(a: unknown, b: unknown, type: SortCriterion['treatAs']): number {
  try {
    if (type === 'string') return stringComparator(a as string, b as string);
    if (type === 'number' || type === 'boolean') return Number(a) - Number(b);
    if (type === 'date') return new Date(a as string).getTime() - new Date(b as string).getTime();
  } catch (e) {
    console.warn(
      `Sorting incompatible types. Proceeding without sorting these values: [A: ${a}] \u00B7 [B: ${b}] (Coerced to ${type})`,
    );
  }
  return 0;
}
