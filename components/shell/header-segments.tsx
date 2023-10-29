'use client';

import { useHeaderSegments } from '@/lib/context/header';
import { createClientComponentClient } from '@/lib/db/client';
import { Group, Text } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';
import { Fragment } from 'react';

export function HeaderSegments() {
  // const supabase = createClientComponentClient();
  // let event: Segment | null = null;
  // let round: Segment | null = null;

  // if ('event' in params) {
  //   const { data } = await supabase
  //     .from('events')
  //     .select('name, href:slug, id:slug')
  //     .eq('slug', params.event)
  //     .single();
  //   event = data;
  //   if (event) event.href = `/ice-skating/${event?.href}`;
  // }

  // if ('round' in params) {
  //   const { data } = await supabase
  //     .from('rounds')
  //     .select('name, href:slug, id')
  //     .eq('slug', params.round)
  //     .single();
  //   round = data;
  //   if (round) round.href = event?.href ? `/ice-skating/${event.href}/${round?.href}` : null;
  // }

  // const headerSegments = [event, round].filter(Boolean) as Segment[];
  const { segments } = useHeaderSegments();

  return (
    <Group className="grow" gap="xs" px="md">
      {segments.map((segment, index) => (
        <Fragment key={segment.id}>
          {index > 0 && <IconChevronRight size={14} />}
          <Text
            // @ts-expect-error
            component={segment.href ? Link : Text}
            href={segment.href ?? ''}
            fz="sm"
            fw="bold"
            className="hover:underline"
            c={index === segments.length - 1 ? 'violet.3' : 'violet.2'}
          >
            {segment.label}
          </Text>
        </Fragment>
      ))}
    </Group>
  );
}
