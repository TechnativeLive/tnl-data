import {
  DateSortOption,
  EventListSortSelection,
} from '@/app/(app-shell)/[sport]/event-list-sort-selection';
import { dsLong, tsTerse } from '@/lib/dates';
import { createServerClient } from '@/lib/db/server';
import { PageProps } from '@/lib/types';
import { ActionIcon, Center, Divider, Flex, Stack, Text, Title } from '@mantine/core';
import {
  IconChevronRight,
  IconEdit,
  IconPlus,
  IconSortAscending2,
  IconSortDescending2,
} from '@tabler/icons-react';
import { Route } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Fragment, Suspense } from 'react';

type EventGroup = { label: string; data: Tables<'events'>[] };

export const dynamic = 'force-dynamic';

export default async function SportPage({
  params,
  searchParams,
}: PageProps<{ sport: string }, { sort?: DateSortOption; order?: 'asc' | 'desc' }>) {
  if (!params?.sport) return notFound();

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('events')
    .select()
    .eq('sport', params.sport)
    .order('starts_at', { ascending: true });

  if (error) {
    return (
      <Flex justify="center" align="center" className="flex-1">
        Error: {error.message}
      </Flex>
    );
  }

  const sortOption = searchParams?.sort ?? 'starts_at';
  const asc = searchParams?.order !== 'desc';

  // group data by starts_at and ends_at into 3 groups
  // 1 group for null starts_at
  // 1 group where current time is between starts_at and ends_at
  // 1 group where current time is after ends_at
  const dateGroups =
    sortOption === 'starts_at' ? startDateReducer(data) : sortedDateReducer(data, sortOption, asc);

  return (
    <Flex justify="center" className="flex-1 py-4 mb-4 mx-content">
      <Stack w="100%">
        <div className="flex justify-between items-end">
          <Title>Events</Title>
          <div className="flex items-end gap-2">
            <Suspense fallback={null}>
              <EventListSortSelection />
            </Suspense>
            <Link
              href={{
                query: {
                  ...searchParams,
                  sort: sortOption,
                  order: asc ? 'desc' : 'asc',
                },
              }}
            >
              <ActionIcon disabled={sortOption === 'starts_at'}>
                {asc ? (
                  <IconSortAscending2 color="var(--mantine-color-dimmed)" />
                ) : (
                  <IconSortDescending2 color="var(--mantine-color-dimmed)" />
                )}
              </ActionIcon>
            </Link>
          </div>
        </div>
        {dateGroups.map((group) =>
          group.data.length === 0 ? null : (
            <Fragment key={group.label}>
              <Divider mt="xl" label={group.label} labelPosition="left" />
              {group.data.map((event) => (
                <Link
                  href={`/${params.sport}/${event.slug}` as Route}
                  key={event.slug}
                  className="active border bg-button rounded-lg px-3 py-1 flex gap-6"
                >
                  <div className="flex justify-between grow items-center">
                    <div className="flex flex-col mr-auto">
                      <Text fw={600} size={event.starts_at || event.ends_at ? 'md' : 'xl'}>
                        {event.name ? event.name : 'No Name'}
                      </Text>
                      <div className="flex gap-1.5 pb-1">
                        {!event.starts_at ? null : (
                          <Text size="xs" c="dimmed">
                            {dsLong.format(new Date(event.starts_at))}
                          </Text>
                        )}
                        {!event.starts_at || !event.ends_at ? null : (
                          <Text size="xs" c="dimmed">
                            {' - '}
                          </Text>
                        )}
                        {!event.ends_at ? null : (
                          <Text size="xs" c="dimmed">
                            {dsLong.format(new Date(event.ends_at))}
                          </Text>
                        )}
                      </div>
                    </div>
                    {sortOption !== 'starts_at' ? (
                      <div className="flex flex-col text-xs text-dimmed">
                        <div className="flex items-center gap-1">
                          <IconPlus size={12} />
                          {tsTerse.format(new Date(event.created_at))}
                        </div>
                        <div className="flex items-center gap-1">
                          <IconEdit size={12} />
                          {event.updated_at
                            ? tsTerse.format(new Date(event.updated_at))
                            : 'Never updated'}
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <Center>
                    <IconChevronRight />
                  </Center>
                </Link>
              ))}
            </Fragment>
          ),
        )}
      </Stack>
    </Flex>
  );
}

function startDateReducer(array: Tables<'events'>[]) {
  return array.reduce(
    (acc, event) => {
      if (!event.starts_at) {
        // unknown
        acc[0].data.push(event);
        return acc;
      }
      const startsAt = new Date(event.starts_at);
      const endsAt = event.ends_at ? new Date(event.ends_at) : null;
      const now = new Date();

      if (startsAt > now) {
        // upcoming
        acc[2].data.push(event);
      } else if (endsAt && endsAt < now) {
        // past
        acc[3].data.push(event);
      } else {
        // current
        acc[1].data.push(event);
      }

      return acc;
    },
    [
      { label: 'No Date', data: [] },
      { label: 'Active', data: [] },
      { label: 'Upcoming', data: [] },
      { label: 'Past', data: [] },
    ] as [EventGroup, EventGroup, EventGroup, EventGroup],
  );
}

function sortedDateReducer(
  array: Tables<'events'>[],
  sort: Exclude<DateSortOption, 'starts_at'>,
  asc: boolean,
) {
  return [
    {
      label: `${sort === 'created_at' ? 'Created' : 'Updated'} (${
        asc ? 'Oldest' : 'Newest'
      } first)`,
      data: array.sort((aData, bData) => {
        const a = aData[sort];
        const b = bData[sort];

        if (!a && !b) return 0;
        if (!a) return asc ? -1 : 1;
        if (!b) return asc ? 1 : -1;

        const aDate = new Date(a);
        const bDate = new Date(b);
        const diff = aDate.getTime() - bDate.getTime();
        return asc ? diff : -diff;
      }),
    },
  ];
}
