import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Warm grey scale (stone-based, NOT zinc/slate)
        grey: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          925: '#151413',
          950: '#0f0f0f',
        },
        // Accent - warm stone grey for primary actions
        accent: {
          DEFAULT: '#57534e',
          hover: '#44403c',
          active: '#292524',
          soft: 'rgba(87, 83, 78, 0.08)',
        },
        // Polkadot pink - for notifications/alerts ONLY (not primary UI)
        pink: {
          DEFAULT: '#ff2867',
          hover: '#e6164f',
          active: '#cc0040',
          soft: 'rgba(255, 40, 103, 0.1)',
        },
        // Brand color - used for primary highlights, game accents, active states
        brand: {
          DEFAULT: 'var(--color-brand)',
          hover: 'var(--color-brand-hover)',
          soft: 'var(--color-brand-soft)',
        },
        // Player identities — Okabe-Ito, colour-vision-deficiency safe.
        // Single source of truth is src/lib/games/playerTheme.ts; these tokens
        // exist so boards can use them in class names. Never write a raw red or
        // blue for a player: red/blue is the pair that collapses under
        // deuteranopia, which is what these replaced.
        'player-x': '#0072B2',
        'player-o': '#D55E00',
        // Okabe-Ito palette, for boards whose pieces are a set rather than two
        // sides. Replaces a red/green/blue/yellow/purple palette whose
        // red-vs-green pair is the commonest confusion there is.
        'oi-orange': '#E69F00',
        'oi-sky': '#56B4E9',
        'oi-green': '#009E73',
        'oi-yellow': '#F0E442',
        'oi-blue': '#0072B2',
        'oi-vermillion': '#D55E00',
        'oi-purple': '#CC79A7',
        // Semantic colors
        success: '#059669',
        error: '#dc2626',
        warning: '#d97706',
        // Semantic surface aliases
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        'surface-secondary': 'var(--color-surface-secondary)',
        border: 'var(--color-border)',
        'border-strong': 'var(--color-border-strong)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-tertiary': 'var(--color-text-tertiary)',
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['DM Serif Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      fontSize: {
        'display-1': ['clamp(4rem, 8vw + 2rem, 8rem)', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        'display-2': ['clamp(3rem, 6vw + 1.5rem, 6rem)', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        'display-3': ['clamp(2.5rem, 5vw + 1rem, 4.5rem)', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        h1: ['clamp(2.5rem, 4vw + 1rem, 4rem)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        h2: ['clamp(2rem, 3vw + 0.75rem, 3rem)', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
        h3: ['clamp(1.75rem, 2.5vw + 0.5rem, 2.5rem)', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        h4: ['clamp(1.5rem, 2vw + 0.5rem, 2rem)', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'body-lg': ['clamp(1.125rem, 1vw + 0.5rem, 1.25rem)', { lineHeight: '1.625' }],
        base: ['1rem', { lineHeight: '1.625' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        caption: ['0.813rem', { lineHeight: '1.4' }],
        label: ['0.75rem', { lineHeight: '1.3' }],
        code: ['0.875rem', { lineHeight: '1.6' }],
      },
      letterSpacing: {
        tighter: '-0.03em',
        tight: '-0.02em',
        snug: '-0.01em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
      },
      lineHeight: {
        tight: '1.2',
        snug: '1.375',
        normal: '1.625',
        relaxed: '1.75',
        loose: '2',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      maxWidth: {
        'prose-narrow': '45ch',
        prose: '65ch',
        'prose-wide': '80ch',
        'container-narrow': '768px',
        'container-standard': '1024px',
        'container-wide': '1280px',
      },
      boxShadow: {
        xs: '0 1px 2px rgba(0, 0, 0, 0.04)',
        sm: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        DEFAULT: '0 4px 16px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)',
        md: '0 8px 24px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.04)',
        lg: '0 12px 40px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.06)',
        xl: '0 20px 60px rgba(0, 0, 0, 0.16), 0 8px 16px rgba(0, 0, 0, 0.08)',
        '2xl': '0 25px 80px rgba(0, 0, 0, 0.2), 0 10px 20px rgba(0, 0, 0, 0.1)',
        'brutal-hint': '2px 2px 0 0 rgba(0, 0, 0, 0.08)',
        'brutal-hint-lg': '4px 4px 0 0 rgba(0, 0, 0, 0.1)',
        focus: '0 0 0 4px rgba(87, 83, 78, 0.08)',
        'focus-strong': '0 0 0 4px rgba(87, 83, 78, 0.16)',
        'accent-sm': '0 2px 8px rgba(87, 83, 78, 0.25)',
        'accent-md': '0 4px 16px rgba(87, 83, 78, 0.35)',
        'accent-lg': '0 8px 24px rgba(87, 83, 78, 0.4)',
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
      },
      borderWidth: {
        DEFAULT: '1px',
        '0': '0px',
        '2': '2px',
        '3': '3px',
        '4': '4px',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.16, 1, 0.3, 1)',
        spring: 'cubic-bezier(0.19, 1, 0.22, 1)',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      transitionDuration: {
        '250': '250ms',
        '400': '400ms',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.5s ease-out',
        'slide-in-left': 'slide-in-left 0.5s ease-out',
        shimmer: 'shimmer 1.5s ease-in-out infinite',
        spin: 'spin 1s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
