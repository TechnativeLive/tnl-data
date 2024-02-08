'use client';

import { Button, ButtonProps } from '@mantine/core';
import { useFormStatus } from 'react-dom';

export function SubmitButton(
  props: ButtonProps &
    Omit<
      React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
      'ref'
    >,
) {
  const { pending } = useFormStatus();

  return <Button loading={pending} type="submit" {...props} />;
}
