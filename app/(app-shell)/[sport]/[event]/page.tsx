import { supabase } from '@/lib/db/static';
import { Flex, Stack } from '@mantine/core';
import { RealtimeJsonEvent } from '@/app/(app-shell)/[sport]/[event]/realtime-json-event';
import { ResolvingMetadata, Metadata } from 'next';
import { createServerClient } from '@/lib/db/server';

export const dynamic = 'force-dynamic';

export async function generateMetadata(
  {
    params,
  }: {
    params: { event: string };
  },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from('events')
    .select()
    .eq('slug', params.event || '')
    .single();

  const title = data ? `TNL - ${data.name}` : (await parent).title;

  return {
    title,
  };
}

export async function generateStaticParams() {
  const events = await supabase.from('events').select('slug');

  return Array.from(new Set(events.data ?? []));
}

export default async function EventPage() {
  return (
    <Flex justify="center" className="flex-1 py-4 mb-4 mx-content">
      <Stack w="100%">
        <RealtimeJsonEvent />
      </Stack>
    </Flex>
  );
}
