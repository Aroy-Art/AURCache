/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#15171b',
        secondary: '#1B1F26',
        'heading-row': '#131418',
        primary: '#2697FF',
        green: '#6bab58',
        'trend-up': '#A9FF0F',
        'trend-neutral': '#868686',
        'status-building': '#9D8D00',
        'status-success': '#0A6900',
        'status-failed': '#FF4752',
        'status-queued': '#0044AA',
        purple: '#6B43A4',
        'dark-green': '#0a7005',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        card: '10px',
      },
    },
  },
  plugins: [],
}
