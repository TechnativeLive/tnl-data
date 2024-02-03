'use client'

import { CreateTimerButton } from '@/components/timer/create-timer';
import { TimerControls } from '@/components/timer/controls';
import { createBrowserClient } from '@/lib/db/client';
import { Loader } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useState, useEffect } from 'react';
import { DbTimer } from '@/lib/db/custom';

export function TimerListRealtime() {
  const supabase = createBrowserClient();
  const [timers, setTimers] = useState<DbTimer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('timers').select('*').order('created_at', { ascending: false }).returns<DbTimer[]>()

      setTimers(data ?? []);
      setLoading(false);
    };

    fetchData();
  }, [supabase]);

  useEffect(() => {
    const channel = supabase
      .channel('realtime timers')
      .on<DbTimer>(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'timers' },
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
            setTimers(ts => ts.filter(t => t.id !== e.old.id))
            return
          }

          if (e.eventType === 'INSERT') {
            setTimers(ts => [e.new, ...ts])
            return
          }

          if (e.eventType === 'UPDATE') {
            setTimers(ts => ts.map(t => t.id === e.new.id ? e.new : t))
            return
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return loading ? (
    <div className="fixed inset-0 flex items-center justify-center">
      <Loader />
    </div>
  ) : !timers ? (<div>No timers found</div>) : (
    <div className="grid gap-4 items-start justify-center xl:justify-start grid-cols-[repeat(auto-fill,minmax(200px,350px))]">
      {timers.map(timer => <TimerControls key={timer.id} timer={timer} />)}
      <CreateTimerButton />
    </div>
  );
}
