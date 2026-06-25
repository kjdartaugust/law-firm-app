import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Lexara brand
        charcoal: {
          DEFAULT: '#1A1A1A',
          50: '#f6f6f6',
          800: '#222222',
          900: '#161616',
          950: '#0e0e0e',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E0C677',
          dark: '#A6863A',
          50: '#FBF7EC',
        },
        cream: '#F9F7F4',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        luxe: '0.18em',
      },
      boxShadow: {
        luxe: '0 24px 60px -20px rgba(26,26,26,0.35)',
        gold: '0 10px 40px -12px rgba(201,168,76,0.45)',
        glass: '0 8px 32px rgba(0,0,0,0.18)',
      },
      backgroundImage: {
        'gold-sheen': 'linear-gradient(135deg, #E0C677 0%, #C9A84C 45%, #A6863A 100%)',
        'charcoal-fade': 'linear-gradient(180deg, rgba(16,16,16,0.0) 0%, rgba(16,16,16,0.85) 100%)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s cubic-bezier(0.22,1,0.36,1)',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
