'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { IconArrowLeft } from '@tabler/icons-react';
import { ActionIcon } from '@mantine/core';

export function BackButton({
  className,
  toRoot = false,
}: {
  className?: string;
  toRoot?: boolean;
}) {
  const pathname = usePathname();
  const target = getTargetPath(pathname, toRoot);

  if (!target || target === pathname) return null;

  return (
    <Link
      href={target}
      className={clsx('fixed block left-4 top-4 pt-[var(--app-shell-header-height)]', className)}
    >
      <ActionIcon size={42}>
        <IconArrowLeft />
      </ActionIcon>
    </Link>
  );
}

function getTargetPath(pathname: string, toRoot?: boolean) {
  if (toRoot) return '/';

  if (!pathname) return null;

  const segments = pathname.split('/');
  const target = segments.slice(0, segments.length - 1).join('/');

  return target;
}
