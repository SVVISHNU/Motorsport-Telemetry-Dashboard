/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        telemetry: {
          dark: "#0b0e14",
          card: "#121824",
          cardHover: "#182030",
          border: "#1f293d",
          green: "#00ff88",
          red: "#ff1801",
          cyan: "#00f0ff",
          yellow: "#ffe600",
          purple: "#d000ff"
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        sans: ['"Inter"', 'sans-serif']
      }
    },
  },
  plugins: [],
}
