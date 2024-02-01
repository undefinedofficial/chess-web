const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        noto: ["'Noto Sans'", "sans-serif"],
        chess: ["'OpenChess'", "sans-serif"],
      },
      colors: {
        // theme background dark
        "d-black": "#15232e", // primary
        "d-black-2": "#1f2935", // secondary
        "d-gray-3": "#44566c", // reverse

        // theme background light
        "l-grey-light": "#eaedf0", // primary
        "l-grey-light-3": "#f8fafb", // secondary
        "l-grey-3": "#eff4f8", // reverse

        "c-overlay": "#000000da",

        "c-grey": "#44566c",
        "c-blue": "#0081ff",
        "c-blue2": "#22cce2",
        "c-blue-control": "#2c91f7",
        "c-blue-control2": "#0f3ad8",
        "c-blue-15": "#0081ff26",
        "c-info": "#22cce2",
        "c-warning": "#ff8a48",
        "c-warning2": "#fdbf5e",
        "c-success": "#09b66d",
        "c-success2": "#0d975d",
        "c-danger": "#fd594a",
        "c-danger2": "#ff3d57",
      },
      screens: {
        xs: "375px",
        sm: "576px",
        "sm-tablet": "768px",
        md: "992px",
        "lg-tablet": "1024px",
        lg: "1200px",
        xl: "1366px",
        "2xl": "1536px",
      },
      gridTemplateColumns: {
        "g-sm": "100%",
        "g-md": "70% 28%",
        "g-lg": "19% 60% 19%",
      },
      gridTemplateRows: {
        "g-sm": "20% 60% 20% 50% 50% 0% 0%",
        "g-md": "15% 70% 15% 0% 100% 0%",
        "g-lg": "15% 70% 15%",
      },
      transitionProperty: {
        filter: "filter",
        size: "width, height",
        "max-size": "max-width, max-height",
      },
      spacing: {
        inherit: "inherit",
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-in",
        "loader-infinite": "loader 4s ease-in infinite",
        progress: "progress 10s linear",
        "progress-invert": "progress 10s linear invert",
      },
      keyframes: {
        progress: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        "fade-in": {
          "0%": { transform: "scale(0.5)" },
          "100%": { transform: "scale(1.0)" },
        },
        loader: {
          from: { left: "-40%" },
          to: { left: "140%" },
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("v-link", "&.router-link-active"); // here
    }),
  ],
};
