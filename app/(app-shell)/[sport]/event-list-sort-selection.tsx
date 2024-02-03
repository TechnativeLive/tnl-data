'use client';

import { Select } from '@/components/select';
import { useSearchParams } from 'next/navigation';
import { useSetSearchParams } from '@/lib/hooks/use-set-query-params';

export type DateSortOption = 'starts_at' | 'updated_at' | 'created_at';
const sortOptions: { value: DateSortOption; label: string }[] = [
  { value: 'starts_at', label: 'Start Date' },
  { value: 'updated_at', label: 'Updated At' },
  { value: 'created_at', label: 'Created At' },
];

export function EventListSortSelection() {
  const searchParams = useSearchParams();
  const setQueryParams = useSetSearchParams();

  const sortOption = searchParams.get('sort') ?? ('starts_at' as DateSortOption);

  return (
    <Select
      surround
      label="Order By"
      defaultValue={sortOption}
      data={sortOptions}
      allowDeselect={false}
      value={sortOption}
      onChange={(value) => setQueryParams('sort', value)}
    />
  );
}
