import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ajo: {
          // ── Blues (Roadrunner-inspired navy / royal blue) ──
          dark:           '#1B3C8A',  // deep royal blue  — hero sections, headings, sidebar
          'dark-surface': '#1F4699',  // slightly lighter blue — inner cards on dark
          sidebar:        '#0D2552',  // darkest navy        — sidebar background
          'blue-light':   '#EEF2FF',  // very light blue     — surface tints on white pages
          // ── Orange (Roadrunner-inspired warm orange) ──
          lime:           '#F97316',  // vibrant orange  — primary CTA, highlights (kept "lime" token name)
          'lime-soft':    '#FFF3E8',  // very light orange
          'lime-dark':    '#EA6A08',  // darker orange — hover states
          // ── Greens (kept for positive / success only) ──
          green:          '#16A34A',
          'green-light':  '#DCFCE7',
          // ── Neutrals ──
          bg:             '#FAFAFA',
          surface:        '#F5F5F4',
          border:         '#E5E7EB',
          muted:          '#6B7280',
          // ── Status ──
          amber:          '#F59E0B',
          'amber-light':  '#FEF3C7',
        },
      },
      maxWidth: {
        '8xl': '88rem',
      },
      fontFamily: {
        sans: ['Satoshi', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease-out',
        'slide-up':   'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(16px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
      },
    },
  },
  plugins: [],
}

export default config
