import { DbTimer } from '@/lib/db/custom';
import { useRequestAnimationFrame } from '@/lib/hooks/use-raf';
import { displayTime } from '@/lib/timer/utils';
import { useState, useCallback, useEffect } from 'react';

export function useTimerDisplay(timer: DbTimer, trailing = false) {
  const [time, setTime] = useState(() => displayTime(timer, trailing));
  const callback = useCallback(
    () => setTime(displayTime(timer, trailing)),
    [timer, setTime, trailing],
  );
  const { start, stop } = useRequestAnimationFrame(callback);

  useEffect(() => {
    if (timer.isRunning) start();
    else {
      // In the case of a running timer being reset, we need to manually call the callback
      callback();
      stop();
    }
  }, [timer.isRunning, start, stop, callback]);

  useEffect(() => {
    setTime(displayTime(timer, trailing));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    timer.value,
    timer.end_hours,
    timer.end_mins,
    timer.end_secs,
    trailing,
    timer.countdown,
    timer.format,
  ]);

  return time;
}
