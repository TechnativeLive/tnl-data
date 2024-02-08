import { useTimerControls } from '@/app/(app-shell)/timers/controls';
import { useTimerDisplay } from '@/lib/hooks/use-timer-display';
import { Text } from '@mantine/core';

export function TimerControlsDisplay({
  local = false,
  className,
}: {
  local?: boolean;
  className?: string;
}) {
  const [timer, { live }] = useTimerControls();
  const { display } = useTimerDisplay(local ? timer : live);

  return <Text className={className}>{display}</Text>;
}
