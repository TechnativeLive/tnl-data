/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      animationDuration: {
        DEFAULT: '300ms',
      },
    },
  },
  plugins: [require('tailwindcss-animated')],
};
