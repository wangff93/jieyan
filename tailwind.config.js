/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669'
        },
        accent: {
          DEFAULT: '#6366F1',
          light: '#818CF8',
          dark: '#4F46E5'
        },
        danger: '#EF4444',
        success: '#22C55E',
        background: {
          start: '#F0FDF4',
          end: '#EEF2FF'
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px'
      },
      boxShadow: {
        'card': '0 4px 20px rgba(16, 185, 129, 0.1)',
        'button': '0 4px 14px rgba(16, 185, 129, 0.3)'
      }
    },
  },
  plugins: [],
}
