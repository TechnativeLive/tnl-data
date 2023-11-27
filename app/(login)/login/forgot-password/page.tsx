import { LoginSubmitButton } from '@/app/(login)/login/submit-button';
import { Center, Text, TextInput, Title } from '@mantine/core';
import Link from 'next/link';

export default function Reset({ searchParams }: { searchParams: Record<string, string> }) {
  const error = searchParams?.error;
  const message = searchParams?.message;

  return (
    <Center className="flex-1 p-8">
      <form
        className="w-full max-w-[300px] flex flex-col justify-center gap-2"
        action="/auth/reset-password"
        method="post"
      >
        <Title size="h4">Reset Your Password</Title>
        <Text mb="xl" size="sm" c="dimmed">
          Type in your email and we&apos;ll send you a link to reset your password
        </Text>
        <TextInput
          name="email"
          label="Email"
          aria-label="Email"
          type="email"
          required
          defaultValue="judge@technative.live"
        />
        <LoginSubmitButton label="Reset" disabled={!!message} />
        {!message ? null : (
          <Text c="blue" className="text-center" my="md">
            {message}
          </Text>
        )}
        {!error ? null : (
          <Text c="red" className="text-center" my="md">
            {error}
          </Text>
        )}
        <p className="text-center text-sm">
          <span className="text-dimmed">Already have an account?</span>{' '}
          <Link href="/login" className="underline-offset-2 underline">
            Sign in
          </Link>
        </p>
      </form>
    </Center>
  );
}
