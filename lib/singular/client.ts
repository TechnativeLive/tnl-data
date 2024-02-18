import { SafeData } from '../utils';

export async function singular<T = unknown>(
  route: string,
  fetchOpts?: RequestInit,
): Promise<SafeData<T>> {
  const init = {
    ...fetchOpts,
    headers: {
      ...(fetchOpts?.body && { 'Content-Type': 'application/json' }),
      ...fetchOpts?.headers,
      Authorization: `Basic ${process.env.SINGULAR_AUTH}`,
    },
  };
  const res = await fetch(`https://app.singular.live${route}`, init);

  if (!res.ok) {
    return {
      data: undefined,
      error: { code: res.status, message: res.statusText },
    };
  }

  const data = await res.json();
  return { data, error: undefined };
}
