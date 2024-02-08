import { useTimerControls } from '@/app/(app-shell)/timers/controls';
import { ActionIcon, Text, TextInput } from '@mantine/core';
import { IconEdit, IconDeviceFloppy } from '@tabler/icons-react';
import { useState } from 'react';

export function TimerControlsTitle({ editable = false }: { editable?: boolean }) {
  const [timer, { setTimer, sync }] = useTimerControls();
  const [input, setInput] = useState(timer.name);
  const [isEdit, setIsEdit] = useState(false);

  return (
    <div className="flex items-center gap-2 h-[1.875rem]">
      {editable && (
        <ActionIcon
          size="md"
          color="gray"
          c="dimmed"
          variant="light"
          onClick={() => setIsEdit((editting) => !editting)}
        >
          <IconEdit size={16} />
        </ActionIcon>
      )}
      {isEdit ? (
        <>
          <TextInput
            size="xs"
            value={input || ''}
            onChange={(e) => setInput(e.currentTarget.value)}
          />
          <ActionIcon
            size="md"
            variant="light"
            onClick={() => {
              const updatedTimer = { ...timer, name: input };
              setTimer(updatedTimer);
              sync(updatedTimer);
              setIsEdit(false);
            }}
          >
            <IconDeviceFloppy />
          </ActionIcon>
        </>
      ) : (
        <Text
          fz={editable ? 'xs' : 'lg'}
          fw={timer.name ? 'bold' : undefined}
          fs={timer.name ? 'normal' : 'italic'}
          c={timer.name ? undefined : 'dimmed'}
        >
          {timer.name || 'Unnamed Timer'}
        </Text>
      )}
    </div>
  );
}
