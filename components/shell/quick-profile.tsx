import {
  ActionIcon,
  Avatar,
  Popover,
  PopoverDropdown,
  PopoverTarget,
  Stack,
  Text,
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';
import styles from './quick-profile.module.css';

export type QuickProfileProps = { name?: string; email?: string; initials: string };

export function QuickProfile({ name, email, initials }: QuickProfileProps) {
  return !email ? null : (
    <Popover>
      <PopoverTarget>
        <Avatar component={ActionIcon} color="teal" classNames={{ root: styles.avatar }}>
          {initials}
        </Avatar>
      </PopoverTarget>
      <PopoverDropdown>
        <Link
          href="/account"
          className="active flex gap-4 items-center bg-button rounded-lg p-sm w-full active:bg-body-dimmed"
        >
          <Stack gap={1} className="grow">
            <Text>{name}</Text>
            <Text size="sm" c="dimmed">
              {email}
            </Text>
          </Stack>
          <IconChevronRight size={14} />
        </Link>
      </PopoverDropdown>
    </Popover>
  );
}
