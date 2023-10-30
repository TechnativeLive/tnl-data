import { AsideNav } from '@/components/shell/aside-nav';
import { createServerComponentClient } from '@/lib/db/server';
import clsx from 'clsx';

export default async function EventLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Record<string, string>;
}) {
  const supabase = createServerComponentClient();
  const { data } = await supabase
    .from('rounds')
    .select('slug, name, order')
    .eq('event', params.event)
    .order('order', { ascending: true, nullsFirst: true });

  return (
    <>
      {children}
      <aside className={clsx('aside', 'event' in params && 'open')}>
        {data && (
          <AsideNav
            items={data?.map((round) => ({
              label: round.name,
              href: `/${params.sport}/${params.event}/${round.slug}`,
              id: round.slug,
            }))}
          />
        )}
      </aside>
    </>
  );
}

/**
 * TODO
 *
 * Rewrite ice-climbing to be generic dynamic route
 * add checks for errors and loading
 * add switches at each segment for events with no rounds / custom round layouts
 */
