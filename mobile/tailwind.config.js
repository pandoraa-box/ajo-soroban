/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        ajo: {
          dark:           '#1B3C8A',
          'dark-surface': '#1F4699',
          sidebar:        '#0D2552',
          'blue-light':   '#EEF2FF',
          lime:           '#F97316',
          'lime-soft':    '#FFF3E8',
          'lime-dark':    '#EA6A08',
          green:          '#16A34A',
          'green-light':  '#DCFCE7',
          bg:             '#FAFAFA',
          surface:        '#F5F5F4',
          border:         '#E5E7EB',
          muted:          '#6B7280',
          amber:          '#F59E0B',
          'amber-light':  '#FEF3C7',
        },
      },
    },
  },
  plugins: [],
};
