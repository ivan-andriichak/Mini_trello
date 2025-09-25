/* eslint-disable @typescript-eslint/no-require-imports */
const tailwindScrollbar = require('tailwind-scrollbar');

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    tailwindScrollbar,
  ],
};