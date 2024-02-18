'use client';

import { Button, Popover, PopoverDropdown, PopoverTarget, Text, Tooltip } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { IconCopy } from '@tabler/icons-react';
import { useState } from 'react';

export function DatastreamKeyCopyButton({
  value,
  timeout = 2000,
}: {
  value: string | number;
  timeout?: number;
}) {
  const [opened, setOpened] = useState(false);
  const clipboard = useClipboard({ timeout });
  const copy = () => clipboard.copy(value);

  return (
    <Popover
      opened={opened && clipboard.copied}
      onChange={setOpened}
      position="right"
      withArrow
      arrowSize={9}
    >
      <PopoverTarget>
        <Button
          className="font-mono"
          rightSection={<IconCopy size={18} />}
          onClick={() => {
            copy();
            setOpened(true);
          }}
        >
          {value}
        </Button>
      </PopoverTarget>
      <PopoverDropdown>
        <Text c="teal.4">Copied!</Text>
      </PopoverDropdown>
    </Popover>
  );
}
