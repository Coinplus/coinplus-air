/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blueGray: '#F7F7FA',
      },
      width: {
        17: '4.25rem',
        86: '21.5rem',
      },
      height: {
        68: '17.188rem',
      },
    },
  },
  plugins: [],
};
