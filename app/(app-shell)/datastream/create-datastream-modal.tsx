'use client';

import { Modal, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export function CreateDatastreamModal({ children }: { children: React.ReactNode }) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal centered title="Create Datastream" opened={opened} onClose={close}>
        {children}
      </Modal>
      <Button onClick={open} variant="filled">
        Create Datastream
      </Button>
    </>
  );
}
