'use client';

import { updateEvent } from '@/app/(app-shell)/[sport]/[event]/edit/actions';
import {
  DepopulateEntrantsInFormat,
  PopulateEntrantsInFormat,
  UpdateEntrantsInFormat,
} from '@/app/(app-shell)/[sport]/[event]/edit/format';
import { EventFormatRoundsInput } from '@/app/(app-shell)/[sport]/[event]/edit/format-rounds-input';
import { Select } from '@/components/select';
import { EventFormat, Sport } from '@/lib/event-data';
import { useFormFeedback } from '@/lib/hooks/use-form-feedback';
import {
  Button,
  Collapse,
  Divider,
  JsonInput,
  MultiSelect,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { type Simplify } from 'type-fest';

type DSKeys = Pick<Tables<'ds_keys'>, 'name' | 'description' | 'private' | 'public'>;
type EventData = Pick<
  Tables<'events'>,
  | 'name'
  | 'format'
  | 'results'
  | 'starts_at'
  | 'ends_at'
  | 'created_at'
  | 'updated_at'
  | 'snapshot'
  | 'timers'
> &
  (null | {
    ds_keys: DSKeys | null;
  });

export function EventDataEditForm<S extends Sport>({
  sport,
  event,
  eventData,
  dsKeys,
  timers,
}: {
  sport: S;
  event: string;
  eventData: Simplify<EventData>;
  dsKeys: DSKeys[] | null;
  timers: { label: string; value: string }[];
}) {
  const [formatInput, setFormatInput] = useState(JSON.stringify(eventData.format, null, 2));
  const [state, formAction] = useFormState(updateEvent, { message: null, success: false });
  const { pending } = useFormStatus();
  const formRef = useRef<HTMLFormElement>(null);

  const startsAt = eventData.starts_at ? new Date(eventData.starts_at) : undefined;
  const endsAt = eventData.ends_at ? new Date(eventData.ends_at) : undefined;

  const [dsKeyName, setDsKeyName] = useState(eventData.ds_keys?.name ?? null);
  const selectedDsKey = dsKeys?.find((dsKey) => dsKey.name === dsKeyName);

  const [showFormatJson, { toggle: toggleShowFormatJson }] = useDisclosure();

  useFormFeedback(state);

  useEffect(() => {
    setFormatInput(JSON.stringify(eventData.format, null, 2));
  }, [eventData.format, setFormatInput]);

  const [rounds, setRounds] = useState((eventData.format as EventFormat<S>).rounds);
  useEffect(() => {
    setRounds((eventData.format as EventFormat<S>).rounds);
  }, [setRounds, eventData.format]);

  const updateFormatRounds = useCallback(
    (updateRounds: EventFormat<Sport>['rounds']) => setRounds(updateRounds),
    [setRounds],
  );

  // Show confirmation modal when updating event
  const openDeleteModal = () =>
    modals.openConfirmModal({
      title: 'Update event',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to update the event? If you overwrite round/classes/users their live
          data will be removed.
        </Text>
      ),
      labels: { confirm: 'Update event', cancel: "No don't update it" },
      confirmProps: { variant: 'filled' },
      onCancel: () =>
        notifications.show({
          color: 'gray',
          title: 'Canceled',
          message: 'Event not updated',
        }),
      onConfirm: () => {
        try {
          formRef.current?.requestSubmit();
        } catch (e) {
          const message = e instanceof Error ? e.message : 'Unknown error';
          notifications.show({
            color: 'red',
            title: 'Error',
            message: `Failed to update event: ${message}`,
          });
        }
      },
    });

  return (
    <>
      <form action={formAction} className="flex flex-col gap-4" ref={formRef}>
        {/* This button is opens a confirmation modal rendered in a portal, 
            so we need to submit the form via requestSubmit instead */}
        <Button onClick={openDeleteModal} disabled={pending} fullWidth variant="light" mb="xs">
          Save
        </Button>
        {/* Used by action to revalidate specific paths, falls back to revalidating root */}
        <input type="hidden" value={sport} name="sport" />
        {/* Required by action to update specific event */}
        <input type="hidden" value={event} name="event" />

        <div className="flex items-end gap-4 flex-wrap justify-stretch">
          <MultiSelect
            className="grow"
            disabled={pending}
            name="timers"
            label="Timers"
            searchable
            nothingFoundMessage="No timers found..."
            data={timers}
            defaultValue={(eventData.timers ?? []).map((timer) => timer.toString())}
          />
          <Select
            className="grow"
            disabled={pending}
            name="ds_keys"
            label="Datastream Keys"
            searchable
            nothingFoundMessage="No datastreams found..."
            allowDeselect={false}
            value={dsKeyName}
            onChange={(value) => setDsKeyName(value)}
            data={dsKeys?.map((dsKey) => ({
              value: dsKey.name,
              label: dsKey.name,
            }))}
          />

          <div className="flex flex-col grow">
            <Divider label={selectedDsKey?.description} labelPosition="left" />
            <div className="flex gap-4">
              <div className="flex flex-col">
                <Text size="sm">{selectedDsKey?.public}</Text>
                <Text size="xs" c="dimmed">
                  Public
                </Text>
              </div>
              <div className="flex flex-col">
                <Text size="sm">{selectedDsKey?.private}</Text>
                <Text size="xs" c="dimmed">
                  Private
                </Text>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <DateTimePicker
            c={startsAt ? undefined : 'orange.4'}
            label="Start Date"
            defaultValue={startsAt}
            name="starts_at"
            disabled={pending}
          />
          <DateTimePicker
            c={endsAt ? undefined : 'orange.4'}
            label="End Date"
            defaultValue={endsAt}
            name="ends_at"
            disabled={pending}
          />
        </div>

        <TextInput
          label="Event Name"
          name="name"
          defaultValue={eventData.name}
          disabled={pending}
        />

        <EventFormatRoundsInput
          sport={sport}
          rounds={rounds}
          updateFormatRounds={updateFormatRounds}
        />

        <Button variant="subtle" fz="sm" fw={500} color="gray" onClick={toggleShowFormatJson}>
          Format (JSON)
        </Button>
        <Collapse in={showFormatJson}>
          <JsonInput
            name="format"
            minRows={1}
            disabled={pending}
            autosize
            formatOnBlur
            variant={'default'}
            // label="Event Format"
            validationError="Invalid JSON (use double-quotes, remove trailing commas)"
            value={formatInput}
            onChange={setFormatInput}
          />
        </Collapse>

        {/* This button is opens a confirmation modal rendered in a portal, 
            so we need to submit the form via requestSubmit instead */}
        <Button onClick={openDeleteModal} disabled={pending} fullWidth variant="light" mb="xs">
          Save
        </Button>
      </form>
      <div className="flex flex-wrap gap-4">
        <Tooltip
          className="whitespace-pre-line"
          label={`Entrants can be written as a list of IDs.
        This will replace each ID with the lastest data.
        Existing entrants will not be altered.`}
        >
          <PopulateEntrantsInFormat sport={sport} event={event} format={eventData.format} />
        </Tooltip>

        <Tooltip label="This will update all entrants with the latest data available">
          <UpdateEntrantsInFormat sport={sport} event={event} format={eventData.format} />
        </Tooltip>

        <Tooltip label="Entrants will be changed to a list of IDs">
          <DepopulateEntrantsInFormat sport={sport} event={event} format={eventData.format} />
        </Tooltip>

        {/* TODO: Add prune results - remove any rounds/classes that no longer exist in the format */}
      </div>
    </>
  );
}
