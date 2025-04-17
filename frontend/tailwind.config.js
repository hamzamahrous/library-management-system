/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./projects/**/*.{html,ts}", "./src/**/*.{html,ts}"],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
      },
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
