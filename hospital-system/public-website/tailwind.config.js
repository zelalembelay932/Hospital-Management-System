/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#eaf6ff',
          100: '#d8efff',
          200: '#b7e0ff',
          300: '#88c9ff',
          400: '#58aefc',
          500: '#2f95f9',
          600: '#1977e6',
          700: '#145fb8',
          800: '#0f4989',
          900: '#0b3561',
        },
        primary: {
          50: '#eaf6ff',
          100: '#d8efff',
          200: '#b7e0ff',
          300: '#88c9ff',
          400: '#58aefc',
          500: '#2f95f9',
          600: '#1977e6',
          700: '#145fb8',
          800: '#0f4989',
          900: '#0b3561',
        },
        hospital: {
          blue: '#145fb8',
          light: '#2f95f9',
          teal: '#0d9488',
          green: '#10b981',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}