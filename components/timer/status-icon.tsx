import { memo } from 'react'
import { Text, Tooltip } from '@mantine/core'
import { IconClockPlay, IconClockPause, IconClockOff } from '@tabler/icons-react'

function TimerStatusIconComponent({ isRunning, value }: { isRunning: boolean, value: number }) {
  const StatusIcon = isRunning ? IconClockPlay : value ? IconClockPause : IconClockOff
  const statusColor = isRunning ? 'green.4' : value ? 'orange.4' : 'gray'
  const statusText = isRunning ? 'Running' : value ? 'Paused' : 'Reset'

  return <Tooltip label={statusText} offset={8}>
    <Text c={statusColor}>
      <StatusIcon />
    </Text>
  </Tooltip>
}

export const TimerStatusIcon = memo(TimerStatusIconComponent)