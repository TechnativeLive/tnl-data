import { ConfirmButton } from '@/components/mantine-extensions/confirm-button';
import { TimerDisplay } from '@/components/timer/display';
import { soundsSelectionData } from '@/lib/timer/utils';
import { TimerEvent } from '@/lib/timer/utils';
import { DbTimer } from '@/lib/db/custom';
import { updateTimer, deleteTimer } from '@/lib/timer/actions';
import { toNumOrZero } from '@/lib/utils';
import {
  Switch,
  TextInput,
  Anchor,
  NumberInput,
  Button,
  Divider,
  Menu,
  MenuTarget,
  MenuDropdown,
  MenuLabel,
  MenuItem,
  MenuDivider,
  Modal,
  Select,
  ActionIcon,
  Text,
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
import { memo, useCallback, useState } from 'react';

type SetSound = (sound: string | null, event: TimerEvent | number) => void;

export const TimerSettings = memo(TimerSettingsComponent);
function TimerSettingsComponent({
  timer,
  setTimer: setTimerState,
}: {
  timer: DbTimer;
  setTimer: React.Dispatch<React.SetStateAction<DbTimer>>;
}) {
  const setSound = useCallback<SetSound>(
    (sound, event) =>
      setTimerState((t) => {
        const sounds = { ...t.sounds };
        if (sound === null) {
          delete sounds[event];
        } else {
          sounds[event] = sound;
        }

        return { ...t, sounds };
      }),
    [setTimerState],
  );

  const [isDirty, setIsDirty] = useState(false);

  const setTimer = useCallback<React.Dispatch<React.SetStateAction<DbTimer>>>(
    (t) => {
      setTimerState(t);
      setIsDirty(true);
    },
    [setTimerState],
  );

  const [opened, { open, close }] = useDisclosure(false);
  const activeSounds = groupBy(Object.entries(timer.sounds), ([key]) =>
    Number.isNaN(Number(key)) ? 'events' : 'time',
  );
  const [customTimeInput, setCustomTimeInput] = useState<number | string>(0);
  const [unit, setUnit] = useState<'ms' | 's' | 'm' | 'h' | string | null>('s');

  return (
    <div className="grid gap-y-4 gap-x-0 sm:gap-x-4 sm:grid-cols-2 max-w-4xl mx-auto pb-4">
      <div className="flex flex-col">
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="row-span-3 flex flex-col justify-between">
            <Switch
              label="Countdown"
              checked={timer.countdown}
              onChange={() => setTimer((t) => ({ ...t, countdown: !t.countdown }))}
            />
            {isDirty && (
              <div className="flex gap-2 items-end">
                <Text fz="xs" c="dimmed">
                  New Timer:
                </Text>
                <TimerDisplay timer={timer} className="grow text-2xl font-bold" c="dimmed" />
              </div>
            )}
            <TextInput
              value={timer.format}
              onChange={(e) => {
                if (e.currentTarget) {
                  setTimer((t) => ({ ...t, format: e.target.value }));
                }
              }}
              label="Format"
              description={
                <span className="text-xs">
                  See all options{' '}
                  <Anchor
                    c="blue"
                    fz="inherit"
                    href="https://day.js.org/docs/en/display/format"
                    target="_blank"
                  >
                    here
                  </Anchor>
                </span>
              }
            />
          </div>
          <div>
            <Text c="dimmed" fz="xs" mb={2}>
              {timer.countdown ? 'End Time' : 'Start Time'}
            </Text>
            <NumberInput
              min={0}
              value={timer.end_hours}
              onChange={(e) => setTimer((t) => ({ ...t, end_hours: toNumOrZero(e) }))}
              leftSection="h"
              rightSectionPointerEvents="none"
            />
          </div>
          <NumberInput
            min={0}
            value={timer.end_mins}
            onChange={(e) => setTimer((t) => ({ ...t, end_mins: toNumOrZero(e) }))}
            leftSection="m"
          />
          <NumberInput
            min={0}
            value={timer.end_secs}
            onChange={(e) => setTimer((t) => ({ ...t, end_secs: toNumOrZero(e) }))}
            leftSection="s"
          />
        </div>
      </div>

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
            {/* Manually listing means we don't have to sort */}
            {/* {activeSounds.events?.map(([event, sound]) => (
              <SoundSelect
                key={event}
                value={sound}
                setSound={setSound}
                event={event as TimerEvent}
              />
            ))} */}
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

      <div className="flex sm:col-span-2 gap-2.5">
        <Button
          fullWidth
          color="teal"
          variant="filled"
          onClick={() => {
            setIsDirty(false);
            updateTimer(timer);
          }}
        >
          Update
        </Button>
        <ConfirmButton
          fullWidth
          onClick={async () => deleteTimer(timer.id)}
          color="red"
          variant="light"
          confirmVariant="filled"
        >
          Delete
        </ConfirmButton>
      </div>
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
