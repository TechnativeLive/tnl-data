import clsx from 'clsx'
import { useSounds } from '@/lib/audio/use-sounds'
import { displayTime, TimerEvent, timerRepeat } from '@/lib/timer/utils'
import { useDidUpdate } from '@mantine/hooks'
import { useRef, useEffect, memo } from 'react'
import { DbTimer } from '@/lib/db/custom'
import { syncTimer } from '@/lib/timer/actions'

function shouldPlaySoundAt(time: number, rawTime: number, prevRawTime: number, trailing: boolean) {
  const timeToCheck = trailing ? time + 1000 : time
  return prevRawTime > timeToCheck && rawTime <= timeToCheck
}

export function TimerEvents({
  timer,
  time,
  trailing = false,
}: {
  timer: DbTimer
  time: ReturnType<typeof displayTime>
  trailing?: boolean
}) {
  const { playFromStart: play, error } = useSounds(timer.sounds)
  const prevRawTime = useRef<number>(time.raw)

  const repeatCount = useRef(timer.repeat_count || Infinity)
  const timeoutRef = useRef<number>()

  useEffect(() => {
    repeatCount.current = timer.repeat_count || Infinity
  }, [timer.repeat_count])

  // time-based events
  useEffect(() => {
    if (shouldPlaySoundAt(0, time.raw, prevRawTime.current, trailing)) {
      if (timer.repeating && repeatCount.current && !timeoutRef.current) {
        timeoutRef.current = window.setTimeout(() => {
          repeatCount.current--

          timerRepeat(timer)
          syncTimer(timer)

          timeoutRef.current = undefined
        }, timer.repeat_delay)
      }
    }

    if (!timer.muted) {
      for (const event in timer.sounds) {
        const eventTime = parseInt(event as string)
        if (!Number.isNaN(eventTime)) {
          if (shouldPlaySoundAt(eventTime, time.raw, prevRawTime.current, trailing)) play(eventTime)
        }
      }
    }

    prevRawTime.current = time.raw
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time.raw, time.total, timer.muted, trailing, JSON.stringify(timer.sounds), play])

  // event-driven
  useDidUpdate(() => {
    if (timer.isRunning) {
      if (timer.value > 0) {
        if (timer.sounds.resume) {
          play('resume')
        }
      } else {
        if (timer.sounds.start) {
          play('start')
        }
      }
    } else if (timer.value > 0) {
      if (timer.sounds.pause) {
        play('pause')
      }
    } else {
      if (timer.sounds.reset) {
        play('reset')
      }
    }
    // re-run on timer.UTC in the case that a running timer is repeated
  }, [timer.UTC, timer.isRunning, timer.value, JSON.stringify(timer.sounds), play])

  return <DisabledSoundWarning error={error} isRunning={timer.isRunning} />
}

function DisabledSoundWarningComponent({
  error,
  isRunning,
}: {
  error: boolean
  isRunning: boolean
}) {
  // const isAutoPlayEnabled = typeof Navigator !== 'undefined' && Navigator.getAutoPlayPolicy()

  return (
    <div
      className={clsx(
        'grid place-content-center transition-opacity duration-300 fixed top-8 w-3/4 h-16 -translate-x-1/2 left-1/2 rounded-md border border-red-5 bg-red-5/30',
        error ? 'opacity-100' : 'opacity-0',
        isRunning && 'invert',
      )}
    >
      Sound is disabled. Allow sound in the site preferences or click on this window to enable.
    </div>
  )
}

const DisabledSoundWarning = memo(DisabledSoundWarningComponent)
