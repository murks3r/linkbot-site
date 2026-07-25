/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: { 950: '#05060a', 900: '#0a0c12', 800: '#10131c', 700: '#181c28' },
        bone: { 50: '#f5f4ef', 100: '#e8e6dc', 200: '#c8c5b8' },
        signal: { 400: '#7be0a8', 500: '#3fc487', 600: '#1ea56b' },
        alarm: { 400: '#e07b7b', 500: '#c44b4b' },
      },
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
      },
      letterSpacing: { tightest: '-0.04em' },
    },
  },
  plugins: [],
};
