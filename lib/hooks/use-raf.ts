import { useState, useEffect, useCallback, useRef } from 'react';

type Options = {
  /** disable to call requestAnimationFrame at the first time */
  disable?: boolean;
  /** duration to run requestAnimationFrame in milliseconed */
  duration?: number;
  /** run when the requestAnimationFrame ended (reach duration) */
  onFinish?: () => void;
};

type Result = {
  /** indicate whether the requestAnimationFrame executing */
  isActive: boolean;
  /** start function to execute requestAnimationFrame */
  start: () => void;
  /** stop function to cancel requestAnimationFrame */
  stop: () => void;
};

export const useRequestAnimationFrame = (
  callback: (time: number) => void,
  opts?: Options,
): Result => {
  const disable = !!opts?.disable;
  const duration = opts?.duration || 0;
  const onFinish = opts?.onFinish;

  const [isActive, setIsActive] = useState(!disable);
  const startTime = useRef<number | undefined>(undefined);
  const requestId = useRef<number | undefined>(undefined);

  const start = useCallback(() => setIsActive(true), [setIsActive]);
  const stop = useCallback(() => setIsActive(false), [setIsActive]);

  const update = useCallback(
    (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;

      const elapsedTime = timestamp - startTime.current;
      callback(elapsedTime);
      if (!duration || elapsedTime < duration) {
        requestId.current = requestAnimationFrame(update);
      } else {
        if (typeof onFinish === 'function') onFinish();
        stop();
      }
    },
    [duration, callback, stop, onFinish],
  );

  useEffect(() => {
    if (isActive) {
      startTime.current = undefined;
      requestId.current = requestAnimationFrame(update);

      return () => {
        if (requestId.current) cancelAnimationFrame(requestId.current);
      };
    }
  }, [isActive, update]);

  return { isActive, start, stop };
};
