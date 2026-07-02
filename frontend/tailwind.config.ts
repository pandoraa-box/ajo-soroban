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
          // ── Earthy Dark (Claude-inspired charcoal) ──
          dark:           '#1E1D1B',
          'dark-surface': '#2C2B29',
          sidebar:        '#171615',
          'blue-light':   '#F6F2EA',  // warm cream tint
          // ── Coral/Terracotta (Claude-inspired primary) ──
          lime:           '#D47253',
          'lime-soft':    '#F7ECE6',
          'lime-dark':    '#B65A3D',
          // ── Greens ──
          green:          '#16A34A',
          'green-light':  '#DCFCE7',
          // ── Neutrals (White & Light Cream) ──
          bg:             '#FFFFFF',
          surface:        '#FAF8F3',
          border:         '#EBE8E1',
          muted:          '#73716D',
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
        serif: ['Newsreader', 'ui-serif', 'Georgia', 'serif'],
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
