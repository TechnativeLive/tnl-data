import { Aside } from '@/components/shell/aside';
import { createServerComponentClient } from '@/lib/db/server';

export default async function EventLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Record<string, string>;
}) {
  const supabase = createServerComponentClient();
  const { data, error } = await supabase
    .from('rounds')
    .select('slug, name, order')
    .eq('event', params.event)
    .order('order', { ascending: true, nullsFirst: true });
  console.log({ data });

  return (
    <>
      {children}
      <Aside>
        <div className="flex flex-col">
          {data?.map((round) => (
            <div key={round.slug}>{round.name}</div>
          ))}
        </div>
      </Aside>
    </>
  );
}
