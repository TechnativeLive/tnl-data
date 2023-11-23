import { SortCriteria } from '@/lib/sort-and-rank';
import get from 'lodash.get';

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
  criteria: SortCriteria
): boolean {
  for (let i = 0; i < criteria.length; i++) {
    const aValue = get(a, criteria[i].field);
    const bValue = get(b, criteria[i].field);

    if (aValue !== bValue) {
      return false;
    }
  }

  return true;
}

export function partition<Datum extends Record<string, unknown>>(
  data: Datum[],
  field: string,
  condition: unknown
): [Datum[], Datum[]] {
  const pass: Datum[] = [];
  const fail: Datum[] = [];

  for (const datum of data) {
    get(datum, field) === condition ? pass.push(datum) : fail.push(datum);
  }

  return [pass, fail];
}
