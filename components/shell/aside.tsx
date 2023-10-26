'use client';

import { useReducer, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * Aside
 *
 * This component is used to render content in the aside of the AppShell.
 * If multiple Aside components are rendered, all contents are appended (order unknown).
 *
 * We provide enables routes based on pathname/params to determine if the aside should be open ***on the first rendered***.
 * We could check for contents every time pathname changes, but a ref would be null on the first render.
 */

export const asideEnabledRoutes: (({
  pathname,
  params,
}: {
  pathname: string;
  params: Record<string, string>;
}) => boolean)[] = [({ pathname, params }) => pathname.startsWith(`/ice-skating/${params.event}`)];

export function Aside({ children }: { children: React.ReactNode }) {
  const aside = useRef<HTMLElement>();
  useEffect(() => {
    aside.current = document.getElementById('#aside') ?? undefined;
  }, []);

  return !aside.current ? null : createPortal(children, aside.current);
}
