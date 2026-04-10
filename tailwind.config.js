/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#010408',
        'primary-light': '#020b15',
        'primary-dark': '#000000',
        metallic: '#C4A06A',
        'metallic-light': '#F2D47B',
        'metallic-dark': '#8B6B2E',
        dark: '#1A1A1A',
        'footer-dark': '#010408',
        'deep-black': '#01050a',
        'deep-black-light': '#020b15',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      borderRadius: {
        'none': '0',
        'sm': '8px',
        DEFAULT: '8px',
        'md': '8px',
        'lg': '8px',
        'xl': '8px',
        '2xl': '8px',
        '3xl': '8px',
        'full': '9999px',
      },
    },
  },
  plugins: [],
}
