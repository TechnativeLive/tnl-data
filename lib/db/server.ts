/* eslint-disable no-restricted-imports */
import { createServerClient as _createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { cache } from 'react';

export const createServerClient = cache(() => {
  const cookieStore = cookies();

  return _createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    },
  );
});
