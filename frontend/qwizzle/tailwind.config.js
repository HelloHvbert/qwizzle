/** @type {import('tailwindcss').Config} */

const { colors: defaultColors } = require("tailwindcss/defaultTheme");

const colors = {
  ...defaultColors,
  primary: "#88fc03",
  primary_hover: "#7dba36",
  secondary: "#2b2b2b",
  gray: "#52525b",
  light_gray: "#aba8a1",
  white: "#ffffff",
  red: "#ff0000",
  blue: "#5238d6",
  black: "#000000",
};

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    colors: colors,
    screens: {
      xs: "320px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
  },
  plugins: [],
};

// colors: {
//   primary: "#88fc03",
//   primary_hover: "#7dba36",
//   secondary: "#2b2b2b",
//   gray: "#52525b",
//   white: "#ffffff",
//   red: "#ff0000",
//   blue: "#5238d6",
//   black: "#000000",
// },
