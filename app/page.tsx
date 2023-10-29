import Login from '@/app/(login)/login/page';
import { SportStat, SportStatProp } from '@/components/sport-stat';
import { createServerComponentClient } from '@/lib/db/server';
import { Blockquote, Stack } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { classifyEventsByDate } from '@/lib/dates';
import { Debug } from '@/components/debug';

export default async function HomePage() {
  const supabase = createServerComponentClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return <Login />;

  const { data, error } = await supabase
    .from('events')
    .select('starts_at, ends_at, sport, sports!inner(name)');

  const dataGroupedBySport = data?.reduce((acc, event) => {
    if (!event.sport) return acc;
    const id = { name: event.sports!.name, slug: event.sport };
    acc.has(id) ? acc.get(id)!.push(event) : acc.set(id, [event]);
    return acc;
  }, new Map<{ name: string; slug: string }, typeof data>());

  const classifiedData =
    dataGroupedBySport &&
    Array.from(dataGroupedBySport.entries()).map(([sport, statData]) => {
      const classification = classifyEventsByDate(statData);
      const stat: SportStatProp = {
        label: sport.name,
        slug: sport.slug,
        count: statData.length,
        unknownCount: classification[0].data.length,
        activeCount: classification[1].data.length,
      };
      return [sport, stat] as [typeof sport, typeof stat];
    });

  const sortedByCurrentEventCount =
    classifiedData && classifiedData.sort(([_, a], [__, b]) => a.label.localeCompare(b.label));

  return (
    <Stack className="flex-1 p-16">
      <Blockquote color="blue" icon={<IconInfoCircle />}>
        Select a sport from the menu to get started
      </Blockquote>
      <Debug data={data} />
      {!sortedByCurrentEventCount ? null : (
        <div className="mt-16 grid gap-md grid-cols-[repeat(auto-fill,minmax(160px,1fr))]">
          {sortedByCurrentEventCount.map(([sport, stat]) => (
            <SportStat stat={stat} key={sport.slug} />
          ))}
        </div>
      )}
    </Stack>
  );
}
