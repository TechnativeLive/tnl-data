'use client';

import { updateOutlineAtom } from '@/components/shell/event-outline';
import { createBrowserClient } from '@/lib/db/client';
import { Json } from '@/lib/db/types';
import { Sport, EventResults, JudgeDataClimbing, EventFormat } from '@/lib/event-data';
import { mergeBoulderingResults } from '@/lib/json/merge-bouldering-results';
import { notifications } from '@mantine/notifications';
import { useSetAtom } from 'jotai';
import { useParams } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import { useThrottledCallback } from 'use-debounce';

type Data = Omit<Tables<'events'>, 'slug' | 'snapshot' | 'sport' | 'ds_keys' | '_format'> & {
  ds_keys: Tables<'ds_keys'> | null;
};

export function useRealtimeJsonEvent<S extends string>() {
  const params = useParams<{ sport?: string; event?: string }>();
  const supabase = createBrowserClient();
  const [event, setEvent] = useState<
    | (Data & {
        results: S extends Sport ? EventResults<S> : Json;
        format: S extends Sport ? EventFormat<S> : Json;
      })
    | null
  >(null);
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

      // @ts-ignore
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

  return {
    event,
    loading,
  };
}
