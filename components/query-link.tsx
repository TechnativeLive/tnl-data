'use client';

import { useDidUpdate } from '@mantine/hooks';
import { Route } from 'next';
import { RouteType } from 'next/dist/lib/load-custom-routes';
import Link, { LinkProps } from 'next/link';
import { ReadonlyURLSearchParams, usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';

type QueryValue = string | number | boolean;

type QueryLinkProps = Omit<LinkProps<RouteType>, 'href'> & {
  query: Record<string, QueryValue>;
  removeOthers?: boolean;
};

function createSearchParams(
  query: Record<string, QueryValue>,
  searchParams: ReadonlyURLSearchParams,
  removeOthers = false,
) {
  console.count('createSearchParams');
  const newQuery = new URLSearchParams(searchParams);
  if (removeOthers) {
    newQuery.forEach((_, key) => {
      if (!(key in query)) {
        newQuery.delete(key);
      }
    });
  }
  for (const [key, value] of Object.entries(query)) {
    newQuery.set(key, value.toString());
  }
  return newQuery;
}

export function QueryLink({ query, removeOthers, ...props }: QueryLinkProps) {
  const pathname = usePathname();
  const currentSearchParams = useSearchParams();
  const [searchParams, setSearchParams] = useState(() =>
    createSearchParams(query, currentSearchParams, removeOthers),
  );

  useDidUpdate(() => {
    setSearchParams(createSearchParams(query, currentSearchParams, removeOthers));
  }, [query, removeOthers, currentSearchParams]);

  const href = `${pathname}?${searchParams.toString()}`;

  return <Link href={href as Route} {...props} />;
}
