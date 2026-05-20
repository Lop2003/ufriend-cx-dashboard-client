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
          DEFAULT: '#0051BA',
          dark:    '#003E90',
          light:   '#E5EFFF',
        },
        status: {
          active:       '#057A55',
          'active-bg':  '#DEF7EC',
          overdue:      '#C81E1E',
          'overdue-bg': '#FDE8E8',
          completed:    '#6B7280',
          'completed-bg':'#F3F4F6',
        },
        sentiment: {
          positive: '#057A55',
          neutral:  '#92400E',
          negative: '#C81E1E',
        },
      },
      fontFamily: {
        display: ['Kanit', 'sans-serif'],
        body:    ['Kanit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
