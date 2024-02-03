'use client';

import { Select } from '@/components/select';
import { createBrowserClient } from '@/lib/db/client';
import { DbTimer } from '@/lib/db/custom';
import { ActionIcon, Space } from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

export function TimerDatastreamSelection({ timer }: { timer: DbTimer }) {
  const supabase = createBrowserClient();
  const [selectedDatastream, setSelectedDatastream] = useState(timer.datastream);
  const [datastreams, setDatastreams] = useState<Pick<Tables<'ds_keys'>, 'name' | 'description'>[]>(
    [],
  );

  useEffect(() => {
    const fetchDatastreams = async () => {
      const { data } = await supabase
        .from('ds_keys')
        .select('name, description')
        .filter('kind', 'eq', 'timer');
      setDatastreams(data ?? []);
    };

    fetchDatastreams();
  }, [supabase]);

  const updateTimerDatastream = async () => {
    await supabase.from('timers').update({ datastream: selectedDatastream }).eq('id', timer.id);
  };

  return (
    <div className="flex gap-2 items-end">
      <Select
        label="Datastream"
        value={selectedDatastream}
        onChange={(e) => setSelectedDatastream(e)}
        data={datastreams.map((ds) => ({ label: ds.name, value: ds.name }))}
        searchable
      />
      {selectedDatastream !== timer.datastream ? (
        <ActionIcon className="hidd" mb={4} variant="light" onClick={updateTimerDatastream}>
          <IconDeviceFloppy />
        </ActionIcon>
      ) : (
        <Space w={28} h={28} mb={4} />
      )}
    </div>
  );
}
