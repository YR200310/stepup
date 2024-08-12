/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'grid-pattern': "url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27100%27 height=%27100%27 viewBox=%270 0 100 100%27%3E%3Cpath fill=%27none%27 stroke=%27%23ccc%27 stroke-width=%271%27 d=%27M0 0h100v100H0z%27/%3E%3Cpath fill=%27none%27 stroke=%27%23eee%27 stroke-width=%271%27 d=%27M0 10h100M0 20h100M0 30h100M0 40h100M0 50h100M0 60h100M0 70h100M0 80h100M0 90h100M10 0v100M20 0v100M30 0v100M40 0v100M50 0v100M60 0v100M70 0v100M80 0v100M90 0v100%27/%3E%3C/svg%3E')",
      },
      colors: {
        'wood-brown': '#b8860b', 
        'clear-green':'#3cb371'
      },
    },
  },
  plugins: [],
}
