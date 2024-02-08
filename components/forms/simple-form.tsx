'use client';

import { createEntrant } from '@/app/(app-shell)/entrants/actions';
import { useDidUpdate } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useRef } from 'react';
import { useFormState } from 'react-dom';

export type FormState<T> = {
  message: string | null;
  success: boolean;
  data?: T;
};

export function SimpleForm({
  reset,
  children,
  ...formProps
}: {
  reset?: boolean;
  children: React.ReactNode;
} & React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>) {
  const form = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(createEntrant, { message: null, success: false });

  useDidUpdate(() => {
    notifications.show({
      title: state.success ? 'Success' : 'Error',
      message: state.message,
      color: state.success ? 'teal' : 'red',
    });
  }, [state.success]);

  return (
    <form
      {...formProps}
      ref={form}
      action={async (formData) => {
        formAction(formData);
        if (reset) form.current?.reset();
      }}
    >
      {children}
    </form>
  );
}
