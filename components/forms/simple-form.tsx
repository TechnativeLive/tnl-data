'use client';

import { useDidUpdate } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useRef } from 'react';
import { useFormState } from 'react-dom';

const defaultFormState = { message: null, success: false };

export type FormState<T> = {
  message: string | null;
  success: boolean;
  data?: T;
};

type SimpleFormAction<T> = (_prevState: FormState<T>, formData: FormData) => Promise<FormState<T>>;

export function SimpleForm<T>({
  action,
  reset,
  children,
  ...formProps
}: {
  action: SimpleFormAction<T>;
  reset?: boolean;
  children: React.ReactNode;
} & Omit<
  React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>,
  'action'
>) {
  const form = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(action, defaultFormState);

  useDidUpdate(() => {
    notifications.show({
      title: state.success ? 'Success' : 'Error',
      message: state.message,
      color: state.success ? 'teal' : 'red',
    });
  }, [state.success, state.message]);

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
