import { useTimerControls } from '@/app/(app-shell)/timers/controls'
import { DbTimer } from '@/lib/db/custom'
import { syncTimer } from '@/lib/timer/actions'
import { Tooltip, ActionIcon } from '@mantine/core'
import { IconVolumeOff, IconVolume } from '@tabler/icons-react'

export function TimerControlsMuteButton() {
  const [timer, { setTimer }] = useTimerControls()
  const MuteIcon = timer.muted ? IconVolumeOff : IconVolume

  return (
    <Tooltip label={timer.muted ? 'Unmute' : 'Mute'}>
      <ActionIcon size="lg" c={timer.muted ? 'red' : 'dimmed'}>
        <MuteIcon
          onClick={() => {
            const updatedTimer: DbTimer = { ...timer, muted: !timer.muted }
            setTimer(updatedTimer)
            syncTimer(updatedTimer)
          }}
        />
      </ActionIcon>
    </Tooltip>
  )
}
