/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sidebar: {
          bg: '#1A0B2E',       // Dark royal purple from screenshots
          card: '#24123E',
          hover: '#2E174E',
          active: '#3C1E66',
          border: '#331B54',
          text: '#C4B5FD',
        },
        coral: {
          50: '#FFF5F2',
          100: '#FFE6DF',
          200: '#FFCEBF',
          300: '#FFAA93',
          400: '#FF7D5D',
          500: '#FF5722',      // Vibrant Coral-Orange CTA from screenshot
          600: '#F04C18',
          700: '#D83E0E',
          800: '#B8320A',
        },
        brand: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#10B981',      // Emerald/Mint green for Live on-time & selected seats
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
      },
      boxShadow: {
        'ticket': '0 20px 40px -15px rgba(0, 0, 0, 0.08), 0 0 15px rgba(255, 87, 34, 0.06)',
        'floating': '0 25px 50px -12px rgba(26, 11, 46, 0.08)',
        'coral': '0 10px 25px -5px rgba(255, 87, 34, 0.35)',
      },
    },
  },
  plugins: [],
}
