import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const createQueryString = (
  pathname: string,
  router: AppRouterInstance,
  name: string,
  value: string,
) => {
  let searchParams = new URLSearchParams(window.location.search);
  if (value) {
    if (!Array.isArray(value)) {
      if (!searchParams.has(name)) searchParams.append(name, value);
      else searchParams.set(name, value);
    } else {
      if (!searchParams.has(name)) searchParams.append(name, value.join());
      else searchParams.set(name, value.join());
    }
  } else if (searchParams.has(name)) searchParams.delete(name);
  const newUrl = pathname + '?' + searchParams.toString();
  router.push(newUrl);
};
