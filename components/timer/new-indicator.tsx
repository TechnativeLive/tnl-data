'use client';

import { DbTimer } from '@/lib/db/custom';
import clsx from 'clsx';
import { useState, useEffect } from 'react';

function isNewTimer(createdAt: number) {
  const now = Date.now();
  const age = now - createdAt;
  return age < 10000;
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
