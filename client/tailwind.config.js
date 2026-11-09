/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
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
        darkbg: {
          900: '#0F0619',
          800: '#160B24',
          700: '#1F1033',
          600: '#2A1645',
          border: '#371D5A',
        },
        coral: {
          50: '#FFF5F2',
          100: '#FFE6DF',
          200: '#FFCEBF',
          300: '#FFAA93',
          400: '#FF7D5D',
          500: '#FF5722',      // Vibrant Coral-Orange CTA
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
          500: '#10B981',      // Emerald green
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
      },
      boxShadow: {
        'ticket': '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
        'floating': '0 20px 30px -10px rgba(0, 0, 0, 0.08)',
        'coral': '0 2px 4px 0 rgba(0, 0, 0, 0.08)', // Clean subtle shadow without AI neon glow
      },
    },
  },
  plugins: [],
}
