import Link from 'next/link';
import { Center, TextInput, Title } from '@mantine/core';
import { LoginSubmitButton } from '@/app/(login)/login/submit-button';
import { createServerClient } from '@/lib/db/server';
import { redirect } from 'next/navigation';

export default async function Login({ searchParams }: { searchParams?: Record<string, string> }) {
  const redirectTo = searchParams?.redirectTo;
  const emailError = searchParams?.email;
  const passwordError = searchParams?.password;

  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect(redirectTo ? decodeURIComponent(redirectTo) : '/');
  }

  return (
    <Center className="flex-1 p-8">
      <form
        className="w-full max-w-[300px] flex flex-col justify-center gap-2"
        action="/auth/sign-in"
        method="post"
      >
        <Title size="h4" mb="xl">
          Log In
        </Title>

        {!!redirectTo && (
          <input name="redirectTo" type="hidden" value={decodeURIComponent(redirectTo)} />
        )}

        <TextInput
          name="email"
          label="Email"
          aria-label="Email"
          type="email"
          required
          defaultValue="ross@technative.live"
          error={emailError}
        />

        <TextInput
          name="password"
          label="Password"
          aria-label="Password"
          type="password"
          required
          placeholder="••••••••"
          error={passwordError}
          mb="xl"
        />

        <LoginSubmitButton label="Sign In" />
        <Link
          href="/login/forgot-password"
          className="text-sm underline-offset-2 text-center text-dimmed underline"
        >
          Forgot your password?
        </Link>
      </form>
    </Center>
  );
}
