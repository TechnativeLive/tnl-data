'use client';

import clsx from 'clsx';

export function Debug({ data, label }: { data: any; label?: string }) {
  if (process.env.NODE_ENV !== 'development') return null;

  console.info(
    '%cDEBUG',
    'color: #34c4f8; background: #21629f88; padding: 2px 4px; border-radius: 4px; font-size: 0.7em;',
    data,
    { label }
  );

  return (
    <pre
      className={clsx(
        'relative min-w-[8rem] text-xs my-0 p-4 border whitespace-pre-wrap rounded bg-body-dimmed',
        label === 'error' ? 'border-red-5/50' : 'border-blue-5/50'
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
