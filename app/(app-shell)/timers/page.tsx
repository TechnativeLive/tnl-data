import { TimerListRealtime } from '@/app/(app-shell)/timers/timer-list-realtime';
import { Flex, Stack, Title } from '@mantine/core';

// export const dynamic = 'force-dynamic';

export default async function TimersPage() {

  return (
    <Flex justify="center" className="flex-1 py-4 mb-4 mx-content">
      <Stack w="100%">
        <div className="flex justify-between items-end">
          <Title>Timers</Title>
        </div>
        <TimerListRealtime />
      </Stack>
    </Flex>
  );
}

