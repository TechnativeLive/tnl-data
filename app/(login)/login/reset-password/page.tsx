import { LoginSubmitButton } from '@/app/(login)/login/submit-button';
import { Center, Title, TextInput, Text, Stack, Button } from '@mantine/core';
import Link from 'next/link';

export default function ResetPassword({ searchParams }: { searchParams: Record<string, string> }) {
  const success = !!searchParams.success;
  const error = searchParams.error;

  if (success) {
    return (
      <Center className="flex-1">
        <Stack gap="xs" w="100%" maw={300}>
          <Title size="h4" c="green">
            Success
          </Title>
          <Text mb="xl">Your password has been updated</Text>
          <Link href="/" className="text-center">
            <Button fullWidth>Back to Home</Button>
          </Link>
        </Stack>
      </Center>
    );
  }

  return (
    <Center className="flex-1">
      <form
        className="w-full max-w-[300px] flex flex-col justify-center gap-2"
        action="/auth/update-password"
        method="post"
      >
        <Title size="h4">Reset Your Password</Title>
        <Text mb="xl" size="sm" c="dimmed">
          Type in a new secure password and press save to update your password
        </Text>
        <TextInput
          name="password"
          label="Password"
          aria-label="Password"
          type="password"
          required
          placeholder="••••••••"
        />
        <LoginSubmitButton label="Update Password" />
        {!error ? null : <Text c="red">{error}</Text>}
      </form>
    </Center>
  );
}
