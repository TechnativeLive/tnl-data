'use client';

import { HeaderSegmentsProvider } from '@/lib/context/header';

export function Providers({ children }: { children: React.ReactNode }) {
  return <HeaderSegmentsProvider>{children}</HeaderSegmentsProvider>;
}
