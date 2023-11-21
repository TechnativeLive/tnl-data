'uce client';

import { Route } from 'next';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export function useSetSearchParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams);
      value ? params.set(name, value) : params.delete(name);

      return params.toString();
    },
    [searchParams]
  );

  const setQueryParams = useCallback(
    (name: string, value: string | null, replace = true) =>
      router[replace ? 'replace' : 'push'](
        (pathname + '?' + createQueryString(name, value)) as Route
      ),
    [router, pathname, createQueryString]
  );

  return setQueryParams;
}
