import { Aside } from '@/components/shell/aside';
import { createServerComponentClient } from '@/lib/db/server';
import { supabase } from '@/lib/db/static';
import { Flex } from '@mantine/core';

export async function generateStaticParams() {
  const events = await supabase.from('events').select('slug').eq('sport', 'ice-skating');

  return events.data;
}

export default async function IceSkatingEventPage({ params }: { params: { event: string } }) {
  const supabase = createServerComponentClient();
  const { data, error } = await supabase
    .from('rounds')
    .select('slug, name, order')
    .eq('event', params.event)
    .order('order', { ascending: true, nullsFirst: true });

  return (
    <Flex justify="center" className="flex-1">
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Flex>
  );
}
