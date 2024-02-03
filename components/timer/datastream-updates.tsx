'use client';

import { createBrowserClient } from '@/lib/db/client';
import { DbTimer } from '@/lib/db/custom';
import { updateDatasream } from '@/lib/singular/datastream';
import { useEffect, useState } from 'react';

export function TimerDatastreamUpdates({
  datastream,
  UTC,
  value,
  isRunning,
  end_hours: beginHours,
  end_mins: beginMinutes,
  end_secs: beginSeconds,
}: Pick<
  DbTimer,
  'datastream' | 'UTC' | 'value' | 'isRunning' | 'end_hours' | 'end_mins' | 'end_secs'
>) {
  const [dsKey, setDsKey] = useState<string | null>(null);
  const supabase = createBrowserClient();
  useEffect(() => {
    if (!datastream) return;

    const fetchDatastream = async () => {
      const { data } = await supabase
        .from('ds_keys')
        .select('private')
        .eq('name', datastream)
        .single();
      setDsKey(data?.private ?? null);
    };

    fetchDatastream();
  }, [supabase, datastream]);

  useEffect(() => {
    if (dsKey) {
      updateDatasream(dsKey, {
        timer: { timeControl: { UTC, value, isRunning }, beginHours, beginMinutes, beginSeconds },
      });
    }
  }, [dsKey, UTC, value, isRunning, beginHours, beginMinutes, beginSeconds]);

  return null;
}
