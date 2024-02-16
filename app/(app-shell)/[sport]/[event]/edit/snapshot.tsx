'use client';

import {
  deleteSnapshot,
  restoreFromSnapshot,
  takeSnapshot,
} from '@/app/(app-shell)/[sport]/[event]/edit/actions';
import { tsReadable } from '@/lib/dates';
import { day } from '@/lib/dayjs';
import { Json } from '@/lib/db/types';
import { useFormFeedback } from '@/lib/hooks/use-form-feedback';
import { isObject } from '@/lib/utils';
import { Button, Code, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useParams } from 'next/navigation';
import { useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

type Params = { sport: string; event: string };

export function PreviousSnapshotModal({ snapshot }: { snapshot?: Json }) {
  const [opened, { open, close }] = useDisclosure(false);
  const takenAt =
    isObject(snapshot) && 'created_at' in snapshot && typeof snapshot.created_at === 'string'
      ? snapshot?.created_at
      : undefined;

  const takenAtDate = takenAt ? new Date(takenAt) : undefined;
  const takenAtFormatted = takenAt ? tsReadable.format(new Date(takenAt)) : undefined;
  const relativeTime = takenAtDate ? day.fromNow(takenAtDate) : undefined;

  return (
    <>
      <Modal opened={opened} onClose={close} title="Latest Snapshot" centered>
        {takenAt ? (
          <Text size="sm" className="mb-4">
            Taken {day.fromNow(takenAt)}
            <br />
            At {takenAtFormatted}
          </Text>
        ) : null}
        <Code block>
          {snapshot ? (
            JSON.stringify(snapshot, null, 2)
          ) : (
            <span className="italic">{`<no data>`}</span>
          )}
        </Code>
        <div className="mt-sm flex justify-end">
          <DeleteSnapshotButton snapshot={snapshot} />
        </div>
      </Modal>
      <Button onClick={open} variant="subtle" color="violet" h="100%">
        <div className="flex flex-col">
          <span>View Snapshot</span>
          <br />
          {relativeTime && (
            <span className="text-xs text-dimmed font-normal">Taken {relativeTime}</span>
          )}
          {takenAt && <span className="text-xs text-dimmed font-normal">{takenAtFormatted}</span>}
        </div>
      </Button>
    </>
  );
}

export function TakeSnapshotButton({
  event,
  format,
  results,
  sport,
  hasSnapshot,
}: Partial<Pick<Tables<'events'>, 'format' | 'results'>> & Params & { hasSnapshot: boolean }) {
  const [state, formAction] = useFormState(takeSnapshot, { message: null, success: false });
  const { pending } = useFormStatus();
  const formRef = useRef<HTMLFormElement>(null);

  useFormFeedback(state);

  const openOverwriteSnapshotModal = () =>
    modals.openConfirmModal({
      title: 'Override snapshot',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to take a new snapshot? This will override the old snapshot.
        </Text>
      ),
      labels: { confirm: 'Override snapshot', cancel: "No don't override it" },
      confirmProps: { variant: 'filled' },
      onCancel: () =>
        notifications.show({
          color: 'gray',
          title: 'Canceled',
          message: 'Snapshot not taken',
        }),
      onConfirm: () => {
        try {
          formRef.current?.requestSubmit();
        } catch (e) {
          const message = e instanceof Error ? e.message : 'Unknown error';
          notifications.show({
            color: 'red',
            title: 'Error',
            message: `Failed to override snapshot: ${message}`,
          });
        }
      },
    });

  return (
    <form action={formAction} ref={formRef}>
      <input type="hidden" name="event" value={event} />
      <input type="hidden" name="sport" value={sport} />
      <input type="hidden" name="format" value={JSON.stringify(format)} />
      <input type="hidden" name="results" value={JSON.stringify(results)} />
      <Button
        fullWidth
        color="blue"
        variant="light"
        loading={pending}
        onClick={() =>
          hasSnapshot ? openOverwriteSnapshotModal() : formRef.current?.requestSubmit()
        }
      >
        {hasSnapshot ? 'Override Snapshot' : 'Take Snapshot'}
      </Button>
    </form>
  );
}

export function DeleteSnapshotButton({ snapshot }: Partial<Pick<Tables<'events'>, 'snapshot'>>) {
  const params = useParams();
  const [state, formAction] = useFormState(deleteSnapshot, {
    message: null,
    success: false,
  });
  const { pending } = useFormStatus();
  const formRef = useRef<HTMLFormElement>(null);

  useFormFeedback(state);

  const openDeleteSnapshotModal = () =>
    modals.openConfirmModal({
      title: 'Delete snapshot',
      centered: true,
      children: (
        <>
          <Text size="sm">
            Are you sure you want to delete this snapshot? This cannot be undone.
          </Text>
          <Code block>
            {snapshot ? (
              JSON.stringify(snapshot, null, 2)
            ) : (
              <span className="italic">{`<no data>`}</span>
            )}
          </Code>
        </>
      ),
      labels: { confirm: 'Delete snapshot', cancel: "No don't delete" },
      confirmProps: { variant: 'filled' },
      onCancel: () =>
        notifications.show({
          color: 'gray',
          title: 'Canceled',
          message: 'Snapshot not deleted',
        }),
      onConfirm: () => {
        try {
          formRef.current?.requestSubmit();
        } catch (e) {
          const message = e instanceof Error ? e.message : 'Unknown error';
          notifications.show({
            color: 'red',
            title: 'Error',
            message: `Failed to delete snapshot: ${message}`,
          });
        }
      },
    });

  return (
    <form action={formAction} ref={formRef}>
      <input type="hidden" name="event" value={params.event} />
      <input type="hidden" name="sport" value={params.sport} />
      <input type="hidden" name="snapshot" value={JSON.stringify(snapshot)} />
      <Button
        fullWidth
        color="red"
        variant="filled"
        loading={pending}
        disabled={!snapshot}
        onClick={openDeleteSnapshotModal}
      >
        Delete Snapshot
      </Button>
    </form>
  );
}

export function RestoreFromSnapshotButton({
  event,
  snapshot,
  sport,
}: Partial<Pick<Tables<'events'>, 'snapshot'>> & Params) {
  const [state, formAction] = useFormState(restoreFromSnapshot, {
    message: null,
    success: false,
  });
  const { pending } = useFormStatus();
  const formRef = useRef<HTMLFormElement>(null);

  useFormFeedback(state);

  const openOverwriteSnapshotModal = () =>
    modals.openConfirmModal({
      title: 'Restore from snapshot',
      centered: true,
      children: (
        <>
          <Text size="sm">
            Are you sure you want to restore from this snapshot? This will override the event format
            and results.
          </Text>
          <Code block>
            {snapshot ? (
              JSON.stringify(snapshot, null, 2)
            ) : (
              <span className="italic">{`<no data>`}</span>
            )}
          </Code>
        </>
      ),
      labels: { confirm: 'Restore from snapshot', cancel: "No don't restore" },
      confirmProps: { variant: 'filled' },
      onCancel: () =>
        notifications.show({
          color: 'gray',
          title: 'Canceled',
          message: 'Snapshot not restored',
        }),
      onConfirm: () => {
        try {
          formRef.current?.requestSubmit();
        } catch (e) {
          const message = e instanceof Error ? e.message : 'Unknown error';
          notifications.show({
            color: 'red',
            title: 'Error',
            message: `Failed to restore from snapshot: ${message}`,
          });
        }
      },
    });

  return (
    <form action={formAction} ref={formRef}>
      <input type="hidden" name="event" value={event} />
      <input type="hidden" name="sport" value={sport} />
      <input type="hidden" name="snapshot" value={JSON.stringify(snapshot)} />
      <Button
        fullWidth
        color="orange"
        variant="light"
        loading={pending}
        disabled={!snapshot}
        onClick={openOverwriteSnapshotModal}
      >
        Restore from Snapshot
      </Button>
    </form>
  );
}
