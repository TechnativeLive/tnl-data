'use client';

import { createContext, Dispatch, SetStateAction, useState, useContext } from 'react';

export type HeaderSegment = { label: string; href: string; id: string | number };

const HeaderSegmentContext = createContext<
  { segments: HeaderSegment[]; setSegments: Dispatch<SetStateAction<HeaderSegment[]>> } | undefined
>(undefined);

export function HeaderSegmentsProvider({ children }: { children: React.ReactNode }) {
  const [segments, setSegments] = useState<HeaderSegment[]>([]);

  return (
    <HeaderSegmentContext.Provider value={{ segments, setSegments }}>
      {children}
    </HeaderSegmentContext.Provider>
  );
}

export function useHeaderSegments() {
  const context = useContext(HeaderSegmentContext);
  if (context === undefined) {
    throw new Error('useHeaderSegments must be used within a HeaderSegmentProvider');
  }
  return context;
}

export function SetHeaderSegments({ segments }: { segments: HeaderSegment[] }) {
  const { setSegments } = useHeaderSegments();
  setSegments(segments);
  return null;
}
