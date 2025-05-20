/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3498db',
          dark: '#2980b9',
        },
        secondary: '#2c3e50',
        accent: {
          DEFAULT: '#3498db',
          hover: '#2980b9',
        },
        text: {
          light: '#ffffff',
          dark: '#2d3436',
          gray: '#7f8c8d',
        },
        bg: {
          light: '#f8fafc',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      boxShadow: {
        DEFAULT: '0 5px 15px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
} 