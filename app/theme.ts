'use client';

import { ActionIcon, Button, UnstyledButton, createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'teal',
  activeClassName: 'active',
  components: {
    Button: Button.extend({
      defaultProps: {
        variant: 'default',
      },
    }),
    ActionIcon: ActionIcon.extend({
      defaultProps: {
        variant: 'default',
      },
    }),
  },
});
