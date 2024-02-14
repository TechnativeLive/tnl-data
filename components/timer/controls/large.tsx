'use client';

import { TimerControls } from '@/app/(app-shell)/timers/controls';
import { TimerControlsButtons, TimerControlsUpdateButton } from '@/components/timer/buttons';
import { TimerControlsDisplay } from '@/components/timer/display';
import { TimerControlsDuration } from '@/components/timer/duration';
import { TimerControlsSoundsSettings } from '@/components/timer/sounds-settings';
import { TimerControlsStatus } from '@/components/timer/status';
import { TimerControlsTitle } from '@/components/timer/title';
import { DbTimer } from '@/lib/db/custom';
import { ActionIcon, Divider } from '@mantine/core';
import { IconWindowMaximize } from '@tabler/icons-react';
import Link from 'next/link';

export function TimerControlCardLarge({ timer }: { timer: DbTimer }) {
  return (
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
  );
}
