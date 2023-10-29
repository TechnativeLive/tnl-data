'use client';

import {
  ActionIcon,
  AppShell,
  Avatar,
  Button,
  Divider,
  Group,
  ScrollArea,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { IconChevronRight, IconSmartHome, IconIceSkating } from '@tabler/icons-react';
import { ThemeSwitcher } from '../theme-switcher';
import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import { AsideNav, asideEnabledRoutes } from '@/components/shell/aside-nav';
import { HeaderSegments } from '@/components/shell/header-segments';

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams<Record<string, string>>();

  const isHome = pathname === '/';
  const isLogin = pathname.startsWith('/login');
  const isAsideOpen = asideEnabledRoutes.some((fn) => fn({ pathname, params }));

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !isHome, desktop: !isHome && !isLogin },
      }}
      aside={{ width: 220, breakpoint: 'md', collapsed: { desktop: !isAsideOpen, mobile: true } }}
      className="p-md dark:bg-gray-9"
    >
      <AppShell.Header>
        <Group h="100%" className="px-md">
          <ActionIcon component={Link} href="/" className="leading-none" size={42}>
            <IconSmartHome />
          </ActionIcon>
          <Title size="sm" className="px-md select-none">
            TNL Data
          </Title>
          <Divider orientation="vertical" />
          <HeaderSegments />
          <ThemeSwitcher />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <AppShell.Section>
          <Text fz="xs" fw="bold" c="dimmed" mb="sm">
            Projects
          </Text>
        </AppShell.Section>
        <AppShell.Section grow component={ScrollArea} className="-mr-[14px] pr-[14px]">
          <Button
            component={Link}
            href="/ice-skating"
            justify="left"
            leftSection={<IconIceSkating stroke={1.5} />}
            fullWidth
          >
            Ice Skating
          </Button>
        </AppShell.Section>
        <AppShell.Section>
          <UnstyledButton
            component={Link}
            href="/account"
            className="flex gap-4 items-center bg-button rounded-lg p-sm w-full"
          >
            <Avatar color="teal">TN</Avatar>
            <Stack gap={1} className="grow">
              <Text>User Name</Text>
              <Text size="sm" c="dimmed">
                Email
              </Text>
            </Stack>
            <IconChevronRight size={14} />
          </UnstyledButton>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main display="flex" pos="relative">
        {children}
      </AppShell.Main>
      <AppShell.Aside withBorder={false} p="md" className="opacity-0 cursor-none" />
    </AppShell>
  );
}
