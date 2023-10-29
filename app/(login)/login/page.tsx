import Link from 'next/link';
import { Center, TextInput, Title } from '@mantine/core';
import { LoginSubmitButton } from '@/app/(login)/login/submit-button';

export default function Login({ searchParams }: { searchParams?: Record<string, string> }) {
  const emailError = searchParams?.email;
  const passwordError = searchParams?.password;

  return (
    <Center className="flex-1">
      <form
        className="w-full max-w-[300px] flex flex-col justify-center gap-2"
        action="/auth/sign-in"
        method="post"
      >
        <Title size="h4" mb="xl">
          Log In
        </Title>

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
