/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blueGray: "#F7F7FA",
      },
      width: {
        86: "21.5rem",
      },
      height: {
        68: "17.188rem",
      },
    },
  },
  plugins: [],
};
