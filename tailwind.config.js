/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(1rem, 1rem) scale(1.05)' },
          '66%': { transform: 'translate(-1rem, -0.5rem) scale(0.95)' },
        },
        'float-delayed': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1.05)' },
          '33%': { transform: 'translate(-1rem, 1rem) scale(1)' },
          '66%': { transform: 'translate(1rem, -0.5rem) scale(1.05)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translate(0, 0) scale(0.95)' },
          '33%': { transform: 'translate(1rem, -1rem) scale(1)' },
          '66%': { transform: 'translate(-1rem, 0.5rem) scale(0.95)' },
        },
      },
      animation: {
        'float': 'float 20s ease-in-out infinite',
        'float-delayed': 'float-delayed 25s ease-in-out infinite',
        'float-slow': 'float-slow 30s ease-in-out infinite',
      },
    },
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
      red: {
        DEFAULT: '#EE4B2B',
      },
    }
  },
  plugins: [],
}