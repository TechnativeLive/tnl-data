'use client';

import { Debug } from '@/components/debug';
import { ScoringTableJson } from '@/components/scoring-table-json/scoring-table-json';
import { updateOutlineAtom } from '@/components/shell/event-outline';
import { EventDateClassification, classifyEventByDate } from '@/lib/dates';
import { createBrowserClient } from '@/lib/db/client';
import {
  EventFormat,
  EventFormatOptions,
  EventResults,
  JudgeDataClimbing,
  Sport,
} from '@/lib/event-data';
import { mergeBoulderingResults } from '@/lib/json/merge-bouldering-results';
import { Title, Button, Text, Loader } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconEdit } from '@tabler/icons-react';
import { useSetAtom } from 'jotai';
import { Route } from 'next';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { useThrottledCallback } from 'use-debounce';

type Data = Omit<Tables<'events'>, 'slug' | 'snapshot' | 'sport' | 'ds_keys' | '_format'> & {
  ds_keys: Tables<'ds_keys'> | null;
};

const eventStatusTextMap: Record<EventDateClassification, string> = {
  future: 'Upcoming',
  current: 'Active',
  past: 'Past',
  unknown: 'Unknown',
};

// let prevNow = Date.now();

export function RealtimeJsonEvent({ debug }: { debug?: boolean }) {
  const params = useParams<{ sport?: string; event?: string }>();
  const searchParams = useSearchParams();
  const supabase = createBrowserClient();
  const [event, setEvent] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const updateOutline = useSetAtom(updateOutlineAtom);

  const fetchData = useThrottledCallback(
    useCallback(async () => {
      const { data } = await supabase
        .from('events')
        .select(
          'name, format, format_options, results, starts_at, ends_at, created_at, updated_at, timers, judge_data, ds_keys(name, description, private, public, kind, id)',
        )
        .eq('slug', params.event || '')
        .single();

      setEvent((prev) => {
        if (params.sport !== 'climbing') return data;
        // console.group('RealtimeJsonEvent', Date.now() - prevNow);
        // prevNow = Date.now();
        const mergedResults = mergeBoulderingResults({
          results: (data?.results || prev?.results || {}) as EventResults<'climbing'>,
          judgesData: data?.judge_data as JudgeDataClimbing[],
          blocCount: (data?.format_options as { blocCount: number })?.blocCount || 4,
        });
        // console.log('data', data);
        // console.log('mergedResults', mergedResults);
        // console.log('prev', prev);
        // console.groupEnd();

        return {
          ...(data as Data),
          results: mergedResults,
        };
      });
      setLoading(false);
      updateOutline();
    }, [params.event, params.sport, supabase, updateOutline]),
    500,
    { leading: true, trailing: true },
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const channel = supabase
      .channel('realtime events')
      .on<Tables<'events'>>(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'events', filter: `slug=eq.${params.event}` },
        (e) => {
          // console.log('Realtime update', e.eventType, e.table, e.commit_timestamp, e.errors);
          if (e.errors || e.new.ds_keys !== event?.ds_keys?.name) {
            notifications.show({
              title: 'Warning',
              color: 'orange',
              message: 'The event has been updated. Please refresh the page',
              autoClose: false,
            });
            if (e.errors) console.warn('Realtime Event - UPDATE - Error', e.errors);
            return;
          }

          fetchData();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchData, params.event, event?.ds_keys?.name]);

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
