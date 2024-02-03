import { EventDataEditForm } from '@/app/(app-shell)/[sport]/[event]/edit/edit';
import {
  PreviousSnapshotModal,
  RestoreFromSnapshotButton,
  TakeSnapshotButton,
} from '@/app/(app-shell)/[sport]/[event]/edit/snapshot';
import { Info } from '@/components/info';
import { tsReadable } from '@/lib/dates';
import { day } from '@/lib/dayjs';
import { createServerClient } from '@/lib/db/server';
import { Flex, Paper, Stack, Text } from '@mantine/core';

export default async function EventPage({ params }: { params: { sport: string; event: string } }) {
  const supabase = createServerClient();

  const { data } = await supabase
    .from('events')
    .select(
      'name, format, results, starts_at, ends_at, created_at, updated_at, snapshot, ds_keys(name, description, public, private)'
    )
    .eq('slug', params.event)
    .single();

  const { data: allDsKeys } = await supabase
    .from('ds_keys')
    .select('name, description, public, private');

  const createdAtDate = data?.created_at ? new Date(data.created_at) : undefined;
  const updatedAtDate = data?.updated_at ? new Date(data.updated_at) : undefined;

  return (
    <Flex justify="center" className="flex-1 py-4 mb-4 mx-content">
      <Stack w="100%" maw={1024} gap="xl">
        <Paper
          display="flex"
          shadow="xs"
          px="xl"
          py="sm"
          className="bg-body-dimmed gap-4 items-center justify-between"
        >
          <div className="flex gap-4 flex-wrap justify-center">
            {data?.created_at && (
              <div className="flex flex-col">
                <Text size="sm" c="dimmed">
                  Created At
                </Text>
                <Text size="sm">{tsReadable.format(createdAtDate)}</Text>
                <Text size="sm">{day.fromNow(createdAtDate)}</Text>
              </div>
            )}
            {data?.updated_at && (
              <div className="flex flex-col">
                <Text size="sm" c="dimmed">
                  Updated At
                </Text>
                <Text size="sm">{tsReadable.format(updatedAtDate)}</Text>
                <Text size="sm">{day.fromNow(updatedAtDate)}</Text>
              </div>
            )}
          </div>
          <div className="flex gap-4 flex-wrap justify-center items-stretch">
            {data?.snapshot ? (
              <div>
                <PreviousSnapshotModal snapshot={data?.snapshot} />
              </div>
            ) : null}
            <div className="flex flex-col gap-2">
              <TakeSnapshotButton
                hasSnapshot={!!data?.snapshot}
                event={params.event}
                sport={params.sport}
                format={data?.format}
                results={data?.results}
              />
              <RestoreFromSnapshotButton
                event={params.event}
                sport={params.sport}
                snapshot={data?.snapshot}
              />
            </div>
          </div>
        </Paper>
        {data ? (
          <EventDataEditForm
            sport={params.sport}
            event={params.event}
            eventData={data}
            dsKeys={allDsKeys}
          />
        ) : (
          <Info title="No Event Found">
            No event data could be found for event [{params.event}]
          </Info>
        )}
      </Stack>
    </Flex>
  );
}
