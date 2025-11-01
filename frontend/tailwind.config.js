/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { display: ['ui-sans-serif', 'system-ui', 'Inter', 'sans-serif'] },
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9eaff',
          200: '#b9d7ff',
          300: '#8dbdff',
          400: '#5a9bff',
          500: '#2f78ff',
          600: '#1d5ee6',
          700: '#184cba',
          800: '#153e96',
          900: '#133678'
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f'
        }
      }
    }
  },
  plugins: []
}
