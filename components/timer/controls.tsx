'use client';

import { NewIndicator } from '@/components/timer/new-indicator';
import { TimerDisplay } from '@/components/timer/display';
import { createBrowserClient } from '@/lib/db/client';
import { timerPause, timerPlay, timerReset } from '@/lib/timer/utils';
import { ActionIcon, Button, ButtonGroup, Space, Text, TextInput, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconDeviceFloppy,
  IconEdit,
  IconSettings,
  IconVolume,
  IconVolumeOff,
  IconWindowMaximize,
} from '@tabler/icons-react';
import clsx from 'clsx';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { TimerStatusIcon } from '@/components/timer/status-icon';
import { DrawerAutoHeight } from '@/components/mantine-extensions/drawer';
import { TimerSettings } from '@/components/timer/settings';
import { DbTimer } from '@/lib/db/custom';
import { TimerDatastreamSelection } from '@/components/timer/datastream-selection';

export function TimerControls({ timer }: { timer: DbTimer }) {
  const supabase = createBrowserClient();

  const [localTimer, setLocalTimer] = useState(timer);
  const [opened, { open, close }] = useDisclosure(false);

  // keep local timer in sync with remote changes
  useEffect(() => {
    setLocalTimer(timer);
  }, [timer]);

  const ac = useRef<AbortController | undefined>();
  const syncTimer = async (timer: DbTimer) => {
    ac.current?.abort();
    ac.current = new AbortController();

    return supabase
      .from('timers')
      .upsert(timer, { onConflict: 'id', ignoreDuplicates: false })
      .abortSignal(ac.current.signal)
      .then(({ error }) => {
        // code 20: aborted request. the AbortController signal is now re-used for the next request
        // otherwise, clear the AbortController
        if (error?.code !== '20') ac.current = undefined;
      });
  };

  const MuteIcon = localTimer.muted ? IconVolumeOff : IconVolume;

  const [isEditingName, setIsEditingName] = useState(false);
  const [edittedName, setEdittedName] = useState(localTimer.name);

  return (
    <div
      className={clsx(
        'grid items-start gap-2 p-2 rounded-md relative border border-body-dimmed-hover transition-all',
        opened
          ? 'bg-dark-1/20 dark:bg-dark-1/0 dark:brightness-[2] delay-200 duration-300'
          : 'duration-150',
      )}
    >
      <DrawerAutoHeight
        position="bottom"
        opened={opened}
        onClose={close}
        title={
          <div className="flex items-center gap-6 flex-wrap justify-around">
            {/* <Space w={200} /> */}

            <Text fw="bold" fz="lg" data-autofocus>
              {timer.name || 'Unnamed Timer'}
            </Text>

            <TimerDatastreamSelection timer={timer} />
          </div>
        }
      >
        <TimerSettings timer={localTimer} setTimer={setLocalTimer} />
      </DrawerAutoHeight>

      <NewIndicator createdAt={timer.created_at} />
      <div className="flex items-center gap-2 h-[1.875rem]">
        <ActionIcon
          size="md"
          color="gray"
          c="dimmed"
          variant="light"
          onClick={() => setIsEditingName((editting) => !editting)}
        >
          <IconEdit size={16} />
        </ActionIcon>
        {isEditingName ? (
          <>
            <TextInput
              size="xs"
              value={edittedName || ''}
              onChange={(e) => setEdittedName(e.currentTarget.value)}
            />
            <ActionIcon
              size="md"
              variant="light"
              onClick={() => {
                const updatedTimer = { ...localTimer, name: edittedName };
                setLocalTimer(updatedTimer);
                syncTimer(updatedTimer);
                setIsEditingName(false);
              }}
            >
              <IconDeviceFloppy />
            </ActionIcon>
          </>
        ) : (
          <Text
            pl="xs"
            fz="xs"
            fw={timer.name ? 'bold' : undefined}
            fs={timer.name ? 'normal' : 'italic'}
            c={timer.name ? undefined : 'dimmed'}
          >
            {timer.name || 'Unnamed Timer'}
          </Text>
        )}
      </div>
      <div className="flex gap-2 items-center">
        <TimerDisplay timer={timer} className="grow text-2xl font-bold" />
        <TimerStatusIcon isRunning={timer.isRunning} value={timer.value} />
        <Tooltip label={localTimer.muted ? 'Unmute' : 'Mute'}>
          <ActionIcon size="lg" c={localTimer.muted ? 'red' : 'dimmed'}>
            <MuteIcon
              onClick={() => {
                const updatedTimer = { ...localTimer, muted: !localTimer.muted };
                setLocalTimer(updatedTimer);
                syncTimer(updatedTimer);
              }}
            />
          </ActionIcon>
        </Tooltip>
        <ActionIcon className="shrink-0" size="lg" onClick={open} c="dimmed">
          <IconSettings stroke={1.5} />
        </ActionIcon>

        {/* shadcn alt drawer - has animation issue with scrollbar */}
        {/* <Drawer modal={false}>
        <DrawerTrigger>
          <ActionIcon className='shrink-0' size='lg' onClick={open} c="dimmed">
            <IconSettings stroke={1.5} />
          </ActionIcon>
        </DrawerTrigger>
        <DrawerContent className='bg-body px-8'>
          <DrawerTitle>Edit Timer Settings</DrawerTitle>
          <DrawerDescription>Timer {timer.id}</DrawerDescription>
          <TimerSettings timer={localTimer} setTimer={setLocalTimer} />
          <DrawerFooter>Footer</DrawerFooter>
        </DrawerContent>
      </Drawer> */}

        <Link target="_blank" href={`/timers/${timer.id}`}>
          <ActionIcon className="shrink-0" size="lg" c="dimmed">
            <IconWindowMaximize stroke={2} />
          </ActionIcon>
        </Link>
      </div>

      <ButtonGroup>
        <Button
          fullWidth
          onClick={async () => {
            const updatedTimer = localTimer.isRunning
              ? timerPause(localTimer)
              : timerPlay(localTimer);
            setLocalTimer(updatedTimer);
            syncTimer(updatedTimer);
          }}
        >
          {localTimer.isRunning ? 'Pause' : 'Play'}
        </Button>
        <Button
          fullWidth
          onClick={async () => {
            const updatedTimer = timerReset(localTimer);
            setLocalTimer(updatedTimer);
            syncTimer(updatedTimer);
          }}
          disabled={!localTimer.isRunning && localTimer.value === 0}
        >
          {localTimer.isRunning ? 'Stop & Reset' : 'Reset'}
        </Button>
      </ButtonGroup>
    </div>
  );
}
