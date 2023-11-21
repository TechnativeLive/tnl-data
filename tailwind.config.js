const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: ['class', '[data-mantine-color-scheme=dark]'],
  theme: {
    colors: require('tailwindcss-open-color'),
    boxShadow: {
      xs: '0 calc(0.0625rem * var(--mantine-scale)) calc(0.1875rem * var(--mantine-scale)) rgba(0, 0, 0, 0.05), 0 calc(0.0625rem * var(--mantine-scale)) calc(0.125rem * var(--mantine-scale)) rgba(0, 0, 0, 0.1)',
      sm: '0 calc(0.0625rem * var(--mantine-scale)) calc(0.1875rem * var(--mantine-scale)) rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0 calc(0.625rem * var(--mantine-scale)) calc(0.9375rem * var(--mantine-scale)) calc(-0.3125rem * var(--mantine-scale)), rgba(0, 0, 0, 0.04) 0 calc(0.4375rem * var(--mantine-scale)) calc(0.4375rem * var(--mantine-scale)) calc(-0.3125rem * var(--mantine-scale))',
      md: '0 calc(0.0625rem * var(--mantine-scale)) calc(0.1875rem * var(--mantine-scale)) rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0 calc(1.25rem * var(--mantine-scale)) calc(1.5625rem * var(--mantine-scale)) calc(-0.3125rem * var(--mantine-scale)), rgba(0, 0, 0, 0.04) 0 calc(0.625rem * var(--mantine-scale)) calc(0.625rem * var(--mantine-scale)) calc(-0.3125rem * var(--mantine-scale))',
      lg: '0 calc(0.0625rem * var(--mantine-scale)) calc(0.1875rem * var(--mantine-scale)) rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0 calc(1.75rem * var(--mantine-scale)) calc(1.4375rem * var(--mantine-scale)) calc(-0.4375rem * var(--mantine-scale)), rgba(0, 0, 0, 0.04) 0 calc(0.75rem * var(--mantine-scale)) calc(0.75rem * var(--mantine-scale)) calc(-0.4375rem * var(--mantine-scale))',
      xl: '0 calc(0.0625rem * var(--mantine-scale)) calc(0.1875rem * var(--mantine-scale)) rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0 calc(2.25rem * var(--mantine-scale)) calc(1.75rem * var(--mantine-scale)) calc(-0.4375rem * var(--mantine-scale)), rgba(0, 0, 0, 0.04) 0 calc(1.0625rem * var(--mantine-scale)) calc(1.0625rem * var(--mantine-scale)) calc(-0.4375rem * var(--mantine-scale))',
    },
    extend: {
      animationDuration: {
        DEFAULT: '300ms',
      },
      colors: {
        dimmed: 'var(--mantine-color-dimmed)',
        'body-dimmed': 'var(--mantine-color-body-dimmed)',
        'body-dimmed-hover': 'var(--mantine-color-body-dimmed-hover)',
        'dark-1': 'var(--mantine-color-dark-1)',
        'dark-2': 'var(--mantine-color-dark-2)',
        'dark-3': 'var(--mantine-color-dark-3)',
        'dark-4': 'var(--mantine-color-dark-4)',
        'dark-5': 'var(--mantine-color-dark-5)',
        'dark-6': 'var(--mantine-color-dark-6)',
        'dark-7': 'var(--mantine-color-dark-7)',
        'dark-8': 'var(--mantine-color-dark-8)',
        'dark-9': 'var(--mantine-color-dark-9)',
      },
      spacing: {
        2.5: '0.625rem',
        xs: '0.625rem',
        sm: '0.75rem',
        md: '1rem',
        lg: '1.25rem',
        xl: '2rem',
      },
    },
  },
  plugins: [
    require('tailwindcss-animated'),

    plugin(({ addUtilities }) => {
      addUtilities({
        '.bg-button': {
          backgroundColor: 'var(--mantine-color-default)',
          '&:hover': {
            backgroundColor: 'var(--mantine-color-default-hover)',
          },
        },
      });
    }),
  ],
};
