import { useTimerControls } from '@/app/(app-shell)/timers/controls'
import { DbTimer } from '@/lib/db/custom'
import { syncTimer } from '@/lib/timer/actions'
import { Tooltip, ActionIcon } from '@mantine/core'
import { IconRepeat, IconRepeatOff } from '@tabler/icons-react'

export function TimerControlsRepeatButton() {
  const [timer, { setTimer }] = useTimerControls()
  const RepeatIcon = timer.repeating ? IconRepeat : IconRepeatOff

  const repeatCountLabel = !timer.repeat_count ? 'Forever' : `${timer.repeat_count} times`
  const repeatDelayLabel =
    timer.repeat_delay >= 1000
      ? `${timer.repeat_delay / 1000}s delay`
      : `${timer.repeat_delay}ms delay`

  return (
    <Tooltip
      label={`${timer.repeating ? '' : 'Not '}Repeating (${repeatCountLabel}, ${repeatDelayLabel})`}
    >
      <ActionIcon size="lg" c={timer.repeating ? 'dimmed' : 'red'}>
        <RepeatIcon
          onClick={() => {
            const updatedTimer: DbTimer = { ...timer, repeating: !timer.repeating }
            setTimer(updatedTimer)
            syncTimer(updatedTimer)
          }}
        />
      </ActionIcon>
    </Tooltip>
  )
}
