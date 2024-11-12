'use client'

import { createBrowserClient } from '@/lib/db/client'
import { executeUpdateJsonEventAtom__workaround } from '@/lib/hooks/use-realtime-json-event'
import { Badge, Tooltip } from '@mantine/core'
import { IconCheck, IconX } from '@tabler/icons-react'
import { useAtomValue, useSetAtom } from 'jotai'
import { useState, useEffect, useRef } from 'react'

export function RealtimeHeartbeat({ interval: ms = 1000 }) {
  const supabase = createBrowserClient()
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [connectionState, setConnectionState] = useState<string>('connecting')
  const interval = useRef<NodeJS.Timeout>()
  const injectedUpdateCallback = useSetAtom(executeUpdateJsonEventAtom__workaround)

  useEffect(() => {
    if (interval.current) clearInterval(interval.current)

    interval.current = setInterval(() => {
      setConnectionState(supabase.realtime.connectionState())
      setIsConnected(supabase.realtime.isConnected())
    }, ms)

    return () => {
      if (interval.current) clearInterval(interval.current)
    }
  }, [setIsConnected, supabase, ms])

  return (
    <Tooltip
      label={
        <span className="inline-flex items-center gap-[1ch]">
          {isConnected ? <IconCheck size={16} color="teal" /> : <IconX size={16} color="orange" />}
          Connection: <b>{connectionState}</b>
        </span>
      }
      position="left"
      offset={16}
      withArrow
      arrowSize={5}
    >
      <Badge
        component="button"
        onClick={() => injectedUpdateCallback((v) => v + 1)}
        variant="dot"
        color={isConnected ? 'teal' : 'orange'}
        size="sm"
        className="shrink-0 cursor-pointer"
      >
        SYNC
      </Badge>
    </Tooltip>
  )
}
