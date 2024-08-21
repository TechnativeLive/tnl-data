'use client';

import { RealtimeJsonEvent } from '@/app/(app-shell)/[sport]/[event]/realtime-json-event';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { useRealtimeJsonEvent } from '@/lib/hooks/use-realtime-json-event';
import { Button, Flex, Loader, Stack, Title } from '@mantine/core';
import { useEffect, useRef } from 'react';
import autoAnimate from '@formkit/auto-animate';
import { useDisclosure } from '@mantine/hooks';
import { animateHighlights } from '@/app/(fullscreen)/[sport]/[event]/scoreboard/animate-highlights';
import { Backdrop } from '@/app/(fullscreen)/[sport]/[event]/scoreboard/backdrop';
import { useRouter } from 'next/navigation';

export default function ScoreboardPage() {
  const { event, loading } = useRealtimeJsonEvent<'climbing'>();

  if (!event || loading) {
    return (
      <Flex justify="center" className="flex-1 h-full py-4 mx-content">
        <Backdrop />

        <Stack w="100%" h="100%" justify="center" align="center">
          <Loader />
        </Stack>
      </Flex>
    );
  }

  const round = event.format.rounds.find((round) => round.id === event.results.active?.round);
  console.log('💡 / file: page.tsx:29 / ScoreboardPage / event:', event);

  return (
    <Flex justify="center" className="flex-1 h-full py-4">
      <Backdrop />

      <Stack w="100%">
        <Flex justify="space-between" className="group mx-content">
          <Flex gap={8}>
            <Title>
              {round?.name}
              {'\u00A0\u00A0//\u00A0\u00A0'}
              {event?.name}
            </Title>
          </Flex>
          <Flex className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ThemeSwitcher />
          </Flex>
        </Flex>
        <div className="grow bg-red-500 relative overflow-hidden mx-content">
          <RealtimeJsonEvent debug />
        </div>
        <UpdateHighlights />
      </Stack>
    </Flex>
  );
}

function UpdateHighlights() {
  const [show, { toggle }] = useDisclosure(false);
  const parent = useRef(null);

  const a = useRef<HTMLInputElement>(null);
  a.current?.style;

  useEffect(() => {
    if (parent.current) autoAnimate(parent.current, animateHighlights);
  }, [parent]);

  return (
    <footer className="overflow-hidden h-32 shrink-0">
      <div ref={parent} className="px-content relative grid grid-cols-4 gap-x-8 h-32">
        <Button onClick={toggle}>Update highlights</Button>
        {show && (
          <>
            <UpdateCard />
            <UpdateCard />
            <UpdateCard />
            <UpdateCard />
          </>
        )}
      </div>
    </footer>
  );
}

function UpdateCard() {
  return (
    <Stack className="rounded-lg border-2 border-pink-5 bg-body-dimmed py-2 px-4 h-32">
      <Flex justify="space-between" className="font-bold">
        <div className="text-lg">Firstname Lastname</div>
        <div className="text-2xl">#4</div>
      </Flex>
      <div className="text-gray-7">Moved into 3rd place, over Firstname Lastname</div>
    </Stack>
  );
}
