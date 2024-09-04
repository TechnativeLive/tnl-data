const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: ['class', '[data-mantine-color-scheme=dark]'],
  theme: {
    colors: require('tailwindcss-open-color'),
    // boxShadow: {
    //   xs: '0 calc(0.0625rem * var(--mantine-scale)) calc(0.1875rem * var(--mantine-scale)) rgba(0, 0, 0, 0.05), 0 calc(0.0625rem * var(--mantine-scale)) calc(0.125rem * var(--mantine-scale)) rgba(0, 0, 0, 0.1)',
    //   sm: '0 calc(0.0625rem * var(--mantine-scale)) calc(0.1875rem * var(--mantine-scale)) rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0 calc(0.625rem * var(--mantine-scale)) calc(0.9375rem * var(--mantine-scale)) calc(-0.3125rem * var(--mantine-scale)), rgba(0, 0, 0, 0.04) 0 calc(0.4375rem * var(--mantine-scale)) calc(0.4375rem * var(--mantine-scale)) calc(-0.3125rem * var(--mantine-scale))',
    //   md: '0 calc(0.0625rem * var(--mantine-scale)) calc(0.1875rem * var(--mantine-scale)) rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0 calc(1.25rem * var(--mantine-scale)) calc(1.5625rem * var(--mantine-scale)) calc(-0.3125rem * var(--mantine-scale)), rgba(0, 0, 0, 0.04) 0 calc(0.625rem * var(--mantine-scale)) calc(0.625rem * var(--mantine-scale)) calc(-0.3125rem * var(--mantine-scale))',
    //   lg: '0 calc(0.0625rem * var(--mantine-scale)) calc(0.1875rem * var(--mantine-scale)) rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0 calc(1.75rem * var(--mantine-scale)) calc(1.4375rem * var(--mantine-scale)) calc(-0.4375rem * var(--mantine-scale)), rgba(0, 0, 0, 0.04) 0 calc(0.75rem * var(--mantine-scale)) calc(0.75rem * var(--mantine-scale)) calc(-0.4375rem * var(--mantine-scale))',
    //   xl: '0 calc(0.0625rem * var(--mantine-scale)) calc(0.1875rem * var(--mantine-scale)) rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0 calc(2.25rem * var(--mantine-scale)) calc(1.75rem * var(--mantine-scale)) calc(-0.4375rem * var(--mantine-scale)), rgba(0, 0, 0, 0.04) 0 calc(1.0625rem * var(--mantine-scale)) calc(1.0625rem * var(--mantine-scale)) calc(-0.4375rem * var(--mantine-scale))',
    // },
    screens: {
      xxs: '30em', // 480px
      xs: '36em',
      sm: '48em',
      md: '62em',
      lg: '75em',
      xl: '88em',
    },
    extend: {
      animationDuration: {
        DEFAULT: '300ms',
      },
      colors: {
        body: 'var(--mantine-color-body)',
        dimmed: 'var(--mantine-color-dimmed)',
        'body-dimmed': 'var(--mantine-color-body-dimmed)',
        'body-dimmed-hover': 'var(--mantine-color-body-dimmed-hover)',
        'dark-0': '#C1C2C5',
        'dark-1': '#A6A7AB',
        'dark-2': '#909296',
        'dark-3': '#5c5f66',
        'dark-4': '#373A40',
        'dark-5': '#2C2E33',
        'dark-6': '#25262b',
        'dark-7': '#1A1B1E',
        'dark-8': '#141517',
        'dark-9': '#101113',
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
        '.mx-content': {
          marginLeft: 'clamp(1rem, 10vw - 3.5rem, 16rem)',
          marginRight: 'clamp(1rem, 10vw - 3.5rem, 16rem)',
          // '@media (min-width: 1024px)': {
          //   marginLeft: 'clamp(1rem, 5vw, 10rem)',
          //   marginRight: 'clamp(1rem, 5vw, 10rem)',
          // }
        },
        '.-mx-content': {
          marginLeft: 'calc(0px - clamp(1rem, 10vw - 3.5rem, 16rem))',
          marginRight: 'calc(0px - clamp(1rem, 10vw - 3.5rem, 16rem))',
          // '@media (min-width: 1024px)': {
          //   marginLeft: 'clamp(1rem, 5vw, 10rem)',
          //   marginRight: 'clamp(1rem, 5vw, 10rem)',
          // }
        },
        '.px-content': {
          paddingLeft: 'clamp(1rem, 10vw - 3.5rem, 16rem)',
          paddingRight: 'clamp(1rem, 10vw - 3.5rem, 16rem)',
          // '@media (min-width: 1024px)': {
          //   paddingLeft: 'clamp(1rem, 5vw, 10rem)',
          //   paddingRight: 'clamp(1rem, 5vw, 10rem)',
          // }
        },
        '.-px-content': {
          paddingLeft: 'calc(0px - clamp(1rem, 10vw - 3.5rem, 16rem))',
          paddingRight: 'calc(0px - clamp(1rem, 10vw - 3.5rem, 16rem))',
          // '@media (min-width: 1024px)': {
          //   paddingLeft: 'clamp(1rem, 5vw, 10rem)',
          //   paddingRight: 'clamp(1rem, 5vw, 10rem)',
          // }
        },
        '.subgrid': {
          display: 'grid',
          'grid-template-columns': 'subgrid',
          'grid-template-rows': 'subgrid',
        },
        '.subgrid-cols': {
          display: 'grid',
          'grid-template-columns': 'subgrid',
        },
        '.subgrid-rows': {
          display: 'grid',
          'grid-template-rows': 'subgrid',
        },
      })
    }),

    plugin(({ addUtilities, matchUtilities, theme }) => {
      addUtilities({
        '.layout-content': {
          '--layout-gap-min': '1rem',
          '--layout-gap-max': '3rem',
          '--layout-gap-scale': '6vw',
          '--layout-gap':
            'clamp(var(--layout-gap-min), var(--layout-gap-scale), var(--layout-gap-max))',
          '--layout-full': 'minmax(var(--layout-gap), 1fr)',
          '--layout-content': 'min(50ch, 100% - var(--layout-gap) * 2)',
          '--layout-popout': 'minmax(0, 2rem)',
          '--layout-feature': 'minmax(0, 5rem)',

          display: 'grid',
          'grid-template-columns':
            '[full-start] var(--layout-full) [feature-start] var(--layout-feature) [popout-start] var(--layout-popout) [content-start] var(--layout-content) [content-end] var(--layout-popout) [popout-end] var(--layout-feature) [feature-end] var(--layout-full) [full-end]',
          '& > *': {
            'grid-column': 'content',
          },
        },
        '.layout-popout': {
          'grid-column': 'popout',
        },
        '.layout-feature': {
          'grid-column': 'feature',
        },
        '.layout-full': {
          'grid-column': 'full',
        },
      })

      matchUtilities(
        {
          'layout-gap-min': (modifier) => {
            const value = theme('spacing')[modifier] || modifier
            return {
              '--layout-gap-min': value,
            }
          },
          'layout-gap-max': (modifier) => {
            const value = theme('spacing')[modifier] || modifier
            return {
              '--layout-gap-max': value,
            }
          },
          'layout-content-min': (modifier) => {
            const value = theme('spacing')[modifier] || modifier
            return {
              '--layout-content': `min(${value}, 100% - var(--layout-gap) * 2)`,
            }
          },
          'layout-popout-size': (modifier) => {
            const value = theme('spacing')[modifier] || modifier
            return {
              '--layout-popout': `minmax(0, ${value})`,
            }
          },
          'layout-feature-size': (modifier) => {
            const value = theme('spacing')[modifier] || modifier
            return {
              '--layout-feature': `minmax(0, ${value})`,
            }
          },
        },
        { values: theme('spacing') },
      )

      matchUtilities(
        {
          'layout-gap-scale': (modifier) => {
            const value = theme('spacing')[modifier] || modifier
            return {
              '--layout-gap-scale': value,
            }
          },
        },
        {
          values: {
            DEFAULT: '6vw',
            1: '1vw',
            2: '2vw',
            3: '3vw',
            4: '4vw',
            5: '5vw',
            6: '6vw',
            7: '7vw',
            8: '8vw',
          },
        },
      )
    }),
  ],
}

function withOpacity(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`
    }
    return `rgb(var(${variable}) / ${opacityValue})`
  }
}
