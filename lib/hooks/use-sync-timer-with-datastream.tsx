'use client'

import { createBrowserClient } from '@/lib/db/client'
import { DbTimer } from '@/lib/db/custom'
import { updateDatastream } from '@/lib/singular/datastream'
import { useEffect, useState } from 'react'

export function useSyncTimerWithDatastream({
  datastream,
  UTC,
  value,
  isRunning,
  end_hours: beginHours,
  end_mins: beginMinutes,
  end_secs: beginSeconds,
}: DbTimer) {
  const [dsKey, setDsKey] = useState<string | null>(null)
  const supabase = createBrowserClient()

  useEffect(() => {
    if (!datastream) return

    const fetchDatastream = async () => {
      const { data } = await supabase
        .from('ds_keys')
        .select('private')
        .eq('name', datastream)
        .single()
      setDsKey(data?.private ?? null)
    }

    fetchDatastream()
  }, [supabase, datastream])

  useEffect(() => {
    if (dsKey) {
      updateDatastream({
        privateKey: dsKey,
        body: {
          timer: { timeControl: { UTC, value, isRunning }, beginHours, beginMinutes, beginSeconds },
        },
      })
    }
  }, [dsKey, UTC, value, isRunning, beginHours, beginMinutes, beginSeconds])
}
