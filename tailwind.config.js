/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#135bec',
        'primary-dark': '#0d4abf',
        'primary-light': '#3d7ef0',
        'background-light': '#f6f6f8',
        'background-dark': '#101622',
      },
      fontFamily: {
        display: ['Public Sans', 'Noto Sans KR', 'sans-serif'],
        body: ['Public Sans', 'Noto Sans KR', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
};
