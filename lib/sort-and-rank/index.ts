import { getRanks } from '@/lib/sort-and-rank/rank';
import { sort } from '@/lib/sort-and-rank/sort';
import { Simplify } from 'type-fest';

export type SortConfig = {
  criteria: SortCriteria;
  stratagem?: Strategy;
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
  config: SortConfig,
  fieldName = 'rank'
): Simplify<Record<FieldName, number> & Datum>[] {
  const sortedData = sort(data, config.criteria);
  const ranks = getRanks(data, config.criteria, config.stratagem);

  return sortedData.map((datum, index) => {
    // @ts-expect-error - We are mutating the object by adding a new field
    datum[fieldName] = ranks[index];
    return datum as Datum & Record<FieldName, number>;
  });
}
