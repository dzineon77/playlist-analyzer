/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      blue: {
        light: '#85d7ff',
        DEFAULT: '#1fb6ff',
        dark: '#009eeb',
      },      
      green: {
        light: '#cfe2ce',
        DEFAULT: '#6b9d4a',
        dark: '#4c6a4b',
        veryDark: '#2d452f',
      },
      gray: {
        darkest: '#1f2d3d',
        dark: '#3c4858',
        DEFAULT: '#c0ccda',
        light: '#e0e6ed',
        lightest: '#f9fafc',
      },
      white: {
        light: '#eae0cc',
        DEFAULT: '#ffffff',
      },
    }
  },
  plugins: [],
}
