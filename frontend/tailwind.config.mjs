/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'bg-blue-400',
    'bg-green-400',
    'bg-orange-400',
    'bg-gray-400',

    'text-red-200',
    'text-green-600',
    'text-blue-200',
    'text-gray-800',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;