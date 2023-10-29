const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    colors: require('tailwindcss-open-color'),
    extend: {
      animationDuration: {
        DEFAULT: '300ms',
      },
      colors: {
        dimmed: 'var(--mantine-color-dimmed)',
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
