'use client';

export function Debug({ data }: { data: any }) {
  if (process.env.NODE_ENV !== 'development') return null;

  console.info(
    '%cDEBUG',
    'color: #34c4f8; background: #21629f88; padding: 2px 4px; border-radius: 4px; font-size: 0.7em;',
    data
  );

  return <pre className="text-xs my-0`">{JSON.stringify(data, null, 2)}</pre>;
}
