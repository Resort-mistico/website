/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1d3f1c',
        'primary-light': '#2a5429',
        'primary-dark': '#152d14',
        metallic: '#C49A1A',
        'metallic-light': '#E8C840',
        'metallic-dark': '#A67D15',
        dark: '#111111',
        'green-tint': '#F2F7F2',
        'footer-dark': '#1B3D1B',
        'deep-black': '#1B3D1B',
        'deep-black-light': '#2D6A2D',
      },
      fontFamily: {
        sans: ['Comfortaa', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
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
