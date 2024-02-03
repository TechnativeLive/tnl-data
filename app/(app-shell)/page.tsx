import Login from '@/app/(login)/login/page';
import { SportStat, SportStatProp } from '@/components/sport-stat';
import { createServerClient } from '@/lib/db/server';
import { Stack } from '@mantine/core';
import { classifyEventsByDate } from '@/lib/dates';
import { Debug } from '@/components/debug';
import { Info } from '@/components/info';
import Link from 'next/link';
// import 'array-grouping-polyfill';

export default async function HomePage() {
  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return <Login />;

  const { data, error } = await supabase
    .from('events')
    .select('starts_at, ends_at, sport, sports!inner(name)');
  // TODO: smart sql select to group by date/category and add dividers for each section

  const dataGroupedBySport = data?.reduce((acc, event) => {
    event.sport in acc ? acc[event.sport].push(event) : (acc[event.sport] = [event]);
    return acc;
  }, {} as Record<string, NonNullable<typeof data>>);

  const classifiedData =
    dataGroupedBySport &&
    Object.entries(dataGroupedBySport).map(([sport, statData]) => {
      const classification = classifyEventsByDate(statData);
      const stat: SportStatProp = {
        label: statData[0].sports?.name || 'Unknown',
        slug: sport,
        count: statData.length,
        events: classification.map((c) => ({ label: c.label, count: c.data.length })),
      };
      return [sport, stat] as [typeof sport, typeof stat];
    });

  const sortedByCurrentEventCount =
    classifiedData && classifiedData.sort(([_, a], [__, b]) => a.label.localeCompare(b.label));

  return (
    <Stack className="flex-1 p-16">
      {error && <Debug data={error} label="error" className="mb-8" />}
      <Link
        href='/timers'
        className="active border bg-button rounded-lg px-3 py-1 flex gap-6 self-start"
      >Timers</Link>
      <Info title="Getting Started">Select a sport from the menu</Info>
      {!sortedByCurrentEventCount ? null : (
        <div className="mt-16 grid gap-md grid-cols-[repeat(auto-fill,minmax(160px,1fr))]">
          {sortedByCurrentEventCount.map(([sport, stat]) => (
            <SportStat stat={stat} key={sport} />
          ))}
        </div>
      )}
    </Stack>
  );
}
