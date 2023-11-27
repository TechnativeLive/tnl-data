import { Avatar, Stack, Text } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';

export type QuickProfileProps = { name?: string; email?: string; initials: string };

export async function QuickProfile({ name, email, initials }: QuickProfileProps) {
  return (
    <Link
      href="/account"
      className="active flex gap-4 items-center bg-button rounded-lg p-sm w-full active:bg-body-dimmed"
    >
      <Avatar color="teal">{initials}</Avatar>
      <Stack gap={1} className="grow">
        <Text>{name}</Text>
        <Text size="sm" c="dimmed">
          {email}
        </Text>
      </Stack>
      <IconChevronRight size={14} />
    </Link>
  );
}
