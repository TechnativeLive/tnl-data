import { Flex, Stack, Title } from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons-react';
import clsx from 'clsx';
import Link from 'next/link';
import { TimersRealtime } from '@/components/timer/controls/realtime';
import { CreateTimerButton } from '@/app/(app-shell)/timers/create-timer';

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
          <div className="flex flex-col justify-center items-center">
            <div className="w-full max-w-2xl flex flex-col justify-center">
              <TimersRealtime ids={[Number(searchParams.control)]} size="lg" />
            </div>
          </div>
        ) : (
          <div className="grid gap-4 items-start justify-center xl:justify-start grid-cols-[repeat(auto-fill,minmax(200px,350px))]">
            <CreateTimerButton />
            <TimersRealtime size="sm" />
          </div>
        )}
      </Stack>
    </Flex>
  );
}
