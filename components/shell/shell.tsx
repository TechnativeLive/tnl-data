'use client';

import {
  ActionIcon,
  AppShell,
  AppShellAside,
  AppShellHeader,
  AppShellMain,
  Divider,
  Group,
  Space,
  Text,
} from '@mantine/core';
import { IconSmartHome } from '@tabler/icons-react';
import { ThemeSwitcher } from '../theme-switcher';
import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import { EventOutline } from '@/components/shell/event-outline';
import { HeaderSegments } from '@/components/shell/header-segments';
import { Suspense } from 'react';
import ClientOnly from '@/components/client-only';
import { QuickProfile, QuickProfileProps } from '@/components/shell/quick-profile';

export function Shell({
  name,
  email,
  initials,
  children,
}: { children: React.ReactNode } & QuickProfileProps) {
  const pathname = usePathname();
  const params = useParams<Record<string, string>>();

  // const isHome = pathname === '/';
  // const isLogin = pathname.startsWith('/login');
  const isAsideOpen =
    params.sport &&
    params.event &&
    !pathname.endsWith('/edit') &&
    !pathname.endsWith('/debug') &&
    !pathname.includes('/climbing');
  const isHeaderSegmentsDisabled = pathname.startsWith('/timers');

  return (
    <AppShell
      header={{ height: 60 }}
      // navbar={{
      //   width: 300,
      //   breakpoint: 'sm',
      //   collapsed: { mobile: !isHome, desktop: !isHome && !isLogin },
      // }}
      aside={{ width: 250, breakpoint: 'md', collapsed: { desktop: !isAsideOpen, mobile: true } }}
    >
      <AppShellHeader>
        <Group h="100%" className="px-md" wrap="nowrap">
          <ActionIcon component={Link} href="/" className="leading-none" size={42}>
            <IconSmartHome />
          </ActionIcon>
          <Text
            component={Link}
            href="/"
            fw={700}
            className="px-md select-none rounded-md shrink-0"
          >
            TNL Data
          </Text>
          <Divider orientation="vertical" />
          {!isHeaderSegmentsDisabled && <HeaderSegments />}
          <Space ml="auto" />
          <ThemeSwitcher />
          <QuickProfile name={name} initials={initials} email={email} />
        </Group>
      </AppShellHeader>
      {/* <AppShellNavbar p="md">
        <AppShellSection>
          <Text fz="xs" fw="bold" c="dimmed" mb="sm">
            Projects
          </Text>
        </AppShellSection>
        <AppShellSection grow component={ScrollArea} className="-mr-[14px] pr-[14px]">
          {Object.entries(PROJECT_ICONS).map(([slug, Icon]) => (
            <Button
              key={slug}
              fullWidth
              leftSection={<Icon stroke={1.5} />}
              component={Link}
              href={slug as Route}
              justify="left"
              className="mb-2"
            >
              {slug
                .replaceAll('-', ' ')
                .split(' ')
                .map((part) => `${part.charAt(0).toLocaleUpperCase()}${part.substring(1)}`)
                .join(' ')}
            </Button>
          ))}
        </AppShellSection>
        <AppShellSection>
        </AppShellSection>
      </AppShellNavbar> */}
      <AppShellMain display="flex">{children}</AppShellMain>
      <AppShellAside withBorder={false} py="md" pr="md">
        <Suspense fallback={null}>
          <ClientOnly>
            <EventOutline />
          </ClientOnly>
        </Suspense>
      </AppShellAside>
    </AppShell>
  );
}
