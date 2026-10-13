/** @type {import('tailwindcss').Config} */
// One brand with the product: the values below are the product's design tokens
// (linkbot: frontend/src/design/system/tokens.css). Change them there first.
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        ground: '#fbf7f0', sand: { DEFAULT: '#f4ede1', 2: '#ebe2d2' }, surface: '#ffffff',
        ink: { DEFAULT: '#1d2320', 2: '#4f5752', 3: '#5a635d' },
        line: { DEFAULT: '#e6ddcd', strong: '#d3c7b2' },
        forest: { DEFAULT: '#12332b', 2: '#1b4a3e', 3: '#2a6252', wash: '#e4ede7' },
        onforest: { DEFAULT: '#f6f1e7', 2: '#b9cdc3' },
        you: { DEFAULT: '#2433e6', wash: '#eceefc' },
        attention: { DEFAULT: '#855400', wash: '#fbecd0' },
      },
      fontFamily: {
        sans: ['"Figtree Variable"', '"Avenir Next"', 'system-ui', 'sans-serif'],
        display: ['"Bricolage Grotesque Variable"', '"Avenir Next"', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: { sm: '6px', md: '10px', lg: '16px', xl: '24px' },
      boxShadow: { e2: '0 1px 2px rgb(60 44 20 / .05), 0 10px 28px rgb(60 44 20 / .10)' },
      letterSpacing: { tightest: '-0.03em' },
      maxWidth: { page: '1280px' },
    },
  },
  plugins: [],
};
