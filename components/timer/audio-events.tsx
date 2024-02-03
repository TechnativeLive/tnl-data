import clsx from 'clsx';
import { useSounds } from '@/lib/audio/use-sounds';
import { TimerEvent } from '@/lib/timer/utils';
import { useDidUpdate } from '@mantine/hooks';
import { useRef, useEffect, memo } from 'react';

function shouldPlaySoundAt(time: number, rawTime: number, prevRawTime: number, trailing: boolean) {
  const timeToCheck = trailing ? time + 1000 : time;
  return prevRawTime > timeToCheck && rawTime <= timeToCheck;
}

export function TimerAudioEvents({
  isRunning,
  value,
  rawTime,
  total,
  muted,
  sounds,
  trailing = false,
}: {
  isRunning: boolean;
  value: number;
  rawTime: number;
  total: number;
  muted: boolean;
  sounds: Record<TimerEvent | number, string>;
  trailing?: boolean;
}) {
  const { playFromStart: play, error } = useSounds(sounds);
  const prevRawTime = useRef<number>(rawTime);

  // time-based events
  useEffect(() => {
    if (!muted) {
      for (const event in sounds) {
        const eventTime = parseInt(event as string);
        if (!Number.isNaN(eventTime)) {
          if (shouldPlaySoundAt(eventTime, rawTime, prevRawTime.current, trailing)) play(eventTime);
        }
      }
    }

    prevRawTime.current = rawTime;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawTime, total, muted, trailing, JSON.stringify(sounds), play]);

  // event-driven
  useDidUpdate(() => {
    if (isRunning) {
      if (value > 0) {
        if (sounds.resume) {
          play('resume');
        }
      } else {
        if (sounds.start) {
          play('start');
        }
      }
    } else if (value > 0) {
      if (sounds.pause) {
        play('pause');
      }
    } else {
      if (sounds.reset) {
        play('reset');
      }
    }
  }, [isRunning, value, JSON.stringify(sounds), play]);

  return <DisabledSoundWarning error={error} isRunning={isRunning} />;
}

function DisabledSoundWarningComponent({
  error,
  isRunning,
}: {
  error: boolean;
  isRunning: boolean;
}) {
  // const isAutoPlayEnabled = typeof Navigator !== 'undefined' && Navigator.getAutoPlayPolicy()

  return (
    <div
      className={clsx(
        'grid place-content-center transition-opacity duration-300 fixed top-8 w-3/4 h-16 -translate-x-1/2 left-1/2 rounded-md border border-red-5 bg-red-5/30',
        error ? 'opacity-100' : 'opacity-0',
        isRunning && 'invert',
      )}
    >
      Sound is disabled. Allow sound in the site preferences or click on this window to enable.
    </div>
  );
}

const DisabledSoundWarning = memo(DisabledSoundWarningComponent);
