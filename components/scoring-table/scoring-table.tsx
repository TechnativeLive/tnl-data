'use client';

import { ScoringTableFallback } from '@/components/scoring-table/fallback';
import { ScoringTableIceSkating } from '@/components/scoring-table/ice-skating/scoring';
import { Sport } from '@/lib/event-data';

export type ScoringTableProps = {
  format: Tables<'events'>['format'] | undefined;
  initialResults: Tables<'events'>['results'] | undefined;
  dsPrivateKey?: string;
};

export function ScoringTable({
  sport,
  format,
  initialResults,
  dsPrivateKey,
}: {
  sport: Sport;
} & ScoringTableProps) {
  switch (sport) {
    case 'climbing':
      return (
        <ScoringTableIceSkating
          format={format}
          initialResults={initialResults}
          dsPrivateKey={dsPrivateKey}
        />
      );
    case 'ice-skating':
      return (
        <ScoringTableIceSkating
          format={format}
          initialResults={initialResults}
          dsPrivateKey={dsPrivateKey}
        />
      );
    default:
      return (
        <ScoringTableFallback
          format={format}
          initialResults={initialResults}
          dsPrivateKey={dsPrivateKey}
        />
      );
  }
}
