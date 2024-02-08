'use client';

import { ScoringTableFallback } from '@/components/scoring-table/fallback';
import { Sport } from '@/lib/event-data';

export type ScoringTableProps = {
  format: Tables<'formats'>['id'] | undefined;
  dsPrivateKey?: string;
};

export function ScoringTable({
  sport,
  format,
  dsPrivateKey,
}: {
  sport: Sport;
} & ScoringTableProps) {
  switch (sport) {
    case 'climbing':
      return <ScoringTableFallback format={format} dsPrivateKey={dsPrivateKey} />;
    default:
      return <ScoringTableFallback format={format} dsPrivateKey={dsPrivateKey} />;
  }
}
