/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // for App Router (Next.js 13+)
    './pages/**/*.{js,ts,jsx,tsx}', // for Page Router (if any)
    './components/**/*.{js,ts,jsx,tsx}', // for shared UI components
  ],
  theme: {
    extend: {}, // customize your theme here if needed
  },
  plugins: [
    require('@tailwindcss/line-clamp'), // enables line-clamp utilities like line-clamp-2, etc.
  ],
};
