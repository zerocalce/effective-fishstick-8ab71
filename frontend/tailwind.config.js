/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'studio-bg': '#0f172a',
        'studio-sidebar': '#1e293b',
        'studio-editor': '#020617',
        'studio-accent': '#3b82f6',
      }
    },
  },
  plugins: [],
}
