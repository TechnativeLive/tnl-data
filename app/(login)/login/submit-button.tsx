'use client';
import { useFormStatus } from '@/lib/hooks/use-form-status';
import { Button, Loader } from '@mantine/core';

export function LoginSubmitButton({ label, disabled }: { label: string; disabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      mt="xl"
      type="submit"
      disabled={pending || disabled}
      className="rounded px-4 py-2 text-white mb-4 active:scale-95 transition-transform"
    >
      {pending ? <Loader size="xs" /> : label}
    </Button>
  );
}
