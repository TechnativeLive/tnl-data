import { Alert } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

export function Info({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Alert color="blue" icon={<IconInfoCircle />} title={title}>
      {children}
    </Alert>
  );
}
