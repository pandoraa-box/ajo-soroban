/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        ajo: {
          dark:           '#1E1D1B',
          'dark-surface': '#2C2B29',
          sidebar:        '#171615',
          'blue-light':   '#F6F2EA',
          lime:           '#D47253',
          'lime-soft':    '#F7ECE6',
          'lime-dark':    '#B65A3D',
          green:          '#16A34A',
          'green-light':  '#DCFCE7',
          bg:             '#FFFFFF',
          surface:        '#FAF8F3',
          border:         '#EBE8E1',
          muted:          '#73716D',
          amber:          '#F59E0B',
          'amber-light':  '#FEF3C7',
        },
      },
    },
  },
  plugins: [],
};
