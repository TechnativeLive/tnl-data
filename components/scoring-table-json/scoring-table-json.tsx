'use client';

import { ScoringTableJsonClimbing } from '@/components/scoring-table-json/climbing/scoring';
import { ScoringTableFallback } from '@/components/scoring-table-json/fallback';
import { ScoringTableJsonIceSkating } from '@/components/scoring-table-json/ice-skating/scoring';
import { EventFormat, EventFormatOptions, EventResults, Sport } from '@/lib/event-data';
import { getValidators } from '@/lib/json/functions';
import { formatValidationError } from '@/lib/json/messages';
import { notifications } from '@mantine/notifications';
import { useEffect } from 'react';

export type ScoringTablePropsJson = {
  format: Tables<'events'>['format'] | undefined;
  formatOptions: Tables<'events'>['format_options'] | undefined;
  results: Tables<'events'>['results'] | undefined;
  timers: Tables<'events'>['timers'] | undefined;
  dsPrivateKey?: string;
};

export type ScoringTableProps<T extends Sport> = {
  format: EventFormat<T>;
  formatOptions: EventFormatOptions<T>;
  results: EventResults<T>;
  timers: Tables<'events'>['timers'] | undefined;
  dsPrivateKey: string;
};

const Components = {
  climbing: ScoringTableJsonClimbing,
  'ice-skating': ScoringTableJsonIceSkating,
};

export function ScoringTableJson<S extends Sport>({
  sport,
  format,
  formatOptions,
  results,
  timers,
  dsPrivateKey,
}: {
  sport: S;
} & ScoringTableProps<S>) {
  // validate format
  useEffect(() => {
    const validators = getValidators(sport);
    const { errors } = validators.format(format);

    for (const err of errors) {
      notifications.show({
        title: 'Format invalid',
        color: 'red',
        message: formatValidationError(err),
        autoClose: false,
      });
    }
  }, [sport, format]);

  // validate format options
  useEffect(() => {
    const validators = getValidators(sport);
    const { errors } = validators.formatOptions(formatOptions);

    for (const err of errors) {
      notifications.show({
        title: 'Format Options invalid',
        color: 'red',
        message: formatValidationError(err),
        autoClose: false,
      });
    }
  }, [sport, formatOptions]);

  // validate results
  useEffect(() => {
    const validators = getValidators(sport);
    const { errors } = validators.results(results);

    for (const err of errors) {
      notifications.show({
        title: 'Results invalid',
        color: 'red',
        message: formatValidationError(err),
        autoClose: false,
      });
    }
  }, [sport, results]);

  // validate private datastream key
  useEffect(() => {
    if (!dsPrivateKey) {
      notifications.show({
        title: 'Datastream private key missing',
        color: 'red',
        message: 'Please provide a private key to enable graphics',
        autoClose: false,
      });
    }
  }, [dsPrivateKey]);

  const Component = (Components[sport] || ScoringTableFallback) as (
    props: ScoringTableProps<S>,
  ) => JSX.Element;

  return (
    <Component
      format={format as EventFormat<S>}
      formatOptions={formatOptions as EventFormatOptions<S>}
      results={results as EventResults<S>}
      timers={timers}
      dsPrivateKey={dsPrivateKey}
    />
  );
}
