import type { Config } from 'tailwindcss'
import { colors as customColors } from './styles/colors'

const colors = {
  ...customColors,
  border: 'var(--border)',
  input: 'var(--input)',
  ring: 'var(--ring)',

  // <-- new Design System colors --->
  action: {
    DEFAULT: 'var(--action-default)',
    hover: 'var(--action-primary-hover)',
    pressed: 'var(--action-primary-pressed)',
    focus: 'var(--action-primary-focus)',
    disabled: 'var(--action-primary-disabled)'
  },

  // text
  foreground: {
    DEFAULT: 'var(--text-primary)',
    secondary: 'var(--text-secondary)',
    tertiary: 'var(--text-tertiary)',
    button: 'var(--text-onbutton-default)',
    btndisabled: 'var(--text-onbutton-disabled)'
  },

  background: {
    DEFAULT: 'var(--bg-primary)',
    contrast: 'var(--bg-primary-oncontrast)',

    secondary: {
      DEFAULT: 'var(--bg-secondary)',
      contrast: 'var(--bg-secondary-oncontrast)'
    }
  },

  success: {
    DEFAULT: 'var(--success)',
    secondary: 'var(--success-secondary)'
  },
  warning: {
    DEFAULT: 'var(--warning)',
    secondary: 'var(--warning-secondary)'
  },
  error: {
    DEFAULT: 'var(--error)',
    secondary: 'var(--error-secondary)'
  },
  info: {
    DEFAULT: 'var(--info)',
    secondary: 'var(--info-secondary)'
  },
  // <--- end new Design System colors --->

  primary: {
    DEFAULT: 'var(--primary)',
    foreground: 'var(--primary-foreground)'
  },
  secondary: {
    DEFAULT: 'var(--secondary)',
    foreground: 'var(--secondary-foreground)'
  },
  destructive: {
    DEFAULT: 'var(--destructive)',
    foreground: 'var(--destructive-foreground)'
  },
  muted: {
    DEFAULT: 'var(--muted)',
    foreground: 'var(--muted-foreground)'
  },
  accent: {
    DEFAULT: 'var(--accent)',
    foreground: 'var(--accent-foreground)'
  },
  popover: {
    DEFAULT: 'var(--popover)',
    foreground: 'var(--popover-foreground)'
  },
  card: {
    DEFAULT: 'var(--card)',
    foreground: 'var(--card-foreground)'
  }
}

// We want each package to be responsible for its own content.
const config: Omit<Config, 'content'> = {
  darkMode: ['class'],
  content: [`src/**/*.{js,ts,jsx,tsx}`, 'components/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem'
    },
    extend: {
      screens: {
        xs: '320px'
      },
      colors,
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: 'calc(var(--radius) - 4px)'
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        serif: ['var(--font-sans)']
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1rem' }],
        base: ['1rem', { lineHeight: '1.25rem' }],
        lg: ['1.125rem', { lineHeight: '1.5rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.75rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '3rem' }],
        '5xl': ['3rem', { lineHeight: '3rem' }],
        '6xl': ['3.75rem', { lineHeight: '3.75rem' }],
        '7xl': ['4.5rem', { lineHeight: '4.5rem' }],
        '8xl': ['6rem', { lineHeight: '6rem' }],
        '9xl': ['8rem', { lineHeight: '7rem' }]
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
}
export default config
