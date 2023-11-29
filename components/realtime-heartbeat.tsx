'use client';

import { createBrowserClient } from '@/lib/db/client';
import { Badge, Tooltip } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useState, useEffect, useRef } from 'react';

export function RealtimeHeartbeat({ interval: ms = 1000 }) {
  const supabase = createBrowserClient();
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const interval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (interval.current) clearInterval(interval.current);

    interval.current = setInterval(() => {
      setIsConnected(supabase.realtime.isConnected());
    }, ms);

    return () => {
      if (interval.current) clearInterval(interval.current);
    };
  }, [setIsConnected, supabase, ms]);

  return (
    <Tooltip
      label={
        <span className="inline-flex items-center gap-[1ch]">
          {isConnected ? <IconCheck size={16} color="teal" /> : <IconX size={16} color="orange" />}
          Events are{!isConnected && <span className="italic"> not </span>} being synced across
          browsers
        </span>
      }
      position="left"
      offset={16}
      withArrow
      arrowSize={5}
    >
      <Badge variant="dot" color={isConnected ? 'teal' : 'orange'} size="sm" className="shrink-0">
        SYNC
      </Badge>
    </Tooltip>
  );
}
