/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Nunito', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: "#5DA7DB",
        secondary: "#5837D0",
        "primary-100": "#81C6E8"
      }
    },
  },
  plugins: [],
}
