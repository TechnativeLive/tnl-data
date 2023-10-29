'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Route } from 'next';

export const asideEnabledRoutes: (({
  pathname,
  params,
}: {
  pathname: string;
  params: Record<string, string>;
}) => boolean)[] = [({ pathname, params }) => pathname.startsWith(`/ice-skating/${params.event}`)];

export function AsideNav({ items }: { items: { label: string; href: string; id: string }[] }) {
  const pathname = usePathname();
  const activeRouteIndex = items.findIndex((item) => pathname.endsWith(item.href));

  return (
    <div className="flex flex-col pl-4 -ml-4 -mt-2 relative overflow-hidden">
      <div
        className="absolute h-[22px] mt-[7px] -ml-4 w-0.5 rounded-sm bg-violet-2 transition-transform"
        style={{ transform: `translateY(${activeRouteIndex * 36}px)` }}
      />

      {items?.map((item, index) => (
        <Link
          key={item.id}
          href={item.href as Route}
          className={clsx(
            'text-sm leading-9 transition-colors overflow-hidden whitespace-nowrap text-ellipsis',
            index !== activeRouteIndex && 'text-dimmed'
          )}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
