import { DbTimer } from '@/lib/db/custom'
import dayjs from 'dayjs'

export function elapsedTime(timer?: DbTimer) {
  if (!timer) return 0
  let runningTime = timer.value
  if (timer.isRunning) {
    const now = Date.now()
    const currentStint = now - timer.UTC
    runningTime += currentStint
  }

  return runningTime
}

export function displayTime(timer: DbTimer, trailing = false) {
  let runningTime = timer.value
  if (timer.isRunning) {
    const now = Date.now()
    const currentStint = now - timer.UTC
    runningTime += currentStint
  }

  const total =
    timer.end_hours * 60 * 60 * 1000 + timer.end_mins * 60 * 1000 + timer.end_secs * 1000

  const displayMs = timer.countdown
    ? Math.max(0, total - runningTime + (trailing ? 999 : 0))
    : runningTime + total

  const formatted = dayjs(displayMs).format(timer.format)
  return {
    display: formatted,
    raw: displayMs,
    total,
  }
}

export function timerStart(timer: DbTimer) {
  timer.value = 0
  timer.UTC = Date.now()
  timer.isRunning = true

  return timer
}

export function timerPlay(timer: DbTimer) {
  if (timer.isRunning) return timer

  timer.UTC = Date.now()
  timer.isRunning = true

  return timer
}

export function timerPause(timer: DbTimer) {
  const now = Date.now()

  timer.value += Date.now() - timer.UTC
  timer.UTC = now
  timer.isRunning = false

  return timer
}

export function timerReset(timer: DbTimer) {
  timer.value = 0
  timer.UTC = Date.now()
  timer.isRunning = false

  return timer
}

export function timerRepeat(timer: DbTimer) {
  timer.value = 0
  timer.UTC = Date.now()
  timer.isRunning = true

  return timer
}

export type TimerEvent = 'start' | 'stop' | 'reset' | 'pause' | 'resume'
export const defaultSounds = {
  start: '/sounds/bcc-start.wav',
  stop: '/sounds/bcc-hard-stop.wav',
  warn: '/sounds/bcc-warn.wav',
  countdown: '/sounds/bcc-countdown.wav',
}
export const soundsSelectionData = [
  // { group: '', items: [{ value: '', label: 'None' }] },
  {
    group: 'BCC',
    items: [
      { value: '/sounds/bcc-start.wav', label: 'Start' },
      { value: '/sounds/bcc-hard-stop.wav', label: 'Stop' },
      { value: '/sounds/bcc-warn.wav', label: 'Warn' },
      { value: '/sounds/bcc-countdown.wav', label: 'Countdown' },
    ],
  },
]
