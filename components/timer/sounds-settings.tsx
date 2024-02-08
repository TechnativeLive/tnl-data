'use client';

import { useTimerControls } from '@/app/(app-shell)/timers/controls';
import { TimerEvent, soundsSelectionData } from '@/lib/timer/utils';
import {
  Menu,
  MenuTarget,
  Button,
  MenuDropdown,
  MenuLabel,
  MenuItem,
  MenuDivider,
  Divider,
  Modal,
  NumberInput,
  Select,
  Text,
  ActionIcon,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconPlus,
  IconPlayerPlayFilled,
  IconPlayerPause,
  IconPlayerPlay,
  IconClock,
  IconSelector,
  IconSquareXFilled,
} from '@tabler/icons-react';
import groupBy from 'object.groupby';
import { useCallback, useState } from 'react';

type SetSound = (sound: string | null, event: TimerEvent | number) => void;

export function TimerControlsSoundsSettings() {
  const [timer, { setTimer }] = useTimerControls();
  const [opened, { open, close }] = useDisclosure(false);
  const [customTimeInput, setCustomTimeInput] = useState<number | string>(0);
  const [unit, setUnit] = useState<'ms' | 's' | 'm' | 'h' | string | null>('s');

  const setSound = useCallback<SetSound>(
    (sound, event) =>
      setTimer((t) => {
        const sounds = { ...t.sounds };
        if (sound === null) {
          delete sounds[event];
        } else {
          sounds[event] = sound;
        }

        return { ...t, sounds };
      }),
    [setTimer],
  );

  const activeSounds = groupBy(Object.entries(timer.sounds), ([key]) =>
    Number.isNaN(Number(key)) ? 'events' : 'time',
  );

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-end">
        <Text>Sounds</Text>
        <Menu>
          <MenuTarget>
            <Button size="xs" rightSection={<IconPlus />}>
              Add Trigger
            </Button>
          </MenuTarget>
          <MenuDropdown className="min-w-[130px]">
            <MenuLabel>Events</MenuLabel>
            <MenuItem
              disabled={'start' in timer.sounds}
              leftSection={<IconPlayerPlayFilled size={16} />}
              onClick={() => setSound('', 'start')}
            >
              Start
            </MenuItem>
            <MenuItem
              disabled={'pause' in timer.sounds}
              leftSection={<IconPlayerPause size={16} />}
              onClick={() => setSound('', 'pause')}
            >
              Pause
            </MenuItem>
            <MenuItem
              disabled={'resume' in timer.sounds}
              leftSection={<IconPlayerPlay size={16} />}
              onClick={() => setSound('', 'resume')}
            >
              Resume
            </MenuItem>
            <MenuItem
              disabled={'reset' in timer.sounds}
              leftSection={<IconPlayerPlay size={16} />}
              onClick={() => setSound('', 'reset')}
            >
              Reset
            </MenuItem>
            {/* <MenuItem disabled={'stop' in timer.sounds} leftSection={<IconPlayerPause size={16} />} onClick={() => setSound('', 'stop')}>Stop</MenuItem> */}
            <MenuDivider />
            <MenuLabel>Time</MenuLabel>
            <MenuItem
              disabled={0 in timer.sounds}
              leftSection={<IconClock size={16} />}
              onClick={() => setSound('', 0)}
            >
              0s
            </MenuItem>
            <MenuItem
              disabled={3000 in timer.sounds}
              leftSection={<IconClock size={16} />}
              onClick={() => setSound('', 3000)}
            >
              3s
            </MenuItem>
            <MenuItem
              disabled={60000 in timer.sounds}
              leftSection={<IconClock size={16} />}
              onClick={() => setSound('', 60000)}
            >
              60s
            </MenuItem>
            <MenuItem leftSection={<IconClock size={16} />} onClick={open}>
              Custom
            </MenuItem>
          </MenuDropdown>
        </Menu>
      </div>

      <div className="grid grid-cols-2 gap-x-6 items-start justify-start">
        <Divider className="-mb-3" label="Events" />
        <Divider className="-mb-3" label="Time" />
        <div className="flex flex-col">
          {'start' in timer.sounds && (
            <SoundSelect value={timer.sounds.start} setSound={setSound} event="start" />
          )}
          {'pause' in timer.sounds && (
            <SoundSelect value={timer.sounds.pause} setSound={setSound} event="pause" />
          )}
          {'resume' in timer.sounds && (
            <SoundSelect value={timer.sounds.resume} setSound={setSound} event="resume" />
          )}
          {'reset' in timer.sounds && (
            <SoundSelect value={timer.sounds.reset} setSound={setSound} event="reset" />
          )}
        </div>
        <div className="flex flex-col">
          {activeSounds.time?.map(([time, sound]) => (
            <SoundSelect key={time} value={sound} setSound={setSound} event={Number(time)} />
          ))}
        </div>
      </div>
      <Modal
        opened={opened}
        onClose={close}
        size="sm"
        centered
        title={
          <Text fw="bold" fz="lg">
            Add custom time trigger
          </Text>
        }
      >
        <div className="flex flex-col gap-y-6">
          <div className="grid grid-cols-[3fr,1fr] gap-2">
            <NumberInput value={customTimeInput} onChange={setCustomTimeInput} />
            <Select data={['ms', 's', 'm', 'h']} value={unit} onChange={setUnit} />
          </div>
          <div className="flex justify-between gap-2">
            <Text fz="sm" className="pl-1">
              Label: {calculateInputTime(customTimeInput, unit) / 1000}s
            </Text>
            <Button
              className="self-end"
              onClick={() => setSound('', calculateInputTime(customTimeInput, unit))}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function SoundSelect({
  label,
  event,
  value,
  setSound,
}: {
  label?: string;
  event: TimerEvent | number;
  value: string;
  setSound: SetSound;
}) {
  const eventLabel = typeof event === 'number' ? `${event / 1000}s` : event;

  return (
    <Select
      label={label || eventLabel}
      data={soundsSelectionData}
      value={value}
      onChange={(sound) => setSound(sound || value, event)}
      leftSection={<IconSelector size={16} />}
      leftSectionPointerEvents="none"
      rightSection={
        <ActionIcon variant="subtle" color="red" onClick={() => setSound(null, event)}>
          <IconSquareXFilled size={20} />
        </ActionIcon>
      }
      rightSectionPointerEvents="auto"
    />
  );
}

function calculateInputTime(number: number | string, unit: string | null) {
  if (typeof number === 'string') number = parseInt(number);
  if (Number.isNaN(number)) return 0;
  if (unit === 'ms') return number;
  if (unit === 's') return number * 1000;
  if (unit === 'm') return number * 1000 * 60;
  if (unit === 'h') return number * 1000 * 60 * 60;
  return number;
}
