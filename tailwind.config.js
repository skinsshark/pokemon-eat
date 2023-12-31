/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontSize: {
        xxs: '0.5rem',
      },
      boxShadow: {
        'float': '0 2px #bbb',
        'sm-float': '0 1px #bbb',
      }
    },
  },
  plugins: [],
}
