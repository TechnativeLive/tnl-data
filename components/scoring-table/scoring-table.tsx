'use client';

import { ScoringTableFallback } from '@/components/scoring-table/fallback';
import { ScoringTableIceSkating } from '@/components/scoring-table/ice-skating';
import { Sport } from '@/lib/db/event-data';

export type ScoringTableProps = {
  format: Tables<'events'>['format'] | undefined;
  initialResults: Tables<'events'>['results'] | undefined;
};

export function ScoringTable({
  sport,
  format,
  initialResults,
}: {
  sport: Sport;
} & ScoringTableProps) {
  switch (sport) {
    case 'ice-skating':
      return <ScoringTableIceSkating format={format} initialResults={initialResults} />;
    default:
      return <ScoringTableFallback format={format} initialResults={initialResults} />;
  }
}
