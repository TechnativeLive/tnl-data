'use client';

import { updateEvent } from '@/app/(projects)/[sport]/[event]/edit/actions';
import {
  DepopulateEntrantsInFormat,
  PopulateEntrantsInFormat,
  UpdateEntrantsInFormat,
} from '@/app/(projects)/[sport]/[event]/edit/format';
import { Select } from '@/components/select';
import { Json } from '@/lib/db/types';
import { useFormFeedback } from '@/lib/hooks/use-form-feedback';
import { Button, Divider, JsonInput, Text, TextInput, Tooltip } from '@mantine/core';
import { DateInput, DateTimePicker } from '@mantine/dates';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useEffect, useRef, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { type Simplify } from 'type-fest';

type DSKeys = Pick<Tables<'ds_keys'>, 'name' | 'description' | 'private' | 'public'>;
type EventData = Pick<
  Tables<'events'>,
  'name' | 'format' | 'results' | 'starts_at' | 'ends_at' | 'created_at' | 'updated_at' | 'snapshot'
> &
  (null | {
    ds_keys: DSKeys | null;
  });

export function EventDataEditForm({
  sport,
  event,
  eventData,
  dsKeys,
}: {
  sport: string;
  event: string;
  eventData: Simplify<EventData>;
  dsKeys: DSKeys[] | null;
}) {
  const [formatInput, setFormatInput] = useState(JSON.stringify(eventData.format, null, 2));
  const [state, formAction] = useFormState(updateEvent, { message: null, success: false });
  const { pending } = useFormStatus();
  const formRef = useRef<HTMLFormElement>(null);

  const startsAt = eventData.starts_at ? new Date(eventData.starts_at) : undefined;
  const endsAt = eventData.ends_at ? new Date(eventData.ends_at) : undefined;

  const [dsKeyName, setDsKeyName] = useState(eventData.ds_keys?.name ?? null);
  const selectedDsKey = dsKeys?.find((dsKey) => dsKey.name === dsKeyName);

  useFormFeedback(state);

  useEffect(() => {
    setFormatInput(JSON.stringify(eventData.format, null, 2));
  }, [eventData.format, setFormatInput]);

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
          Update Event
        </Button>
        {/* Used by action to revalidate specific paths, falls back to revalidating root */}
        <input type="hidden" value={sport} name="sport" />
        {/* Required by action to update specific event */}
        <input type="hidden" value={event} name="event" />

        <div className="flex items-end gap-4 flex-wrap justify-stretch">
          <Select
            className="grow"
            disabled={pending}
            name="ds_keys"
            label="Datastream Keys"
            searchable
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

        <JsonInput
          name="format"
          minRows={1}
          disabled={pending}
          autosize
          formatOnBlur
          variant={'default'}
          label="Event Format"
          validationError="Invalid JSON (use double-quotes, remove trailing commas)"
          value={formatInput}
          onChange={setFormatInput}
        />
      </form>
      <div className="flex gap-4">
        <Tooltip
          className="whitespace-pre-line"
          label={`Entrants can be written as a list of IDs.
        This will replace each ID with the lastest data.
        Existing entrants will not be altered.`}
        >
          {/* <Button>Populate Entrants</Button> */}
          <PopulateEntrantsInFormat sport={sport} event={event} format={eventData.format} />
        </Tooltip>

        <Tooltip label="This will update all entrants with the latest data available">
          <UpdateEntrantsInFormat sport={sport} event={event} format={eventData.format} />
        </Tooltip>

        {process.env.NODE_ENV === 'development' ? (
          <Tooltip label="Entrants will be changed to a list of IDs">
            {/* <Button>Populate Entrants</Button> */}
            <DepopulateEntrantsInFormat sport={sport} event={event} format={eventData.format} />
          </Tooltip>
        ) : null}
      </div>
    </>
  );
}
