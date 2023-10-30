'use client';

import { createClientComponentClient } from '@/lib/db/client';
import { Group } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import clsx from 'clsx';
import { Route } from 'next';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';

type Segment = { id?: string | number; slug: string; name: string } & Record<string, unknown>;

export function HeaderSegments({ params }: { params: Record<string, string> }) {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [segments, setSegments] = useState<(Segment | null)[]>([]);

  useEffect(() => {
    (async () => {
      const data = await Promise.all([
        supabase.from('sports').select('id, slug, name').eq('slug', params.sport).single(),
        supabase.from('events').select('slug, name').eq('slug', params.event).single(),
        supabase
          .from('rounds')
          .select('id, slug, name, event')
          .eq('slug', params.round)
          .eq('event', params.event)
          .single(),
      ]);
      setSegments(data.map((query) => query.data));
    })();

    setLoading(false);
  }, [params.sport, params.event, params.round, supabase]);

  return (
    <Group
      className={clsx('grow transition-opacity', loading ? 'opacity-0' : 'opacity-100')}
      gap="xs"
      px="md"
    >
      {segments.map((segment, index) => {
        const href = `/${segments
          .slice(0, index + 1)
          .filter((s) => !!s?.slug)
          .map((s) => s!.slug)
          .join('/')}`;
        return !segment ? null : (
          <Fragment key={segment.id ?? segment.slug}>
            {index > 0 && <IconChevronRight size={14} className="animate-fade" />}
            <Link
              aria-disabled={loading}
              href={href as Route}
              className={clsx(
                'hover:underline underline-offset-2 text-sm animate-fade',
                index === segments.length - 1 && 'text-violet-3',
                loading && 'cursor-default'
              )}
            >
              {segment.name}
            </Link>
          </Fragment>
        );
      })}
    </Group>
  );
}
