'use client';

import {
  ActionIcon,
  Button,
  createTheme,
  defaultVariantColorsResolver,
  lighten,
  parseThemeColor,
  rem,
} from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'teal',
  activeClassName: 'active',
  cursorType: 'pointer',
  black: 'var(--mantine-color-dark-7)',
  variantColorResolver: (input) => {
    const defaultResolvedColors = defaultVariantColorsResolver(input);
    const parsedColor = parseThemeColor({
      color: input.color || input.theme.primaryColor,
      theme: input.theme,
    });

    if (input.variant === 'filled') {
      return {
        ...defaultResolvedColors,
        border: `${rem(1)} solid ${lighten(parsedColor.value, 0.1)}`,
      };
    }

    return defaultResolvedColors;
  },
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
