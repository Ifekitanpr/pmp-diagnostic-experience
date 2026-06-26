/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#e6f2ff',
          100: '#b0d6ff',
          200: '#7abaff',
          300: '#54a7ff',
          400: '#3395ff',
          500: '#007bff',
          600: '#0066ff',
          700: '#0052cc',
          800: '#073f96',
          900: '#142142',
        },
        sprint: {
          orange: '#ff6b35',
          purple: '#974ffc',
          green: '#22c55e',
          ink: '#030507',
          slate: '#334155',
        },
        // Used by the Landing page components (src/components/landing/*).
        primary: {
          50:  '#e6f2ff',
          100: '#b0d6ff',
          200: '#8ac2ff',
          400: '#3395ff',
          500: '#007bff',
          600: '#0066d6',
          700: '#0052ad',
        },
        accent: {
          50:  '#fff0eb',
          100: '#ffd1c0',
          200: '#ffbba2',
          500: '#ff6b35',
          600: '#e8551f',
          700: '#b54c26',
        },
        ink: '#030507',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 60px rgba(15, 23, 42, 0.08)',
        panel: '0 24px 80px rgba(0, 123, 255, 0.16)',
      },
    },
  },
  plugins: [],
}
