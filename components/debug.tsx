'use client';

import ClientOnly from '@/components/client-only';
import clsx from 'clsx';

type DebugProps = {
  data: any;
  label?: string;
  className?: string;
};

export function Debug(props: DebugProps) {
  if (process.env.NODE_ENV !== 'development') return null;
  return (
    <ClientOnly>
      <DebugInternals {...props} />
    </ClientOnly>
  );
}

export function DebugInternals({ data, label, className }: DebugProps) {
  console.info(
    label ? `%cDEBUG [${label}]` : '%cDEBUG',
    'color: #34c4f8; background: #21629f88; padding: 2px 4px; border-radius: 4px; font-size: 0.7em;',
    data
  );

  return (
    <pre
      className={clsx(
        'relative min-w-[8rem] text-xs my-0 p-4 border whitespace-pre-wrap rounded bg-body-dimmed',
        label === 'error' ? 'border-red-5/50' : 'border-blue-5/50',
        className
      )}
    >
      {!label ? null : (
        <div
          className={clsx(
            'absolute top-0 right-0 p-4 text-blue-5/70 underline',
            label === 'error' ? 'text-red-5/50' : 'text-blue-5/50'
          )}
        >
          {label}
        </div>
      )}
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
