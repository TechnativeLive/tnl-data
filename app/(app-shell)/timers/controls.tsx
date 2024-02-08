'use client';

import { createBrowserClient } from '@/lib/db/client';
import { DbTimer } from '@/lib/db/custom';
import clsx from 'clsx';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

const TimerControlsContext = createContext<
  | [
      DbTimer,
      {
        size: 'sm' | 'lg';
        live: DbTimer;
        setTimer: React.Dispatch<React.SetStateAction<DbTimer>>;
        sync: (timer: DbTimer) => Promise<void>;
      },
    ]
  | undefined
>(undefined);

function TimerControlsProvider({
  size,
  timer,
  children,
}: {
  size: 'sm' | 'lg';
  timer: DbTimer;
  children: React.ReactNode;
}) {
  const supabase = createBrowserClient();
  const [state, setState] = useState(timer);

  useEffect(() => {
    setState(timer);
  }, [timer]);

  const ac = useRef<AbortController | undefined>();
  const sync = async (timer: DbTimer) => {
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

  return (
    <TimerControlsContext.Provider value={[state, { setTimer: setState, sync, size, live: timer }]}>
      {children}
    </TimerControlsContext.Provider>
  );
}

export function useTimerControls() {
  const context = useContext(TimerControlsContext);

  if (!context) {
    throw new Error('useTimerControls must be used within a TimerControlsProvider');
  }

  return context;
}

export function TimerControls({
  size,
  timer,
  children,
}: {
  size: 'sm' | 'lg';
  timer: DbTimer;
  children: React.ReactNode;
}) {
  return (
    <TimerControlsProvider size={size} timer={timer}>
      <div
        className={clsx(
          'grid items-start relative border transition-all',
          size === 'sm'
            ? 'gap-2 p-2 rounded-md border-body-dimmed'
            : 'gap-4 p-6 rounded-lg border-body-dimmed-hover',
          // opened
          //   ? 'bg-dark-1/20 dark:bg-dark-1/0 dark:brightness-[2] delay-200 duration-300'
          //   : 'duration-150',
        )}
      >
        {children}
      </div>
    </TimerControlsProvider>
  );
}
