import { Center, Text, Title } from '@mantine/core';
import { LoginSubmitButton } from '@/app/(login)/login/submit-button';
import { createServerComponentClient } from '@/lib/db/server';

export default async function AccountPage() {
  const supabase = createServerComponentClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  let user: Tables<'profiles'> | null = null;
  if (session?.user.id) {
    const res = await supabase.from('profiles').select().single();

    if (res.data) {
      user = res.data;
    }
  }

  return (
    <Center className="flex-1">
      <form
        className="w-full max-w-[300px] flex flex-col justify-center gap-2"
        action="/auth/sign-out"
        method="post"
      >
        {!user ? null : (
          <Title size="h3">
            {user.first_name} {user.last_name}
          </Title>
        )}
        <Title size="h4">{session?.user.email}</Title>

        <Text c="dimmed" size="xs">
          {session?.user.id}
        </Text>

        <LoginSubmitButton label="Sign Out" />
      </form>
    </Center>
  );
}
