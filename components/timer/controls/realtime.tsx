'use client';

import { createBrowserClient } from '@/lib/db/client';
import { Loader, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useState, useEffect } from 'react';
import { DbTimer } from '@/lib/db/custom';
import { TimerControlCardLarge } from '@/components/timer/controls/large';
import { TimerControlCardSmall } from '@/components/timer/controls/small';
import clsx from 'clsx';
import { TimerControlCardCompactSm } from '@/components/timer/controls/compact-sm';

const Components = {
  sm: TimerControlCardSmall,
  lg: TimerControlCardLarge,
  'compact-sm': TimerControlCardCompactSm,
};

export function TimersRealtime({
  ids,
  size,
}: {
  ids?: Tables<'events'>['timers'];
  size: keyof typeof Components;
}) {
  const supabase = createBrowserClient();
  const [timers, setTimers] = useState<DbTimer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = ids
        ? await supabase
            .from('timers')
            .select('*')
            .in('id', ids)
            .order('name, created_at', { ascending: false })
            .returns<DbTimer[]>()
        : await supabase
            .from('timers')
            .select('*')
            .order('name, created_at', { ascending: false })
            .returns<DbTimer[]>();

      setTimers(data ?? []);
      setLoading(false);
    };

    fetchData();
  }, [supabase, ids]);

  useEffect(() => {
    const channel = supabase
      .channel('realtime timers')
      .on<DbTimer>(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'timers',
          filter: ids ? `id=in.(${ids.join(',')})` : undefined,
        },
        (e) => {
          if (e.errors) {
            notifications.show({
              title: 'Warning',
              color: 'orange',
              message: 'Timers are desynced. Please refresh the page',
              autoClose: false,
            });
            return;
          }

          if (e.eventType === 'DELETE') {
            setTimers((ts) => ts.filter((t) => t.id !== e.old.id));
            return;
          }

          if (e.eventType === 'INSERT') {
            setTimers((ts) => [e.new, ...ts]);
            return;
          }

          if (e.eventType === 'UPDATE') {
            setTimers((ts) => ts.map((t) => (t.id === e.new.id ? e.new : t)));
            return;
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, ids]);

  if (loading || !timers) {
    return (
      <div className={clsx(size === 'lg' && 'h-36', 'w-full flex items-center justify-center')}>
        {loading ? <Loader /> : <Text size="lg">No timer found</Text>}
      </div>
    );
  }

  const Component = Components[size];

  return (
    <>
      {timers.map((timer) => (
        <Component key={timer.id} timer={timer} />
      ))}
    </>
  );
}
