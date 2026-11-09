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
        // Design System from Image 1
        primary: {
          DEFAULT: '#B91C1C',
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C', // Exact Primary
          800: '#991B1B', // Exact Secondary
          900: '#7F1D1D',
          950: '#450A0A',
        },
        secondary: {
          DEFAULT: '#991B1B',
          hover: '#7F1D1D',
        },
        tertiary: {
          DEFAULT: '#F59E0B',
          50: '#FFFBEB',
          100: '#FEF3C7',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
        },
        neutral: {
          DEFAULT: '#1C1917',
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
          950: '#0C0A09',
        },
        warmbg: {
          DEFAULT: '#FBF9F7',
          card: '#FFFFFF',
          soft: '#F3EFEA',
          border: '#E7E2DA',
          muted: '#EFECE6',
        },
        sidebar: {
          bg: '#1C1917',       // Dark stone neutral from palette
          card: '#292524',
          hover: '#383330',
          active: '#B91C1C',     // Primary red active
          border: '#2E2A27',
          text: '#D6D3D1',
        },
        coral: {
          DEFAULT: '#B91C1C',
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#B91C1C',
          600: '#991B1B',
          700: '#7F1D1D',
        },
        brand: {
          DEFAULT: '#B91C1C',
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#10B981', // Emerald for status/on-time
          600: '#059669',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'ticket': '0 8px 24px -4px rgba(28, 25, 23, 0.06)',
        'floating': '0 16px 32px -8px rgba(28, 25, 23, 0.08)',
        'coral': '0 1px 3px 0 rgba(0, 0, 0, 0.06)',
        'card': '0 4px 16px -2px rgba(28, 25, 23, 0.04)',
      },
    },
  },
  plugins: [],
}
