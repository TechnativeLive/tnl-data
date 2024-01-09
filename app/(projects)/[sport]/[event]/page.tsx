import { supabase } from '@/lib/db/static';
import { Flex, Stack } from '@mantine/core';
import { RealtimeJsonEvent } from '@/app/(projects)/[sport]/[event]/realtime-json-event';

export const dynamic = 'force-dynamic';

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
