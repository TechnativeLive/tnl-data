'use client';

import { useParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { Route } from 'next';
import { throttleAndDebounce } from '@/lib/utils';
import { atom, useAtom, useAtomValue } from 'jotai';

const outlineRerenderStoreAtom = atom(0);
const outlineRerenderKeyAtom = atom((get) => get(outlineRerenderStoreAtom));

export const updateOutlineAtom = atom(null, (get, set) =>
  set(outlineRerenderStoreAtom, get(outlineRerenderStoreAtom) + 1)
);

// scroll margin above anchors
const PAGE_OFFSET = 83;

type OutlineItem = {
  title: string;
  href: string;
  level: number;
  children?: OutlineItem[];
};

export function EventOutline() {
  const params = useParams();
  const externalUpdate = useAtomValue(outlineRerenderKeyAtom);

  const containerRef = useRef(null);
  const styles = useActiveAnchor(containerRef);

  const [headers, setHeaders] = useState<OutlineItem[]>([]);
  useEffect(() => setHeaders(getHeaders()), [params.sport, params.event, externalUpdate]);

  return (
    <div
      className="flex flex-col pl-4 -ml-4 relative overflow-hidden border-l border-gray-3 dark:border-dark-4"
      ref={containerRef}
    >
      <div
        className="absolute h-[22px] mt-[3px] -ml-4 w-0.5 rounded-sm bg-violet-5 dark:bg-violet-3 transition-all duration-[250ms]"
        style={{ transform: `translateY(${styles.top})`, opacity: styles.opacity }}
      />
      <Headers headers={headers} />
    </div>
  );
}

function Headers({ headers, root = true }: { headers: OutlineItem[]; root?: boolean }) {
  return (
    <ul className={clsx('list-none m-0 p-0', !root ? 'pl-4' : 'relative')}>
      {headers.map((header) => (
        <li key={header.href} className="outline-item">
          <Link
            href={header.href as Route}
            className={clsx(
              'outline-link block text-sm font-medium leading-7 transition-colors overflow-hidden whitespace-nowrap text-ellipsis'
            )}
          >
            {header.title}
          </Link>
          {header.children && <Headers headers={header.children} root={false} />}
        </li>
      ))}
    </ul>
  );
}

function getHeaders() {
  const eventHeaders = Array.from(
    document.querySelectorAll('.event-header:where(h1,h2,h3,h4,h5,h6')
  );
  const headers = eventHeaders
    .filter((el) => el.id && el.hasChildNodes())
    .map((el) => ({ title: serializeHeader(el), href: `#${el.id}`, level: Number(el.tagName[1]) }));

  return resolveHeaders(headers);
}

function serializeHeader(h: Element): string {
  let ret = '';
  for (const node of h.childNodes) {
    if (node.nodeType === 1) {
      if ((node as Element).classList.contains('header-anchor')) {
        continue;
      }
      ret += node.textContent;
    } else if (node.nodeType === 3) {
      ret += node.textContent;
    }
  }
  return ret.trim();
}

function resolveHeaders(headers: OutlineItem[]) {
  // Nest sequential headers as children
  // https://github.com/vuejs/vitepress/blob/0761062790b441eccd0d57d51903271f30e713af/src/client/theme-default/composables/outline.ts#L59
  const ret: OutlineItem[] = [];
  outer: for (let i = 0; i < headers.length; i++) {
    const cur = headers[i];
    if (i === 0) {
      ret.push(cur);
    } else {
      for (let j = i - 1; j >= 0; j--) {
        const prev = headers[j];
        if (prev.level < cur.level) {
          (prev.children || (prev.children = [])).push(cur);
          continue outer;
        }
      }
      ret.push(cur);
    }
  }

  return ret;
}

export function useActiveAnchor(container: React.MutableRefObject<HTMLElement | null | undefined>) {
  const prevActiveLink = useRef<HTMLElement | null>();
  const [styles, setStyles] = useState({ top: '0px', opacity: '1' });

  const activateLink = useCallback(
    (linkHash: string | null) => {
      if (prevActiveLink.current) {
        prevActiveLink.current.classList.remove('active');
      }

      if (linkHash === null) {
        prevActiveLink.current = null;
      } else if (container.current) {
        prevActiveLink.current = container.current.querySelector<HTMLElement>(
          `a[href="${decodeURIComponent(linkHash)}"]`
        );
      }

      const activeLink = prevActiveLink.current;

      if (activeLink) {
        activeLink.classList.add('active');
        setStyles({ top: activeLink.offsetTop + 'px', opacity: '1' });
      } else {
        setStyles({ top: '0px', opacity: '0' });
      }
    },
    [prevActiveLink, container]
  );

  const setActiveLink = useCallback(() => {
    const links = Array.from(
      container.current?.querySelectorAll('.outline-link') ?? []
    ) as HTMLAnchorElement[];

    const anchors = (
      Array.from(document.querySelectorAll('.header-anchor')) as HTMLAnchorElement[]
    ).filter((anchor) => {
      return links.some((link) => link.hash === anchor.hash && anchor.offsetParent !== null);
    });

    const scrollY = window.scrollY;
    const isBottom = scrollY >= document.body.scrollHeight - document.body.offsetHeight;

    // page top - highlight first one
    if (anchors.length && scrollY === 0) {
      activateLink(anchors[0].hash);
      return;
    }

    // page bottom - highlight last one
    if (anchors.length && isBottom) {
      activateLink(anchors[anchors.length - 1].hash);
      return;
    }

    for (let i = 0; i < anchors.length; i++) {
      const anchor = anchors[i];
      const nextAnchor = anchors[i + 1];

      const [isActive, hash] = isAnchorActive(i, anchor, nextAnchor);

      if (isActive) {
        activateLink(hash);
        return;
      }
    }
  }, [activateLink, container]);

  const onScroll = useCallback(() => throttleAndDebounce(setActiveLink, 100)(), [setActiveLink]);

  useEffect(() => {
    window.requestAnimationFrame(setActiveLink);
    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, [setActiveLink, onScroll]);

  return styles;
}

function getAnchorTop(anchor: HTMLAnchorElement): number {
  return anchor.parentElement!.offsetTop - PAGE_OFFSET;
}

function isAnchorActive(
  index: number,
  anchor: HTMLAnchorElement,
  nextAnchor: HTMLAnchorElement | undefined
): [boolean, string | null] {
  const scrollTop = window.scrollY;

  if (index === 0 && scrollTop === 0) {
    return [true, null];
  }

  if (scrollTop < getAnchorTop(anchor)) {
    return [false, null];
  }

  if (!nextAnchor || scrollTop < getAnchorTop(nextAnchor)) {
    return [true, anchor.hash];
  }

  return [false, null];
}
