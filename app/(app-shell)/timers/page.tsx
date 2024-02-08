import { TimersRealtime } from '@/app/(app-shell)/timers/timers-realtime';
import { TimerRealtime } from '@/app/(app-shell)/timers/timer-realtime';
import { Flex, Stack, Title } from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons-react';
import clsx from 'clsx';
import Link from 'next/link';
import { Fragment } from 'react';

// export const dynamic = 'force-dynamic';

export default async function TimersPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  return (
    <Flex justify="center" className="flex-1 py-4 mb-4 mx-content">
      <Stack w="100%">
        <div className="flex justify-between items-center">
          <Title>Timers</Title>
          <div
            className={clsx(
              'flex items-center flex-wrap gap-x-2 px-md grow transition-opacity',
              searchParams.control ? 'opacity-100' : 'opacity-0',
            )}
          >
            <Link
              href="/timers"
              className="underline-offset-2 animate-fade flex gap-1 items-center hover:underline hover:text-teal-5 text-violet-5 dark:text-violet-3 text-sm"
            >
              <IconChevronLeft className="mt-0.5" size={14} />
              <span>All Timers</span>
            </Link>
          </div>
        </div>

        {searchParams.control ? (
          <TimerRealtime id={Number(searchParams.control)} />
        ) : (
          <TimersRealtime />
        )}
      </Stack>
    </Flex>
  );
}
