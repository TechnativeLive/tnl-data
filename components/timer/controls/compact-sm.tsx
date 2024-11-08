'use client'

import { TimerControls } from '@/app/(app-shell)/timers/controls'
import { NewIndicator } from '@/app/(app-shell)/timers/create-timer'
import { TimerControlsButtons } from '@/components/timer/buttons'
import { TimerControlsDisplay } from '@/components/timer/display'
import { TimerControlsMuteButton } from '@/components/timer/mute'
import { TimerControlsRepeatButton } from '@/components/timer/repeat'
import { TimerControlsSettingsDrawer } from '@/components/timer/settings-drawer'
import { TimerControlsStatus } from '@/components/timer/status'
import { TimerControlsTitle } from '@/components/timer/title'
import { DbTimer } from '@/lib/db/custom'
import { useSetSearchParams } from '@/lib/hooks/use-set-query-params'
import { Button, ActionIcon, Tooltip } from '@mantine/core'
import { IconWindowMaximize } from '@tabler/icons-react'
import { Route } from 'next'
import Link from 'next/link'

export function TimerControlCardCompactSm({ timer }: { timer: DbTimer }) {
  const setSearchParams = useSetSearchParams()

  return (
    <TimerControls timer={timer} size="sm">
      <NewIndicator createdAt={timer.created_at} />
      <div className="flex gap-2 items-center">
        <div className="flex gap-2 flex-col">
          <div className="flex items-center gap-2 h-[1.875rem] justify-between">
            <TimerControlsTitle editable />
            {/* <Button
              component={Link}
              href={`/timers?control=${timer.id}` as Route}
              onClick={() => setSearchParams('control', timer.id.toString())}
              ml="auto"
              size="compact-xs"
            >
              Controls
            </Button> */}
            <TimerControlsSettingsDrawer size="md" />
          </div>
          <div className="flex gap-2 items-center">
            <TimerControlsDisplay className="text-2xl font-bold grow" />
            <TimerControlsStatus />
            <TimerControlsMuteButton />
            <TimerControlsRepeatButton />

            <Tooltip label="Fullscreen">
              <Link target="_blank" href={`/timers/${timer.id}`}>
                <ActionIcon className="shrink-0" size="lg" c="dimmed">
                  <IconWindowMaximize stroke={2} />
                </ActionIcon>
              </Link>
            </Tooltip>
          </div>
        </div>
        <TimerControlsButtons orientation="vertical" compact />
      </div>
    </TimerControls>
  )
}
