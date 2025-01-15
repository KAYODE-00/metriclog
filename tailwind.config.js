/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#FAFAF7',
        ink: '#1B1B18',
        inksoft: '#57544c',
        hairline: '#DEDAD0',
        accent: '#2D5F5A',
        accentsoft: '#DCE8E6',
        danger: '#A3402F',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        sm: '2px',
      },
      typography: () => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': '#1B1B18',
            '--tw-prose-headings': '#1B1B18',
            '--tw-prose-links': '#2D5F5A',
            '--tw-prose-bold': '#1B1B18',
            '--tw-prose-quotes': '#57544c',
            '--tw-prose-quote-borders': '#DEDAD0',
            '--tw-prose-code': '#2D5F5A',
            maxWidth: 'none',
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
