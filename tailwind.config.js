/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#B91C1C',    // Deep red
        accent: '#FACC15',     // Golden yellow
        background: '#FFF5F5', // Soft blush
      },
    },
  },
  plugins: [],
};
