'use client';

import { createBrowserClient } from '@/lib/db/client';
import { DbTimer } from '@/lib/db/custom';
import { notifications } from '@mantine/notifications';
import { createContext, useContext, useEffect, useState } from 'react';

const EventTimersContext = createContext<DbTimer[] | undefined>(undefined);

export function EventTimersProvider({
  ids,
  children,
}: {
  ids?: Tables<'events'>['timers'];
  children: React.ReactNode;
}) {
  const supabase = createBrowserClient();
  const [timers, setTimers] = useState<DbTimer[]>([]);
  // const [loading, setLoading] = useState(true);

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
      // setLoading(false);
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

  return <EventTimersContext.Provider value={timers}>{children}</EventTimersContext.Provider>;
}

export function useEventTimers() {
  const context = useContext(EventTimersContext);

  if (!context) {
    throw new Error('useEventTimers must be used within a EventTimersProvider');
  }

  return context;
}
