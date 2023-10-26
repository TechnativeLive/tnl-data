'use client';

import {
  ActionIcon,
  AppShell,
  Avatar,
  Button,
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
import { useRef } from 'react';

const asideEnabledRoutes: (({
  pathname,
  params,
}: {
  pathname: string;
  params: Record<string, string>;
}) => boolean)[] = [({ pathname, params }) => pathname.startsWith(`/ice-skating/${params.event}`)];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams<Record<string, string>>();

  const isHome = pathname === '/';
  // const isLogin = pathname === '/login';

  const asideRef = useRef<HTMLDivElement>(null);

  const isAsideOpen = asideEnabledRoutes.some((fn) => fn({ pathname, params }));

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !isHome, desktop: !isHome },
      }}
      aside={{ width: 300, breakpoint: 'md', collapsed: { desktop: !isAsideOpen, mobile: true } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Link href="/" className="leading-none">
            {/* <Tooltip
              label="Home"
              offset={10}
              arrowPosition="side"
              arrowOffset={8}
              arrowSize={4}
              arrowRadius={2}
              withArrow
            > */}
            <ActionIcon variant="default" size={42}>
              <IconSmartHome />
            </ActionIcon>
            {/* </Tooltip> */}
          </Link>
          <Title size="sm">TNL Interfaces</Title>
          <Group className="grow" id="#header-content" />
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
          <Link href="/ice-skating">
            <Button
              justify="left"
              leftSection={<IconIceSkating stroke={1.5} />}
              variant="default"
              fullWidth
            >
              Ice Skating
            </Button>
          </Link>
        </AppShell.Section>
        <AppShell.Section>
          <Link href="/account">
            <UnstyledButton
              className="hover:bg-[var(--mantine-color-default-hover)] rounded-lg"
              p="sm"
              w="100%"
            >
              <Group>
                <Avatar color="teal">TN</Avatar>
                <Stack mr="auto" gap={1}>
                  <Text>User Name</Text>
                  <Text size="sm" c="dimmed">
                    Email
                  </Text>
                </Stack>
                <IconChevronRight size={14} />
              </Group>
            </UnstyledButton>
          </Link>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main display="flex">{children}</AppShell.Main>
      <AppShell.Aside p="md" id="#aside" />
    </AppShell>
  );
}
