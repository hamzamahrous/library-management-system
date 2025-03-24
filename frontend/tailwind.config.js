/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./projects/**/*.{html,ts}", "./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        mainBlue: "#0154F7",
      },
    },
  },
  plugins: [],
};
