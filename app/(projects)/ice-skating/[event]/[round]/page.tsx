import { EventList } from '@/components/event-list';
import { SetHeaderSegments } from '@/lib/context/header';
import { createServerComponentClient } from '@/lib/db/server';
import { supabase } from '@/lib/db/static';
import { Flex } from '@mantine/core';

export async function generateStaticParams({ params }: { params: { event: string } }) {
  const events = await supabase.from('rounds').select('slug').eq('event', params.event);

  return events.data;
}

export default async function IceSkatingEventPage({ params }: { params: { event: string } }) {
  const supabase = createServerComponentClient();
  const { data, error } = await supabase
    .from('rounds')
    .select('slug, name, order')
    .eq('event', params.event)
    .order('order', { ascending: true, nullsFirst: true });

  const items = data?.map((round) => ({
    label: round.name,
    href: `/ice-skating/${params.event}/${round.slug}`,
    id: round.slug,
  }));

  return (
    <Flex justify="center" className="flex-1">
      <pre>{JSON.stringify(data, null, 2)}</pre>
      {/* <EventList data={items} label='Rounds' /> */}
    </Flex>
  );
}
