'use client';

import {
  ActionIcon,
  AppShell,
  Avatar,
  Button,
  Group,
  Stack,
  Text,
  Title,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import { IconChevronRight, IconSmartHome, IconIceSkating } from '@tabler/icons-react';
import { ThemeSwitcher } from './theme-switcher';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const collapsed = pathname !== '/';

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: collapsed, desktop: collapsed },
      }}
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
          <Title size="sm" mr="auto">
            TNL Interfaces
          </Title>
          <ThemeSwitcher />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <Text fz="xs" fw="bold" c="dimmed" mb="sm">
          Projects
        </Text>
        <Link href="/ice-skating">
          <Button justify="left" leftSection={<IconIceSkating />} variant="default" fullWidth>
            Ice Skating
          </Button>
        </Link>
        <UnstyledButton
          mt="auto"
          className="hover:bg-[var(--mantine-color-default-hover)] rounded-lg"
          p="sm"
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
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
