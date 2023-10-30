import { createServerComponentClient } from '@/lib/db/server';
import { PageProps } from '@/lib/types';
import { Button, Center, Divider, Flex, Stack, Text, Title, UnstyledButton } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { Route } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Fragment } from 'react';

type EventGroups = { label: string; data: Tables<'events'>[] }[];

const timestamp = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' });

export default async function SportPage({ params }: PageProps<{ sport: string }>) {
  if (!params?.sport) return notFound();

  const supabase = createServerComponentClient();
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

  // group data by starts_at and ends_at into 3 groups
  // 1 group for null starts_at
  // 1 group where current time is between starts_at and ends_at
  // 1 group where current time is after ends_at
  const dateGroups = data.reduce(
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
    ] as EventGroups
  );

  return (
    <Flex justify="center" className="flex-1">
      <Stack w="100%" maw={800}>
        {/* <pre className="max-w-3xl whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
        <pre className="max-w-3xl whitespace-pre-wrap">{JSON.stringify(error, null, 2)}</pre> */}

        <Title>Events</Title>
        {dateGroups.map((group) =>
          group.data.length === 0 ? null : (
            <Fragment key={group.label}>
              <Divider mt="xl" label={group.label} labelPosition="left" />
              {group.data.map((event) => (
                <Link
                  href={`/${params.sport}/${event.slug}` as Route}
                  key={event.slug}
                  className="active border bg-button rounded-lg px-3 py-1 flex"
                >
                  <div className="flex flex-col mr-auto">
                    <Text fw={600} size={event.starts_at || event.ends_at ? 'md' : 'xl'}>
                      {event.name ? event.name : 'No Name'}
                    </Text>
                    <div className="flex gap-1.5 pb-1">
                      {!event.starts_at ? null : (
                        <Text size="xs" c="dimmed">
                          {timestamp.format(new Date(event.starts_at))}
                        </Text>
                      )}
                      {!event.starts_at || !event.ends_at ? null : (
                        <Text size="xs" c="dimmed">
                          {' - '}
                        </Text>
                      )}
                      {!event.ends_at ? null : (
                        <Text size="xs" c="dimmed">
                          {timestamp.format(new Date(event.ends_at))}
                        </Text>
                      )}
                    </div>
                  </div>
                  <Center>
                    <IconChevronRight />
                  </Center>
                </Link>
              ))}
            </Fragment>
          )
        )}
      </Stack>
    </Flex>
  );
}
