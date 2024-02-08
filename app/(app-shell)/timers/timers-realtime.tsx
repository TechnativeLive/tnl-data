'use client';

import { CreateTimerButton, NewIndicator } from '@/app/(app-shell)/timers/create-timer';

import { createBrowserClient } from '@/lib/db/client';
import { ActionIcon, Button, Loader, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useState, useEffect } from 'react';
import { DbTimer } from '@/lib/db/custom';
import { TimerControls } from '@/app/(app-shell)/timers/controls';
import { TimerControlsTitle } from '@/components/timer/title';
import { IconWindowMaximize } from '@tabler/icons-react';
import Link from 'next/link';
import { useSetSearchParams } from '@/lib/hooks/use-set-query-params';
import { TimerControlsDisplay } from '@/components/timer/display';
import { TimerControlsStatus } from '@/components/timer/status';
import { TimerControlsMuteButton } from '@/components/timer/mute';
import { TimerControlsButtons } from '@/components/timer/buttons';
import { TimerControlsSettingsDrawer } from '@/components/timer/settings-drawer';

export function TimersRealtime() {
  const supabase = createBrowserClient();
  const [timers, setTimers] = useState<DbTimer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('timers')
        .select('*')
        .order('created_at', { ascending: false })
        .returns<DbTimer[]>();

      setTimers(data ?? []);
      setLoading(false);
    };

    fetchData();
  }, [supabase]);

  useEffect(() => {
    const channel = supabase
      .channel('realtime timers')
      .on<DbTimer>('postgres_changes', { event: '*', schema: 'public', table: 'timers' }, (e) => {
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
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  if (loading || !timers) {
    return (
      <div className="h-36 w-full flex items-center justify-center">
        {loading ? <Loader /> : <Text size="lg">No timers found</Text>}
      </div>
    );
  }

  return (
    <div className="grid gap-4 items-start justify-center xl:justify-start grid-cols-[repeat(auto-fill,minmax(200px,350px))]">
      <CreateTimerButton />
      {timers.map((timer) => (
        <TimerControlCard key={timer.id} timer={timer} />
      ))}
    </div>
  );
}

function TimerControlCard({ timer }: { timer: DbTimer }) {
  const setSearchParams = useSetSearchParams();

  return (
    <TimerControls timer={timer} size="sm">
      <NewIndicator createdAt={timer.created_at} />
      <div className="flex items-center gap-2 h-[1.875rem]">
        <TimerControlsTitle editable />
        <Button
          onClick={() => setSearchParams('control', timer.id.toString())}
          ml="auto"
          size="compact-xs"
        >
          Controls
        </Button>
      </div>
      <div className="flex gap-2 items-center">
        <TimerControlsDisplay className="text-2xl font-bold grow" />
        <TimerControlsStatus />
        <TimerControlsMuteButton />
        <TimerControlsSettingsDrawer />

        <Link target="_blank" href={`/timers/${timer.id}`}>
          <ActionIcon className="shrink-0" size="lg" c="dimmed">
            <IconWindowMaximize stroke={2} />
          </ActionIcon>
        </Link>
      </div>

      <TimerControlsButtons />
    </TimerControls>
  );
}

// {/* shadcn alt drawer - has animation issue with scrollbar */}
//   <Drawer modal={false}>
//     <DrawerTrigger>
//       <ActionIcon className='shrink-0' size='lg' onClick={open} c="dimmed">
//         <IconSettings stroke={1.5} />
//       </ActionIcon>
//     </DrawerTrigger>
//     <DrawerContent className='bg-body px-8'>
//       <DrawerTitle>Edit Timer Settings</DrawerTitle>
//       <DrawerDescription>Timer {timer.id}</DrawerDescription>
//       <TimerSettings timer={localTimer} setTimer={setLocalTimer} />
//       <DrawerFooter>Footer</DrawerFooter>
//     </DrawerContent>
//   </Drawer>
