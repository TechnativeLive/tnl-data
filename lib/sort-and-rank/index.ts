import { getRanks } from '@/lib/sort-and-rank/rank';
import { sort } from '@/lib/sort-and-rank/sort';

export type SortConfig = {
  criteria: SortCriteria;
  stratagem: Strategy;
};

export type SortCriteria = SortCriterion[];
export type SortCriterion = {
  field: string;
  asc?: boolean;
  undefinedFirst?: boolean;
  treatAs?: 'string' | 'number' | 'boolean' | 'date';
};

export type Strategy = 'standard' | 'modified' | 'dense' | 'ordinal' | 'fractional' | undefined;

export function sortAndRank<Datum extends Record<string, unknown>, FieldName extends 'rank'>(
  data: Datum[],
  { criteria: sortBy, stratagem }: SortConfig,
  fieldName = 'rank'
): (Datum & Record<FieldName, number>)[] {
  const sortedData = sort(data, sortBy);
  const ranks = getRanks(data, sortBy, stratagem);

  return sortedData.map((datum, index) => {
    // @ts-expect-error - We are mutating the object by adding a new field
    datum[fieldName] = ranks[index];
    return datum as Datum & Record<FieldName, number>;
  });
}
