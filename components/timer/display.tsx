'use client';

import { TimerAudioEvents } from '@/components/timer/audio-events';
import { TimerEvent } from '@/lib/timer/utils';
import { DbTimer } from '@/lib/db/custom';
import { useTimerDisplay } from '@/lib/hooks/use-timer-display';
import { Text, TextProps } from '@mantine/core';

export function TimerDisplay({
  sounds,
  timer,
  ...props
}: { sounds?: Record<TimerEvent | number, string>; timer: DbTimer } & TextProps) {
  const time = useTimerDisplay(timer);

  return (
    <>
      <Text {...props}>{time.display}</Text>
      {sounds && (
        <TimerAudioEvents
          value={timer.value}
          isRunning={timer.isRunning}
          rawTime={time.raw}
          total={time.total}
          muted={timer.muted}
          sounds={sounds}
          trailing
        />
      )}
    </>
  );
}
