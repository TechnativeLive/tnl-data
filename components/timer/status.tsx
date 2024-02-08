import { useTimerControls } from '@/app/(app-shell)/timers/controls';
import { Text, Tooltip } from '@mantine/core';
import { IconClockOff, IconClockPause, IconClockPlay, TablerIconsProps } from '@tabler/icons-react';
import { memo } from 'react';

export function TimerControlsStatus({
  local,
  ...iconProps
}: {
  local?: boolean;
} & TablerIconsProps) {
  const [localTimer, { live }] = useTimerControls();
  const timer = local ? localTimer : live;

  return <TimerStatusIcon isRunning={timer.isRunning} value={timer.value} iconProps={iconProps} />;
}

function TimerStatusIconComponent({
  isRunning,
  value,
  iconProps,
}: {
  isRunning: boolean;
  value: number;
  iconProps?: TablerIconsProps;
}) {
  const StatusIcon = isRunning ? IconClockPlay : value ? IconClockPause : IconClockOff;
  const statusColor = isRunning ? 'green.4' : value ? 'orange.4' : 'gray';
  const statusText = isRunning ? 'Running' : value ? 'Paused' : 'Reset';

  return (
    <Tooltip label={statusText} offset={8}>
      <Text c={statusColor}>
        <StatusIcon {...iconProps} />
      </Text>
    </Tooltip>
  );
}

const TimerStatusIcon = memo(TimerStatusIconComponent);
