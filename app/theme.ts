'use client';

import { ActionIcon, Button, createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'teal',
  activeClassName: 'active',
  cursorType: 'pointer',
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
  headings: {
    sizes: {
      h1: {
        fontSize: 'calc(1.75rem * var(--mantine-scale))',
        lineHeight: '1.2',
      },
      h2: {
        fontSize: 'calc(1.5rem * var(--mantine-scale))',
        lineHeight: '1.25',
      },
      h3: {
        fontSize: 'calc(1.25rem * var(--mantine-scale))',
        lineHeight: '1.3',
      },
      h4: {
        fontSize: 'calc(1rem * var(--mantine-scale))',
        lineHeight: '1.35',
      },
      h5: {
        fontSize: 'calc(0.875rem * var(--mantine-scale))',
        lineHeight: '1.4',
      },
      h6: {
        fontSize: 'calc(0.75rem * var(--mantine-scale))',
        lineHeight: '1.4',
      },
    },
  },
});
