'use client';

import { Debug } from '@/components/debug';
import { ScoringTableJson } from '@/components/scoring-table-json/scoring-table-json';
import { EventDateClassification, classifyEventByDate } from '@/lib/dates';
import {
  EventFormat,
  EventFormatOptions,
  EventResults,
  JudgeDataClimbing,
  Sport,
} from '@/lib/event-data';
import { useRealtimeJsonEvent } from '@/lib/hooks/use-realtime-json-event';
import { Title, Button, Text, Loader } from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';
import { Route } from 'next';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';

const eventStatusTextMap: Record<EventDateClassification, string> = {
  future: 'Upcoming',
  current: 'Active',
  past: 'Past',
  unknown: 'Unknown',
};

export function RealtimeJsonEvent({ debug }: { debug?: boolean }) {
  const params = useParams<{ sport?: string; event?: string }>();
  const searchParams = useSearchParams();
  const { event, loading } = useRealtimeJsonEvent();

  const eventStatus = classifyEventByDate({ starts_at: event?.starts_at, ends_at: event?.ends_at });

  const judge = searchParams.get('judge');
  const hideTitle = judge && !!judge.match(/^\w\d$/);

  return loading ? (
    <div className="fixed inset-0 flex items-center justify-center">
      <Loader />
    </div>
  ) : debug ? (
    <Debug data={event} label="Event" />
  ) : (
    <>
      {hideTitle ? null : (
        <div className="flex items-center gap-4">
          <Title size="h3">{event?.name}</Title>
          <Text size="sm" c="dimmed">
            {eventStatusTextMap[eventStatus]}
          </Text>
          <Button
            className="ml-auto"
            component={Link}
            href={`/${params.sport}/${params.event}/edit` as Route}
            variant="default"
            leftSection={<IconEdit size={16} />}
          >
            Edit
          </Button>
        </div>
      )}

      <ScoringTableJson
        sport={params.sport as Sport}
        format={event?.format as EventFormat<Sport>}
        formatOptions={event?.format_options as EventFormatOptions<Sport>}
        results={event?.results as EventResults<Sport>}
        judgesData={(event?.judge_data ?? []) as JudgeDataClimbing[]}
        dsPrivateKey={event?.ds_keys?.private!}
        timers={event?.timers}
      />
    </>
  );
}
