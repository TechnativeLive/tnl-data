import { ConfirmButton } from '@/components/mantine-extensions/confirm-button';
import { StackedButton } from '@/components/mantine-extensions/stacked-button';
import { QueryLink } from '@/components/query-link';
import { Button, ButtonGroup, Divider, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import clsx from 'clsx';
import { useState } from 'react';

export function ClimbingMinorJudge({ station }: { station: string }) {
  const cls = station.charAt(0) === 'M' ? 'mens' : 'womens';
  const position = station.charAt(1);

  const entrant = 'undefined';

  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col h-full rounded-lg border border-body-dimmed-hover overflow-hidden">
      <div className="px-4 py-2 text-center text-lg tracking-widest uppercase font-bold w-full border-b bg-body-dimmed">
        {cls} {position}
        {entrant && (
          <span>
            {' '}
            - <span className="text-white">Current Entrant Name</span>
          </span>
        )}
      </div>

      {!entrant && (
        <div className="h-full grid place-content-center gap-6 text-center px-8">
          <span>Waiting for the head judge to activate the round</span>
          <span>This page will automatically update when the round starts</span>
        </div>
      )}

      {entrant && (
        <>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 p-4">
            <StackedButton
              className="min-w-[6rem] py-2 items-center"
              component={QueryLink}
              query={{ entrant: 5 }}
              leftSection={<IconChevronLeft />}
              rightSection={<IconChevronRight className="opacity-0" />}
            >
              <Text fz="xs">Previous Entrant</Text>
              <Text fw={600}>Jim Pope</Text>
            </StackedButton>
            <StackedButton
              className="min-w-[6rem] py-2 items-center"
              component={QueryLink}
              query={{ entrant: 7 }}
              leftSection={<IconChevronLeft className="opacity-0" />}
              rightSection={<IconChevronRight />}
            >
              <Text fz="xs">Next Entrant</Text>
              <Text fw={600}>Jim Pope</Text>
            </StackedButton>
          </div>
          <ButtonGroup className="mx-4 my-12 grid grid-cols-1 xxs:grid-cols-4">
            <Button
              className="px-2"
              size="md"
              disabled={active !== 0}
              color={active === 0 ? 'teal' : undefined}
              onClick={() => setActive(1)}
            >
              Start
            </Button>
            <Button
              className="px-2"
              size="md"
              disabled={active !== 1}
              color={active === 1 ? 'teal' : undefined}
              onClick={() => setActive(2)}
            >
              Zone
            </Button>
            <Button
              className="px-2"
              size="md"
              disabled={active !== 2}
              color={active === 2 ? 'teal' : undefined}
              onClick={() => setActive(3)}
            >
              Top
            </Button>
            <Button
              className="px-2 break-words"
              size="md"
              disabled={active === 0}
              color={active === 3 ? 'teal' : undefined}
              onClick={() => setActive(0)}
            >
              {active === 3 ? 'Confirm' : 'End'}
            </Button>
          </ButtonGroup>

          <div className="flex flex-col gap-2 p-4">
            <Attempt number={4} active={true} />
            <Attempt number={3} active={false} />
            <Attempt number={2} active={false} />
            <Attempt number={1} active={false} />
          </div>
        </>
      )}
    </div>
  );
}

function Attempt({ number, active }: { number: number; active: boolean }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [editing, setEditing] = useState<number>();

  return (
    <>
      <Modal centered opened={opened} onClose={close} title={`Edit Attempt ${editing}`}>
        {/* show no score / zonne / top options for `editing` attempt and update db on click */}
        <ButtonGroup>
          <Button className="flex-grow flex-shrink-0 basis-0" size="lg">
            No Score
          </Button>
          <Button className="flex-grow flex-shrink-0 basis-0" size="lg">
            Zone
          </Button>
          <Button className="flex-grow flex-shrink-0 basis-0" size="lg">
            Top
          </Button>
        </ButtonGroup>
      </Modal>
      <div
        className={clsx(
          'relative flex flex-wrap gap-4 items-center rounded-md border p-2 flex-grow border-body-dimmed',
        )}
      >
        {active && (
          <div className="absolute inset-0 shadow-teal-5/50 border border-teal-5/70 shadow-md rounded-md animate-pulse" />
        )}
        <div className="pl-2">
          <Text span fz="xs" c="dimmed">
            ATT.{' '}
          </Text>
          <Text span fz="md">
            {number}
          </Text>
          {number}
        </div>
        <Divider orientation="vertical" />
        <Text fw={600}>Top</Text>
        <Divider className="ml-auto" orientation="vertical" />
        <div className="flex items-center gap-4">
          <Button
            size="compact-sm"
            color="blue"
            variant="light"
            onClick={() => {
              open();
              setEditing(number);
            }}
          >
            Edit
          </Button>
          <ConfirmButton
            confirmMessage="Confirm"
            size="compact-sm"
            color="red"
            confirmVariant="filled"
          >
            Delete
          </ConfirmButton>
        </div>
      </div>
    </>
  );
}
