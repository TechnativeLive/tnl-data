'use client';

import { AsideProvider } from '@/lib/context/aside';

export function Providers({ children }: { children: React.ReactNode }) {
  return <AsideProvider>{children}</AsideProvider>;
}
