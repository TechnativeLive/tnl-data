'use client';

import { Debug } from '@/components/debug';
import { ScoringTable } from '@/components/scoring-table/scoring-table';
import { updateOutlineAtom } from '@/components/shell/event-outline';
import { EventDateClassification, classifyEventByDate } from '@/lib/dates';
import { createBrowserClient } from '@/lib/db/client';
import { Sport } from '@/lib/event-data';
import { Title, Button, Text, Loader } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconEdit } from '@tabler/icons-react';
import { useSetAtom } from 'jotai';
import { Route } from 'next';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

type Data = Omit<Tables<'events'>, 'slug' | 'snapshot' | 'sport' | 'ds_keys'> & {
  ds_keys: Tables<'ds_keys'> | null;
};

const eventStatusTextMap: Record<EventDateClassification, string> = {
  future: 'Upcoming',
  current: 'Active',
  past: 'Past',
  unknown: 'Unknown',
};

export function RealtimeEvent({ debug }: { debug?: boolean }) {
  const params = useParams<{ sport?: string; event?: string }>();
  const supabase = createBrowserClient();
  const [event, setEvent] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const updateOutline = useSetAtom(updateOutlineAtom);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('events')
        .select(
          'name, format, results, starts_at, ends_at, created_at, updated_at, ds_keys(name, description, private, public)'
        )
        .eq('slug', params.event || '')
        .single();

      setEvent(data);
      setLoading(false);
      updateOutline();
    };

    fetchData();
  }, [params.event, supabase, updateOutline]);

  useEffect(() => {
    const channel = supabase
      .channel('realtime events')
      .on<Tables<'events'>>(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'events', filter: `slug=eq.${params.event}` },
        (e) => {
          if (e.new.slug === params.event) {
            console.log({ new: e.new });
            if (!event || e.errors || e.new.ds_keys !== event?.ds_keys?.name) {
              notifications.show({
                title: 'Warning',
                color: 'orange',
                message: 'The event has been updated. Please refresh the page',
                autoClose: false,
              });
              if (e.errors) console.warn('Realtime Event - UPDATE - Error', e.errors);
              return;
            }
            // TODO: validate format / results in tandem - results for entrants no longer in the fomrat should be removed
            const updatedEvent: Data = {
              ds_keys: event.ds_keys,
              name: e.new.name,
              // supabase realtime events can skip columns with large data when there are no changes to that data
              // https://github.com/supabase/realtime/issues/223#issuecomment-1022653529
              format: e.new.format || event.format,
              results: e.new.results,
              ends_at: e.new.ends_at,
              starts_at: e.new.starts_at,
              updated_at: e.new.updated_at,
              created_at: e.new.created_at,
            };
            setEvent(updatedEvent);
            updateOutline();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, event, params.event, updateOutline]);

  const eventStatus = classifyEventByDate({ starts_at: event?.starts_at, ends_at: event?.ends_at });

  return loading ? (
    <div className="fixed inset-0 flex items-center justify-center">
      <Loader />
    </div>
  ) : debug ? (
    <Debug data={event} label="Event" />
  ) : (
    <>
      <div className="flex items-center gap-4">
        <Title>{event?.name}</Title>
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

      <ScoringTable
        sport={params.sport as Sport}
        format={event?.format}
        initialResults={event?.results}
        dsPrivateKey={event?.ds_keys?.private}
      />
    </>
  );
}
