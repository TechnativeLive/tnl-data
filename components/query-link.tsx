'use client';

import { useDidUpdate } from '@mantine/hooks';
import clsx from 'clsx';
import { Route } from 'next';
import { RouteType } from 'next/dist/lib/load-custom-routes';
import Link, { LinkProps } from 'next/link';
import { ReadonlyURLSearchParams, usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';

type QueryValue = string | number | boolean;

type QueryLinkProps = Omit<LinkProps<RouteType>, 'href'> & {
  query: Record<string, QueryValue | undefined>;
  removeOthers?: boolean;
  disabled?: boolean;
};

function createSearchParams(
  query: QueryLinkProps['query'],
  searchParams: ReadonlyURLSearchParams,
  removeOthers = false,
) {
  const newQuery = new URLSearchParams(searchParams);
  if (removeOthers) {
    newQuery.forEach((_, key) => {
      if (!(key in query)) {
        newQuery.delete(key);
      }
    });
  }
  for (const [key, value] of Object.entries(query)) {
    if (value) {
      newQuery.set(key, value.toString());
    } else {
      newQuery.delete(key);
    }
  }
  return newQuery;
}

export function QueryLink({ query, removeOthers, disabled, ...props }: QueryLinkProps) {
  const pathname = usePathname();
  const currentSearchParams = useSearchParams();
  const [searchParams, setSearchParams] = useState(() =>
    createSearchParams(query, currentSearchParams, removeOthers),
  );

  useDidUpdate(() => {
    setSearchParams(createSearchParams(query, currentSearchParams, removeOthers));
  }, [query, removeOthers, currentSearchParams]);

  const href = `${pathname}?${searchParams.toString()}`;

  return (
    <Link
      href={href as Route}
      className={clsx(props.className, disabled && 'pointer-events-none')}
      {...(disabled && {
        'aria-disabled': true,
        tabIndex: -1,
      })}
      {...props}
    />
  );
}
