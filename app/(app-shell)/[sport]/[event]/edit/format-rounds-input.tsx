import { ConfirmButton } from '@/components/mantine-extensions/confirm-button';
import { EventFormat, Sport, roundKindSelection } from '@/lib/event-data';
import {
  Badge,
  Button,
  Divider,
  Modal,
  Paper,
  Select,
  TagsInput,
  Text,
  TextInput,
} from '@mantine/core';
import { useDisclosure, useInputState } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';

export function EventFormatRoundsInput<S extends Sport>({
  sport,
  rounds,
  updateFormatRounds,
}: {
  sport: S;
  rounds: EventFormat<S>['rounds'];
  updateFormatRounds: (rounds: EventFormat<S>['rounds']) => void;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const [editRoundIndex, setEditRoundIndex] = useState<number>();

  const editingRound = editRoundIndex !== undefined ? rounds[editRoundIndex] : undefined;

  const classOptions = new Map(
    rounds.flatMap((round) =>
      round.classes.map((cls) => [cls.id, { value: cls.id, label: cls.name }]),
    ),
  );

  const [nameInput, setNameInput] = useInputState(editingRound?.name ?? 'Default Round Name');
  const [idInput, setIdInput] = useInputState(editingRound?.id ?? 'default-round-id');
  const [kindInput, setKindInput] = useInputState<EventFormat<S>['rounds'][number]['kind']>(
    editingRound?.kind ?? roundKindSelection[sport]?.[0]?.value,
  );

  return (
    <div className="flex flex-col">
      <Modal
        centered
        opened={opened}
        onClose={close}
        title={editingRound?.name ? `Editing ${editingRound.name}` : 'Add a new round'}
      >
        <form className="flex flex-col gap-2">
          <TextInput
            name="name"
            label="Round Name"
            value={nameInput}
            onChange={(evt) => setNameInput(evt.currentTarget.value)}
            required
          />
          <div className="flex flex-wrap gap-2 items-center">
            <TextInput
              name="id"
              label="Round Id"
              value={idInput}
              onChange={(evt) => setIdInput(evt.currentTarget.value)}
              required
            />
            <Select
              name="kind"
              label="Round Kind"
              data={roundKindSelection[sport]}
              value={kindInput}
              onChange={(evt) => {
                if (evt) setKindInput(evt as EventFormat<S>['rounds'][number]['kind']);
              }}
            />
          </div>
          <Divider className="my-4" />
          <TagsInput
            name="classes"
            label="Classes"
            onOptionSubmit={(cls) => {
              const newRounds = [...rounds];
              const newClass = { id: cls, name: cls, entrants: [] };
              if (editRoundIndex === undefined) {
                newRounds.push({
                  name: nameInput,
                  id: idInput,
                  kind: kindInput,
                  classes: [newClass],
                });
              } else {
                if (newRounds[editRoundIndex]?.classes)
                  newRounds[editRoundIndex]!.classes.push(newClass);
              }
              updateFormatRounds(newRounds as EventFormat<S>['rounds']);
            }}
            data={[...classOptions.values()]}
            defaultValue={editingRound?.classes.map((cls) => cls.id) ?? []}
          />
        </form>
      </Modal>
      <Text fz="sm" fw={500}>
        Event Rounds
      </Text>
      <Paper withBorder px="sm" className="flex flex-col divide-y">
        {rounds.map((round, roundIndex) => (
          <div key={round.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-2">
            <Text fw={700} className="mr-auto">
              {round.name}
            </Text>
            {round.classes.map((cls) => (
              <Badge
                /* Button size="compact-sm" */ radius="xl"
                className="shrink-0 max-w-[33%]"
                key={cls.id}
              >
                {cls.name}
              </Badge>
            ))}
            {/* <div className="ml-auto flex gap-x-2">
              <Button
                onClick={() => {
                  setEditRoundIndex(roundIndex);
                  open();
                }}
              >
                Edit
              </Button>
              <ConfirmButton
                className="min-w-[90px]"
                confirmVariant="filled"
                confirmMessage="Confirm"
              >
                Delete
              </ConfirmButton>
            </div> */}
          </div>
        ))}
        {/* <div className="py-2">
          <Button
            className="border-dashed"
            fullWidth
            onClick={() => {
              setEditRoundIndex(undefined);
              open();
            }}
          >
            <IconPlus />
          </Button>
        </div> */}
      </Paper>
    </div>
  );
}
