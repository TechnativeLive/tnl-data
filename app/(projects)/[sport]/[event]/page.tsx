import { Debug } from '@/components/debug';
import { EventDateClassification, classifyEventByDate } from '@/lib/dates';
import { createServerClient } from '@/lib/db/server';
import { supabase } from '@/lib/db/static';
import { AppShellAside, Button, Flex, Stack, Text, Title } from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';
import { Route } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { ScoringTable } from '@/components/scoring-table/scoring-table';
import { EventData, Sport } from '@/lib/db/event-data';
import { EventOutline } from '@/components/shell/event-outline';

export async function generateStaticParams() {
  const events = await supabase.from('events').select('slug');

  return Array.from(new Set(events.data ?? []));
}

const eventStatusTextMap: Record<EventDateClassification, string> = {
  future: 'Upcoming',
  current: 'Active',
  past: 'Past',
  unknown: 'Unknown',
};

export default async function EventPage({ params }: { params: { sport: string; event: string } }) {
  const supabase = createServerClient();
  // const { data: roundData } = await supabase
  //   .from('rounds')
  //   .select('id, href:slug, name, order, event')
  //   .eq('event', params.event)
  //   .order('order', { ascending: true, nullsFirst: true });

  const { data } = await supabase
    .from('events')
    .select(
      'name, format, results, starts_at, ends_at, created_at, updated_at, ds_keys(name, description, private, public)'
    )
    .eq('slug', params.event)
    .single();

  const eventStatus = classifyEventByDate({ starts_at: data?.starts_at, ends_at: data?.ends_at });

  return (
    <Flex justify="center" className="flex-1 py-8 mb-4">
      <Stack w="100%" maw={800} mx="lg">
        <div className="flex items-center gap-4">
          <Title fz="lg">{data?.name}</Title>
          <Text size="sm" c="dimmed">
            {eventStatusTextMap[eventStatus]}
          </Text>
          <Button
            className="ml-auto"
            component={Link}
            href={`/${params.sport}/${params.event}/edit` as Route}
            variant="default"
            leftSection={<IconEdit size={16} />}
          >
            Edit
          </Button>
        </div>

        <ScoringTable
          sport={params.sport as Sport}
          format={data?.format}
          initialResults={data?.results}
        />
        <Debug data={data} />
      </Stack>
    </Flex>
  );
}
