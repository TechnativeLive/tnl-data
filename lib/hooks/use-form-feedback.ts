import { notifications } from '@mantine/notifications';
import { useEffect } from 'react';

export function useFormFeedback<T extends { message: string | null; success: boolean }>(state: T) {
  useEffect(() => {
    if (state.message) {
      notifications.show({
        color: state.success ? 'teal' : 'red',
        title: state.success ? 'Success' : 'Error - No Changes Made',
        message: state.message,
      });
    }
  }, [state]);
}
