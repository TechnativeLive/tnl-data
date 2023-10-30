import { EventList } from '@/components/event-list';
import { createServerComponentClient } from '@/lib/db/server';
import { supabase } from '@/lib/db/static';
import { Flex } from '@mantine/core';

export async function generateStaticParams() {
  const events = await supabase.from('events').select('slug');

  return Array.from(new Set(events.data ?? []));
}

export default async function EventPage({ params }: { params: { sport: string; event: string } }) {
  const supabase = createServerComponentClient();
  const { data } = await supabase
    .from('rounds')
    .select('id, slug, name, order, event')
    .eq('event', params.event)
    .order('order', { ascending: true, nullsFirst: true });

  const items = data?.map((item) => ({
    ...item,
    href: `/${params.sport}/${params.event}/${item.slug}`,
  }));

  return (
    <Flex justify="center" className="flex-1">
      {items && <EventList label="Rounds" data={items} row={({ name }) => <div>{name}</div>} />}
    </Flex>
  );
}
