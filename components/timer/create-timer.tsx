'use client';

import { DbTimer } from '@/lib/db/custom';
import { createTimer } from '@/lib/timer/actions';
import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

export function CreateTimerButton() {
  const [state, setState] = useState<'pending' | 'success' | 'error'>('success');
  return (
    <div className="grid self-center">
      <Button
        color={state === 'error' ? 'red' : 'gray.8'}
        disabled={state === 'pending'}
        variant="light"
        className="h-full border-2 border-dashed border-white/20"
        onClick={async () => {
          setState('pending');
          const { success } = await createTimer();
          setState(success ? 'success' : 'error');
        }}
      >
        <div className="flex flex-col items-center gap-2 py-4">
          Create Timer
          <IconPlus />
        </div>
      </Button>
    </div>
  );
}

export function NewIndicator({ createdAt }: { createdAt: DbTimer['created_at'] }) {
  const createdAtInMs = new Date(createdAt).getTime();
  const [isNew, setIsNew] = useState(() => isNewTimer(createdAtInMs));

  useEffect(() => {
    if (isNew) setIsNew(false);
  }, [isNew, setIsNew]);

  return (
    <div
      className={clsx(
        'pointer-events-none absolute inset-0 border rounded-md border-teal-4/60 transition-opacity duration-[5s] shadow-lg shadow-teal-4/30',
        isNew ? 'opacity-100' : 'opacity-0',
      )}
    />
  );
}

function isNewTimer(createdAt: number) {
  const now = Date.now();
  const age = now - createdAt;
  return age < 10000;
}
