import Login from '@/app/(login)/login/page';
import { createServerComponentClient } from '@/lib/db/server';
import { Blockquote, Center, Flex } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

export default async function HomePage() {
  const supabase = createServerComponentClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return <Login />;

  return (
    <Flex align="start" justify="center" mt={120} className="flex-1">
      <Blockquote color="blue" icon={<IconInfoCircle />}>
        Select a sport from the menu to get started
      </Blockquote>
    </Flex>
  );
}
