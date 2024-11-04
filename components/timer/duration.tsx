import { useTimerControls } from '@/app/(app-shell)/timers/controls'
import { DbTimer } from '@/lib/db/custom'
import { useTimerDisplay } from '@/lib/hooks/use-timer-display'
import { toNumOrZero } from '@/lib/utils'
import { Switch, TextInput, Anchor, NumberInput, Text } from '@mantine/core'
import { useCallback, useState } from 'react'

export function TimerControlsDuration() {
  const [isDirty, setIsDirty] = useState(false)
  const [timer, { setTimer: _setTimer }] = useTimerControls()
  const time = useTimerDisplay(timer)
  const setTimer = useCallback<React.Dispatch<React.SetStateAction<DbTimer>>>(
    (t) => {
      _setTimer(t)
      setIsDirty(true)
    },
    [_setTimer, setIsDirty],
  )

  return (
    <div className="flex flex-col gap-2">
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
              <Text className="grow text-2xl font-bold" c="dimmed">
                {time.display}
              </Text>
            </div>
          )}
          <TextInput
            label="Format"
            value={timer.format}
            onChange={(e) => {
              if (e.currentTarget) {
                setTimer((t) => ({ ...t, format: e.target.value }))
              }
            }}
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

      <div className="flex gap-4 items-center">
        <Switch
          className="grow"
          label="Repeating"
          checked={timer.repeating}
          onChange={() => setTimer((t) => ({ ...t, repeating: !t.repeating }))}
        />
        <NumberInput
          description="Repeat Delay"
          min={0}
          value={timer.repeat_delay / 1000}
          onChange={(e) => setTimer((t) => ({ ...t, repeat_delay: toNumOrZero(e) * 1000 }))}
          leftSection="s"
        />
        <NumberInput
          description="Repeat Count"
          min={0}
          value={timer.repeat_count ?? 0}
          onChange={(e) => setTimer((t) => ({ ...t, repeat_count: Math.max(0, toNumOrZero(e)) }))}
        />
      </div>
    </div>
  )
}
