'use client';

import { ActionIcon, Button, createTheme } from '@mantine/core';

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
  fontFamilyMonospace:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
});
