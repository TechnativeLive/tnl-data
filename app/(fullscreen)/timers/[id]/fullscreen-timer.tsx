'use client'

import clsx from 'clsx'
import useFitText from 'use-fit-text'
import { useState, useEffect } from 'react'

import { createBrowserClient } from '@/lib/db/client'
import { Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useTimerDisplay } from '@/lib/hooks/use-timer-display'
import { TimerEvents } from '@/components/timer/timer-events'
import { DbTimer } from '@/lib/db/custom'
import { useSyncTimerWithDatastream } from '@/lib/hooks/use-sync-timer-with-datastream'

export function FullscreenTimer({ id, className }: { id: number | string; className?: string }) {
  const supabase = createBrowserClient()
  const [timer, setTimer] = useState<DbTimer | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('timers')
        .select('*')
        .eq('id', id)
        .returns<DbTimer[]>()
        .single()
      setTimer(data)
    }

    fetchData()
  }, [supabase, id])

  useEffect(() => {
    const channel = supabase
      .channel('realtime timers')
      .on<DbTimer>(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'timers', filter: `id=eq.${id}` },
        (e) => {
          if (e.errors) {
            notifications.show({
              title: 'Warning',
              color: 'orange',
              message: 'Timers are desynced. Please refresh the page',
              autoClose: false,
            })
            return
          }

          if (e.eventType === 'DELETE') {
            setTimer(null)
            return
          }

          setTimer(e.new)
          return
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, id])

  return (
    <section
      className={clsx(
        'text-white bg-black text-center h-screen select-none',
        timer?.isRunning && 'invert',
        className,
      )}
    >
      <Text className="tracking-widest h-8 flex items-center justify-center" fw="bolder" fz="lg">
        {timer ? timer.name || 'Unnamed Timer' : 'Loading...'}
      </Text>
      <div className="px-[5vw] h-[calc(100%-96px)]">
        {timer ? <ActiveFullscreenTimer timer={timer} /> : null}
      </div>
      <Text className="tracking-widest h-16 flex items-center justify-center" fw="bolder" fz="xl">
        TECHNATIVE
      </Text>
    </section>
  )
}

function ActiveFullscreenTimer({ timer }: { timer: DbTimer }) {
  useSyncTimerWithDatastream(timer)
  // useRepeatingTimer(timer)

  return <Display timer={timer} />
}

function Display({ timer }: { timer: DbTimer }) {
  const time = useTimerDisplay(timer, true)

  return (
    <>
      {!timer.muted && (
        <TimerEvents
          timer={timer}
          time={time}
          // value={timer.value}
          // isRunning={timer.isRunning}
          // rawTime={time.raw}
          // total={time.total}
          // muted={timer.muted}
          // sounds={timer.sounds}
          trailing
          // repeat_count={timer.repeat_count}
          // repeat_delay={timer.repeat_delay}
          // repeating={timer.repeating}
        />
      )}
      <FullscreenText>{time.display}</FullscreenText>
    </>
  )
}

function FullscreenText({ children }: { children: string }) {
  const { fontSize, ref } = useFitText({ maxFontSize: 5000, logLevel: 'info' })

  return (
    <div
      ref={ref}
      style={{ fontSize }}
      className="w-full h-full flex items-center justify-center animate-fade animate-delay-300"
    >
      {children}
    </div>
  )
}
