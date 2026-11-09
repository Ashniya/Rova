/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#00D053', // Reference vibrant bright green from the uploaded UI!
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
      },
      boxShadow: {
        'ticket': '0 20px 40px -15px rgba(0, 0, 0, 0.08), 0 0 15px rgba(0, 208, 83, 0.06)',
        'floating': '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
}
