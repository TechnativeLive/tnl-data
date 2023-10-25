import { Blockquote, Center } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

export default function HomePage() {
  return (
    <Center mt={120}>
      <Blockquote color="blue" icon={<IconInfoCircle />}>
        Select a sport from the menu to get started
      </Blockquote>
    </Center>
  );
}
