import { Blockquote } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import classes from './info.module.css';

export function Info({ dimmed, children }: { dimmed?: boolean; children: React.ReactNode }) {
  return (
    <Blockquote
      color="blue"
      icon={<IconInfoCircle />}
      className={classes.root}
      classNames={{
        icon: classes.icon,
      }}
      data-dimmed={dimmed}
    >
      {children}
    </Blockquote>
  );
}
