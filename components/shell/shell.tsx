'use client';

import {
  ActionIcon,
  AppShell,
  AppShellAside,
  AppShellHeader,
  AppShellMain,
  AppShellNavbar,
  AppShellSection,
  Avatar,
  Button,
  Divider,
  Group,
  ScrollArea,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconChevronRight, IconSmartHome } from '@tabler/icons-react';
import { ThemeSwitcher } from '../theme-switcher';
import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import { EventOutline } from '@/components/shell/event-outline';
import { HeaderSegments } from '@/components/shell/header-segments';
import { Route } from 'next';
import { PROJECT_ICONS } from '@/components/project-icons';
import { Suspense } from 'react';
import ClientOnly from '@/components/client-only';

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams<Record<string, string>>();

  const isHome = pathname === '/';
  const isLogin = pathname.startsWith('/login');
  const isAsideOpen = params.sport && params.event && !pathname.endsWith('/edit');

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !isHome, desktop: !isHome && !isLogin },
      }}
      aside={{ width: 220, breakpoint: 'md', collapsed: { desktop: !isAsideOpen, mobile: true } }}
    >
      <AppShellHeader>
        <Group h="100%" className="px-md">
          <ActionIcon component={Link} href="/" className="leading-none" size={42}>
            <IconSmartHome />
          </ActionIcon>
          <Text component={Link} href="/" fw={700} className="px-md select-none">
            TNL Data
          </Text>
          <Divider orientation="vertical" />
          <HeaderSegments />
          <ThemeSwitcher />
        </Group>
      </AppShellHeader>
      <AppShellNavbar p="md">
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
          <Link
            href="/account"
            className="active flex gap-4 items-center bg-button rounded-lg p-sm w-full active:bg-body-dimmed"
          >
            <Avatar color="teal">TN</Avatar>
            <Stack gap={1} className="grow">
              <Text>User Name</Text>
              <Text size="sm" c="dimmed">
                Email
              </Text>
            </Stack>
            <IconChevronRight size={14} />
          </Link>
        </AppShellSection>
      </AppShellNavbar>
      <AppShellMain>{children}</AppShellMain>
      <AppShellAside withBorder={false} p="md">
        <Suspense fallback={null}>
          <ClientOnly>
            <EventOutline />
          </ClientOnly>
        </Suspense>
      </AppShellAside>
    </AppShell>
  );
}
