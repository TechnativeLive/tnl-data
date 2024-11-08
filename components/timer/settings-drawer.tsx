import { DrawerAutoHeight } from '@/components/mantine-extensions/drawer'
import { TimerControlsDeleteButton, TimerControlsUpdateButton } from '@/components/timer/buttons'
import { TimerControlsDuration } from '@/components/timer/duration'
import { TimerControlsSoundsSettings } from '@/components/timer/sounds-settings'
import { useTimerControls } from '@/app/(app-shell)/timers/controls'
import { TimerControlsDatastreamSelection } from '@/components/timer/datastream-selection'
import { ActionIcon, ActionIconProps, Text, Tooltip } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconSettings } from '@tabler/icons-react'

export function TimerControlsSettingsDrawer({ size = 'lg' }: { size?: ActionIconProps['size'] }) {
  const [timer] = useTimerControls()
  const [opened, { open, close }] = useDisclosure(false)

  return (
    <>
      <DrawerAutoHeight
        position="bottom"
        opened={opened}
        onClose={close}
        title={
          <div className="flex items-center gap-6 flex-wrap justify-around">
            <Text fw="bold" fz="lg" data-autofocus>
              {timer.name || 'Unnamed Timer'}
            </Text>
            <TimerControlsDatastreamSelection />
          </div>
        }
      >
        <div className="grid gap-y-4 gap-x-0 sm:gap-x-4 sm:grid-cols-2 max-w-4xl mx-auto pb-4">
          <TimerControlsDuration />
          <TimerControlsSoundsSettings />
          <div className="flex sm:col-span-2 gap-2.5">
            <TimerControlsUpdateButton />
          </div>
        </div>
      </DrawerAutoHeight>
      <Tooltip label="Settings">
        <ActionIcon className="shrink-0" size={size} onClick={open} c="dimmed">
          <IconSettings size={size === 'lg' || size === 'xl' ? 24 : 20} stroke={1.5} />
        </ActionIcon>
      </Tooltip>
    </>
  )
}
