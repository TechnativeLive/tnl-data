import { RealtimeJsonEvent } from '@/app/(projects)/[sport]/[event]/realtime-json-event';
import { Flex, Stack } from '@mantine/core';

export default async function EventPage() {
  return (
    <Flex justify="center" className="flex-1 py-4 mb-4 mx-content">
      <Stack w="100%">
        <RealtimeJsonEvent debug />
      </Stack>
    </Flex>
  );
}
