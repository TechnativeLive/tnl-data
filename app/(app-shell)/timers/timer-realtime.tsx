'use client';

import { createBrowserClient } from '@/lib/db/client';
import { ActionIcon, Divider, Loader, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useState, useEffect } from 'react';
import { DbTimer } from '@/lib/db/custom';
import { TimerControlsButtons, TimerControlsUpdateButton } from '@/components/timer/buttons';
import { TimerControlsTitle } from '@/components/timer/title';
import { TimerControls } from '@/app/(app-shell)/timers/controls';
import { TimerControlsDisplay } from '@/components/timer/display';
import { TimerControlsStatus } from '@/components/timer/status';
import { TimerControlsDuration } from '@/components/timer/duration';
import { TimerControlsSoundsSettings } from '@/components/timer/sounds-settings';
import { IconWindowMaximize } from '@tabler/icons-react';
import Link from 'next/link';

export function TimerRealtime({ id }: { id: number }) {
  const supabase = createBrowserClient();
  const [timer, setTimer] = useState<DbTimer>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('timers')
        .select('*')
        .eq('id', id)
        .returns<DbTimer>()
        .single();

      setTimer(data ?? undefined);
      setLoading(false);
    };

    fetchData();
  }, [supabase, id]);

  useEffect(() => {
    const channel = supabase
      .channel('realtime timers')
      .on<DbTimer>(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'timers', filter: `id=eq.${id}` },
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

          setTimer(e.eventType === 'DELETE' ? undefined : e.new);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, id]);

  if (loading || !timer) {
    return (
      <div className="h-36 w-full flex items-center justify-center">
        {loading ? <Loader /> : <Text size="lg">No timer found</Text>}
      </div>
    );
  }

  return <TimerPage timer={timer} />;
}

function TimerPage({ timer }: { timer: DbTimer }) {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl flex flex-col justify-center">
        <TimerControls size="lg" timer={timer}>
          <div className="flex gap-4 justify-between flex-wrap items-center">
            <TimerControlsTitle />
            <div className="flex items-center gap-2">
              <TimerControlsDisplay className="text-4xl font-bold -mt-0.5" />
              <TimerControlsStatus size={36} />
              <Link target="_blank" href={`/timers/${timer.id}`}>
                <ActionIcon className="shrink-0" size={36} c="dimmed">
                  <IconWindowMaximize stroke={2} />
                </ActionIcon>
              </Link>
            </div>
          </div>

          <TimerControlsButtons size="lg" />
          <Divider className="mt-8 mb-2" />
          <TimerControlsDuration />
          <Divider className="mt-8 mb-2" />
          <TimerControlsSoundsSettings />
          <Divider className="my-2" />
          <TimerControlsUpdateButton />
        </TimerControls>
      </div>
    </div>
  );
}
